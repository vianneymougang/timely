package com.timely.planningservice.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.timely.planningservice.entity.enums.Severite;
import com.timely.planningservice.entity.enums.StatutResolution;
import com.timely.planningservice.entity.enums.TypeConflit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConflitResponseDTO {

    private UUID id;
    private UUID emploiDuTempsId;
    private TypeConflit typeConflit;
    private String description;
    private Severite severite;
    private String suggestionResolution;
    private StatutResolution statutResolution;
    private LocalDateTime dateDetection;
    private LocalDateTime dateResolution;
    private UUID reservation1Id;
    private UUID reservation2Id;
}
