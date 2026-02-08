package com.timely.bookingservice.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.timely.bookingservice.entity.enums.Niveau;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "classes")
@Getter
@Setter
@NoArgsConstructor
public class Classe {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "filiere_id", nullable = false)
    private Filiere filiere;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Niveau niveau;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false)
    private Integer effectif = 0;

    @Column(name = "annee_academique", nullable = false, length = 20)
    private String anneeAcademique;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    @OneToMany(mappedBy = "classe", cascade = CascadeType.ALL)
    private List<Etudiant> etudiants = new ArrayList<>();

    @OneToMany(mappedBy = "classe", cascade = CascadeType.ALL)
    private List<Cours> cours = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }
}
