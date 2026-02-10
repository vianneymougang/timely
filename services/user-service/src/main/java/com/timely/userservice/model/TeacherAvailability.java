package com.timely.userservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "teacher_availability")
public class TeacherAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID teacherId;

    @OneToMany(mappedBy = "availability", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AvailabilityTimeSlot> timeSlots = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructeurs
    public TeacherAvailability() {
        this.createdAt = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }

    public TeacherAvailability(UUID teacherId) {
        this.teacherId = teacherId;
        this.createdAt = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public UUID getTeacherId() {
        return teacherId;
    }

    public List<AvailabilityTimeSlot> getTimeSlots() {
        return timeSlots;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Setters
    public void setId(UUID id) {
        this.id = id;
    }

    public void setTeacherId(UUID teacherId) {
        this.teacherId = teacherId;
    }

    public void setTimeSlots(List<AvailabilityTimeSlot> timeSlots) {
        this.timeSlots = timeSlots;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Méthodes utilitaires
    public void addTimeSlot(AvailabilityTimeSlot slot) {
        timeSlots.add(slot);
        slot.setAvailability(this);
    }

    public void removeTimeSlot(AvailabilityTimeSlot slot) {
        timeSlots.remove(slot);
        slot.setAvailability(null);
    }

    @PreUpdate
    public void preUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }

    public void clearTimeSlots() {
    }
}