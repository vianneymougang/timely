package com.timely.bookingservice.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.timely.bookingservice.entity.enums.StatutEvenement;
import com.timely.bookingservice.entity.enums.TypeEvenement;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EvenementRequest {

    @NotNull(message = "L'école est obligatoire")
    private UUID ecoleId;

    @NotNull(message = "Le type d'événement est obligatoire")
    private TypeEvenement typeEvenement;

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private String description;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;

    private LocalTime heureDebut;
    private LocalTime heureFin;
    private Integer priorite;
    private StatutEvenement statut;
}
