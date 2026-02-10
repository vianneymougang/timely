package com.timely.userservice.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.userservice.dto.AvailabilityRequestDto;
import com.timely.userservice.dto.AvailabilityResponseDto;
import com.timely.userservice.dto.TeacherAvailabilitySummaryDto;
import com.timely.userservice.exception.ResourceNotFoundException;
import com.timely.userservice.mapper.AvailabilityMapper;
import com.timely.userservice.model.AvailabilityTimeSlot;
import com.timely.userservice.model.TeacherAvailability;
import com.timely.userservice.model.User;
import com.timely.userservice.model.UserRole;
import com.timely.userservice.repository.TeacherAvailabilityRepository;
import com.timely.userservice.repository.UserRepository;

/**
 * Implementation of AvailabilityService
 */
@Service
public class AvailabilityServiceImpl implements AvailabilityService {

    private final TeacherAvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;
    private final AvailabilityMapper availabilityMapper;

    // ✅ Constructeur manuel (remplace @RequiredArgsConstructor)
    public AvailabilityServiceImpl(TeacherAvailabilityRepository availabilityRepository,
                                   UserRepository userRepository,
                                   AvailabilityMapper availabilityMapper) {
        this.availabilityRepository = availabilityRepository;
        this.userRepository = userRepository;
        this.availabilityMapper = availabilityMapper;
    }

    @Override
    @Transactional
    public AvailabilityResponseDto saveOrUpdateAvailability(UUID teacherId, AvailabilityRequestDto request) {
        // Verify teacher exists
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));

        // Verify user is a teacher
        if (!UserRole.ROLE_TEACHER.equals(teacher.getRole())) {
            throw new IllegalArgumentException("User is not a teacher");
        }

        // Convert DTO to entity
        TeacherAvailability newAvailability = availabilityMapper.toEntity(request, teacherId);

        // Check if availability already exists
        Optional<TeacherAvailability> existingOpt = availabilityRepository.findByTeacherId(teacherId);

        TeacherAvailability availability;
        if (existingOpt.isPresent()) {
            // Update existing availability
            availability = existingOpt.get();
            availability.setLastUpdated(LocalDateTime.now());

            // Clear old time slots
            availability.getTimeSlots().clear();

            // Force flush to ensure deletes are executed before inserts
            availabilityRepository.saveAndFlush(availability);

            // Add new time slots
            for (AvailabilityTimeSlot slot : newAvailability.getTimeSlots()) {
                availability.addTimeSlot(slot);
            }
        } else {
            // Use the new availability created by mapper
            availability = newAvailability;
        }

        // Save
        availability = availabilityRepository.save(availability);

        // Convert to response DTO
        return availabilityMapper.toResponseDto(availability, teacher);
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

        // Find availability
        Optional<TeacherAvailability> availabilityOpt = availabilityRepository.findByTeacherId(teacherId);

        if (availabilityOpt.isPresent()) {
            return availabilityMapper.toResponseDto(availabilityOpt.get(), teacher);
        } else {
            // Return empty grid
            return availabilityMapper.createEmptyResponseDto(teacher);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherAvailabilitySummaryDto> getAllTeacherAvailabilities() {
        // Get all teachers
        List<User> teachers = userRepository.findByRole(UserRole.ROLE_TEACHER);

        List<TeacherAvailabilitySummaryDto> summaries = new ArrayList<>();

        for (User teacher : teachers) {
            Optional<TeacherAvailability> availabilityOpt = availabilityRepository.findByTeacherId(teacher.getId());

            TeacherAvailabilitySummaryDto summary = new TeacherAvailabilitySummaryDto();
            summary.setUserId(teacher.getId());
            summary.setTeacherName(teacher.getFirstName() + " " + teacher.getLastName());
            summary.setTeacherEmail(teacher.getEmail());

            if (availabilityOpt.isPresent()) {
                TeacherAvailability availability = availabilityOpt.get();
                summary.setHasAvailability(!availability.getTimeSlots().isEmpty());
                summary.setLastUpdated(availability.getLastUpdated());
            } else {
                summary.setHasAvailability(false);
                summary.setLastUpdated(null);
            }

            summaries.add(summary);
        }

        return summaries;
    }
}