package com.timely.agoraservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * DTO de réponse pour l'import des étudiants depuis Agora.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportEtudiantsResponse {

    /**
     * ID de l'import (correspond à l'ID du LogIntegration).
     */
    private UUID importId;

    /**
     * Statut de l'import (SUCCESS, PARTIAL_SUCCESS, FAILED).
     */
    private String statut;

    /**
     * Total d'étudiants récupérés depuis Agora.
     */
    private Integer totalRecuperes;

    /**
     * Nombre d'étudiants créés.
     */
    private Integer etudiantsCrees;

    /**
     * Nombre d'étudiants mis à jour.
     */
    private Integer etudiantsMisAJour;

    /**
     * Nombre d'étudiants ignorés (doublons en mode SKIP).
     */
    private Integer etudiantsIgnores;

    /**
     * Nombre d'échecs.
     */
    private Integer echecs;

    /**
     * Détails des erreurs rencontrées.
     */
    @Builder.Default
    private List<String> erreurs = new ArrayList<>();

    /**
     * Date et heure de l'import.
     */
    private LocalDateTime dateImport;

    /**
     * Durée de l'import en millisecondes.
     */
    private Long dureeMs;

    /**
     * Calcule le taux de succès de l'import.
     */
    public double getTauxSucces() {
        if (totalRecuperes == null || totalRecuperes == 0) {
            return 0.0;
        }
        int succes = (etudiantsCrees != null ? etudiantsCrees : 0) +
                     (etudiantsMisAJour != null ? etudiantsMisAJour : 0);
        return (succes * 100.0) / totalRecuperes;
    }
}
