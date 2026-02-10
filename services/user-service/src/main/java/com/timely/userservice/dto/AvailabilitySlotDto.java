package com.timely.userservice.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for individual availability slots (for inter-service communication)
 * Represents a single continuous time slot on a specific day of the week
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilitySlotDto {

    /**
     * Unique identifier of the slot
     */
    private UUID id;

    /**
     * ID of the teacher this slot belongs to
     */
    private UUID teacherId;

    /**
     * Day of the week for this availability slot
     */
    private DayOfWeek dayOfWeek;

    /**
     * Start time of the availability slot
     */
    private LocalTime startTime;

    /**
     * End time of the availability slot
     */
    private LocalTime endTime;

    /**
     * Constructor without ID for creating new slots
     */
    public AvailabilitySlotDto(UUID teacherId, DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime) {
        this.teacherId = teacherId;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
