package com.timely.agoraservice.dto.booking;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO de réponse pour un étudiant depuis booking-service.
 */
@Getter
@Setter
public class EtudiantResponse {

    private UUID id;
    private String matricule;
    private String nom;
    private String prenom;
    private String email;
    private UUID classeId;
    private String telephone;
    private LocalDate dateNaissance;
    private String genre;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
