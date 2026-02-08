package com.timely.bookingservice.dto.request;

import java.util.UUID;

import com.timely.bookingservice.entity.enums.Niveau;

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

    @NotNull(message = "Le niveau est obligatoire")
    private Niveau niveau;

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    @NotNull(message = "L'effectif est obligatoire")
    @Min(value = 0, message = "L'effectif doit être positif")
    private Integer effectif;

    @NotBlank(message = "L'année académique est obligatoire")
    private String anneeAcademique;
}
