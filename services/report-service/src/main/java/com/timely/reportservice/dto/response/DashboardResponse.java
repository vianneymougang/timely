package com.timely.reportservice.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class DashboardResponse {
    private BigDecimal tauxOccupationSalles;
    private Integer nombreCoursTotal;
    private Integer nombreEnseignants;
    private Integer nombreConflits;
    private List<KPIResponse> kpisRecents;
}
