package com.timely.agoraservice.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * DTO pour déclencher l'import des étudiants depuis Agora.
 */
@Getter
@Setter
public class ImportEtudiantsRequest {

    /**
     * ID de l'école pour laquelle importer les étudiants.
     */
    @NotNull(message = "L'ID de l'école est obligatoire")
    private UUID ecoleId;

    /**
     * ID de la classe (optionnel - si fourni, importe uniquement cette classe).
     */
    private UUID classeId;

    /**
     * Année académique pour l'import (optionnel, défaut: année en cours).
     * Format: "2025-2026"
     */
    private String anneeAcademique;

    /**
     * Mode de gestion des doublons:
     * - "SKIP": Ignore les étudiants déjà existants
     * - "UPDATE": Met à jour les étudiants existants
     * Par défaut: "UPDATE"
     */
    private String modeDoublons = "UPDATE";
}
