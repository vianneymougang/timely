package com.timely.notificationservice.dto.response;

import com.timely.notificationservice.document.enums.CanalNotification;
import com.timely.notificationservice.document.enums.StatutNotification;
import com.timely.notificationservice.document.enums.TypeNotification;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class NotificationDetailsResponse {

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

    // Détails supplémentaires
    private List<HistoriqueResponse> historique;
    private Integer nombreTentatives;
    private String dernierMessageErreur;
}
