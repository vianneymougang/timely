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

import com.timely.bookingservice.dto.request.FiliereRequest;
import com.timely.bookingservice.dto.response.FiliereResponse;
import com.timely.bookingservice.service.FiliereService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class FiliereController {

    private final FiliereService filiereService;

    @PostMapping("/filieres")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FiliereResponse> create(@Valid @RequestBody FiliereRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(filiereService.create(request));
    }

    @GetMapping("/filieres")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<FiliereResponse>> getAll() {
        return ResponseEntity.ok(filiereService.getAll());
    }

    @GetMapping("/filieres/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<FiliereResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(filiereService.getById(id));
    }

    @GetMapping("/ecoles/{ecoleId}/filieres")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<FiliereResponse>> getByEcoleId(@PathVariable UUID ecoleId) {
        return ResponseEntity.ok(filiereService.getByEcoleId(ecoleId));
    }

    @PutMapping("/filieres/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FiliereResponse> update(@PathVariable UUID id, @Valid @RequestBody FiliereRequest request) {
        return ResponseEntity.ok(filiereService.update(id, request));
    }

    @DeleteMapping("/filieres/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        filiereService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
