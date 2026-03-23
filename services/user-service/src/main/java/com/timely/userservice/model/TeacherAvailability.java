package com.timely.userservice.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity representing a teacher's overall availability configuration
 */
@Entity
@Table(name = "teacher_availability")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeacherAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "teacher_id", nullable = false, unique = true)
    private UUID teacherId;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    @Version
    @Column(name = "version")
    private Long version;

    @OneToMany(mappedBy = "availability", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<AvailabilityTimeSlot> timeSlots = new ArrayList<>();

    /**
     * Helper method to add a time slot
     */
    public void addTimeSlot(AvailabilityTimeSlot slot) {
        timeSlots.add(slot);
        slot.setAvailability(this);
    }

    /**
     * Helper method to remove a time slot
     */
    public void removeTimeSlot(AvailabilityTimeSlot slot) {
        timeSlots.remove(slot);
        slot.setAvailability(null);
    }

    /**
     * Helper method to clear all time slots
     */
    public void clearTimeSlots() {
        timeSlots.clear();
    }
}
