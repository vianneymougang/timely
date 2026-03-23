package com.timely.bookingservice.controller;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timely.bookingservice.dto.request.AutoAssignSalleRequest;
import com.timely.bookingservice.dto.request.ReservationRequest;
import com.timely.bookingservice.dto.response.CoursResponse;
import com.timely.bookingservice.dto.response.GroupeEtudiantResponse;
import com.timely.bookingservice.dto.response.ReservationResponse;
import com.timely.bookingservice.dto.response.SalleResponse;
import com.timely.bookingservice.service.CoursService;
import com.timely.bookingservice.service.GroupeEtudiantService;
import com.timely.bookingservice.service.ReservationService;
import com.timely.bookingservice.service.SalleAssignmentService;
import com.timely.bookingservice.service.SalleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Internal REST controller for inter-service communication.
 * No security constraints - should only be called by other microservices.
 * NOT exposed via API Gateway.
 */
@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
public class InternalController {

    private final CoursService coursService;
    private final SalleService salleService;
    private final ReservationService reservationService;
    private final GroupeEtudiantService groupeEtudiantService;
    private final SalleAssignmentService salleAssignmentService;

    // ==================== COURS ENDPOINTS ====================

    @GetMapping("/cours/{id}")
    public ResponseEntity<CoursResponse> getCours(@PathVariable UUID id) {
        return ResponseEntity.ok(coursService.getById(id));
    }

    @GetMapping("/cours/ecole/{ecoleId}")
    public ResponseEntity<List<CoursResponse>> getCoursByEcole(@PathVariable UUID ecoleId) {
        // Filter by ecoleId from CoursResponse
        List<CoursResponse> allCours = coursService.getAll(Pageable.unpaged()).getContent();
        List<CoursResponse> filtered = allCours.stream()
                .filter(c -> ecoleId.equals(c.getEcoleId()))
                .toList();
        return ResponseEntity.ok(filtered);
    }

    @GetMapping("/cours/classe/{classeId}")
    public ResponseEntity<List<CoursResponse>> getCoursByClasse(@PathVariable UUID classeId) {
        return ResponseEntity.ok(coursService.getByClasseId(classeId, Pageable.unpaged()).getContent());
    }

    @GetMapping("/cours/enseignant/{enseignantId}")
    public ResponseEntity<List<CoursResponse>> getCoursByEnseignant(@PathVariable UUID enseignantId) {
        return ResponseEntity.ok(coursService.getByEnseignantId(enseignantId, Pageable.unpaged()).getContent());
    }

    // ==================== SALLE ENDPOINTS ====================

    @GetMapping("/salles/{id}")
    public ResponseEntity<SalleResponse> getSalle(@PathVariable UUID id) {
        return ResponseEntity.ok(salleService.getById(id));
    }

    @GetMapping("/salles/ecole/{ecoleId}")
    public ResponseEntity<List<SalleResponse>> getSallesByEcole(@PathVariable UUID ecoleId) {
        return ResponseEntity.ok(salleService.getByEcoleId(ecoleId, Pageable.unpaged()).getContent());
    }

    @GetMapping("/salles/disponibles")
    public ResponseEntity<List<SalleResponse>> getSallesDisponibles(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime heureDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime heureFin,
            @RequestParam DayOfWeek jourSemaine,
            @RequestParam(required = false) UUID ecoleId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        // Get all salles (or by ecole if specified)
        List<SalleResponse> salles = ecoleId != null
            ? salleService.getByEcoleId(ecoleId, Pageable.unpaged()).getContent()
            : salleService.getAll(Pageable.unpaged()).getContent();

        // Filter by availability (simple implementation - can be optimized)
        return ResponseEntity.ok(salles);
    }

    // ==================== RESERVATION ENDPOINTS ====================

    @GetMapping("/reservations/{id}")
    public ResponseEntity<ReservationResponse> getReservation(@PathVariable UUID id) {
        return ResponseEntity.ok(reservationService.getById(id));
    }

    @GetMapping("/reservations/search")
    public ResponseEntity<List<ReservationResponse>> searchReservations(
            @RequestParam(required = false) UUID salleId,
            @RequestParam(required = false) UUID coursId,
            @RequestParam(required = false) UUID enseignantId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {

        List<ReservationResponse> all = reservationService.getAll(Pageable.unpaged()).getContent();

        // Apply filters
        return ResponseEntity.ok(all.stream()
                .filter(r -> salleId == null || salleId.equals(r.getSalleId()))
                .filter(r -> coursId == null || coursId.equals(r.getCoursId()))
                .filter(r -> enseignantId == null || enseignantId.equals(r.getEnseignantId()))
                .filter(r -> dateDebut == null || !r.getDateReservation().isBefore(dateDebut))
                .filter(r -> dateFin == null || !r.getDateReservation().isAfter(dateFin))
                .toList());
    }

    @PostMapping("/reservations")
    public ResponseEntity<ReservationResponse> createReservation(@Valid @RequestBody ReservationRequest request) {
        return ResponseEntity.ok(reservationService.create(request));
    }

    @PostMapping("/reservations/auto-assign")
    public ResponseEntity<SalleResponse> autoAssignSalle(@Valid @RequestBody AutoAssignSalleRequest request) {
        return ResponseEntity.ok(salleAssignmentService.findOptimalSalle(request));
    }

    // ==================== GROUPE ENDPOINTS ====================

    @GetMapping("/groupes/cours/{coursId}")
    public ResponseEntity<List<GroupeEtudiantResponse>> getGroupesByCours(@PathVariable UUID coursId) {
        return ResponseEntity.ok(groupeEtudiantService.getByCoursId(coursId));
    }
}
