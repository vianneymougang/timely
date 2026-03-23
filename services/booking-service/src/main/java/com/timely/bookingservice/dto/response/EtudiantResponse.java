package com.timely.bookingservice.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EtudiantResponse {

    private UUID id;
    private UUID classeId;
    private String classeCode;
    private String matricule;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private LocalDate dateInscription;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
