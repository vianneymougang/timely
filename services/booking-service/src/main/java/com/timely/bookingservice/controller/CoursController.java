package com.timely.bookingservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.timely.bookingservice.dto.request.CoursRequest;
import com.timely.bookingservice.dto.response.CoursResponse;
import com.timely.bookingservice.service.CoursService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class CoursController {

    private final CoursService coursService;

    @PostMapping("/cours")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CoursResponse> create(@Valid @RequestBody CoursRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(coursService.create(request));
    }

    @GetMapping("/cours")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<CoursResponse>> getAll() {
        return ResponseEntity.ok(coursService.getAll());
    }

    @GetMapping("/cours/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<CoursResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(coursService.getById(id));
    }

    @GetMapping("/ues/{ueId}/cours")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<CoursResponse>> getByUeId(@PathVariable UUID ueId) {
        return ResponseEntity.ok(coursService.getByUeId(ueId));
    }

    @GetMapping("/classes/{classeId}/cours")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<CoursResponse>> getByClasseId(@PathVariable UUID classeId) {
        return ResponseEntity.ok(coursService.getByClasseId(classeId));
    }

    @PutMapping("/cours/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CoursResponse> update(@PathVariable UUID id, @Valid @RequestBody CoursRequest request) {
        return ResponseEntity.ok(coursService.update(id, request));
    }

    @DeleteMapping("/cours/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        coursService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
