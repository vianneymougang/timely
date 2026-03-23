package com.timely.notificationservice.dto.request;

import com.timely.notificationservice.document.enums.TypeNotification;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TemplateRequest {

    @NotBlank(message = "Le nom est requis")
    private String nom;

    @NotNull(message = "Le type de notification est requis")
    private TypeNotification typeNotification;

    @NotBlank(message = "Le contenu du template est requis")
    private String contenuTemplate;

    private List<String> variablesDisponibles;

    @NotNull(message = "Le statut actif est requis")
    private Boolean actif;
}
