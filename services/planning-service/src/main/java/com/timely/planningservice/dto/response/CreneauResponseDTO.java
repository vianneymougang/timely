package com.timely.planningservice.dto.response;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.timely.planningservice.entity.enums.StatutCreneau;
import com.timely.planningservice.entity.enums.TypeRecurrence;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreneauResponseDTO {

    private UUID id;
    private UUID emploiDuTempsId;
    private DayOfWeek jourSemaine;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private LocalDate dateCreneau;
    private TypeRecurrence typeRecurrence;
    private StatutCreneau statutCreneau;
    private UUID reservationId;
    private UUID enseignantId;
    private UUID salleId;
    private UUID groupeId;
    private UUID coursId;
}
