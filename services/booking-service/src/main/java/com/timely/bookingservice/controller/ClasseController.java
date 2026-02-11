package com.timely.bookingservice.controller;

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

import com.timely.bookingservice.dto.request.ClasseRequest;
import com.timely.bookingservice.dto.response.ClasseResponse;
import com.timely.bookingservice.service.ClasseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class ClasseController {

    private final ClasseService classeService;

    @PostMapping("/classes")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ClasseResponse> create(@Valid @RequestBody ClasseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(classeService.create(request));
    }

    @GetMapping("/classes")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<ClasseResponse>> getAll() {
        return ResponseEntity.ok(classeService.getAll());
    }

    @GetMapping("/classes/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ClasseResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(classeService.getById(id));
    }

    @GetMapping("/filieres/{filiereId}/classes")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<ClasseResponse>> getByFiliereId(@PathVariable UUID filiereId) {
        return ResponseEntity.ok(classeService.getByFiliereId(filiereId));
    }

    @PutMapping("/classes/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ClasseResponse> update(@PathVariable UUID id, @Valid @RequestBody ClasseRequest request) {
        return ResponseEntity.ok(classeService.update(id, request));
    }

    @DeleteMapping("/classes/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        classeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
