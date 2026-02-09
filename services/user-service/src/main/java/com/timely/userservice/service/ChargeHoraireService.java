package com.timely.userservice.service;

import com.timely.userservice.dto.ChargeHoraireResponse;

import java.util.UUID;

/**
 * Service interface for calculating teacher workload (charge horaire).
 */
public interface ChargeHoraireService {

    /**
     * Calculate total workload for a teacher.
     * Aggregates hours from all assigned courses.
     *
     * @param enseignantId Teacher ID
     * @return ChargeHoraireResponse with total hours and breakdowns
     */
    ChargeHoraireResponse calculateChargeHoraire(UUID enseignantId);
}
