package com.hotel.service;

import com.hotel.dto.BookingSummaryDTO;
import com.hotel.model.*;
import com.hotel.repository.*;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
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
import java.util.Set;
import java.util.UUID;

@Service
public class BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    @Autowired private BookingRepository bookingRepository;
    @Autowired private BranchRepository branchRepository;
    @Autowired private RoomRepository roomRepository;
    @Autowired private RoomService roomService;
    @Autowired private PdfService pdfService;
    @Autowired private EmailService emailService;
    @Autowired private WebhookService webhookService;
    @Autowired private PriceRepository priceRepository;
    @Autowired private Validator validator;

    // Used by filter page to check room type availability
    public boolean checkAvailability(Long branchId, String roomTypeStr, LocalDate checkIn, LocalDate checkOut) {
        logger.info("Checking availability for branchId: {}, roomType: {}, checkIn: {}, checkOut: {}", branchId, roomTypeStr, checkIn, checkOut);
        Branch branch = branchRepository.findById(branchId).orElseThrow();
        RoomType roomType = RoomType.valueOf(roomTypeStr.toUpperCase());

        int totalRooms = (int) branch.getRooms().stream().filter(r -> r.getRoomType() == roomType).count();
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(branchId, roomType, checkIn, checkOut);

        logger.debug("Found {} overlapping bookings", overlapping.size());
        return overlapping.size() < totalRooms;
    }

    // Only used before creating Stripe session — checks room conflict
    public Booking prepareTempBooking(String customerName, String phoneNumber, String email,
                                      Long roomId, LocalDate checkIn, LocalDate checkOut, LocalTime bookingTime) {
        logger.info("Pre-booking (no DB write yet) for Stripe: roomId={}", roomId);

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

        Booking temp = new Booking();
        temp.setCustomerName(customerName);
        temp.setPhoneNumber(phoneNumber);
        temp.setEmail(email);
        temp.setRoom(room);
        temp.setBranch(room.getBranch());
        temp.setCheckIn(checkIn);
        temp.setCheckOut(checkOut);
        temp.setPrice(calculatePrice(roomType, checkIn, checkOut));
        temp.setBookingTime(bookingTime != null ? bookingTime.withNano(0) : LocalTime.now().withNano(0));

        return temp;
    }

    // Stripe webhook will use this to persist final booking
    public Booking saveFinalBookingAfterStripe(String customerName, String phoneNumber, String email,
                                               Long roomId, LocalDate checkIn, LocalDate checkOut,
                                               LocalTime bookingTime, String sessionId) {
        logger.info("Webhook saving final booking for Stripe session: {}", sessionId);

        if (bookingRepository.findByStripeSessionId(sessionId).isPresent()) {
            logger.warn("Booking already exists for Stripe session: {}", sessionId);
            return bookingRepository.findByStripeSessionId(sessionId).get();
        }

        Room room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("Room not found"));
        RoomType roomType = room.getRoomType();

        Booking booking = new Booking();
        booking.setBookingId(UUID.randomUUID().toString());
        booking.setCustomerId((long) Math.abs((customerName + ":" + phoneNumber).hashCode()));
        booking.setCustomerName(customerName);
        booking.setPhoneNumber(phoneNumber);
        booking.setEmail(email);
        booking.setBranch(room.getBranch());
        booking.setRoom(room);
        booking.setCheckIn(checkIn);
        booking.setCheckOut(checkOut);
        booking.setPrice(calculatePrice(roomType, checkIn, checkOut));
        booking.setDiscount(0);
        booking.setCreatedAt(LocalDate.now());
        booking.setBookingTime(bookingTime != null ? bookingTime.withNano(0) : LocalTime.now().withNano(0));
        booking.setStatus("ACTIVE");
        booking.setStripeSessionId(sessionId);

        Set<ConstraintViolation<Booking>> violations = validator.validate(booking);
        if (!violations.isEmpty()) {
            logger.error("Validation errors: {}", violations);
            throw new ConstraintViolationException(violations);
        }

        bookingRepository.save(booking);
        logger.info("✅ Booking saved to DB with ID: {}", booking.getBookingId());

        byte[] pdf = pdfService.generateReceipt(booking);
        emailService.sendEmail(email, pdf, booking);
        webhookService.notifyWebhook(booking);

        return booking;
    }

    // ⚠️ ONLY reads booking after payment for frontend status
    public Booking confirmBookingFromStripeSession(String sessionId) {
        logger.info("Reading booking from DB for session: {}", sessionId);
        return bookingRepository.findByStripeSessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Booking not found for session: " + sessionId));
    }

    private double calculatePrice(RoomType roomType, LocalDate checkIn, LocalDate checkOut) {
        long days = checkIn.until(checkOut).getDays();

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

    public Booking getBookingByStripeSessionId(String sessionId) {
        return bookingRepository.findByStripeSessionId(sessionId).orElse(null);
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
