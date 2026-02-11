package com.timely.agoraservice.controller;

import com.timely.agoraservice.dto.request.ExportRequest;
import com.timely.agoraservice.dto.request.ImportEtudiantsRequest;
import com.timely.agoraservice.dto.request.MappingRequest;
import com.timely.agoraservice.dto.response.ExportAgoraResponse;
import com.timely.agoraservice.dto.response.ImportEtudiantsResponse;
import com.timely.agoraservice.dto.response.LogResponse;
import com.timely.agoraservice.dto.response.MappingResponse;
import com.timely.agoraservice.entity.enums.StatutExportAgora;
import com.timely.agoraservice.entity.enums.TypeLog;
import com.timely.agoraservice.service.AgoraExportService;
import com.timely.agoraservice.service.AgoraImportService;
import com.timely.agoraservice.service.ExportAgoraService;
import com.timely.agoraservice.service.LogIntegrationService;
import com.timely.agoraservice.service.MappingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/agora")
@RequiredArgsConstructor
@Slf4j
public class AgoraController {

    private final ExportAgoraService exportAgoraService;
    private final LogIntegrationService logIntegrationService;
    private final MappingService mappingService;
    private final AgoraExportService agoraExportService;
    private final AgoraImportService agoraImportService;

    @PostMapping("/export/emploi-du-temps")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExportAgoraResponse> createExport(@Valid @RequestBody ExportRequest request) {
        log.info("Requete de creation d'export recue pour l'emploi du temps: {}", request.getEmploiDuTempsId());
        ExportAgoraResponse response = exportAgoraService.createExport(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/exports/historique")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ExportAgoraResponse>> getAllExports() {
        log.info("Requete de recuperation de tous les exports");
        List<ExportAgoraResponse> exports = exportAgoraService.getAllExports();
        return ResponseEntity.ok(exports);
    }

    @GetMapping("/exports/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExportAgoraResponse> getExportById(@PathVariable UUID id) {
        log.info("Requete de recuperation de l'export: {}", id);
        ExportAgoraResponse export = exportAgoraService.getExportById(id);
        return ResponseEntity.ok(export);
    }

    @GetMapping("/exports/statut/{statut}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ExportAgoraResponse>> getExportsByStatut(@PathVariable StatutExportAgora statut) {
        log.info("Requete de recuperation des exports avec le statut: {}", statut);
        List<ExportAgoraResponse> exports = exportAgoraService.getExportsByStatut(statut);
        return ResponseEntity.ok(exports);
    }

    @GetMapping("/logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LogResponse>> getAllLogs() {
        log.info("Requete de recuperation de tous les logs");
        List<LogResponse> logs = logIntegrationService.getAllLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/logs/export/{exportId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LogResponse>> getLogsByExportId(@PathVariable UUID exportId) {
        log.info("Requete de recuperation des logs pour l'export: {}", exportId);
        List<LogResponse> logs = logIntegrationService.getLogsByExportId(exportId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/logs/type/{type}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LogResponse>> getLogsByType(@PathVariable TypeLog type) {
        log.info("Requete de recuperation des logs de type: {}", type);
        List<LogResponse> logs = logIntegrationService.getLogsByType(type);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/mappings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MappingResponse> createMapping(@Valid @RequestBody MappingRequest request) {
        log.info("Requete de creation de mapping recue pour l'entite locale {}:{}",
                request.getEntiteLocaleType(), request.getEntiteLocaleId());
        MappingResponse response = mappingService.createMapping(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/mappings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MappingResponse>> getAllMappings() {
        log.info("Requete de recuperation de tous les mappings");
        List<MappingResponse> mappings = mappingService.getAllMappings();
        return ResponseEntity.ok(mappings);
    }

    @GetMapping("/mappings/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MappingResponse> getMappingById(@PathVariable UUID id) {
        log.info("Requete de recuperation du mapping: {}", id);
        MappingResponse mapping = mappingService.getMappingById(id);
        return ResponseEntity.ok(mapping);
    }

    @GetMapping("/mappings/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MappingResponse> getMappingByLocaleEntity(
            @RequestParam String type,
            @RequestParam UUID id) {
        log.info("Requete de recherche de mapping pour l'entite locale {}:{}", type, id);
        MappingResponse mapping = mappingService.getMappingByLocaleEntity(type, id);
        return ResponseEntity.ok(mapping);
    }

    @GetMapping("/mappings/type/{type}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MappingResponse>> getMappingsByType(@PathVariable String type) {
        log.info("Requete de recuperation des mappings pour le type: {}", type);
        List<MappingResponse> mappings = mappingService.getMappingsByType(type);
        return ResponseEntity.ok(mappings);
    }

    @GetMapping("/mappings/agora/{agoraId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MappingResponse> getMappingByAgoraId(@PathVariable String agoraId) {
        log.info("Requete de recuperation du mapping pour l'ID Agora: {}", agoraId);
        MappingResponse mapping = mappingService.getMappingByAgoraId(agoraId);
        return ResponseEntity.ok(mapping);
    }

    @PutMapping("/mappings/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MappingResponse> updateMapping(
            @PathVariable UUID id,
            @Valid @RequestBody MappingRequest request) {
        log.info("Requete de mise a jour du mapping: {}", id);
        MappingResponse response = mappingService.updateMapping(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/mappings/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMapping(@PathVariable UUID id) {
        log.info("Requete de suppression du mapping: {}", id);
        mappingService.deleteMapping(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/exports/{id}/retry")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> retryExport(@PathVariable UUID id) {
        log.info("Requete de retry pour l'export: {}", id);
        agoraExportService.exportToAgoraAsync(id);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/sync/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getSyncStatus() {
        log.info("Requete de recuperation du statut de synchronisation");

        long enAttente = exportAgoraService.getExportsByStatut(StatutExportAgora.EN_ATTENTE).size();
        long envoye = exportAgoraService.getExportsByStatut(StatutExportAgora.ENVOYE).size();
        long echec = exportAgoraService.getExportsByStatut(StatutExportAgora.ECHEC).size();
        long confirme = exportAgoraService.getExportsByStatut(StatutExportAgora.CONFIRME).size();

        Map<String, Long> status = Map.of(
                "EN_ATTENTE", enAttente,
                "ENVOYE", envoye,
                "ECHEC", echec,
                "CONFIRME", confirme
        );

        return ResponseEntity.ok(status);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        log.info("Health check endpoint appele");
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "agora-service",
                "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }

    // ==================== PHASE 4 - Import Étudiants ====================

    /**
     * Importe les étudiants depuis la plateforme Agora externe.
     */
    @PostMapping("/import/etudiants")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ImportEtudiantsResponse> importEtudiants(@Valid @RequestBody ImportEtudiantsRequest request) {
        log.info("Requête d'import d'étudiants depuis Agora: ecoleId={}, classeId={}",
                request.getEcoleId(), request.getClasseId());

        ImportEtudiantsResponse response = agoraImportService.importEtudiants(request);

        // Retourner 200 pour succès partiel ou complet, 500 pour échec total
        if ("FAILED".equals(response.getStatut())) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        return ResponseEntity.ok(response);
    }
}
