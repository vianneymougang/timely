package com.timely.userservice.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Summary DTO for admin list view of all teacher availabilities
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherAvailabilitySummaryDto {
    
    /**
     * Teacher's UUID as string
     */
    private String teacherId;
    
    /**
     * Teacher's full name
     */
    private String teacherName;
    
    /**
     * Total number of time slots marked as available
     */
    private int totalSlotsAvailable;
    
    /**
     * When the availability was last updated
     */
    private LocalDateTime lastUpdated;
}
