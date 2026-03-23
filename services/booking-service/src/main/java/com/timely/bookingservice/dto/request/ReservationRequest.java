package com.timely.bookingservice.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.timely.bookingservice.entity.enums.Recurrence;
import com.timely.bookingservice.entity.enums.StatutReservation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationRequest {

    @NotNull(message = "Le cours est obligatoire")
    private UUID coursId;

    @NotNull(message = "La salle est obligatoire")
    private UUID salleId;

    private UUID groupeEtudiantId;
    private UUID enseignantId;

    @NotNull(message = "La date de réservation est obligatoire")
    private LocalDate dateReservation;

    @NotNull(message = "L'heure de début est obligatoire")
    private LocalTime heureDebut;

    @NotNull(message = "L'heure de fin est obligatoire")
    private LocalTime heureFin;

    @NotBlank(message = "Le jour de la semaine est obligatoire")
    private String jourSemaine;

    private Recurrence recurrence;
    private StatutReservation statut;
}
