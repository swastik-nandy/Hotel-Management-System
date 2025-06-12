package com.hotel.service;

import com.hotel.model.Room;
import com.hotel.model.RoomType;
import com.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public List<Room> getAvailableRooms(Long branchId, RoomType roomType, LocalDate checkIn, LocalDate checkOut) {
        return roomRepository.findAllAvailableRooms(branchId, roomType, checkIn, checkOut);
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    public boolean isRoomAvailable(Long branchId, RoomType roomType, LocalDate checkIn, LocalDate checkOut) {
        return !getAvailableRooms(branchId, roomType, checkIn, checkOut).isEmpty();
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room findAvailableRoom(String branchName, String type, LocalDate checkIn, LocalDate checkOut) {
        RoomType roomType = RoomType.valueOf(type.toUpperCase());
        List<Room> available = roomRepository.findAvailableRoomByBranchAndType(branchName, roomType, checkIn, checkOut);
        return available.isEmpty() ? null : available.get(0);
    }
}