package com.timely.planningservice.entity;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.timely.planningservice.entity.enums.StatutCreneau;
import com.timely.planningservice.entity.enums.TypeRecurrence;

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
@Table(name = "creneaux")
@Getter
@Setter
@NoArgsConstructor
public class Creneau {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull(message = "L'emploi du temps est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emploi_id", nullable = false)
    private EmploiDuTemps emploiDuTemps;

    @NotNull(message = "Le jour de la semaine est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "jour_semaine", nullable = false, length = 20)
    private DayOfWeek jourSemaine;

    @NotNull(message = "L'heure de début est obligatoire")
    @Column(name = "heure_debut", nullable = false)
    private LocalTime heureDebut;

    @NotNull(message = "L'heure de fin est obligatoire")
    @Column(name = "heure_fin", nullable = false)
    private LocalTime heureFin;

    @Column(name = "date_creneau")
    private LocalDate dateCreneau;

    @NotNull(message = "Le type de récurrence est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "type_recurrence", nullable = false, length = 50)
    private TypeRecurrence typeRecurrence;

    @NotNull(message = "Le statut du créneau est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "statut_creneau", nullable = false, length = 50)
    private StatutCreneau statutCreneau;

    @Column(name = "reservation_id")
    private UUID reservationId;

    @Column(name = "enseignant_id")
    private UUID enseignantId;

    @Column(name = "salle_id")
    private UUID salleId;

    @Column(name = "groupe_id")
    private UUID groupeId;

    @Column(name = "cours_id")
    private UUID coursId;

    @Column(name = "cours_intitule")
    private String coursIntitule;

    @Column(name = "cours_type", length = 10)
    private String coursType;

    @Column(name = "enseignant_nom")
    private String enseignantNom;

    @Column(name = "salle_nom")
    private String salleNom;

    @Column(name = "groupe_nom")
    private String groupeNom;

    public Creneau(EmploiDuTemps emploiDuTemps, DayOfWeek jourSemaine, LocalTime heureDebut,
                   LocalTime heureFin, TypeRecurrence typeRecurrence) {
        this.emploiDuTemps = emploiDuTemps;
        this.jourSemaine = jourSemaine;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
        this.typeRecurrence = typeRecurrence;
        this.statutCreneau = StatutCreneau.RESERVE;
    }
}
