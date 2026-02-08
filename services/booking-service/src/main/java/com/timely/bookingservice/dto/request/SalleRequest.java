package com.timely.bookingservice.dto.request;

import java.util.Set;
import java.util.UUID;

import com.timely.bookingservice.entity.enums.StatutSalle;
import com.timely.bookingservice.entity.enums.TypeSalle;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SalleRequest {

    @NotNull(message = "L'école est obligatoire")
    private UUID ecoleId;

    @NotBlank(message = "Le numéro est obligatoire")
    private String numero;

    private String nom;

    @NotNull(message = "Le type de salle est obligatoire")
    private TypeSalle typeSalle;

    @NotNull(message = "La capacité est obligatoire")
    @Min(value = 1, message = "La capacité doit être supérieure à 0")
    private Integer capacite;

    private Double superficieM2;
    private String batiment;
    private String etage;
    private StatutSalle statut;
    private Set<UUID> equipementIds;
}
