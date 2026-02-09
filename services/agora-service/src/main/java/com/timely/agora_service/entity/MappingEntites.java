package com.timely.agora_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "mapping_entites",
    uniqueConstraints = @UniqueConstraint(columnNames = {"entite_locale_type", "entite_locale_id"})
)
@Getter
@Setter
@NoArgsConstructor
public class MappingEntites {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "entite_locale_type", nullable = false, length = 50)
    private String entiteLocaleType;

    @Column(name = "entite_locale_id", nullable = false)
    private UUID entiteLocaleId;

    @Column(name = "entite_agora_id", nullable = false, length = 100)
    private String entiteAgoraId;

    @Column(name = "type_mapping", length = 50)
    private String typeMapping;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        dateModification = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }
}
