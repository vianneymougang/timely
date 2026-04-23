package com.timely.bookingservice.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
import org.springframework.web.bind.annotation.RequestParam;
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EtudiantResponse> create(@Valid @RequestBody EtudiantRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(etudiantService.create(request));
    }

    @GetMapping("/etudiants")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<EtudiantResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(etudiantService.getAll(PageRequest.of(page, size)));
    }

    @GetMapping("/etudiants/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EtudiantResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(etudiantService.getById(id));
    }

    @GetMapping("/classes/{classeId}/etudiants")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Page<EtudiantResponse>> getByClasseId(
            @PathVariable UUID classeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(etudiantService.getByClasseId(classeId, PageRequest.of(page, size)));
    }

    @PutMapping("/etudiants/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EtudiantResponse> update(@PathVariable UUID id, @Valid @RequestBody EtudiantRequest request) {
        return ResponseEntity.ok(etudiantService.update(id, request));
    }

    @DeleteMapping("/etudiants/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        etudiantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
