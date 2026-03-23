package com.timely.planningservice.dto.request;

import java.time.LocalDate;
import java.util.UUID;

import com.timely.planningservice.entity.enums.PeriodeEmploi;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmploiDuTempsRequestDTO {

    @NotNull(message = "L'ID de l'école est obligatoire")
    private UUID ecoleId;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;

    @NotNull(message = "La période est obligatoire")
    private PeriodeEmploi periode;

    private String notes;
}
