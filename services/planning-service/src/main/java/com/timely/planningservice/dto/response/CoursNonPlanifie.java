package com.timely.planningservice.dto.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoursNonPlanifie {

    private UUID coursId;
    private String intitule;
    private String raison;
}
