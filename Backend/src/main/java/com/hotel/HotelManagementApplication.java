package com.hotel;

import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; // ✅ Added

@SpringBootApplication
@EnableScheduling // ✅ Enables all @Scheduled methods
public class HotelManagementApplication {
    private static final Logger logger = LoggerFactory.getLogger(HotelManagementApplication.class);

    public static void main(String[] args) {
        try {
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
            setSystemProperty("DB_URL", dotenv.get("DB_URL"), "jdbc:postgresql://localhost:5432/hotel_db");
            setSystemProperty("DB_USERNAME", dotenv.get("DB_USERNAME"), "postgres");
            setSystemProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"), "");
            setSystemProperty("SMTP_HOST", dotenv.get("SMTP_HOST"), "smtp.gmail.com");
            setSystemProperty("SMTP_PORT", dotenv.get("SMTP_PORT"), "587");
            setSystemProperty("SMTP_USERNAME", dotenv.get("SMTP_USERNAME"), "");
            setSystemProperty("SMTP_PASSWORD", dotenv.get("SMTP_PASSWORD"), "");
            setSystemProperty("HOTEL_NAME", dotenv.get("HOTEL_NAME"), "Swastik Hotel");
            setSystemProperty("WEBHOOK_URL", dotenv.get("WEBHOOK_URL"), "");
            setSystemProperty("JWT_SECRET", dotenv.get("JWT_SECRET"), "7b9f2c4d8a1e6b3f9c0d5a2e7b4f8c1d3e6a9b2f5c7d0e4a8b1c3f6e9a2d5b");

            logger.info("Environment variables loaded successfully");
            SpringApplication.run(HotelManagementApplication.class, args);
        } catch (Exception e) {
            logger.error("Application startup failed", e);
            throw new RuntimeException("Failed to start application", e);
        }
    }

    private static void setSystemProperty(String key, String value, String defaultValue) {
        String finalValue = (value != null && !value.isEmpty()) ? value : defaultValue;
        System.setProperty(key, finalValue);
        logger.debug("Set {}={}", key,
                key.equals("DB_PASSWORD") || key.equals("SMTP_PASSWORD") || key.equals("JWT_SECRET")
                        ? "[REDACTED]"
                        : finalValue);
    }
}
