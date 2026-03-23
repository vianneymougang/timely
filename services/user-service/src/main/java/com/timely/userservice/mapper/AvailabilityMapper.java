package com.timely.userservice.mapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.timely.userservice.dto.AvailabilityResponseDto;
import com.timely.userservice.dto.TimeSlotDto;
import com.timely.userservice.model.AvailabilityTimeSlot;
import com.timely.userservice.model.TeacherAvailability;

/**
 * Mapper utility for converting between availability entities and DTOs
 */
public class AvailabilityMapper {

    private static final String[] DAYS = {"lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"};
    private static final int START_HOUR = 8;
    private static final int END_HOUR = 17;

    /**
     * Convert frontend DTO (grid format) to list of time slot entities
     * Extracts only the selected (true) slots
     */
    public static List<AvailabilityTimeSlot> toTimeSlotEntities(List<TimeSlotDto> timeSlotsDto) {
        List<AvailabilityTimeSlot> entities = new ArrayList<>();

        for (int hourIndex = 0; hourIndex < timeSlotsDto.size(); hourIndex++) {
            TimeSlotDto slotDto = timeSlotsDto.get(hourIndex);
            int hourStart = START_HOUR + hourIndex;
            int hourEnd = hourStart + 1;

            // Extract selected days for this hour
            for (String day : DAYS) {
                Boolean isAvailable = slotDto.getSlots().get(day);
                if (Boolean.TRUE.equals(isAvailable)) {
                    AvailabilityTimeSlot slot = new AvailabilityTimeSlot(day, hourStart, hourEnd);
                    entities.add(slot);
                }
            }
        }

        return entities;
    }

    /**
     * Convert entities to frontend DTO (grid format)
     * Creates a full grid with all hours and days, marking selected slots as true
     */
    public static AvailabilityResponseDto toResponseDto(TeacherAvailability availability, String teacherName) {
        AvailabilityResponseDto responseDto = new AvailabilityResponseDto();
        responseDto.setTeacherId(availability.getTeacherId().toString());
        responseDto.setTeacherName(teacherName);
        responseDto.setLastUpdated(availability.getLastUpdated());

        // Create a map for quick lookup of selected slots
        Map<String, Map<Integer, Boolean>> selectedSlots = new HashMap<>();
        for (AvailabilityTimeSlot slot : availability.getTimeSlots()) {
            selectedSlots
                .computeIfAbsent(slot.getDayOfWeek(), k -> new HashMap<>())
                .put(slot.getHourStart(), true);
        }

        // Build the grid
        List<TimeSlotDto> timeSlots = new ArrayList<>();
        for (int hour = START_HOUR; hour < END_HOUR; hour++) {
            String hourLabel = hour + "h - " + (hour + 1) + "h";
            Map<String, Boolean> daySlots = new HashMap<>();

            for (String day : DAYS) {
                boolean isAvailable = selectedSlots.getOrDefault(day, new HashMap<>())
                    .getOrDefault(hour, false);
                daySlots.put(day, isAvailable);
            }

            timeSlots.add(new TimeSlotDto(hourLabel, daySlots));
        }

        responseDto.setTimeSlots(timeSlots);
        return responseDto;
    }

    /**
     * Create an empty availability response (for teachers who haven't set availability yet)
     */
    public static AvailabilityResponseDto createEmptyResponse(String teacherId, String teacherName) {
        AvailabilityResponseDto responseDto = new AvailabilityResponseDto();
        responseDto.setTeacherId(teacherId);
        responseDto.setTeacherName(teacherName);
        responseDto.setLastUpdated(null);

        // Create empty grid
        List<TimeSlotDto> timeSlots = new ArrayList<>();
        for (int hour = START_HOUR; hour < END_HOUR; hour++) {
            String hourLabel = hour + "h - " + (hour + 1) + "h";
            Map<String, Boolean> daySlots = new HashMap<>();

            for (String day : DAYS) {
                daySlots.put(day, false);
            }

            timeSlots.add(new TimeSlotDto(hourLabel, daySlots));
        }

        responseDto.setTimeSlots(timeSlots);
        return responseDto;
    }
}
