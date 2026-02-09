package com.timely.reportservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.timely.reportservice.dto.response.ExportResponse;
import com.timely.reportservice.entity.enums.FormatExport;
import com.timely.reportservice.entity.enums.StatutExport;
import com.timely.reportservice.service.ExportService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/reports/exports")
@RequiredArgsConstructor
@Slf4j
public class ExportController {

    private final ExportService exportService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ExportResponse> createExport(
            @RequestParam UUID rapportId,
            @RequestParam FormatExport format,
            Authentication authentication) {
        log.info("Création d'un export: rapportId={}, format={}", rapportId, format);
        String utilisateur = authentication.getName();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(exportService.createExport(rapportId, format, utilisateur));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ExportResponse> getExportById(@PathVariable UUID id) {
        log.debug("Récupération de l'export: id={}", id);
        return ResponseEntity.ok(exportService.getExportById(id));
    }

    @GetMapping("/rapport/{rapportId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<ExportResponse>> getExportsByRapport(@PathVariable UUID rapportId) {
        log.debug("Récupération des exports pour le rapport: id={}", rapportId);
        return ResponseEntity.ok(exportService.getExportsByRapport(rapportId));
    }

    @GetMapping("/utilisateur/{utilisateur}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<ExportResponse>> getExportsByUtilisateur(@PathVariable String utilisateur) {
        log.debug("Récupération des exports pour l'utilisateur: {}", utilisateur);
        return ResponseEntity.ok(exportService.getExportsByUtilisateur(utilisateur));
    }

    @GetMapping("/statut/{statut}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ExportResponse>> getExportsByStatut(@PathVariable StatutExport statut) {
        log.debug("Récupération des exports par statut: {}", statut);
        return ResponseEntity.ok(exportService.getExportsByStatut(statut));
    }

    @PatchMapping("/{id}/statut")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> updateExportStatus(
            @PathVariable UUID id,
            @RequestParam StatutExport statut,
            @RequestParam(required = false) String messageErreur) {
        log.info("Mise à jour du statut de l'export: id={}, statut={}", id, statut);
        exportService.updateExportStatus(id, statut, messageErreur);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteExport(@PathVariable UUID id) {
        log.info("Suppression de l'export: id={}", id);
        exportService.deleteExport(id);
        return ResponseEntity.noContent().build();
    }
}
