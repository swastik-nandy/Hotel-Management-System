package com.hotel.service;

import com.hotel.model.Booking;
import io.github.resilience4j.retry.annotation.Retry;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Retry(name = "emailRetry", fallbackMethod = "emailFallback")
    public void sendEmail(String to, byte[] pdf, Booking booking) {
        logger.info("Sending email to: {} for booking ID: {}", to, booking.getBookingId());
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Your Luxe Hotels Booking Confirmation");

            String htmlContent = """
                    <div style="font-family:Arial,sans-serif; max-width:600px; margin:auto; border:1px solid #eee; padding:20px; background:#fdfdfd;">
                      <h2 style="text-align:center; color:#2c3e50;">Luxe Hotels</h2>
                      <p style="font-size:16px; color:#333;">Dear <strong>%s</strong>,</p>
                      <p style="font-size:15px;">Thank you for choosing <strong>Luxe Hotels</strong>. Your booking has been confirmed.</p>
                      <div style="margin-top:20px; padding:15px; border:1px solid #ddd; border-radius:6px; background:#fafafa;">
                        <h3 style="color:#2c3e50;">Booking Summary</h3>
                        <p><strong>Booking ID:</strong> %s</p>
                        <p><strong>Room Number:</strong> %s</p>
                        <p><strong>Room Type:</strong> %s</p>
                        <p><strong>Branch:</strong> %s</p>
                        <p><strong>Check-In:</strong> %s</p>
                        <p><strong>Check-Out:</strong> %s</p>
                      </div>
                      <p style="margin-top:20px;">Your receipt is attached to this email.</p>
                      <p style="font-size:14px; color:#666;">We look forward to hosting you!<br/><em>- Luxe Hotels Team</em></p>
                      <hr style="margin-top:30px;"/>
                      <p style="font-size:12px; text-align:center; color:#999;">Need help? Contact us at support@luxehotels.com</p>
                    </div>
                    """.formatted(
                    booking.getCustomerName(),
                    booking.getBookingId(),
                    booking.getRoom().getRoomNumber(),
                    booking.getRoom().getRoomType().name(),
                    booking.getRoom().getBranch().getName(),
                    booking.getCheckIn().toString(),
                    booking.getCheckOut().toString()
            );

            helper.setText(htmlContent, true); // true for HTML
            helper.addAttachment("booking_receipt.pdf", new ByteArrayResource(pdf));

            mailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Error sending email to: {}", to, e);
            throw new RuntimeException("Error sending email", e);
        }
    }

    public void emailFallback(String to, byte[] pdf, Booking booking, Throwable t) {
        logger.error("Failed to send email to: {} after retries, booking ID: {}", to, booking.getBookingId(), t);
        // Optionally queue or store for manual retry
    }
}
