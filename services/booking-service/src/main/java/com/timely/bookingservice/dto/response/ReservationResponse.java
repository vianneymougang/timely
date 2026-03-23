package com.timely.bookingservice.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

import com.timely.bookingservice.entity.enums.Recurrence;
import com.timely.bookingservice.entity.enums.StatutReservation;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationResponse {

    private UUID id;
    private UUID coursId;
    private String coursIntitule;
    private UUID salleId;
    private String salleNom;
    private UUID groupeEtudiantId;
    private UUID enseignantId;
    private LocalDate dateReservation;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String jourSemaine;
    private Recurrence recurrence;
    private StatutReservation statut;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
