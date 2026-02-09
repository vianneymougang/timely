package com.timely.reportservice.entity;

import com.timely.reportservice.entity.enums.FormatExport;
import com.timely.reportservice.entity.enums.TypeRapport;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "rapports")
@Getter
@Setter
@NoArgsConstructor
public class Rapport {

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

    @Column(name = "date_generation", nullable = false)
    private LocalDateTime dateGeneration;

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @Column(name = "ecole_id")
    private UUID ecoleId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FormatExport format;

    @Column(name = "chemin_fichier", length = 500)
    private String cheminFichier;

    @Column(name = "utilisateur_createur", nullable = false)
    private String utilisateurCreateur;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "parametres_rapport", columnDefinition = "jsonb")
    private Map<String, Object> parametresRapport;

    @OneToMany(mappedBy = "rapport", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Export> exports = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (dateGeneration == null) {
            dateGeneration = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
