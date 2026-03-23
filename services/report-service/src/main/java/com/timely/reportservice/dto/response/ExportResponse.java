package com.timely.reportservice.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.timely.reportservice.entity.enums.FormatExport;
import com.timely.reportservice.entity.enums.StatutExport;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExportResponse {

    private UUID id;
    private UUID rapportId;
    private FormatExport format;
    private LocalDateTime dateExport;
    private String utilisateur;
    private String cheminFichier;
    private StatutExport statut;
    private String messageErreur;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
