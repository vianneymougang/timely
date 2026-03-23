package com.timely.planningservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timely.planningservice.dto.response.ConflitResponseDTO;
import com.timely.planningservice.entity.enums.StatutResolution;
import com.timely.planningservice.service.ConflitService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/planning/plannings/{emploiId}/conflits")
@RequiredArgsConstructor
public class ConflitController {

    private final ConflitService conflitService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ConflitResponseDTO>> getConflitsByEmploi(@PathVariable UUID emploiId) {
        List<ConflitResponseDTO> response = conflitService.getConflitsByEmploi(emploiId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{conflitId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ConflitResponseDTO> getConflitById(@PathVariable UUID conflitId) {
        ConflitResponseDTO response = conflitService.getConflitById(conflitId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ConflitResponseDTO>> getConflitsByStatut(
            @RequestParam StatutResolution statut
    ) {
        List<ConflitResponseDTO> response = conflitService.getConflitsByStatut(statut);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count-non-resolus")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> countNonResolus(@PathVariable UUID emploiId) {
        long count = conflitService.countNonResolus(emploiId);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{conflitId}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ConflitResponseDTO> resolveConflit(
            @PathVariable UUID conflitId,
            @RequestBody String resolution
    ) {
        ConflitResponseDTO response = conflitService.resolveConflit(conflitId, resolution);
        return ResponseEntity.ok(response);
    }
}
