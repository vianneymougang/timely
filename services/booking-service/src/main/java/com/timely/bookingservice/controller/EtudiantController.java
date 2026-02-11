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

import com.timely.bookingservice.dto.request.EtudiantRequest;
import com.timely.bookingservice.dto.response.EtudiantResponse;
import com.timely.bookingservice.service.EtudiantService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class EtudiantController {

    private final EtudiantService etudiantService;

    @PostMapping("/etudiants")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<EtudiantResponse> create(@Valid @RequestBody EtudiantRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(etudiantService.create(request));
    }

    @GetMapping("/etudiants")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<EtudiantResponse>> getAll() {
        return ResponseEntity.ok(etudiantService.getAll());
    }

    @GetMapping("/etudiants/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<EtudiantResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(etudiantService.getById(id));
    }

    @GetMapping("/classes/{classeId}/etudiants")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<EtudiantResponse>> getByClasseId(@PathVariable UUID classeId) {
        return ResponseEntity.ok(etudiantService.getByClasseId(classeId));
    }

    @PutMapping("/etudiants/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<EtudiantResponse> update(@PathVariable UUID id, @Valid @RequestBody EtudiantRequest request) {
        return ResponseEntity.ok(etudiantService.update(id, request));
    }

    @DeleteMapping("/etudiants/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        etudiantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
