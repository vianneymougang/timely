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

import com.timely.bookingservice.dto.request.UERequest;
import com.timely.bookingservice.dto.response.UEResponse;
import com.timely.bookingservice.service.UEService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class UEController {

    private final UEService ueService;

    @PostMapping("/ues")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UEResponse> create(@Valid @RequestBody UERequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ueService.create(request));
    }

    @GetMapping("/ues")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<UEResponse>> getAll() {
        return ResponseEntity.ok(ueService.getAll());
    }

    @GetMapping("/ues/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<UEResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ueService.getById(id));
    }

    @GetMapping("/filieres/{filiereId}/ues")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<UEResponse>> getByFiliereId(@PathVariable UUID filiereId) {
        return ResponseEntity.ok(ueService.getByFiliereId(filiereId));
    }

    @PutMapping("/ues/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UEResponse> update(@PathVariable UUID id, @Valid @RequestBody UERequest request) {
        return ResponseEntity.ok(ueService.update(id, request));
    }

    @DeleteMapping("/ues/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        ueService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
