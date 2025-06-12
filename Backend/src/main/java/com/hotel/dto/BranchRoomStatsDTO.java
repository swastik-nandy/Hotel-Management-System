package com.hotel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BranchRoomStatsDTO {
    private Long branchId;
    private String branchName;
    private int luxuryRooms;
    private int deluxeRooms;
    private int standardRooms;
}