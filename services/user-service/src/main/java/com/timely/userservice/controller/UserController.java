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
import com.timely.userservice.dto.CreateAdminRequest;
import com.timely.userservice.dto.CreateTeacherRequest;
import com.timely.userservice.dto.TeacherDto;
import com.timely.userservice.dto.UpdateUserRequest;
import com.timely.userservice.dto.UserDto;
import com.timely.userservice.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

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
     * Delete user (Admin-only) - performs soft delete by blocking
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
