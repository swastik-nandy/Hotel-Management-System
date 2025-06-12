package com.hotel.service;

import com.hotel.dto.BookingSummaryDTO;
import com.hotel.model.*;
import com.hotel.repository.*;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class BookingService {
    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomService roomService;

    @Autowired
    private PdfService pdfService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private WebhookService webhookService;

    @Autowired
    private PriceRepository priceRepository;

    @Autowired
    private Validator validator;

    public boolean checkAvailability(Long branchId, String roomTypeStr, LocalDate checkIn, LocalDate checkOut) {
        logger.info("Checking availability for branchId: {}, roomType: {}, checkIn: {}, checkOut: {}",
                branchId, roomTypeStr, checkIn, checkOut);

        Branch branch = branchRepository.findById(branchId).orElseThrow();
        RoomType roomType = RoomType.valueOf(roomTypeStr.toUpperCase());

        int totalRooms = (int) branch.getRooms().stream()
                .filter(r -> r.getRoomType() == roomType)
                .count();

        List<Booking> overlapping = bookingRepository.findOverlappingBookings(branchId, roomType, checkIn, checkOut);
        logger.debug("Found {} overlapping bookings", overlapping.size());

        return overlapping.size() < totalRooms;
    }

    public Booking createBooking(String customerName, String phoneNumber, String email,
                                 Long branchId, String roomTypeStr, LocalDate checkIn, LocalDate checkOut,
                                 LocalTime bookingTime) {
        logger.info("Creating booking for customerName: {}, branchId: {}, roomType: {}",
                customerName, branchId, roomTypeStr);

        if (!checkAvailability(branchId, roomTypeStr, checkIn, checkOut)) {
            logger.warn("Room not available for requested dates");
            throw new RuntimeException("Room not available");
        }

        RoomType roomType = RoomType.valueOf(roomTypeStr.toUpperCase());

        Room assignedRoom = roomRepository
                .findFirstAvailableRoomCandidates(branchId, roomType, checkIn, checkOut)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No available room found"));

        return saveBooking(customerName, phoneNumber, email, assignedRoom, checkIn, checkOut, bookingTime);
    }

    public Booking createBookingFromRoomId(String customerName, String phoneNumber, String email,
                                           Long roomId, LocalDate checkIn, LocalDate checkOut, LocalTime bookingTime) {
        logger.info("Creating booking for specific room ID: {}", roomId);

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        RoomType roomType = room.getRoomType();

        boolean isBooked = bookingRepository.findOverlappingBookings(
                        room.getBranch().getId(), roomType, checkIn, checkOut)
                .stream()
                .anyMatch(b -> b.getRoom().getId().equals(roomId));

        if (isBooked) {
            logger.warn("Room already booked for selected date range");
            throw new RuntimeException("Selected room is not available");
        }

        return saveBooking(customerName, phoneNumber, email, room, checkIn, checkOut, bookingTime);
    }

    private Booking saveBooking(String customerName, String phoneNumber, String email,
                                Room room, LocalDate checkIn, LocalDate checkOut, LocalTime bookingTime) {

        String base = customerName.trim().toLowerCase() + ":" + phoneNumber.trim();
        long customerId = Math.abs(base.hashCode());

        Booking booking = new Booking();
        booking.setBookingId(UUID.randomUUID().toString());
        booking.setCustomerId(customerId);
        booking.setCustomerName(customerName);
        booking.setPhoneNumber(phoneNumber);
        booking.setEmail(email);
        booking.setBranch(room.getBranch());
        booking.setRoom(room);
        booking.setCheckIn(checkIn);
        booking.setCheckOut(checkOut);
        booking.setPrice(calculatePrice(room.getRoomType(), checkIn, checkOut));
        booking.setDiscount(0);
        booking.setCreatedAt(LocalDate.now());
        booking.setBookingTime(bookingTime != null ? bookingTime.withNano(0) : LocalTime.now().withNano(0));
        booking.setStatus("ACTIVE");

        Set<ConstraintViolation<Booking>> violations = validator.validate(booking);
        if (!violations.isEmpty()) {
            logger.error("Validation errors: {}", violations);
            throw new ConstraintViolationException(violations);
        }

        bookingRepository.save(booking);
        logger.info("Booking saved with ID: {}", booking.getBookingId());

        byte[] pdf = pdfService.generateReceipt(booking);
        emailService.sendEmail(email, pdf, booking);
        webhookService.notifyWebhook(booking);

        return booking;
    }

    private double calculatePrice(RoomType roomType, LocalDate checkIn, LocalDate checkOut) {
        long days = checkIn.until(checkOut).getDays();

        // Fix: Convert RoomType enum to "Standard", "Deluxe", etc.
        String typeKey = roomType.name().substring(0, 1).toUpperCase() +
                         roomType.name().substring(1).toLowerCase();

        Price price = priceRepository.findByRoomType(typeKey)
                .orElseThrow(() -> new RuntimeException("Price not found for room type: " + typeKey));

        return price.getPricePerNight() * days;
    }

    public void cancelBooking(String bookingId) {
        logger.info("Cancelling booking with ID: {}", bookingId);
        Booking booking = bookingRepository.findActiveByBookingId(bookingId);
        if (booking == null) {
            logger.warn("Active booking not found for ID: {}", bookingId);
            throw new RuntimeException("Booking not found or already cancelled");
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);

        logger.info("Booking cancelled");
    }

    public void deleteOldBookings() {
        logger.info("Running old bookings cleanup");
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        List<Booking> oldBookings = bookingRepository.findBookingsOlderThanThirtyDays(thirtyDaysAgo);
        bookingRepository.deleteAll(oldBookings);
        logger.info("Deleted {} old bookings", oldBookings.size());
    }

    public Booking getBookingById(String bookingId) {
        logger.info("Fetching booking with ID: {}", bookingId);
        Booking booking = bookingRepository.findByBookingId(bookingId);
        if (booking == null) {
            logger.warn("Booking not found for ID: {}", bookingId);
            throw new RuntimeException("Booking not found");
        }
        return booking;
    }

    public Booking getBookingWithRoomAndBranch(String bookingId) {
        logger.info("Fetching booking with full room and branch for ID: {}", bookingId);
        Booking booking = bookingRepository.findByBookingIdWithRoomAndBranch(bookingId);
        if (booking == null) {
            throw new RuntimeException("Booking not found");
        }
        return booking;
    }

    public BookingSummaryDTO getBookingSummary(String bookingId) {
        Booking booking = getBookingById(bookingId);

        BookingSummaryDTO dto = new BookingSummaryDTO();
        dto.setBookingId(booking.getBookingId());
        dto.setCustomerName(booking.getCustomerName());
        dto.setEmail(booking.getEmail());
        dto.setPhoneNumber(booking.getPhoneNumber());
        dto.setBranchName(booking.getBranch().getName());
        dto.setRoomNumber(String.valueOf(booking.getRoom().getRoomNumber()));
        dto.setRoomType(booking.getRoom().getRoomType().name());
        dto.setCheckIn(booking.getCheckIn());
        dto.setCheckOut(booking.getCheckOut());
        dto.setPrice(booking.getPrice());

        return dto;
    }

    public int getBookedRooms(Long branchId, String roomTypeStr, LocalDate checkIn, LocalDate checkOut) {
        RoomType roomType = RoomType.valueOf(roomTypeStr.toUpperCase());
        return bookingRepository.findOverlappingBookings(branchId, roomType, checkIn, checkOut).size();
    }
}
