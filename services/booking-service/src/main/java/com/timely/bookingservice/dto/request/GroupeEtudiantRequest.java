package com.timely.bookingservice.dto.request;

import java.util.UUID;

import com.timely.bookingservice.entity.enums.TypeGroupe;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupeEtudiantRequest {

    @NotNull(message = "Le cours est obligatoire")
    private UUID coursId;

    @NotNull(message = "Le numéro de groupe est obligatoire")
    @Min(value = 1, message = "Le numéro de groupe doit être supérieur à 0")
    private Integer numeroGroupe;

    @NotNull(message = "L'effectif est obligatoire")
    @Min(value = 0, message = "L'effectif doit être positif")
    private Integer effectif;

    @NotNull(message = "Le type de groupe est obligatoire")
    private TypeGroupe typeGroupe;
}
