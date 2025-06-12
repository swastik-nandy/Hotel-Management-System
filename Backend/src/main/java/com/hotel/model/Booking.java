package com.hotel.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String bookingId;

    @Column(name = "customer_id")
    private Long customerId; 

    @NotBlank
    private String customerName;

    @NotBlank
    private String phoneNumber;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email must be valid")
    @Pattern(
        regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
        message = "Email domain must be valid"
    )
    private String email;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "branch_id", foreignKey = @ForeignKey(name = "fk_booking_branch"))
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", foreignKey = @ForeignKey(name = "fk_booking_room"))
    private Room room;

    @Column(nullable = false)
    private LocalDate checkIn;

    @Column(nullable = false)
    private LocalDate checkOut;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private double discount;

    @Column(nullable = false)
    private LocalDate createdAt;

    @Column(nullable = false)
    private LocalTime bookingTime;

    @Column(nullable = false)
    private String status; 
}