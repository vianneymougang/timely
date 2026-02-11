package com.timely.reportservice.entity;

import com.timely.reportservice.entity.enums.AuditAction;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Entité représentant un log d'audit pour la traçabilité des actions critiques.
 * Capture les opérations CREATE, UPDATE, DELETE sur toutes les entités critiques.
 */
@Entity
@Table(name = "historique_modifications")
@Getter
@Setter
@NoArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    /**
     * Type d'action effectuée (CREATE, UPDATE, DELETE).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private AuditAction actionType;

    /**
     * Type d'entité modifiée (ex: "EmploiDuTemps", "Cours", "Salle").
     */
    @Column(name = "entity_type", nullable = false)
    private String entityType;

    /**
     * ID de l'entité modifiée.
     */
    @Column(name = "entity_id", nullable = false)
    private UUID entityId;

    /**
     * Nom complet de la classe de l'entité (pour désérialisation).
     */
    @Column(name = "entity_class_name")
    private String entityClassName;

    /**
     * Email de l'utilisateur qui a effectué l'action.
     */
    @Column(name = "utilisateur", nullable = false)
    private String utilisateur;

    /**
     * Adresse IP de l'utilisateur.
     */
    @Column(name = "ip_address")
    private String ipAddress;

    /**
     * Date et heure de l'action.
     */
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    /**
     * Valeur de l'entité AVANT modification (JSON).
     * Null pour les actions CREATE.
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "valeur_avant", columnDefinition = "jsonb")
    private Map<String, Object> valeurAvant;

    /**
     * Valeur de l'entité APRÈS modification (JSON).
     * Null pour les actions DELETE.
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "valeur_apres", columnDefinition = "jsonb")
    private Map<String, Object> valeurApres;

    /**
     * Changements détectés (uniquement pour UPDATE).
     * Liste des champs modifiés avec leurs anciennes et nouvelles valeurs.
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "changements", columnDefinition = "jsonb")
    private Map<String, Map<String, Object>> changements;

    /**
     * Informations supplémentaires contextuelles (optionnel).
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "jsonb")
    private Map<String, Object> metadata;

    /**
     * Service d'origine de l'action (ex: "planning-service", "booking-service").
     */
    @Column(name = "source_service")
    private String sourceService;

    /**
     * Méthode/endpoint qui a déclenché l'action (optionnel).
     */
    @Column(name = "source_method")
    private String sourceMethod;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
