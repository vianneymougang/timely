package com.timely.userservice.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity representing teacher-school assignments.
 * Tracks which teachers work at which schools (ecoles).
 */
@Entity
@Table(
    name = "intervenir_ecole",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_enseignant_ecole",
        columnNames = {"enseignant_id", "ecole_id"}
    )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IntervenirEcole {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Column(name = "enseignant_id", nullable = false)
    private UUID enseignantId;

    @NotNull
    @Column(name = "ecole_id", nullable = false)
    private UUID ecoleId;

    @NotNull
    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * ManyToOne relationship with Teacher (optional, for JPA navigation)
     * Using insertable=false, updatable=false to avoid conflicts with enseignantId
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enseignant_id", insertable = false, updatable = false)
    private Teacher enseignant;
}
