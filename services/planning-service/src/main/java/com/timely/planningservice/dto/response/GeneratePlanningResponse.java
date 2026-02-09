package com.timely.planningservice.dto.response;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeneratePlanningResponse {

    private UUID emploiDuTempsId;
    private int totalCoursAPlanifier;
    private int coursPlanifies;
    private List<CoursNonPlanifie> coursNonPlanifies = new ArrayList<>();
    private double tauxReussite;
    private int conflitsDetectes;
    private long dureeGenerationMs;
}
