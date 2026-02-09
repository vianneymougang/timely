package com.timely.planningservice.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.timely.planningservice.entity.enums.PeriodeEmploi;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeneratePlanningRequest {

    @NotNull(message = "L'ID de l'école est obligatoire")
    private UUID ecoleId;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;

    @NotNull(message = "La période est obligatoire")
    private PeriodeEmploi periode;

    @Min(value = 1, message = "Le nombre de créneaux par jour doit être au minimum 1")
    private Integer creneauxParJour = 6;

    private LocalTime heureDebutJournee = LocalTime.of(8, 0);

    private LocalTime heureFinJournee = LocalTime.of(18, 0);

    @Min(value = 30, message = "La durée du créneau doit être au minimum 30 minutes")
    private Integer dureeCreneauMinutes = 90;

    @Min(value = 0, message = "La pause entre créneaux ne peut pas être négative")
    private Integer pauseEntreCreneauxMinutes = 15;
}
