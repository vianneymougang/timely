package com.timely.reportservice.dto.response;

import com.timely.reportservice.entity.enums.AuditAction;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * DTO de réponse pour un log d'audit.
 */
@Getter
@Setter
public class AuditLogResponse {

    private UUID id;
    private AuditAction actionType;
    private String entityType;
    private UUID entityId;
    private String entityClassName;
    private String utilisateur;
    private String ipAddress;
    private LocalDateTime timestamp;
    private Map<String, Object> valeurAvant;
    private Map<String, Object> valeurApres;
    private Map<String, Map<String, Object>> changements;
    private Map<String, Object> metadata;
    private String sourceService;
    private String sourceMethod;

    /**
     * Retourne le nombre de champs modifiés (pour UPDATE).
     */
    public int getNombreChangements() {
        return changements != null ? changements.size() : 0;
    }
}
