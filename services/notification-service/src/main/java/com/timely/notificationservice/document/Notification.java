package com.timely.notificationservice.document;

import com.timely.notificationservice.document.enums.CanalNotification;
import com.timely.notificationservice.document.enums.StatutNotification;
import com.timely.notificationservice.document.enums.TypeNotification;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "notifications")
@Getter
@Setter
@NoArgsConstructor
public class Notification {

    @Id
    private String id;

    private UUID destinataireId;

    private TypeNotification typeNotification;

    private String sujet;

    private String contenu;

    private CanalNotification canal;

    private StatutNotification statut;

    private LocalDateTime dateCreation;

    private LocalDateTime dateEnvoi;

    private LocalDateTime dateLecture;

    private Integer tentativesRestantes;
}
