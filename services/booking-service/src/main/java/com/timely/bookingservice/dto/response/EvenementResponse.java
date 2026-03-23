package com.timely.bookingservice.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

import com.timely.bookingservice.entity.enums.StatutEvenement;
import com.timely.bookingservice.entity.enums.TypeEvenement;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EvenementResponse {

    private UUID id;
    private UUID ecoleId;
    private String ecoleNom;
    private TypeEvenement typeEvenement;
    private String titre;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private Integer priorite;
    private StatutEvenement statut;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
