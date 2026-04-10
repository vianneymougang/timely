package com.timely.bookingservice.dto.request;

import java.util.UUID;

import com.timely.bookingservice.entity.enums.CycleType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FiliereRequest {

    @NotNull(message = "L'école est obligatoire")
    private UUID ecoleId;

    @NotNull(message = "Le type de cycle est obligatoire")
    private CycleType cycleType;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    private String description;
}
