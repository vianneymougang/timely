package com.timely.notificationservice.dto.response;

import com.timely.notificationservice.document.enums.TypeNotification;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class TemplateResponse {

    private String id;
    private String nom;
    private TypeNotification typeNotification;
    private String contenuTemplate;
    private List<String> variablesDisponibles;
    private Boolean actif;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
