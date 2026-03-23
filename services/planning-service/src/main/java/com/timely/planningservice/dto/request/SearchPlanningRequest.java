package com.timely.planningservice.dto.request;

import java.time.LocalDate;
import java.util.UUID;

import com.timely.planningservice.entity.enums.StatutEmploi;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO for advanced planning search with filters and pagination
 */
@Getter
@Setter
public class SearchPlanningRequest {

    /**
     * Filter by école ID
     */
    private UUID ecoleId;

    /**
     * Filter by enseignant ID (searches in creneaux)
     */
    private UUID enseignantId;

    /**
     * Filter by salle ID (searches in creneaux)
     */
    private UUID salleId;

    /**
     * Filter by groupe étudiant ID (searches in creneaux)
     */
    private UUID groupeId;

    /**
     * Filter by week (date of Monday)
     */
    private LocalDate semaine;

    /**
     * Filter by emploi status
     */
    private StatutEmploi statut;

    /**
     * Page number (0-indexed)
     */
    @Min(0)
    private int page = 0;

    /**
     * Page size
     */
    @Min(1)
    @Max(100)
    private int size = 20;

    /**
     * Sort field
     */
    private String sortBy = "dateDebut";

    /**
     * Sort direction (ASC or DESC)
     */
    private String sortDirection = "ASC";
}
