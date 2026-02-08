package com.timely.bookingservice.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FiliereResponse {

    private UUID id;
    private UUID ecoleId;
    private String ecoleNom;
    private String nom;
    private String code;
    private String description;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
