package com.timely.reportservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.timely.reportservice.entity.AuditLog;
import com.timely.reportservice.entity.enums.AuditAction;
import com.timely.reportservice.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service gérant l'audit trail et la traçabilité des actions.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    /**
     * Crée un log d'audit pour une action CREATE.
     */
    @Transactional
    public void logCreate(Object entity, String entityType, UUID entityId,
                          String utilisateur, String sourceService) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setActionType(AuditAction.CREATE);
            auditLog.setEntityType(entityType);
            auditLog.setEntityId(entityId);
            auditLog.setEntityClassName(entity.getClass().getName());
            auditLog.setUtilisateur(utilisateur);
            auditLog.setSourceService(sourceService);
            auditLog.setTimestamp(LocalDateTime.now());

            // Sérialiser la nouvelle valeur en JSON
            Map<String, Object> valeurApres = objectMapper.convertValue(entity, Map.class);
            auditLog.setValeurApres(valeurApres);

            auditLogRepository.save(auditLog);
            log.debug("Audit log created for CREATE action on {} {}", entityType, entityId);
        } catch (Exception e) {
            log.error("Failed to create audit log for CREATE action on {} {}: {}",
                    entityType, entityId, e.getMessage(), e);
        }
    }

    /**
     * Crée un log d'audit pour une action UPDATE.
     */
    @Transactional
    public void logUpdate(Object oldEntity, Object newEntity, String entityType, UUID entityId,
                          String utilisateur, String sourceService) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setActionType(AuditAction.UPDATE);
            auditLog.setEntityType(entityType);
            auditLog.setEntityId(entityId);
            auditLog.setEntityClassName(newEntity.getClass().getName());
            auditLog.setUtilisateur(utilisateur);
            auditLog.setSourceService(sourceService);
            auditLog.setTimestamp(LocalDateTime.now());

            // Sérialiser les anciennes et nouvelles valeurs
            Map<String, Object> valeurAvant = objectMapper.convertValue(oldEntity, Map.class);
            Map<String, Object> valeurApres = objectMapper.convertValue(newEntity, Map.class);

            auditLog.setValeurAvant(valeurAvant);
            auditLog.setValeurApres(valeurApres);

            // Calculer les changements (champs modifiés)
            Map<String, Map<String, Object>> changements = calculateChanges(valeurAvant, valeurApres);
            auditLog.setChangements(changements);

            auditLogRepository.save(auditLog);
            log.debug("Audit log created for UPDATE action on {} {} with {} changes",
                    entityType, entityId, changements.size());
        } catch (Exception e) {
            log.error("Failed to create audit log for UPDATE action on {} {}: {}",
                    entityType, entityId, e.getMessage(), e);
        }
    }

    /**
     * Crée un log d'audit pour une action DELETE.
     */
    @Transactional
    public void logDelete(Object entity, String entityType, UUID entityId,
                          String utilisateur, String sourceService) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setActionType(AuditAction.DELETE);
            auditLog.setEntityType(entityType);
            auditLog.setEntityId(entityId);
            auditLog.setEntityClassName(entity.getClass().getName());
            auditLog.setUtilisateur(utilisateur);
            auditLog.setSourceService(sourceService);
            auditLog.setTimestamp(LocalDateTime.now());

            // Sérialiser la valeur avant suppression
            Map<String, Object> valeurAvant = objectMapper.convertValue(entity, Map.class);
            auditLog.setValeurAvant(valeurAvant);

            auditLogRepository.save(auditLog);
            log.debug("Audit log created for DELETE action on {} {}", entityType, entityId);
        } catch (Exception e) {
            log.error("Failed to create audit log for DELETE action on {} {}: {}",
                    entityType, entityId, e.getMessage(), e);
        }
    }

    /**
     * Crée un log d'audit pour une action métier personnalisée.
     */
    @Transactional
    public void logCustomAction(AuditAction action, String entityType, UUID entityId,
                                String utilisateur, String sourceService,
                                Map<String, Object> metadata) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setActionType(action);
            auditLog.setEntityType(entityType);
            auditLog.setEntityId(entityId);
            auditLog.setUtilisateur(utilisateur);
            auditLog.setSourceService(sourceService);
            auditLog.setTimestamp(LocalDateTime.now());
            auditLog.setMetadata(metadata);

            auditLogRepository.save(auditLog);
            log.debug("Audit log created for {} action on {} {}", action, entityType, entityId);
        } catch (Exception e) {
            log.error("Failed to create audit log for {} action on {} {}: {}",
                    action, entityType, entityId, e.getMessage(), e);
        }
    }

    /**
     * Récupère l'historique d'une entité.
     */
    @Transactional(readOnly = true)
    public List<AuditLog> getEntityHistory(String entityType, UUID entityId) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(entityType, entityId);
    }

    /**
     * Récupère les logs d'audit par type d'action.
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getLogsByAction(AuditAction actionType, Pageable pageable) {
        return auditLogRepository.findByActionTypeOrderByTimestampDesc(actionType, pageable);
    }

    /**
     * Récupère les logs d'audit par utilisateur.
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getLogsByUser(String utilisateur, Pageable pageable) {
        return auditLogRepository.findByUtilisateurOrderByTimestampDesc(utilisateur, pageable);
    }

    /**
     * Récupère les logs d'audit par type d'entité.
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getLogsByEntityType(String entityType, Pageable pageable) {
        return auditLogRepository.findByEntityTypeOrderByTimestampDesc(entityType, pageable);
    }

    /**
     * Récupère les logs d'audit dans une période donnée.
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return auditLogRepository.findByTimestampBetween(startDate, endDate, pageable);
    }

    /**
     * Récupère les derniers logs d'audit (pour dashboard).
     */
    @Transactional(readOnly = true)
    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop10ByOrderByTimestampDesc();
    }

    /**
     * Calcule les changements entre deux versions d'une entité.
     */
    private Map<String, Map<String, Object>> calculateChanges(
            Map<String, Object> valeurAvant,
            Map<String, Object> valeurApres) {

        Map<String, Map<String, Object>> changements = new HashMap<>();

        // Parcourir tous les champs de la nouvelle valeur
        for (Map.Entry<String, Object> entry : valeurApres.entrySet()) {
            String field = entry.getKey();
            Object newValue = entry.getValue();
            Object oldValue = valeurAvant.get(field);

            // Vérifier si le champ a changé
            if (!isEqual(oldValue, newValue)) {
                Map<String, Object> change = new HashMap<>();
                change.put("avant", oldValue);
                change.put("apres", newValue);
                changements.put(field, change);
            }
        }

        return changements;
    }

    /**
     * Compare deux valeurs en gérant les cas null.
     */
    private boolean isEqual(Object obj1, Object obj2) {
        if (obj1 == null && obj2 == null) {
            return true;
        }
        if (obj1 == null || obj2 == null) {
            return false;
        }
        return obj1.equals(obj2);
    }
}
