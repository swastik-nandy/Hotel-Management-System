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
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    //  Fetch booking by bookingId (regardless of status)
    Booking findByBookingId(String bookingId);

    //  Fetch only ACTIVE bookings by bookingId
    @Query("SELECT b FROM Booking b WHERE b.status = 'ACTIVE' AND b.bookingId = :bookingId")
    Booking findActiveByBookingId(@Param("bookingId") String bookingId);

    //  Fetch overlapping ACTIVE bookings based on branch + room type + date range
    @Query("""
        SELECT b FROM Booking b
        WHERE b.branch.id = :branchId AND b.room.roomType = :roomType
        AND ((b.checkIn <= :checkOut AND b.checkOut >= :checkIn))
        AND b.status = 'ACTIVE'
    """)
    List<Booking> findOverlappingBookings(
            @Param("branchId") Long branchId,
            @Param("roomType") RoomType roomType,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );

    //  Clean up old records
    @Query("SELECT b FROM Booking b WHERE b.createdAt < :cutoffDate")
    List<Booking> findBookingsOlderThanThirtyDays(@Param("cutoffDate") LocalDate cutoffDate);

    //  Check if a room is still booked past a certain date
    boolean existsByRoomAndCheckOutAfter(Room room, LocalDate date);

    //  Get full booking with room and branch for PDF generation
    @Query("SELECT b FROM Booking b JOIN FETCH b.room r JOIN FETCH r.branch WHERE b.bookingId = :bookingId")
    Booking findByBookingIdWithRoomAndBranch(@Param("bookingId") String bookingId);

    //  Support Stripe webhook lookups
    Optional<Booking> findByStripeSessionId(String stripeSessionId);
}
