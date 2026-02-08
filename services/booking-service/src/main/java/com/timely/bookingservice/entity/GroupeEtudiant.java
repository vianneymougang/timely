package com.timely.bookingservice.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.timely.bookingservice.entity.enums.TypeGroupe;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "groupes_etudiants")
@Getter
@Setter
@NoArgsConstructor
public class GroupeEtudiant {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cours_id", nullable = false)
    private Cours cours;

    @Column(name = "numero_groupe", nullable = false)
    private Integer numeroGroupe;

    @Column(nullable = false)
    private Integer effectif = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_groupe", nullable = false, length = 30)
    private TypeGroupe typeGroupe;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    @ManyToMany
    @JoinTable(
            name = "groupe_etudiant_etudiant",
            joinColumns = @JoinColumn(name = "groupe_etudiant_id"),
            inverseJoinColumns = @JoinColumn(name = "etudiant_id")
    )
    private Set<Etudiant> etudiants = new HashSet<>();

    @OneToMany(mappedBy = "groupeEtudiant", cascade = CascadeType.ALL)
    private List<Reservation> reservations = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }
}
