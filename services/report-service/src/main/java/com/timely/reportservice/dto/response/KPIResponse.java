package com.timely.reportservice.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
public class KPIResponse {
    private String nomKpi;
    private BigDecimal valeur;
    private String unite;
    private LocalDate date;
    private String periode;
}
