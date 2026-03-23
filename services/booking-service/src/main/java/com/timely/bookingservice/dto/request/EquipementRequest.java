package com.timely.bookingservice.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EquipementRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    private String description;

    @NotNull(message = "La quantité disponible est obligatoire")
    @Min(value = 0, message = "La quantité doit être positive")
    private Integer quantiteDisponible;
}
