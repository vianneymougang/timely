package com.timely.bookingservice.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClasseResponse {

    private UUID id;
    private UUID filiereId;
    private String filiereNom;
    private Integer yearIndex;
    private String cycleType;
    private String displayLevel;
    private String code;
    private Integer effectif;
    private String anneeAcademique;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
