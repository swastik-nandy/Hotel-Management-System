package com.hotel.controller;

import com.hotel.dto.BookingSummaryDTO;
import com.hotel.model.Booking;
import com.hotel.model.Branch;
import com.hotel.repository.BranchRepository;
import com.hotel.service.BookingService;
import com.hotel.service.EmailService;
import com.hotel.service.PdfService;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    @Autowired private BookingService bookingService;
    @Autowired private BranchRepository branchRepository;
    @Autowired private PdfService pdfService;
    @Autowired private EmailService emailService;

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

    // ✅ Only reads booking if Stripe session already handled it
    @GetMapping("/booking/confirm")
    public ResponseEntity<?> confirmBooking(@RequestParam("session_id") String sessionId) {
        logger.info("Confirming booking from Stripe session ID: {}", sessionId);
        try {
            Booking booking = bookingService.confirmBookingFromStripeSession(sessionId);
            return ResponseEntity.ok(Map.of("bookingId", booking.getBookingId()));
        } catch (RuntimeException e) {
            logger.error("Booking confirmation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body("❌ Failed to confirm booking: " + e.getMessage());
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

    // DTO reserved for future manual booking flow
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

        // Getters & Setters
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
