package com.timely.agoraservice.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO pour créer ou mettre à jour un étudiant dans booking-service.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEtudiantRequest {

    private String matricule;
    private String nom;
    private String prenom;
    private String email;
    private UUID classeId;
    private String telephone;
    private LocalDate dateNaissance;
    private String genre;
}
