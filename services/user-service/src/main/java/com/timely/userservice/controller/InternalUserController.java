package com.timely.userservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timely.userservice.dto.ChargeHoraireResponse;
import com.timely.userservice.dto.InternalUserDto;
import com.timely.userservice.dto.TeacherDto;
import com.timely.userservice.dto.UpdatePasswordRequest;
import com.timely.userservice.service.ChargeHoraireService;
import com.timely.userservice.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
public class InternalUserController {

    private final UserService userService;
    private final ChargeHoraireService chargeHoraireService;

    /**
     * Get user by email with password (for auth-service)
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<InternalUserDto> getUserByEmail(@PathVariable String email) {
        InternalUserDto user = userService.getInternalUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    /**
     * Get user by ID (for auth-service)
     */
    @GetMapping("/{id}")
    public ResponseEntity<InternalUserDto> getUserById(@PathVariable UUID id) {
        InternalUserDto user = userService.getInternalUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Get all teachers (for report-service inter-service calls)
     */
    @GetMapping("/teachers")
    public ResponseEntity<List<TeacherDto>> getAllTeachers() {
        List<TeacherDto> teachers = userService.getAllTeachers(Pageable.unpaged()).getContent();
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/{enseignantId}/charge-horaire")
    public ResponseEntity<ChargeHoraireResponse> getChargeHoraire(@PathVariable UUID enseignantId) {
        ChargeHoraireResponse charge = chargeHoraireService.calculateChargeHoraire(enseignantId);
        return ResponseEntity.ok(charge);
    }

    /**
     * Check if email exists (for auth-service)
     */
    @GetMapping("/exists-by-email")
    public ResponseEntity<Boolean> existsByEmail(@RequestParam String email) {
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }
    
    /**
     * Update user password (for auth-service password reset)
     */
    @PutMapping("/{id}/password")
    public ResponseEntity<Void> updatePassword(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePasswordRequest request) {
        userService.updatePassword(id, request.getNewPassword());
        return ResponseEntity.ok().build();
    }
}
