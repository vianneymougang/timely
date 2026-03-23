package com.timely.bookingservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EcoleRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    private String adresse;
    private String telephone;

    @Email(message = "L'email doit être valide")
    private String email;

    private String contactResponsable;
}
