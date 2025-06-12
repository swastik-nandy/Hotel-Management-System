package com.hotel.controller;

import com.hotel.model.RoomType;
import com.hotel.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/filter")
public class RoomFilterController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkRoomAvailability(
            @RequestParam Long branchId,
            @RequestParam RoomType type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut
    ) {
        boolean isAvailable = roomService.isRoomAvailable(branchId, type, checkIn, checkOut);
        return ResponseEntity.ok(isAvailable);
    }
}
