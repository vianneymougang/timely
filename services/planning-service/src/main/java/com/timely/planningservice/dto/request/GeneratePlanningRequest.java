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

    private UUID ecoleId;

    @NotNull(message = "La date de debut de semaine est obligatoire")
    private LocalDate weekStart;

    public GeneratePlanningRequest(LocalDate weekStart) {
        this.weekStart = weekStart;
    }

    public void validate() {
        if (weekStart != null && weekStart.getDayOfWeek() != DayOfWeek.MONDAY) {
            throw new IllegalArgumentException("weekStart doit etre un lundi");
        }
    }
}
