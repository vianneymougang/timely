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

import com.timely.bookingservice.dto.request.EvenementRequest;
import com.timely.bookingservice.dto.response.EvenementResponse;
import com.timely.bookingservice.service.EvenementService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class EvenementController {

    private final EvenementService evenementService;

    @PostMapping("/evenements")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<EvenementResponse> create(@Valid @RequestBody EvenementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(evenementService.create(request));
    }

    @GetMapping("/evenements")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<EvenementResponse>> getAll() {
        return ResponseEntity.ok(evenementService.getAll());
    }

    @GetMapping("/evenements/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<EvenementResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(evenementService.getById(id));
    }

    @GetMapping("/ecoles/{ecoleId}/evenements")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<EvenementResponse>> getByEcoleId(@PathVariable UUID ecoleId) {
        return ResponseEntity.ok(evenementService.getByEcoleId(ecoleId));
    }

    @PutMapping("/evenements/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<EvenementResponse> update(@PathVariable UUID id, @Valid @RequestBody EvenementRequest request) {
        return ResponseEntity.ok(evenementService.update(id, request));
    }

    @DeleteMapping("/evenements/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        evenementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
