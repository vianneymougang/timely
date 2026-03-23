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

import com.timely.bookingservice.dto.request.CoursRequest;
import com.timely.bookingservice.dto.request.GenerateGroupesRequest;
import com.timely.bookingservice.dto.response.CoursResponse;
import com.timely.bookingservice.dto.response.GenerateGroupesResponse;
import com.timely.bookingservice.service.CoursService;
import com.timely.bookingservice.service.GroupeEtudiantService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class CoursController {

    private final CoursService coursService;
    private final GroupeEtudiantService groupeEtudiantService;

    @PostMapping("/cours")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CoursResponse> create(@Valid @RequestBody CoursRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(coursService.create(request));
    }

    @GetMapping("/cours")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<Page<CoursResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(coursService.getAll(PageRequest.of(page, size)));
    }

    @GetMapping("/cours/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<CoursResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(coursService.getById(id));
    }

    @GetMapping("/ues/{ueId}/cours")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<Page<CoursResponse>> getByUeId(
            @PathVariable UUID ueId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(coursService.getByUeId(ueId, PageRequest.of(page, size)));
    }

    @GetMapping("/classes/{classeId}/cours")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<Page<CoursResponse>> getByClasseId(
            @PathVariable UUID classeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(coursService.getByClasseId(classeId, PageRequest.of(page, size)));
    }

    @GetMapping("/cours/enseignant/{enseignantId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<Page<CoursResponse>> getByEnseignantId(
            @PathVariable UUID enseignantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(coursService.getByEnseignantId(enseignantId, PageRequest.of(page, size)));
    }

    @PutMapping("/cours/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CoursResponse> update(@PathVariable UUID id, @Valid @RequestBody CoursRequest request) {
        return ResponseEntity.ok(coursService.update(id, request));
    }

    @DeleteMapping("/cours/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        coursService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Generate student groups automatically for a course.
     * Distributes students evenly based on course type:
     * - CM: 1 group (entire class)
     * - TD: 2 groups
     * - TP: 3 groups (or custom via request)
     */
    @PostMapping("/cours/{id}/groupes/generate")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<GenerateGroupesResponse> generateGroupes(
            @PathVariable UUID id,
            @RequestBody(required = false) GenerateGroupesRequest request) {
        GenerateGroupesRequest finalRequest = request != null ? request : new GenerateGroupesRequest();
        GenerateGroupesResponse response = groupeEtudiantService.generateGroupes(id, finalRequest);
        return ResponseEntity.ok(response);
    }
}
