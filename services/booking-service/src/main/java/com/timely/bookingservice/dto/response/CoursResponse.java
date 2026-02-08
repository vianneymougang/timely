package com.timely.bookingservice.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.timely.bookingservice.entity.enums.StatutCours;
import com.timely.bookingservice.entity.enums.TypeCours;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CoursResponse {

    private UUID id;
    private UUID ueId;
    private String ueIntitule;
    private UUID classeId;
    private String classeCode;
    private UUID enseignantId;
    private String intitule;
    private TypeCours typeCours;
    private Integer volumeHoraire;
    private Integer effectifGroupe;
    private String description;
    private StatutCours statut;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
