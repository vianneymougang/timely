package com.timely.userservice.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.userservice.dto.AvailabilityRequestDto;
import com.timely.userservice.dto.AvailabilityResponseDto;
import com.timely.userservice.dto.AvailabilitySlotDto;
import com.timely.userservice.dto.TeacherAvailabilitySummaryDto;
import com.timely.userservice.exception.ResourceNotFoundException;
import com.timely.userservice.mapper.AvailabilityMapper;
import com.timely.userservice.model.AvailabilityTimeSlot;
import com.timely.userservice.model.Role;
import com.timely.userservice.model.TeacherAvailability;
import com.timely.userservice.model.TeacherWeeklyOverride;
import com.timely.userservice.model.User;
import com.timely.userservice.repository.TeacherAvailabilityRepository;
import com.timely.userservice.repository.TeacherWeeklyOverrideRepository;
import com.timely.userservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Implementation of AvailabilityService
 */
@Service
@RequiredArgsConstructor
public class AvailabilityServiceImpl implements AvailabilityService {

    private final TeacherAvailabilityRepository availabilityRepository;
    private final TeacherWeeklyOverrideRepository overrideRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public AvailabilityResponseDto saveOrUpdateAvailability(UUID teacherId, AvailabilityRequestDto request) {
        // Verify teacher exists
        User teacher = userRepository.findById(teacherId)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));

        // Verify user is a teacher
        if (!"ROLE_TEACHER".equals(teacher.getRole().name())) {
            throw new IllegalArgumentException("User is not a teacher");
        }

        // Convert DTO to entities
        List<AvailabilityTimeSlot> newTimeSlots = AvailabilityMapper.toTimeSlotEntities(request.getTimeSlots());

        // Check if availability already exists (with timeSlots for update)
        Optional<TeacherAvailability> existingOpt = availabilityRepository.findByTeacherIdWithTimeSlots(teacherId);

        TeacherAvailability availability;
        if (existingOpt.isPresent()) {
            // Update existing availability
            availability = existingOpt.get();
            availability.setLastUpdated(LocalDateTime.now());

            // Clear old time slots
            availability.clearTimeSlots();
            // Force flush to ensure deletes are executed before inserts to avoid unique constraint violation
            availabilityRepository.saveAndFlush(availability);
        } else {
            // Create new availability
            availability = new TeacherAvailability();
            availability.setTeacherId(teacherId);
            availability.setLastUpdated(LocalDateTime.now());
        }

        // Add new time slots
        for (AvailabilityTimeSlot slot : newTimeSlots) {
            availability.addTimeSlot(slot);
        }

        // Save
        availability = availabilityRepository.save(availability);

        // Build teacher name
        String teacherName = teacher.getName() + " " + teacher.getSurname();

        // Convert to response DTO
        return AvailabilityMapper.toResponseDto(availability, teacherName);
    }

    @Override
    @Transactional(readOnly = true)
    public AvailabilityResponseDto getMyAvailability(UUID teacherId) {
        return getTeacherAvailability(teacherId);
    }

    @Override
    @Transactional(readOnly = true)
    public AvailabilityResponseDto getTeacherAvailability(UUID teacherId) {
        // Verify teacher exists
        User teacher = userRepository.findById(teacherId)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));

        String teacherName = teacher.getName() + " " + teacher.getSurname();

        // Find availability with timeSlots
        Optional<TeacherAvailability> availabilityOpt = availabilityRepository.findByTeacherIdWithTimeSlots(teacherId);

        if (availabilityOpt.isPresent()) {
            return AvailabilityMapper.toResponseDto(availabilityOpt.get(), teacherName);
        } else {
            // Return empty grid
            return AvailabilityMapper.createEmptyResponse(teacherId.toString(), teacherName);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherAvailabilitySummaryDto> getAllTeacherAvailabilities() {
        // Get all teachers
        List<User> teachers = userRepository.findAllByRole(Role.ROLE_TEACHER);

        List<TeacherAvailabilitySummaryDto> summaries = new ArrayList<>();

        for (User teacher : teachers) {
            Optional<TeacherAvailability> availabilityOpt = availabilityRepository.findByTeacherIdWithTimeSlots(teacher.getId());

            TeacherAvailabilitySummaryDto summary = new TeacherAvailabilitySummaryDto();
            summary.setTeacherId(teacher.getId().toString());
            summary.setTeacherName(teacher.getName() + " " + teacher.getSurname());

            if (availabilityOpt.isPresent()) {
                TeacherAvailability availability = availabilityOpt.get();
                summary.setTotalSlotsAvailable(availability.getTimeSlots().size());
                summary.setLastUpdated(availability.getLastUpdated());
            } else {
                summary.setTotalSlotsAvailable(0);
                summary.setLastUpdated(null);
            }

            summaries.add(summary);
        }

        return summaries;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailabilitySlotDto> getAvailabilityByTeacherId(UUID teacherId) {
        // Find availability for the teacher with timeSlots
        Optional<TeacherAvailability> availabilityOpt = availabilityRepository.findByTeacherIdWithTimeSlots(teacherId);

        if (availabilityOpt.isEmpty()) {
            return new ArrayList<>();
        }

        TeacherAvailability availability = availabilityOpt.get();
        List<AvailabilitySlotDto> slots = new ArrayList<>();

        // Convert each AvailabilityTimeSlot to AvailabilitySlotDto
        for (AvailabilityTimeSlot timeSlot : availability.getTimeSlots()) {
            AvailabilitySlotDto dto = new AvailabilitySlotDto();
            dto.setId(timeSlot.getId());
            dto.setTeacherId(teacherId);

            // Convert String day to DayOfWeek enum
            dto.setDayOfWeek(convertToDayOfWeek(timeSlot.getDayOfWeek()));

            // Convert Integer hours to LocalTime
            dto.setStartTime(LocalTime.of(timeSlot.getHourStart(), 0));
            dto.setEndTime(LocalTime.of(timeSlot.getHourEnd(), 0));

            slots.add(dto);
        }

        return slots;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailabilitySlotDto> getEffectiveAvailability(UUID teacherId, LocalDate weekStart) {
        List<AvailabilitySlotDto> template = getAvailabilityByTeacherId(teacherId);
        List<TeacherWeeklyOverride> overrides = overrideRepository.findByTeacherIdAndWeekStart(teacherId, weekStart);

        Set<String> unavailableKeys = overrides.stream()
                .filter(o -> o.getOverrideType() == TeacherWeeklyOverride.OverrideType.UNAVAILABLE)
                .map(o -> o.getDayOfWeek().name() + ":" + o.getHourStart())
                .collect(Collectors.toSet());

        Set<String> extraAvailableKeys = overrides.stream()
                .filter(o -> o.getOverrideType() == TeacherWeeklyOverride.OverrideType.AVAILABLE)
                .map(o -> o.getDayOfWeek().name() + ":" + o.getHourStart())
                .collect(Collectors.toSet());

        List<AvailabilitySlotDto> effective = template.stream()
                .filter(s -> !unavailableKeys.contains(s.getDayOfWeek().name() + ":" + s.getStartTime().getHour()))
                .collect(Collectors.toCollection(ArrayList::new));

        for (TeacherWeeklyOverride override : overrides) {
            if (override.getOverrideType() == TeacherWeeklyOverride.OverrideType.AVAILABLE) {
                String key = override.getDayOfWeek().name() + ":" + override.getHourStart();
                boolean alreadyPresent = template.stream()
                        .anyMatch(s -> (s.getDayOfWeek().name() + ":" + s.getStartTime().getHour()).equals(key));
                if (!alreadyPresent) {
                    AvailabilitySlotDto extra = new AvailabilitySlotDto();
                    extra.setId(override.getId());
                    extra.setTeacherId(teacherId);
                    extra.setDayOfWeek(override.getDayOfWeek());
                    extra.setStartTime(LocalTime.of(override.getHourStart(), 0));
                    extra.setEndTime(LocalTime.of(override.getHourEnd(), 0));
                    effective.add(extra);
                }
            }
        }

        return effective;
    }

    private DayOfWeek convertToDayOfWeek(String dayName) {
        try {
            return DayOfWeek.valueOf(dayName.toUpperCase());
        } catch (IllegalArgumentException e) {
            return switch (dayName.toLowerCase()) {
                case "lundi" -> DayOfWeek.MONDAY;
                case "mardi" -> DayOfWeek.TUESDAY;
                case "mercredi" -> DayOfWeek.WEDNESDAY;
                case "jeudi" -> DayOfWeek.THURSDAY;
                case "vendredi" -> DayOfWeek.FRIDAY;
                case "samedi" -> DayOfWeek.SATURDAY;
                case "dimanche" -> DayOfWeek.SUNDAY;
                default -> throw new IllegalArgumentException("Invalid day name: " + dayName);
            };
        }
    }
}
