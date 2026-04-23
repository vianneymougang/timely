package com.timely.userservice.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timely.userservice.dto.AvailabilityRequestDto;
import com.timely.userservice.dto.AvailabilityResponseDto;
import com.timely.userservice.dto.TeacherAvailabilitySummaryDto;
import com.timely.userservice.dto.WeeklyOverridesRequest;
import com.timely.userservice.exception.ResourceNotFoundException;
import com.timely.userservice.model.User;

import jakarta.validation.Valid;
import com.timely.userservice.repository.UserRepository;
import com.timely.userservice.service.AvailabilityService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller for teacher availability management
 */
@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;
    private final UserRepository userRepository;

    /**
     * Save or update teacher's own availability
     * Accessible by teachers only
     */
    @PutMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<AvailabilityResponseDto> saveMyAvailability(
            @Valid @RequestBody AvailabilityRequestDto request,
            Authentication authentication) {
        
        // Extract teacher email from JWT principal and find user
        String email = authentication.getName();
        User teacher = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with email: " + email));
        
        AvailabilityResponseDto response = availabilityService.saveOrUpdateAvailability(teacher.getId(), request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get teacher's own availability
     * Accessible by teachers only
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<AvailabilityResponseDto> getMyAvailability(Authentication authentication) {
        // Extract teacher email from JWT principal and find user
        String email = authentication.getName();
        User teacher = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with email: " + email));
        
        AvailabilityResponseDto response = availabilityService.getMyAvailability(teacher.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Get specific teacher's availability
     * Accessible by admins only
     */
    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AvailabilityResponseDto> getTeacherAvailability(@PathVariable UUID teacherId) {
        AvailabilityResponseDto response = availabilityService.getTeacherAvailability(teacherId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all teachers' availability summaries
     * Accessible by admins only
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TeacherAvailabilitySummaryDto>> getAllTeacherAvailabilities() {
        List<TeacherAvailabilitySummaryDto> summaries = availabilityService.getAllTeacherAvailabilities();
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/effective")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<AvailabilityResponseDto> getEffectiveAvailability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart,
            Authentication authentication) {
        String email = authentication.getName();
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with email: " + email));
        return ResponseEntity.ok(availabilityService.getEffectiveAvailabilityResponse(teacher.getId(), weekStart));
    }

    @PutMapping("/overrides")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Void> saveWeeklyOverrides(
            @Valid @RequestBody WeeklyOverridesRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with email: " + email));
        availabilityService.saveWeeklyOverrides(teacher.getId(), request);
        return ResponseEntity.noContent().build();
    }
}
