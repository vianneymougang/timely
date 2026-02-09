package com.timely.reportservice.dto.request;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import com.timely.reportservice.entity.enums.FormatExport;
import com.timely.reportservice.entity.enums.TypeRapport;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenerateReportRequest {

    @NotNull(message = "Le type de rapport est obligatoire")
    private TypeRapport typeRapport;

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private String description;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;

    @NotNull(message = "L'ID de l'école est obligatoire")
    private UUID ecoleId;

    @NotNull(message = "Le format est obligatoire")
    private FormatExport format;

    private Map<String, Object> parametresRapport;
}
