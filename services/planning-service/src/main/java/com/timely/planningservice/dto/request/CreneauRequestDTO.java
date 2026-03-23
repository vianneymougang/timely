package com.timely.planningservice.dto.request;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.timely.planningservice.entity.enums.TypeRecurrence;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreneauRequestDTO {

    @NotNull(message = "Le jour de la semaine est obligatoire")
    private DayOfWeek jourSemaine;

    @NotNull(message = "L'heure de début est obligatoire")
    private LocalTime heureDebut;

    @NotNull(message = "L'heure de fin est obligatoire")
    private LocalTime heureFin;

    private LocalDate dateCreneau;

    @NotNull(message = "Le type de récurrence est obligatoire")
    private TypeRecurrence typeRecurrence;

    private UUID reservationId;
    private UUID enseignantId;
    private UUID salleId;
    private UUID groupeId;
    private UUID coursId;
}
