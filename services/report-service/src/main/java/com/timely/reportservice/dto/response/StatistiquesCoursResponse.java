package com.timely.reportservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatistiquesCoursResponse {

    private Integer nombreCoursTotal;
    private Map<String, Integer> coursParType;
    private Map<String, Integer> coursParDepartement;
    private Integer nombreEtudiantsTotal;
}
