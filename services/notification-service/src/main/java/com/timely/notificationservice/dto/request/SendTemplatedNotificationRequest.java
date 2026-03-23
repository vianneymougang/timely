package com.timely.notificationservice.dto.request;

import com.timely.notificationservice.document.enums.CanalNotification;
import com.timely.notificationservice.document.enums.TypeNotification;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;
import java.util.UUID;

@Getter
@Setter
public class SendTemplatedNotificationRequest {

    @NotNull(message = "Le destinataire est requis")
    private UUID destinataireId;

    @NotNull(message = "Le type de notification est requis")
    private TypeNotification typeNotification;

    @NotBlank(message = "Le template ID est requis")
    private String templateId;

    @NotNull(message = "Le canal est requis")
    private CanalNotification canal;

    private Map<String, Object> variables;
}
