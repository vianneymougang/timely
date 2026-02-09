package com.timely.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.UUID;

/**
 * Response DTO for teacher workload calculation.
 * Contains total hours and breakdown by course type and school.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChargeHoraireResponse {

    private UUID enseignantId;
    private Integer totalHeures;

    // Breakdown by course type (CM, TD, TP)
    private Map<String, Integer> heuresParType;

    // Breakdown by school
    private Map<UUID, Integer> heuresParEcole;

    // Number of courses assigned
    private Integer nombreCours;
}
