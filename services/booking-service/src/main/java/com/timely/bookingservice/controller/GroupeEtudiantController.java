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

import com.timely.bookingservice.dto.request.GroupeEtudiantRequest;
import com.timely.bookingservice.dto.response.GroupeEtudiantResponse;
import com.timely.bookingservice.service.GroupeEtudiantService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class GroupeEtudiantController {

    private final GroupeEtudiantService groupeEtudiantService;

    @PostMapping("/groupes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GroupeEtudiantResponse> create(@Valid @RequestBody GroupeEtudiantRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(groupeEtudiantService.create(request));
    }

    @GetMapping("/groupes")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<GroupeEtudiantResponse>> getAll() {
        return ResponseEntity.ok(groupeEtudiantService.getAll());
    }

    @GetMapping("/groupes/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<GroupeEtudiantResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(groupeEtudiantService.getById(id));
    }

    @GetMapping("/cours/{coursId}/groupes")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<GroupeEtudiantResponse>> getByCoursId(@PathVariable UUID coursId) {
        return ResponseEntity.ok(groupeEtudiantService.getByCoursId(coursId));
    }

    @PutMapping("/groupes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GroupeEtudiantResponse> update(@PathVariable UUID id, @Valid @RequestBody GroupeEtudiantRequest request) {
        return ResponseEntity.ok(groupeEtudiantService.update(id, request));
    }

    @DeleteMapping("/groupes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        groupeEtudiantService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/groupes/{id}/etudiants/{etudiantId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GroupeEtudiantResponse> addEtudiant(@PathVariable UUID id, @PathVariable UUID etudiantId) {
        return ResponseEntity.ok(groupeEtudiantService.addEtudiant(id, etudiantId));
    }

    @DeleteMapping("/groupes/{id}/etudiants/{etudiantId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GroupeEtudiantResponse> removeEtudiant(@PathVariable UUID id, @PathVariable UUID etudiantId) {
        return ResponseEntity.ok(groupeEtudiantService.removeEtudiant(id, etudiantId));
    }
}
