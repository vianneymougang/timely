package com.timely.reportservice.entity;

import com.timely.reportservice.entity.enums.FormatExport;
import com.timely.reportservice.entity.enums.TypeRapport;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Entité représentant un rapport planifié pour exécution automatique récurrente.
 * Utilise une expression cron pour définir la périodicité d'exécution.
 */
@Entity
@Table(name = "scheduled_reports")
@Getter
@Setter
@NoArgsConstructor
public class ScheduledReport {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_rapport", nullable = false)
    private TypeRapport typeRapport;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Expression cron définissant la périodicité d'exécution.
     * Exemples:
     * - "0 0 9 * * MON" : Tous les lundis à 9h
     * - "0 0 9 1 * ?" : Le 1er de chaque mois à 9h
     * - "0 0 9 * * ?" : Tous les jours à 9h
     */
    @Column(name = "cron_expression", nullable = false)
    private String cronExpression;

    @Column(name = "ecole_id")
    private UUID ecoleId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FormatExport format;

    /**
     * Adresses email des destinataires (séparées par des virgules).
     * Exemple: "admin@example.com,teacher@example.com"
     */
    @Column(name = "destinataires_email", length = 1000, nullable = false)
    private String destinatairesEmail;

    @Column(name = "actif", nullable = false)
    private Boolean actif = true;

    @Column(name = "utilisateur_createur", nullable = false)
    private String utilisateurCreateur;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "parametres_rapport", columnDefinition = "jsonb")
    private Map<String, Object> parametresRapport;

    @Column(name = "derniere_execution")
    private LocalDateTime derniereExecution;

    @Column(name = "prochaine_execution")
    private LocalDateTime prochaineExecution;

    @Column(name = "nombre_executions", nullable = false)
    private Integer nombreExecutions = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (actif == null) {
            actif = true;
        }
        if (nombreExecutions == null) {
            nombreExecutions = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Parse les destinataires email en liste.
     */
    public List<String> getDestinatairesAsList() {
        if (destinatairesEmail == null || destinatairesEmail.isBlank()) {
            return new ArrayList<>();
        }
        return List.of(destinatairesEmail.split(","))
                .stream()
                .map(String::trim)
                .filter(email -> !email.isBlank())
                .toList();
    }
}
