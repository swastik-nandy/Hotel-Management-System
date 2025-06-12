package com.hotel.repository;

import com.hotel.model.Booking;
import com.hotel.model.Room;
import com.hotel.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Booking findByBookingId(String bookingId);

    @Query("SELECT b FROM Booking b WHERE b.status = 'ACTIVE' AND b.bookingId = :bookingId")
    Booking findActiveByBookingId(@Param("bookingId") String bookingId);

    @Query("SELECT b FROM Booking b " +
           "WHERE b.branch.id = :branchId AND b.room.roomType = :roomType " +
           "AND ((b.checkIn <= :checkOut AND b.checkOut >= :checkIn)) " +
           "AND b.status = 'ACTIVE'")
    List<Booking> findOverlappingBookings(@Param("branchId") Long branchId,
                                          @Param("roomType") RoomType roomType,
                                          @Param("checkIn") LocalDate checkIn,
                                          @Param("checkOut") LocalDate checkOut);

    @Query("SELECT COUNT(b) FROM Booking b " +
           "WHERE b.phoneNumber = :phoneNumber AND b.customerName = :customerName " +
           "AND b.createdAt BETWEEN :start AND :end")
    long countBookingsInMonth(@Param("phoneNumber") String phoneNumber,
                              @Param("customerName") String customerName,
                              @Param("start") LocalDate start,
                              @Param("end") LocalDate end);

    @Query("SELECT b FROM Booking b WHERE b.createdAt < :cutoffDate")
    List<Booking> findBookingsOlderThanThirtyDays(@Param("cutoffDate") LocalDate cutoffDate);

    
    boolean existsByRoomAndCheckOutAfter(Room room, LocalDate date);

    @Query("SELECT b FROM Booking b JOIN FETCH b.room r JOIN FETCH r.branch WHERE b.bookingId = :bookingId")
    Booking findByBookingIdWithRoomAndBranch(@Param("bookingId") String bookingId);
}
