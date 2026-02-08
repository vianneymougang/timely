package com.timely.bookingservice.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ecoles")
@Getter
@Setter
@NoArgsConstructor
public class Ecole {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(length = 500)
    private String adresse;

    @Column(length = 20)
    private String telephone;

    @Column(length = 255)
    private String email;

    @Column(name = "contact_responsable")
    private String contactResponsable;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    @OneToMany(mappedBy = "ecole", cascade = CascadeType.ALL)
    private List<Filiere> filieres = new ArrayList<>();

    @OneToMany(mappedBy = "ecole", cascade = CascadeType.ALL)
    private List<Salle> salles = new ArrayList<>();

    @OneToMany(mappedBy = "ecole", cascade = CascadeType.ALL)
    private List<Evenement> evenements = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }
}
