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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timely.bookingservice.dto.request.SalleRequest;
import com.timely.bookingservice.dto.response.SalleResponse;
import com.timely.bookingservice.entity.enums.TypeSalle;
import com.timely.bookingservice.service.SalleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class SalleController {

    private final SalleService salleService;

    @PostMapping("/salles")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<SalleResponse> create(@Valid @RequestBody SalleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(salleService.create(request));
    }

    @GetMapping("/salles")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<SalleResponse>> getAll() {
        return ResponseEntity.ok(salleService.getAll());
    }

    @GetMapping("/salles/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<SalleResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(salleService.getById(id));
    }

    @GetMapping("/ecoles/{ecoleId}/salles")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<SalleResponse>> getByEcoleId(@PathVariable UUID ecoleId) {
        return ResponseEntity.ok(salleService.getByEcoleId(ecoleId));
    }

    @GetMapping("/salles/disponibles")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<SalleResponse>> getDisponibles(
            @RequestParam(defaultValue = "0") Integer capaciteMin,
            @RequestParam(required = false) TypeSalle typeSalle) {
        return ResponseEntity.ok(salleService.getDisponibles(capaciteMin, typeSalle));
    }

    @PutMapping("/salles/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<SalleResponse> update(@PathVariable UUID id, @Valid @RequestBody SalleRequest request) {
        return ResponseEntity.ok(salleService.update(id, request));
    }

    @DeleteMapping("/salles/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        salleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
