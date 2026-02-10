package com.timely.userservice.model;

import jakarta.persistence.*;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "availability_time_slots")
public class AvailabilityTimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "availability_id", nullable = false)
    private TeacherAvailability availability;

    @Column(nullable = false)
    private String dayOfWeek;  // "MONDAY", "TUESDAY", etc.

    @Column(nullable = false)
    private LocalTime hourStart;

    @Column(nullable = false)
    private LocalTime hourEnd;

    // Constructeurs
    public AvailabilityTimeSlot() {
    }

    public AvailabilityTimeSlot(String dayOfWeek, LocalTime hourStart, LocalTime hourEnd) {
        this.dayOfWeek = dayOfWeek;
        this.hourStart = hourStart;
        this.hourEnd = hourEnd;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public TeacherAvailability getAvailability() {
        return availability;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public LocalTime getHourStart() {
        return hourStart;
    }

    public LocalTime getHourEnd() {
        return hourEnd;
    }

    // Setters
    public void setId(UUID id) {
        this.id = id;
    }

    public void setAvailability(TeacherAvailability availability) {
        this.availability = availability;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public void setHourStart(LocalTime hourStart) {
        this.hourStart = hourStart;
    }

    public void setHourEnd(LocalTime hourEnd) {
        this.hourEnd = hourEnd;
    }
}