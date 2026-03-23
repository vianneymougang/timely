package com.timely.reportservice.controller;

import com.timely.reportservice.dto.response.AuditLogResponse;
import com.timely.reportservice.entity.AuditLog;
import com.timely.reportservice.entity.enums.AuditAction;
import com.timely.reportservice.mapper.AuditLogMapper;
import com.timely.reportservice.service.AuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Controller pour la consultation de l'audit trail.
 * Permet de tracer toutes les actions critiques effectuées dans le système.
 */
@RestController
@RequestMapping("/api/reports/audit")
@RequiredArgsConstructor
@Slf4j
public class AuditController {

    private final AuditService auditService;
    private final AuditLogMapper auditLogMapper;

    /**
     * Récupère l'historique complet d'une entité.
     */
    @GetMapping("/entity/{entityType}/{entityId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<AuditLogResponse>> getEntityHistory(
            @PathVariable String entityType,
            @PathVariable UUID entityId) {
        log.info("Récupération de l'historique pour {} {}", entityType, entityId);

        List<AuditLog> logs = auditService.getEntityHistory(entityType, entityId);
        List<AuditLogResponse> response = auditLogMapper.toResponseList(logs);

        return ResponseEntity.ok(response);
    }

    /**
     * Récupère les logs d'audit par type d'action.
     */
    @GetMapping("/action/{actionType}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<AuditLogResponse>> getLogsByAction(
            @PathVariable AuditAction actionType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Récupération des logs pour l'action: {}", actionType);

        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> logs = auditService.getLogsByAction(actionType, pageable);
        Page<AuditLogResponse> response = logs.map(auditLogMapper::toResponse);

        return ResponseEntity.ok(response);
    }

    /**
     * Récupère les logs d'audit par utilisateur.
     */
    @GetMapping("/user/{utilisateur}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<AuditLogResponse>> getLogsByUser(
            @PathVariable String utilisateur,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Récupération des logs pour l'utilisateur: {}", utilisateur);

        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> logs = auditService.getLogsByUser(utilisateur, pageable);
        Page<AuditLogResponse> response = logs.map(auditLogMapper::toResponse);

        return ResponseEntity.ok(response);
    }

    /**
     * Récupère les logs d'audit par type d'entité.
     */
    @GetMapping("/entity-type/{entityType}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<AuditLogResponse>> getLogsByEntityType(
            @PathVariable String entityType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Récupération des logs pour le type d'entité: {}", entityType);

        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> logs = auditService.getLogsByEntityType(entityType, pageable);
        Page<AuditLogResponse> response = logs.map(auditLogMapper::toResponse);

        return ResponseEntity.ok(response);
    }

    /**
     * Récupère les logs d'audit dans une période donnée.
     */
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<AuditLogResponse>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Récupération des logs entre {} et {}", startDate, endDate);

        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> logs = auditService.getLogsByDateRange(startDate, endDate, pageable);
        Page<AuditLogResponse> response = logs.map(auditLogMapper::toResponse);

        return ResponseEntity.ok(response);
    }

    /**
     * Récupère les derniers logs d'audit (pour dashboard).
     */
    @GetMapping("/recent")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<AuditLogResponse>> getRecentLogs() {
        log.debug("Récupération des derniers logs d'audit");

        List<AuditLog> logs = auditService.getRecentLogs();
        List<AuditLogResponse> response = auditLogMapper.toResponseList(logs);

        return ResponseEntity.ok(response);
    }
}
