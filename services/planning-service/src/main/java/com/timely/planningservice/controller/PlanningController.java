package com.timely.planningservice.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timely.planningservice.dto.request.CreneauRequestDTO;
import com.timely.planningservice.dto.request.EmploiDuTempsRequestDTO;
import com.timely.planningservice.dto.request.GeneratePlanningRequest;
import com.timely.planningservice.dto.request.SearchPlanningRequest;
import com.timely.planningservice.dto.response.CreneauResponseDTO;
import com.timely.planningservice.dto.response.EmploiDuTempsResponseDTO;
import com.timely.planningservice.dto.response.GeneratePlanningResponse;
import com.timely.planningservice.entity.enums.StatutEmploi;
import com.timely.planningservice.service.CreneauService;
import com.timely.planningservice.service.EmploiDuTempsService;
import com.timely.planningservice.service.ICalExportService;
import com.timely.planningservice.service.PdfExportService;
import com.timely.planningservice.service.PlanningGenerationService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/planning/plannings")
@RequiredArgsConstructor
public class PlanningController {

    private final EmploiDuTempsService emploiDuTempsService;
    private final CreneauService creneauService;
    private final ICalExportService iCalExportService;
    private final PdfExportService pdfExportService;
    private final PlanningGenerationService planningGenerationService;

    // ==================== EmploiDuTemps Endpoints ====================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmploiDuTempsResponseDTO> createEmploiDuTemps(
            @Valid @RequestBody EmploiDuTempsRequestDTO requestDTO
    ) {
        EmploiDuTempsResponseDTO response = emploiDuTempsService.createEmploiDuTemps(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<EmploiDuTempsResponseDTO> getEmploiDuTempsById(@PathVariable UUID id) {
        EmploiDuTempsResponseDTO response = emploiDuTempsService.getEmploiDuTempsById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Page<EmploiDuTempsResponseDTO>> getAllEmploisDuTemps(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<EmploiDuTempsResponseDTO> response = emploiDuTempsService.getAllEmploisDuTemps(
                org.springframework.data.domain.PageRequest.of(page, size));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Page<EmploiDuTempsResponseDTO>> searchAdvanced(
            @Valid @ModelAttribute SearchPlanningRequest request
    ) {
        Page<EmploiDuTempsResponseDTO> response = emploiDuTempsService.searchAdvanced(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmploiDuTempsResponseDTO> updateEmploiDuTemps(
            @PathVariable UUID id,
            @Valid @RequestBody EmploiDuTempsRequestDTO requestDTO
    ) {
        EmploiDuTempsResponseDTO response = emploiDuTempsService.updateEmploiDuTemps(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEmploiDuTemps(@PathVariable UUID id) {
        emploiDuTempsService.deleteEmploiDuTemps(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/validate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmploiDuTempsResponseDTO> validateEmploi(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        String validatorEmail = authentication.getName();
        EmploiDuTempsResponseDTO response = emploiDuTempsService.validateEmploi(id, validatorEmail);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmploiDuTempsResponseDTO> publishEmploi(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        String publisherEmail = authentication.getName();
        EmploiDuTempsResponseDTO response = emploiDuTempsService.publishEmploi(id, publisherEmail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/export/ical")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<byte[]> exportICal(@PathVariable UUID id) {
        byte[] icalData = iCalExportService.exportToICal(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("text", "calendar"));
        headers.setContentDispositionFormData("attachment", "planning-" + id + ".ics");

        return ResponseEntity.ok()
                .headers(headers)
                .body(icalData);
    }

    @GetMapping("/{id}/export/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<byte[]> exportPdf(@PathVariable UUID id) {
        byte[] pdfData = pdfExportService.exportToPdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "planning-" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfData);
    }

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeneratePlanningResponse> generatePlanning(
            @Valid @RequestBody GeneratePlanningRequest request) {
        GeneratePlanningResponse response = planningGenerationService.generate(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ==================== Creneau Endpoints ====================

    @PostMapping("/{emploiId}/creneaux")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CreneauResponseDTO> createCreneau(
            @PathVariable UUID emploiId,
            @Valid @RequestBody CreneauRequestDTO requestDTO
    ) {
        CreneauResponseDTO response = creneauService.createCreneau(emploiId, requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{emploiId}/creneaux")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Page<CreneauResponseDTO>> getCreneauxByEmploi(
            @PathVariable UUID emploiId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<CreneauResponseDTO> response = creneauService.getCreneauxByEmploi(emploiId,
                org.springframework.data.domain.PageRequest.of(page, size));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{emploiId}/creneaux/{creneauId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<CreneauResponseDTO> getCreneauById(@PathVariable UUID creneauId) {
        CreneauResponseDTO response = creneauService.getCreneauById(creneauId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{emploiId}/creneaux/{creneauId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CreneauResponseDTO> updateCreneau(
            @PathVariable UUID creneauId,
            @Valid @RequestBody CreneauRequestDTO requestDTO
    ) {
        CreneauResponseDTO response = creneauService.updateCreneau(creneauId, requestDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{emploiId}/creneaux/{creneauId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCreneau(@PathVariable UUID creneauId) {
        creneauService.deleteCreneau(creneauId);
        return ResponseEntity.noContent().build();
    }
}
