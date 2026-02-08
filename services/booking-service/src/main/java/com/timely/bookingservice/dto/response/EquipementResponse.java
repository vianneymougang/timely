package com.timely.bookingservice.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EquipementResponse {

    private UUID id;
    private String nom;
    private String code;
    private String description;
    private Integer quantiteDisponible;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
