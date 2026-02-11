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

import com.timely.bookingservice.dto.request.EcoleRequest;
import com.timely.bookingservice.dto.response.EcoleResponse;
import com.timely.bookingservice.service.EcoleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings/ecoles")
@RequiredArgsConstructor
public class EcoleController {

    private final EcoleService ecoleService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<EcoleResponse> create(@Valid @RequestBody EcoleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ecoleService.create(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<EcoleResponse>> getAll() {
        return ResponseEntity.ok(ecoleService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<EcoleResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ecoleService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<EcoleResponse> update(@PathVariable UUID id, @Valid @RequestBody EcoleRequest request) {
        return ResponseEntity.ok(ecoleService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        ecoleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
