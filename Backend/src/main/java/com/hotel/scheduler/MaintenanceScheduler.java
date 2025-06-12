package com.hotel.scheduler;

import com.hotel.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MaintenanceScheduler {

    @Autowired
    private BookingService bookingService;

   

    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanupOldBookings() {
        bookingService.deleteOldBookings();
    }

    
}