package com.timely.userservice.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing a single time slot row in the availability grid
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotDto {
    
    /**
     * Hour range as string, e.g. "8h - 9h"
     */
    private String hour;
    
    /**
     * Map of day names to availability boolean
     * Keys: "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"
     * Values: true if available, false if not
     */
    private Map<String, Boolean> slots;
}
