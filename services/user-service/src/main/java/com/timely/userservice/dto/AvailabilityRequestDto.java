package com.timely.userservice.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for availability request from frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityRequestDto {
    
    @NotNull(message = "Time slots cannot be null")
    @Valid
    private List<TimeSlotDto> timeSlots;
}
