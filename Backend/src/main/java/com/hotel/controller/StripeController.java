package com.hotel.controller;

import com.hotel.model.Booking;
import com.hotel.service.BookingService;
import com.hotel.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
public class StripeController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private StripeService stripeService;

    @Value("${app.client.url}")
    private String clientBaseUrl;

    @PostMapping("/create-session")
    public Map<String, Object> createStripeSession(@RequestBody Map<String, Object> payload) throws StripeException {
        String customerName = payload.get("customerName").toString();
        String phoneNumber = payload.get("phoneNumber").toString();
        String email = payload.get("email").toString();
        Long roomId = Long.parseLong(payload.get("roomId").toString());
        String roomType = payload.get("roomType").toString();
        Long branchId = Long.parseLong(payload.get("branchId").toString());

        LocalDate checkIn = LocalDate.parse(payload.get("checkIn").toString());
        LocalDate checkOut = LocalDate.parse(payload.get("checkOut").toString());
        LocalTime bookingTime = LocalTime.now().withNano(0);

        // Step 1: Prepare temporary booking
        Booking tempBooking = bookingService.prepareTempBooking(
                customerName, phoneNumber, email, roomId, checkIn, checkOut, bookingTime
        );

        // Step 2: Price calculation
        double basePrice = tempBooking.getPrice();
        int nights = (int) java.time.temporal.ChronoUnit.DAYS.between(checkIn, checkOut);
        double tax = basePrice * 0.18;
        double serviceFee = 250;
        double finalAmount = basePrice + tax + serviceFee;

        // Step 3: Stripe product metadata
        String productName = "Swastik Luxe Hotel Stay";
        String productDescription = String.format(
                "%s Room • %d Nights • 2 Adults\nBranch #%d\nCheck-in: %s\nCheck-out: %s\nTaxes + Service Fee included",
                roomType,
                nights,
                branchId,
                checkIn.toString(),
                checkOut.toString()
        );

        // Step 4: Redirect URLs
        String successUrl = clientBaseUrl + "/confirmation?session_id={CHECKOUT_SESSION_ID}";
        String cancelUrl = clientBaseUrl + "/payment/cancelled";

        // Step 5: Create Stripe session
        Session session = stripeService.createStripeSession(
                productName,
                finalAmount,
                customerName,
                email,
                phoneNumber,
                roomId,
                checkIn.toString(),
                checkOut.toString(),
                bookingTime.toString(),
                successUrl,
                cancelUrl,
                productDescription
        );

        // Step 6: Return session ID
        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", session.getId());
        return response;
    }
}
