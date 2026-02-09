package com.timely.bookingservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.timely.bookingservice.dto.request.AutoAssignSalleRequest;
import com.timely.bookingservice.dto.request.ReservationRequest;
import com.timely.bookingservice.dto.response.ReservationResponse;
import com.timely.bookingservice.dto.response.SalleResponse;
import com.timely.bookingservice.service.ReservationService;
import com.timely.bookingservice.service.SalleAssignmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final SalleAssignmentService salleAssignmentService;

    @PostMapping("/reservations")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ReservationResponse> create(@Valid @RequestBody ReservationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationService.create(request));
    }

    @GetMapping("/reservations")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<ReservationResponse>> getAll() {
        return ResponseEntity.ok(reservationService.getAll());
    }

    @GetMapping("/reservations/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ReservationResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(reservationService.getById(id));
    }

    @GetMapping("/salles/{salleId}/reservations")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<ReservationResponse>> getBySalleId(@PathVariable UUID salleId) {
        return ResponseEntity.ok(reservationService.getBySalleId(salleId));
    }

    @PutMapping("/reservations/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ReservationResponse> update(@PathVariable UUID id, @Valid @RequestBody ReservationRequest request) {
        return ResponseEntity.ok(reservationService.update(id, request));
    }

    @DeleteMapping("/reservations/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        reservationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Find optimal room using automatic assignment algorithm.
     * Uses progressive filtering: availability -> type -> capacity -> equipment.
     */
    @PostMapping("/reservations/auto-assign")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<SalleResponse> autoAssignSalle(@Valid @RequestBody AutoAssignSalleRequest request) {
        SalleResponse optimalSalle = salleAssignmentService.findOptimalSalle(request);
        return ResponseEntity.ok(optimalSalle);
    }
}
