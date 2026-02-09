package com.timely.agoraservice.entity;

import com.timely.agoraservice.entity.enums.FormatExportAgora;
import com.timely.agoraservice.entity.enums.StatutExportAgora;
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

@Entity
@Table(name = "exports_agora")
@Getter
@Setter
@NoArgsConstructor
public class ExportAgora {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID emploiDuTempsId;

    @Column(nullable = false)
    private LocalDateTime dateExport;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FormatExportAgora format;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutExportAgora statut;

    @Column(nullable = false)
    private Integer numeroTentative = 0;

    @Column(columnDefinition = "TEXT")
    private String messageErreur;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> reponseAgora;

    private LocalDateTime dateDerniereTentative;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "exportAgora", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LogIntegration> logs = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (numeroTentative == null) {
            numeroTentative = 0;
        }
        if (statut == null) {
            statut = StatutExportAgora.EN_ATTENTE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
