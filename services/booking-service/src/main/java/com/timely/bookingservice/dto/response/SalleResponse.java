package com.timely.bookingservice.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.timely.bookingservice.entity.enums.StatutSalle;
import com.timely.bookingservice.entity.enums.TypeSalle;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SalleResponse {

    private UUID id;
    private UUID ecoleId;
    private String ecoleNom;
    private String numero;
    private String nom;
    private TypeSalle typeSalle;
    private Integer capacite;
    private Double superficieM2;
    private String batiment;
    private String etage;
    private StatutSalle statut;
    private List<EquipementResponse> equipements;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
