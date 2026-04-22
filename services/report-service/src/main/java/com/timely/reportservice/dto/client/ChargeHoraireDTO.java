package com.timely.reportservice.dto.client;

import java.util.Map;
import java.util.UUID;

public record ChargeHoraireDTO(
        UUID enseignantId,
        Integer totalHeures,
        Map<String, Integer> heuresParType,
        Integer nombreCours) {}
