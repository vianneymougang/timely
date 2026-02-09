package com.timely.userservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity representing teacher-course assignments.
 * Tracks which teachers teach which courses.
 * Note: coursId is an external reference to booking-service (no FK constraint).
 */
@Entity
@Table(
    name = "enseigner",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_enseignant_cours",
        columnNames = {"enseignant_id", "cours_id"}
    )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enseigner {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Column(name = "enseignant_id", nullable = false)
    private UUID enseignantId;

    @NotNull
    @Column(name = "cours_id", nullable = false)
    private UUID coursId;

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
