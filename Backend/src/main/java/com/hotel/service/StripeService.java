package com.hotel.service;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StripeService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public Session createStripeSession(String productName,
                                       double totalAmount,
                                       String customerName,
                                       String email,
                                       String phoneNumber,
                                       Long roomId,
                                       String checkIn,
                                       String checkOut,
                                       String bookingTime,
                                       String successUrl,
                                       String cancelUrl,
                                       String productDescription
    ) {
        long amountInPaise = Math.round(totalAmount * 100);

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .setCustomerEmail(email)
                .putMetadata("customerName", customerName)
                .putMetadata("phoneNumber", phoneNumber)
                .putMetadata("email", email)
                .putMetadata("roomId", String.valueOf(roomId))
                .putMetadata("checkInDate", checkIn)         // ✅ fixed key
                .putMetadata("checkOutDate", checkOut)       // ✅ fixed key
                .putMetadata("bookingTime", bookingTime)
                .putMetadata("productName", productName)
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .addAllLineItem(List.of(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("inr")
                                                .setUnitAmount(amountInPaise)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(productName)
                                                                .setDescription(productDescription)
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                ))
                .build();

        try {
            Session session = Session.create(params);
            System.out.println("✅ Stripe session created: " + session.getId());
            return session;
        } catch (Exception e) {
            throw new RuntimeException("❌ Stripe session creation failed: " + e.getMessage(), e);
        }
    }
}
