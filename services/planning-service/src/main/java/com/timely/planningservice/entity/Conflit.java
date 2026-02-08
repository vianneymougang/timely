package com.timely.planningservice.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.timely.planningservice.entity.enums.Severite;
import com.timely.planningservice.entity.enums.StatutResolution;
import com.timely.planningservice.entity.enums.TypeConflit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "conflits")
@Getter
@Setter
@NoArgsConstructor
public class Conflit {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull(message = "L'emploi du temps est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emploi_id", nullable = false)
    private EmploiDuTemps emploiDuTemps;

    @NotNull(message = "Le type de conflit est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "type_conflit", nullable = false, length = 100)
    private TypeConflit typeConflit;

    @NotNull(message = "La description est obligatoire")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "La sévérité est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Severite severite;

    @Column(name = "suggestion_resolution", columnDefinition = "JSONB")
    private String suggestionResolution;

    @NotNull(message = "Le statut de résolution est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "statut_resolution", nullable = false, length = 50)
    private StatutResolution statutResolution;

    @Column(name = "date_detection", nullable = false, updatable = false)
    private LocalDateTime dateDetection;

    @Column(name = "date_resolution")
    private LocalDateTime dateResolution;

    @Column(name = "reservation1_id")
    private UUID reservation1Id;

    @Column(name = "reservation2_id")
    private UUID reservation2Id;

    public Conflit(EmploiDuTemps emploiDuTemps, TypeConflit typeConflit, String description, Severite severite) {
        this.emploiDuTemps = emploiDuTemps;
        this.typeConflit = typeConflit;
        this.description = description;
        this.severite = severite;
        this.statutResolution = StatutResolution.NON_RESOLU;
        this.dateDetection = LocalDateTime.now();
    }
}
