package com.timely.reportservice.entity;

import com.timely.reportservice.entity.enums.FormatExport;
import com.timely.reportservice.entity.enums.StatutExport;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "exports")
@Getter
@Setter
@NoArgsConstructor
public class Export {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rapport_id", nullable = false)
    private Rapport rapport;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FormatExport format;

    @Column(name = "date_export", nullable = false)
    private LocalDateTime dateExport;

    @Column(nullable = false)
    private String utilisateur;

    @Column(name = "chemin_fichier", nullable = false, length = 500)
    private String cheminFichier;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutExport statut;

    @Column(name = "message_erreur", columnDefinition = "TEXT")
    private String messageErreur;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (dateExport == null) {
            dateExport = LocalDateTime.now();
        }
        if (statut == null) {
            statut = StatutExport.EN_COURS;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
