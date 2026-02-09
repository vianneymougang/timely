package com.timely.reportservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatistiquesEnseignantsResponse {

    private Integer nombreEnseignantsTotal;
    private BigDecimal chargeHoraireMoyenne;
    private BigDecimal chargeHoraireMax;
    private BigDecimal chargeHoraireMin;
    private Map<String, BigDecimal> chargeParEnseignant;
}
