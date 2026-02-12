package com.timely.bookingservice.controller;

import java.util.List;
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
    public ResponseEntity<Page<ReservationResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(reservationService.getAll(PageRequest.of(page, size)));
    }

    @GetMapping("/reservations/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ReservationResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(reservationService.getById(id));
    }

    @GetMapping("/salles/{salleId}/reservations")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<Page<ReservationResponse>> getBySalleId(
            @PathVariable UUID salleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(reservationService.getBySalleId(salleId, PageRequest.of(page, size)));
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
