package com.timely.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.HashMap;
import java.util.Map;

public class TimeSlotDto {

    @NotBlank(message = "Day is required")
    private String day;  // "monday", "tuesday", etc.

    @NotNull(message = "Slots are required")
    private Map<String, Boolean> slots;  // {"08:00-10:00": true, "10:00-12:00": false}

    // Constructeurs
    public TimeSlotDto() {
        this.slots = new HashMap<>();
    }

    public TimeSlotDto(String day, Map<String, Boolean> slots) {
        this.day = day;
        this.slots = slots != null ? slots : new HashMap<>();
    }

    // Getters
    public String getDay() {
        return day;
    }

    public Map<String, Boolean> getSlots() {
        return slots;
    }

    // Setters
    public void setDay(String day) {
        this.day = day;
    }

    public void setSlots(Map<String, Boolean> slots) {
        this.slots = slots;
    }
}