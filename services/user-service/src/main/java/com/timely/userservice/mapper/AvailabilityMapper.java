package com.timely.userservice.mapper;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.timely.userservice.dto.AvailabilityRequestDto;
import com.timely.userservice.dto.AvailabilityResponseDto;
import com.timely.userservice.dto.TeacherAvailabilitySummaryDto;
import com.timely.userservice.dto.TimeSlotDto;
import com.timely.userservice.model.AvailabilityTimeSlot;
import com.timely.userservice.model.TeacherAvailability;
import com.timely.userservice.model.User;

@Component
public class AvailabilityMapper {

    public static List<AvailabilityTimeSlot> toTimeSlotEntities(List<TimeSlotDto> timeSlots) {
        List<AvailabilityTimeSlot> entities = new ArrayList<>();

        if (timeSlots == null) {
            return entities;
        }

        for (TimeSlotDto slotDto : timeSlots) {
            String day = slotDto.getDay();
            Map<String, Boolean> slots = slotDto.getSlots();

            if (slots == null) continue;

            for (Map.Entry<String, Boolean> entry : slots.entrySet()) {
                if (Boolean.TRUE.equals(entry.getValue())) {
                    String timeRange = entry.getKey();
                    String[] times = timeRange.split("-");

                    if (times.length == 2) {
                        try {
                            LocalTime start = LocalTime.parse(times[0].trim());
                            LocalTime end = LocalTime.parse(times[1].trim());

                            AvailabilityTimeSlot slot = new AvailabilityTimeSlot(
                                    day.toUpperCase(), start, end
                            );
                            entities.add(slot);
                        } catch (Exception ex) {
                            // ignore invalid time formats
                        }
                    }
                }
            }
        }

        return entities;
    }

    /**
     * Convert AvailabilityRequestDto to TeacherAvailability entity
     */
    public TeacherAvailability toEntity(AvailabilityRequestDto requestDto, UUID teacherId) {
        TeacherAvailability availability = new TeacherAvailability(teacherId);

        if (requestDto.getTimeSlots() != null) {
            for (TimeSlotDto slotDto : requestDto.getTimeSlots()) {
                String day = slotDto.getDay();
                Map<String, Boolean> slots = slotDto.getSlots();

                if (slots != null) {
                    for (Map.Entry<String, Boolean> entry : slots.entrySet()) {
                        if (Boolean.TRUE.equals(entry.getValue())) {
                            String timeRange = entry.getKey();
                            String[] times = timeRange.split("-");

                            if (times.length == 2) {
                                LocalTime start = LocalTime.parse(times[0].trim());
                                LocalTime end = LocalTime.parse(times[1].trim());

                                AvailabilityTimeSlot slot = new AvailabilityTimeSlot(
                                        day.toUpperCase(), start, end
                                );
                                availability.addTimeSlot(slot);
                            }
                        }
                    }
                }
            }
        }

        return availability;
    }

    /**
     * Convert TeacherAvailability entity to AvailabilityResponseDto
     */
    public AvailabilityResponseDto toResponseDto(TeacherAvailability availability, User teacher) {
        AvailabilityResponseDto responseDto = new AvailabilityResponseDto();

        responseDto.setUserId(teacher.getId());
        responseDto.setTeacherId(availability.getTeacherId().toString());
        responseDto.setTeacherName(teacher.getFirstName() + " " + teacher.getLastName());
        responseDto.setTeacherEmail(teacher.getEmail());
        responseDto.setLastUpdated(availability.getLastUpdated());

        // Grouper les créneaux par jour
        Map<String, Map<String, Boolean>> daySlots = new HashMap<>();

        for (AvailabilityTimeSlot slot : availability.getTimeSlots()) {
            String day = slot.getDayOfWeek().toLowerCase();
            String timeRange = slot.getHourStart() + "-" + slot.getHourEnd();

            daySlots.computeIfAbsent(day, k -> new HashMap<>()).put(timeRange, true);
        }

        // Convertir en liste de TimeSlotDto
        List<TimeSlotDto> timeSlots = daySlots.entrySet().stream()
                .map(entry -> new TimeSlotDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        responseDto.setTimeSlots(timeSlots);

        return responseDto;
    }

    /**
     * Convert to summary DTO
     */
    public TeacherAvailabilitySummaryDto toSummaryDto(User teacher, TeacherAvailability availability) {
        TeacherAvailabilitySummaryDto summaryDto = new TeacherAvailabilitySummaryDto();

        summaryDto.setUserId(teacher.getId());
        summaryDto.setTeacherName(teacher.getFirstName() + " " + teacher.getLastName());
        summaryDto.setTeacherEmail(teacher.getEmail());
        summaryDto.setHasAvailability(availability != null && !availability.getTimeSlots().isEmpty());
        summaryDto.setLastUpdated(availability != null ? availability.getLastUpdated() : null);

        return summaryDto;
    }

    /**
     * Create empty response DTO
     */
    public AvailabilityResponseDto createEmptyResponseDto(User teacher) {
        AvailabilityResponseDto responseDto = new AvailabilityResponseDto();

        responseDto.setUserId(teacher.getId());
        responseDto.setTeacherId(teacher.getId().toString());
        responseDto.setTeacherName(teacher.getFirstName() + " " + teacher.getLastName());
        responseDto.setTeacherEmail(teacher.getEmail());
        responseDto.setTimeSlots(new ArrayList<>());
        responseDto.setLastUpdated(null);

        return responseDto;
    }
}