package com.timely.bookingservice.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClasseRequest {

    @NotNull(message = "La filière est obligatoire")
    private UUID filiereId;

    @NotNull(message = "L'année est obligatoire")
    @Min(value = 1, message = "L'année doit être au moins 1")
    @Max(value = 5, message = "L'année doit être au plus 5")
    private Integer yearIndex;

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    @NotNull(message = "L'effectif est obligatoire")
    @Min(value = 0, message = "L'effectif doit être positif")
    private Integer effectif;

    @NotBlank(message = "L'année académique est obligatoire")
    private String anneeAcademique;
}
