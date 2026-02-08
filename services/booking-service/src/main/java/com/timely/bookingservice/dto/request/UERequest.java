package com.timely.bookingservice.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UERequest {

    @NotNull(message = "La filière est obligatoire")
    private UUID filiereId;

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    @NotBlank(message = "L'intitulé est obligatoire")
    private String intitule;

    @NotNull(message = "Les crédits ECTS sont obligatoires")
    @Min(value = 1, message = "Les crédits ECTS doivent être supérieurs à 0")
    private Integer creditEcts;

    @NotNull(message = "Le volume horaire total est obligatoire")
    @Min(value = 1, message = "Le volume horaire doit être supérieur à 0")
    private Integer volumeHoraireTotal;

    private String description;
}
