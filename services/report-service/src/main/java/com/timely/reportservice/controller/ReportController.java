package com.timely.reportservice.controller;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.timely.reportservice.dto.request.GenerateReportRequest;
import com.timely.reportservice.dto.response.DashboardResponse;
import com.timely.reportservice.dto.response.RapportResponse;
import com.timely.reportservice.dto.response.StatistiquesCoursResponse;
import com.timely.reportservice.dto.response.StatistiquesEnseignantsResponse;
import com.timely.reportservice.dto.response.StatistiquesSallesResponse;
import com.timely.reportservice.entity.enums.TypeRapport;
import com.timely.reportservice.service.FileGenerationService;
import com.timely.reportservice.service.KPIService;
import com.timely.reportservice.service.ReportService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Slf4j
public class ReportController {

    private final ReportService reportService;
    private final KPIService kpiService;
    private final FileGenerationService fileGenerationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<RapportResponse> generateReport(
            @Valid @RequestBody GenerateReportRequest request,
            Authentication authentication) {
        log.info("Génération d'un nouveau rapport: type={}", request.getTypeRapport());
        String utilisateur = authentication.getName();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reportService.generateReport(request, utilisateur));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<RapportResponse>> getAllReports() {
        log.debug("Récupération de tous les rapports");
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<RapportResponse> getReportById(@PathVariable UUID id) {
        log.debug("Récupération du rapport: id={}", id);
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    @GetMapping("/ecole/{ecoleId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<RapportResponse>> getReportsByEcoleId(@PathVariable UUID ecoleId) {
        log.debug("Récupération des rapports pour l'école: id={}", ecoleId);
        return ResponseEntity.ok(reportService.getReportsByEcoleId(ecoleId));
    }

    @GetMapping("/utilisateur/{utilisateur}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<RapportResponse>> getReportsByUtilisateur(@PathVariable String utilisateur) {
        log.debug("Récupération des rapports pour l'utilisateur: {}", utilisateur);
        return ResponseEntity.ok(reportService.getReportsByUtilisateur(utilisateur));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteReport(@PathVariable UUID id) {
        log.info("Suppression du rapport: id={}", id);
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }

    // Phase R4 - KPI + Dashboard endpoints

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<DashboardResponse> getDashboard(@RequestParam UUID ecoleId) {
        log.info("Récupération du dashboard pour l'école: {}", ecoleId);
        return ResponseEntity.ok(kpiService.getDashboard(ecoleId));
    }

    @GetMapping("/statistics/salles")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<StatistiquesSallesResponse> getStatistiquesSalles(@RequestParam UUID ecoleId) {
        log.info("Récupération des statistiques des salles pour l'école: {}", ecoleId);
        return ResponseEntity.ok(kpiService.getStatistiquesSalles(ecoleId));
    }

    @GetMapping("/statistics/enseignants")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<StatistiquesEnseignantsResponse> getStatistiquesEnseignants() {
        log.info("Récupération des statistiques des enseignants");
        return ResponseEntity.ok(kpiService.getStatistiquesEnseignants());
    }

    @GetMapping("/statistics/cours")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<StatistiquesCoursResponse> getStatistiquesCours() {
        log.info("Récupération des statistiques des cours");
        return ResponseEntity.ok(kpiService.getStatistiquesCours());
    }

    @GetMapping("/types")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<TypeRapport[]> getTypesRapports() {
        log.debug("Récupération des types de rapports disponibles");
        return ResponseEntity.ok(TypeRapport.values());
    }

    @PostMapping("/kpis/calculate")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> calculateKPIs(
            @RequestParam LocalDate dateDebut,
            @RequestParam LocalDate dateFin) {
        log.info("Calcul des KPIs pour la période du {} au {}", dateDebut, dateFin);
        kpiService.calculateKPIs(dateDebut, dateFin);
        return ResponseEntity.ok().build();
    }

    // Phase R5 - Génération de fichiers

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<Resource> downloadReport(@PathVariable UUID id) {
        log.info("Téléchargement du rapport: id={}", id);

        try {
            String filePath = fileGenerationService.generateFile(id);
            Path path = Paths.get(filePath);
            Resource resource = new UrlResource(path.toUri());

            if (resource.exists() && resource.isReadable()) {
                String filename = path.getFileName().toString();
                MediaType mediaType = determineMediaType(filename);

                return ResponseEntity.ok()
                        .contentType(mediaType)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                log.error("Fichier introuvable ou illisible: {}", filePath);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Erreur lors du téléchargement du rapport {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    private MediaType determineMediaType(String filename) {
        if (filename.endsWith(".pdf")) {
            return MediaType.APPLICATION_PDF;
        } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
            return MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        } else if (filename.endsWith(".csv")) {
            return MediaType.parseMediaType("text/csv");
        }
        return MediaType.APPLICATION_OCTET_STREAM;
    }
}
