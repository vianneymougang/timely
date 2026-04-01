package com.timely.planningservice.dto.request;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeneratePlanningRequest {

    @NotNull(message = "L'école est obligatoire")
    private UUID ecoleId;

    @NotNull(message = "La date de début de semaine est obligatoire")
    private LocalDate weekStart;

    public void validate() {
        if (weekStart != null && weekStart.getDayOfWeek() != DayOfWeek.MONDAY) {
            throw new IllegalArgumentException("weekStart doit être un lundi");
        }
    }
}
