package com.hotel.repository;

import com.hotel.model.Room;
import com.hotel.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // ✅ Find the first unbooked room by branch ID and room type
    @Query("""
        SELECT r FROM Room r
        WHERE r.branch.id = :branchId
          AND r.roomType = :roomType
          AND NOT EXISTS (
              SELECT 1 FROM Booking b
              WHERE b.room = r
                AND b.status = 'ACTIVE'
                AND (:checkIn < b.checkOut AND :checkOut > b.checkIn)
          )
        ORDER BY r.id ASC
    """)
    List<Room> findFirstAvailableRoomCandidates(
        Long branchId,
        RoomType roomType,
        LocalDate checkIn,
        LocalDate checkOut
    );

    // ✅ Get all rooms available for a branch/type combo in given date range
    @Query("""
        SELECT r FROM Room r
        WHERE r.branch.id = :branchId
          AND r.roomType = :roomType
          AND NOT EXISTS (
              SELECT 1 FROM Booking b
              WHERE b.room = r
                AND b.status = 'ACTIVE'
                AND (:checkIn < b.checkOut AND :checkOut > b.checkIn)
          )
        ORDER BY r.roomNumber ASC
    """)
    List<Room> findAllAvailableRooms(
        Long branchId,
        RoomType roomType,
        LocalDate checkIn,
        LocalDate checkOut
    );

    // ✅ Same as above but filters by branch name instead of ID
    @Query("""
        SELECT r FROM Room r
        WHERE r.branch.name = :branchName
          AND r.roomType = :roomType
          AND NOT EXISTS (
              SELECT 1 FROM Booking b
              WHERE b.room = r
                AND b.status = 'ACTIVE'
                AND (:checkIn < b.checkOut AND :checkOut > b.checkIn)
          )
        ORDER BY r.id ASC
    """)
    List<Room> findAvailableRoomByBranchAndType(
        String branchName,
        RoomType roomType,
        LocalDate checkIn,
        LocalDate checkOut
    );

    // ✅ For dashboard stats (raw SQL)
    @Query(value = "SELECT * FROM branch_room_stats", nativeQuery = true)
    List<Object[]> fetchBranchRoomStatsRaw();
}