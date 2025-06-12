package com.hotel.dto;

import com.hotel.model.Room;
import com.hotel.model.RoomType;

public class RoomDTO {
    private Long id;
    private String roomNumber;
    private RoomType roomType;
    private String branchName;
    private String branchState;
    private Long branchId;

    // ✅ No-arg constructor for serialization
    public RoomDTO() {}

    // ✅ Constructor from Room entity
    public RoomDTO(Room room) {
        this.id = room.getId();
        this.roomNumber = room.getRoomNumber();
        this.roomType = room.getRoomType();
        if (room.getBranch() != null) {
            this.branchName = room.getBranch().getName();
            this.branchState = room.getBranch().getState();
            this.branchId = room.getBranch().getId();
        }
    }

    // Getters
    public Long getId() { return id; }
    public String getRoomNumber() { return roomNumber; }
    public RoomType getRoomType() { return roomType; }
    public String getBranchName() { return branchName; }
    public String getBranchState() { return branchState; }
    public Long getBranchId() { return branchId; }

    // ✅ Setters for JSON deserialization (if ever needed)
    public void setId(Long id) { this.id = id; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }
    public void setBranchName(String branchName) { this.branchName = branchName; }
    public void setBranchState(String branchState) { this.branchState = branchState; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }
}