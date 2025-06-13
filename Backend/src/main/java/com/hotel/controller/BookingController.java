package com.hotel.controller;

import com.hotel.dto.BookingSummaryDTO;
import com.hotel.model.Booking;
import com.hotel.model.Branch;
import com.hotel.model.RoomType;
import com.hotel.repository.BranchRepository;
import com.hotel.service.BookingService;
import com.hotel.service.EmailService;
import com.hotel.service.PdfService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private PdfService pdfService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/availability")
    public ResponseEntity<Map<String, Object>> checkAvailability(
            @RequestParam Long branchId,
            @RequestParam String roomType,
            @RequestParam String checkIn,
            @RequestParam String checkOut) {

        logger.info("Checking availability for branchId: {}, roomType: {}", branchId, roomType);
        LocalDate checkInDate = LocalDate.parse(checkIn);
        LocalDate checkOutDate = LocalDate.parse(checkOut);

        boolean available = bookingService.checkAvailability(branchId, roomType, checkInDate, checkOutDate);
        Branch branch = branchRepository.findById(branchId).orElseThrow();

        int totalRooms = (int) branch.getRooms().stream()
                .filter(r -> r.getRoomType().name().equalsIgnoreCase(roomType))
                .count();

        Map<String, Object> response = new HashMap<>();
        response.put("available", available);
        response.put("totalRooms", totalRooms);
        response.put("bookedRooms", bookingService.getBookedRooms(branchId, roomType, checkInDate, checkOutDate));

        if (!available) {
            response.put("message", "Not available, consider changing filters");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/booking/add")
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest request) {
        logger.info("Creating booking for customer: {}", request.getCustomerName());
        try {
            RoomType roomTypeEnum = RoomType.valueOf(request.getRoomType().toUpperCase());

            LocalDate checkIn = LocalDate.parse(request.getCheckIn());
            LocalDate checkOut = LocalDate.parse(request.getCheckOut());
            LocalTime bookingTime = request.getBookingTime() != null
                    ? LocalTime.parse(request.getBookingTime())
                    : LocalTime.now();

            Booking booking;

            if (request.getRoomId() != null) {
                booking = bookingService.createBookingFromRoomId(
                        request.getCustomerName(),
                        request.getPhoneNumber(),
                        request.getEmail(),
                        request.getRoomId(),
                        checkIn,
                        checkOut,
                        bookingTime
                );
            } else {
                booking = bookingService.createBooking(
                        request.getCustomerName(),
                        request.getPhoneNumber(),
                        request.getEmail(),
                        request.getBranchId(),
                        roomTypeEnum.name(),
                        checkIn,
                        checkOut,
                        bookingTime
                );
            }

            byte[] pdf = pdfService.generateReceipt(booking);
            emailService.sendEmail(booking.getEmail(), pdf, booking);

            Map<String, Object> response = new HashMap<>();
            response.put("bookingId", booking.getBookingId());
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.error("Invalid room type: {}", request.getRoomType());
            return ResponseEntity.badRequest().body("Invalid room type: " + request.getRoomType());
        } catch (jakarta.validation.ConstraintViolationException e) {
            logger.error("Validation errors: {}", e.getConstraintViolations());
            return ResponseEntity.badRequest().body(e.getConstraintViolations().stream()
                    .map(v -> v.getMessage()).toList());
        } catch (RuntimeException e) {
            logger.error("Booking creation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/booking/{bookingId}/receipt")
    public ResponseEntity<byte[]> getBookingReceipt(@PathVariable String bookingId) {
        Booking booking = bookingService.getBookingWithRoomAndBranch(bookingId);
        byte[] pdf = pdfService.generateReceipt(booking);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=receipt_" + bookingId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancelBooking(@RequestParam String bookingId) {
        logger.info("Request to cancel booking ID: {}", bookingId);
        try {
            bookingService.cancelBooking(bookingId);
            return ResponseEntity.ok("Booking cancelled successfully");
        } catch (RuntimeException e) {
            logger.error("Error cancelling booking: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/booking-status")
    public ResponseEntity<?> getBookingStatus(@RequestParam String bookingId) {
        logger.info("Fetching status for booking ID: {}", bookingId);
        try {
            BookingSummaryDTO summary = bookingService.getBookingSummary(bookingId);
            return ResponseEntity.ok(summary);
        } catch (RuntimeException e) {
            logger.error("Error fetching booking summary: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/employee/branches/rooms")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<List<Branch>> getBranchRoomCounts() {
        logger.info("Fetching branch room counts");
        return ResponseEntity.ok(branchRepository.findAll());
    }

    @PostMapping("/admin/branch")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Branch> addBranch(@RequestBody Branch branch) {
        logger.info("Adding new branch: {}", branch.getName());
        return ResponseEntity.ok(branchRepository.save(branch));
    }

    // ✅ Health check endpoint for uptime monitoring (e.g., UptimeRobot)
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }

    // Inner DTO class
    public static class BookingRequest {
        private String customerName;
        private String phoneNumber;

        @NotBlank(message = "Email is mandatory")
        @Email(message = "Email must be valid")
        @Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Email domain must be valid")
        private String email;

        private Long branchId;
        private String roomType;
        private String checkIn;
        private String checkOut;
        private Long roomId;
        private String bookingTime;

        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }

        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public Long getBranchId() { return branchId; }
        public void setBranchId(Long branchId) { this.branchId = branchId; }

        public String getRoomType() { return roomType; }
        public void setRoomType(String roomType) { this.roomType = roomType; }

        public String getCheckIn() { return checkIn; }
        public void setCheckIn(String checkIn) { this.checkIn = checkIn; }

        public String getCheckOut() { return checkOut; }
        public void setCheckOut(String checkOut) { this.checkOut = checkOut; }

        public Long getRoomId() { return roomId; }
        public void setRoomId(Long roomId) { this.roomId = roomId; }

        public String getBookingTime() { return bookingTime; }
        public void setBookingTime(String bookingTime) { this.bookingTime = bookingTime; }
    }
}
