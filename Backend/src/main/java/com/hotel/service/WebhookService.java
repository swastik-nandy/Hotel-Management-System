package com.hotel.service;

import com.hotel.model.Booking;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WebhookService {
    private static final Logger logger = LoggerFactory.getLogger(WebhookService.class);

    @Value("${app.webhook.url}")
    private String webhookUrl;

    @Retry(name = "webhookRetry", fallbackMethod = "webhookFallback")
    public void notifyWebhook(Booking booking) {
        if (webhookUrl == null || webhookUrl.isEmpty()) {
            logger.info("Webhook URL not configured, skipping notification");
            return;
        }

        logger.info("Sending webhook notification for booking ID: {}", booking.getBookingId());
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Booking> request = new HttpEntity<>(booking, headers);
        try {
            restTemplate.postForObject(webhookUrl, request, String.class);
            logger.info("Webhook notification sent successfully");
        } catch (Exception e) {
            logger.error("Error sending webhook notification", e);
            throw new RuntimeException("Webhook notification failed", e);
        }
    }

    public void webhookFallback(Booking booking, Throwable t) {
        logger.error("Failed to send webhook for booking ID: {} after retries", booking.getBookingId(), t);
        // Log to a queue for manual retry or monitoring
    }
}