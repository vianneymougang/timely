package com.timely.userservice.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for availability response to frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityResponseDto {
    
    /**
     * Teacher's UUID as string
     */
    private String teacherId;
    
    /**
     * Teacher's full name (for admin view)
     */
    private String teacherName;
    
    /**
     * When the availability was last updated
     */
    private LocalDateTime lastUpdated;
    
    /**
     * Time slots in grid format matching frontend structure
     */
    private List<TimeSlotDto> timeSlots;
}
