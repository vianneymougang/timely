package com.timely.planningservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timely.planningservice.dto.response.ConflitResponseDTO;
import com.timely.planningservice.service.ConflitService;

import lombok.RequiredArgsConstructor;

/**
 * Internal REST controller for inter-service communication.
 * No security constraints - only accessible within the Docker network,
 * NOT exposed via API Gateway.
 */
@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
public class InternalController {

    private final ConflitService conflitService;

    /**
     * Get all conflits (for report-service KPI dashboard).
     * Returns unresolved conflits across all emplois du temps.
     */
    @GetMapping("/conflits")
    public ResponseEntity<List<ConflitResponseDTO>> getAllConflits() {
        List<ConflitResponseDTO> conflits = conflitService.getAllConflits();
        return ResponseEntity.ok(conflits);
    }
}