package com.timely.notificationservice.dto.request;

import com.timely.notificationservice.document.enums.CanalNotification;
import com.timely.notificationservice.document.enums.TypeNotification;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ScheduleNotificationRequest {

    @NotNull(message = "Le destinataire est requis")
    private UUID destinataireId;

    @NotNull(message = "Le type de notification est requis")
    private TypeNotification typeNotification;

    @NotBlank(message = "Le sujet est requis")
    private String sujet;

    @NotBlank(message = "Le contenu est requis")
    private String contenu;

    @NotNull(message = "Le canal est requis")
    private CanalNotification canal;

    @NotNull(message = "La date d'envoi est requise")
    @Future(message = "La date d'envoi doit être dans le futur")
    private LocalDateTime dateEnvoiPrevue;
}
