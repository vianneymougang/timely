package com.timely.userservice.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class AvailabilityRequestDto {

    @NotNull(message = "Time slots are required")
    private List<TimeSlotDto> timeSlots;

    // Constructeurs
    public AvailabilityRequestDto() {
    }

    public AvailabilityRequestDto(List<TimeSlotDto> timeSlots) {
        this.timeSlots = timeSlots;
    }

    // Getters
    public List<TimeSlotDto> getTimeSlots() {
        return timeSlots;
    }

    // Setters
    public void setTimeSlots(List<TimeSlotDto> timeSlots) {
        this.timeSlots = timeSlots;
    }
}