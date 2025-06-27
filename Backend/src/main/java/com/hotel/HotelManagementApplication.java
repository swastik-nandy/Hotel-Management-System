package com.hotel;

import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HotelManagementApplication {
    private static final Logger logger = LoggerFactory.getLogger(HotelManagementApplication.class);

    public static void main(String[] args) {
        try {
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

            // Database
            setSystemProperty("DB_URL", dotenv.get("DB_URL"), "jdbc:postgresql://localhost:5432/hotel_db");
            setSystemProperty("DB_USERNAME", dotenv.get("DB_USERNAME"), "postgres");
            setSystemProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"), "");

            // SMTP Email
            setSystemProperty("SMTP_HOST", dotenv.get("SMTP_HOST"), "smtp.gmail.com");
            setSystemProperty("SMTP_PORT", dotenv.get("SMTP_PORT"), "587");
            setSystemProperty("SMTP_USERNAME", dotenv.get("SMTP_USERNAME"), "");
            setSystemProperty("SMTP_PASSWORD", dotenv.get("SMTP_PASSWORD"), "");

            // App settings
            setSystemProperty("HOTEL_NAME", dotenv.get("HOTEL_NAME"), "Swastik Hotel");
            setSystemProperty("WEBHOOK_URL", dotenv.get("WEBHOOK_URL"), "");
            setSystemProperty("CLIENT_BASE_URL", dotenv.get("CLIENT_BASE_URL"), "http://localhost:3000");
            setSystemProperty("JWT_SECRET", dotenv.get("JWT_SECRET"), "default-jwt");

            // Stripe keys
            setSystemProperty("STRIPE_SECRET_KEY", dotenv.get("STRIPE_SECRET_KEY"), "");
            setSystemProperty("STRIPE_PUBLISHABLE_KEY", dotenv.get("STRIPE_PUBLISHABLE_KEY"), "");
            setSystemProperty("STRIPE_WEBHOOK_SECRET", dotenv.get("STRIPE_WEBHOOK_SECRET"), "");


            // CORS
            setSystemProperty("FRONTEND_ORIGIN", dotenv.get("FRONTEND_ORIGIN"), "http://localhost:5173");

            logger.info("✅ Environment variables loaded successfully");
            SpringApplication.run(HotelManagementApplication.class, args);
        } catch (Exception e) {
            logger.error("❌ Application startup failed", e);
            throw new RuntimeException("Failed to start application", e);
        }
    }

    private static void setSystemProperty(String key, String value, String defaultValue) {
        String finalValue = (value != null && !value.isEmpty()) ? value : defaultValue;
        System.setProperty(key, finalValue);
        logger.debug("Set {}={}", key,
                isSensitive(key) ? "[REDACTED]" : finalValue);
    }

    private static boolean isSensitive(String key) {
        return key.contains("PASSWORD") || key.contains("SECRET") || key.contains("KEY");
    }
}
