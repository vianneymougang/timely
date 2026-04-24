package com.timely.userservice.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.timely.userservice.dto.AvailabilityRequestDto;
import com.timely.userservice.dto.AvailabilityResponseDto;
import com.timely.userservice.dto.AvailabilitySlotDto;
import com.timely.userservice.dto.TeacherAvailabilitySummaryDto;
import com.timely.userservice.dto.WeeklyOverridesRequest;

/**
 * Service interface for managing teacher availability
 */
public interface AvailabilityService {

    /**
     * Save or update availability for a teacher
     * 
     * @param teacherId ID of the teacher
     * @param request availability data from frontend
     * @return saved availability as response DTO
     */
    AvailabilityResponseDto saveOrUpdateAvailability(UUID teacherId, AvailabilityRequestDto request);

    /**
     * Get teacher's own availability
     * 
     * @param teacherId ID of the teacher
     * @return availability response DTO, or empty grid if not set
     */
    AvailabilityResponseDto getMyAvailability(UUID teacherId);

    /**
     * Get specific teacher's availability (admin only)
     * 
     * @param teacherId ID of the teacher
     * @return availability response DTO, or empty grid if not set
     */
    AvailabilityResponseDto getTeacherAvailability(UUID teacherId);

    /**
     * Get all teachers' availability summaries (admin only)
     *
     * @return list of availability summaries for all teachers
     */
    List<TeacherAvailabilitySummaryDto> getAllTeacherAvailabilities();

    /**
     * Get availability slots for a teacher (for inter-service communication)
     *
     * @param teacherId ID of the teacher
     * @return list of individual availability slots
     */
    List<AvailabilitySlotDto> getAvailabilityByTeacherId(UUID teacherId);

    List<AvailabilitySlotDto> getEffectiveAvailability(UUID teacherId, LocalDate weekStart);

    AvailabilityResponseDto getEffectiveAvailabilityResponse(UUID teacherId, LocalDate weekStart);

    void saveWeeklyOverrides(UUID teacherId, WeeklyOverridesRequest request);
}
