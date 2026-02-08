package com.timely.bookingservice.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UEResponse {

    private UUID id;
    private UUID filiereId;
    private String filiereNom;
    private String code;
    private String intitule;
    private Integer creditEcts;
    private Integer volumeHoraireTotal;
    private String description;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
