package com.timely.bookingservice.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EcoleResponse {

    private UUID id;
    private String nom;
    private String code;
    private String adresse;
    private String telephone;
    private String email;
    private String contactResponsable;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
