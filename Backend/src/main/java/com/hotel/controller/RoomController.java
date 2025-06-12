package com.hotel.controller;

import com.hotel.dto.RoomDTO;
import com.hotel.model.Room;
import com.hotel.model.RoomType;
import com.hotel.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/room")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/{id}")
    public ResponseEntity<RoomDTO> getRoomById(@PathVariable Long id) {
        Room room = roomService.getRoomById(id);
        return room != null ? ResponseEntity.ok(new RoomDTO(room)) : ResponseEntity.notFound().build();
    }

    @GetMapping("/available")
    public List<RoomDTO> getAvailableRooms(
            @RequestParam Long branchId,
            @RequestParam String type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut
    ) {
        RoomType roomTypeEnum = RoomType.valueOf(type.toUpperCase());
        return roomService.getAvailableRooms(branchId, roomTypeEnum, checkIn, checkOut)
                .stream()
                .map(RoomDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/all")
    public List<RoomDTO> getAllRooms() {
        return roomService.getAllRooms()
                .stream()
                .map(RoomDTO::new)
                .collect(Collectors.toList());
    }

    // ✅ Used by FilterPage — returns first match
    @GetMapping("/filter/check-room")
    public ResponseEntity<Map<String, Object>> getAvailableRoomByFilter(
            @RequestParam String branchName,
            @RequestParam String type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut
    ) {
        Room room = roomService.findAvailableRoom(branchName, type, checkIn, checkOut);
        return ResponseEntity.ok(Map.of("id", room != null ? room.getId() : null));
    }
}