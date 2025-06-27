package com.hotel.controller;

import com.hotel.model.Booking;
import com.hotel.service.BookingService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
public class StripeWebhookController {

    private static final Logger logger = LoggerFactory.getLogger(StripeWebhookController.class);

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    private final BookingService bookingService;

    public StripeWebhookController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) {
        logger.info("⚡ Incoming webhook triggered");

        Event event;

        try {
            logger.debug("🔐 Verifying Stripe signature...");
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            logger.warn("❌ Stripe signature verification failed", e);
            return ResponseEntity.status(400).body("Signature mismatch");
        } catch (Exception e) {
            logger.error("❌ Webhook construction failed: {}", e.getMessage());
            return ResponseEntity.status(500).body("Webhook error");
        }

        logger.info("✅ Stripe event type: {}", event.getType());

        if ("checkout.session.completed".equals(event.getType())) {
            try {
                Session session = (Session) event.getData().getObject();

                if (session == null) {
                    logger.error("❌ Session deserialization failed");
                    return ResponseEntity.badRequest().body("Invalid session object");
                }

                logger.debug("✅ Session retrieved: {}", session.getId());

                Map<String, String> metadata = session.getMetadata();

                if (metadata == null || metadata.isEmpty()) {
                    logger.warn("⚠️ Metadata missing for session: {}", session.getId());
                    return ResponseEntity.badRequest().body("Missing metadata");
                }

                String customerName = metadata.get("customerName");
                String phoneNumber = metadata.get("phoneNumber");
                String email = metadata.get("email");
                String roomIdStr = metadata.get("roomId");
                String checkInStr = metadata.get("checkInDate");
                String checkOutStr = metadata.get("checkOutDate");

                if (customerName == null || phoneNumber == null || email == null ||
                        roomIdStr == null || checkInStr == null || checkOutStr == null) {
                    logger.error("❌ Invalid metadata content");
                    return ResponseEntity.badRequest().body("Invalid metadata fields");
                }

                Long roomId = Long.parseLong(roomIdStr);
                LocalDate checkIn = LocalDate.parse(checkInStr);
                LocalDate checkOut = LocalDate.parse(checkOutStr);
                LocalTime bookingTime = LocalTime.now();

                logger.info("💾 Saving booking for Stripe session: {}", session.getId());

                Booking booking = bookingService.saveFinalBookingAfterStripe(
                        customerName,
                        phoneNumber,
                        email,
                        roomId,
                        checkIn,
                        checkOut,
                        bookingTime,
                        session.getId()
                );

                logger.info("✅ Booking saved successfully: {}", booking.getBookingId());

            } catch (Exception e) {
                logger.error("❌ Error handling checkout.session.completed: {}", e.getMessage(), e);
                return ResponseEntity.status(500).body("Failed to create booking");
            }
        }

        return ResponseEntity.ok("Webhook handled");
    }
}
