package com.timely.planningservice.event;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmploiDuTempsPublieEvent {

    private UUID emploiDuTempsId;
    private UUID ecoleId;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private LocalDateTime datePublication;
}
