package com.timely.userservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timely.userservice.dto.AdminDto;
import com.timely.userservice.dto.AssignTeacherRequest;
import com.timely.userservice.dto.BulkUserActionRequest;
import com.timely.userservice.dto.BulkUserActionResponse;
import com.timely.userservice.dto.ChargeHoraireResponse;
import com.timely.userservice.dto.CreateAdminRequest;
import com.timely.userservice.dto.CreateTeacherRequest;
import com.timely.userservice.dto.EnseignerDto;
import com.timely.userservice.dto.IntervenirEcoleDto;
import com.timely.userservice.dto.TeacherDto;
import com.timely.userservice.dto.UpdateUserRequest;
import com.timely.userservice.dto.UserDto;
import com.timely.userservice.service.AffectationService;
import com.timely.userservice.service.ChargeHoraireService;
import com.timely.userservice.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AffectationService affectationService;
    private final ChargeHoraireService chargeHoraireService;

    /**
     * Create a new teacher (Admin-only)
     */
    @PostMapping("/teachers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeacherDto> createTeacher(@Valid @RequestBody CreateTeacherRequest request) {
        TeacherDto teacher = userService.createTeacher(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(teacher);
    }

    /**
     * Create a new admin (Admin-only)
     */
    @PostMapping("/admins")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDto> createAdmin(@Valid @RequestBody CreateAdminRequest request) {
        AdminDto admin = userService.createAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(admin);
    }

    /**
     * Get user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable UUID id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Get all users
     */
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Get all teachers
     */
    @GetMapping("/teachers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TeacherDto>> getAllTeachers() {
        List<TeacherDto> teachers = userService.getAllTeachers();
        return ResponseEntity.ok(teachers);
    }

    /**
     * Update user
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable UUID id, @Valid @RequestBody UpdateUserRequest request) {
        UserDto updated = userService.updateUser(id, request);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Block user (Admin-only) - prevents login
     */
    @PutMapping("/{id}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> blockUser(@PathVariable UUID id) {
        UserDto user = userService.blockUser(id);
        return ResponseEntity.ok(user);
    }
    
    /**
     * Unblock user (Admin-only) - restores login access
     */
    @PutMapping("/{id}/unblock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> unblockUser(@PathVariable UUID id) {
        UserDto user = userService.unblockUser(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Bulk block users (Admin-only) - blocks multiple users at once
     */
    @PutMapping("/bulk-block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BulkUserActionResponse> bulkBlockUsers(@Valid @RequestBody BulkUserActionRequest request) {
        BulkUserActionResponse response = userService.bulkBlockUsers(request.getUserIds());
        return ResponseEntity.ok(response);
    }

    /**
     * Bulk unblock users (Admin-only) - unblocks multiple users at once
     */
    @PutMapping("/bulk-unblock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BulkUserActionResponse> bulkUnblockUsers(@Valid @RequestBody BulkUserActionRequest request) {
        BulkUserActionResponse response = userService.bulkUnblockUsers(request.getUserIds());
        return ResponseEntity.ok(response);
    }

    /**
     * Delete user (Admin-only) - performs soft delete by blocking
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ============= Teacher-School Assignment Endpoints =============

    /**
     * Assign a teacher to a school
     */
    @PostMapping("/{enseignantId}/ecoles/{ecoleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IntervenirEcoleDto> assignTeacherToEcole(
            @PathVariable UUID enseignantId,
            @PathVariable UUID ecoleId,
            @Valid @RequestBody AssignTeacherRequest request) {
        IntervenirEcoleDto assignment = affectationService.assignTeacherToEcole(enseignantId, ecoleId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(assignment);
    }

    /**
     * Remove a teacher from a school
     */
    @DeleteMapping("/{enseignantId}/ecoles/{ecoleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removeTeacherFromEcole(
            @PathVariable UUID enseignantId,
            @PathVariable UUID ecoleId) {
        affectationService.removeTeacherFromEcole(enseignantId, ecoleId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all schools assigned to a teacher
     */
    @GetMapping("/{enseignantId}/ecoles")
    public ResponseEntity<List<IntervenirEcoleDto>> getTeacherEcoles(@PathVariable UUID enseignantId) {
        List<IntervenirEcoleDto> ecoles = affectationService.getTeacherEcoles(enseignantId);
        return ResponseEntity.ok(ecoles);
    }

    // ============= Teacher-Course Assignment Endpoints =============

    /**
     * Assign a teacher to a course
     */
    @PostMapping("/{enseignantId}/cours/{coursId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnseignerDto> assignTeacherToCours(
            @PathVariable UUID enseignantId,
            @PathVariable UUID coursId,
            @Valid @RequestBody AssignTeacherRequest request) {
        EnseignerDto assignment = affectationService.assignTeacherToCours(enseignantId, coursId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(assignment);
    }

    /**
     * Remove a teacher from a course
     */
    @DeleteMapping("/{enseignantId}/cours/{coursId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removeTeacherFromCours(
            @PathVariable UUID enseignantId,
            @PathVariable UUID coursId) {
        affectationService.removeTeacherFromCours(enseignantId, coursId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all courses assigned to a teacher
     */
    @GetMapping("/{enseignantId}/cours")
    public ResponseEntity<List<EnseignerDto>> getTeacherCours(@PathVariable UUID enseignantId) {
        List<EnseignerDto> cours = affectationService.getTeacherCours(enseignantId);
        return ResponseEntity.ok(cours);
    }

    // ============= Teacher Workload Calculation =============

    /**
     * Calculate total workload (charge horaire) for a teacher.
     * Aggregates hours from all assigned courses with breakdown by type and school.
     */
    @GetMapping("/{enseignantId}/charge-horaire")
    public ResponseEntity<ChargeHoraireResponse> getChargeHoraire(@PathVariable UUID enseignantId) {
        ChargeHoraireResponse chargeHoraire = chargeHoraireService.calculateChargeHoraire(enseignantId);
        return ResponseEntity.ok(chargeHoraire);
    }
}
