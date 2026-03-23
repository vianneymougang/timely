package com.timely.reportservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatistiquesSallesResponse {

    private UUID ecoleId;
    private Integer nombreSallesTotal;
    private Integer nombreSallesOccupees;
    private BigDecimal tauxOccupationMoyen;
    private Map<String, BigDecimal> occupationParSalle;
    private Map<String, Integer> reservationsParSalle;
}
