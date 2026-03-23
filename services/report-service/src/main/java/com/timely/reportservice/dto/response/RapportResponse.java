package com.timely.reportservice.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import com.timely.reportservice.entity.enums.FormatExport;
import com.timely.reportservice.entity.enums.TypeRapport;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RapportResponse {

    private UUID id;
    private TypeRapport typeRapport;
    private String titre;
    private String description;
    private LocalDateTime dateGeneration;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private UUID ecoleId;
    private FormatExport format;
    private String cheminFichier;
    private String utilisateurCreateur;
    private Map<String, Object> parametresRapport;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
