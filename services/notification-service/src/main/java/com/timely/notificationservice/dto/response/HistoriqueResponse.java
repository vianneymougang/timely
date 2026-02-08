package com.timely.notificationservice.dto.response;

import com.timely.notificationservice.document.enums.CanalNotification;
import com.timely.notificationservice.document.enums.StatutEnvoi;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class HistoriqueResponse {

    private String id;
    private String notificationId;
    private UUID utilisateurId;
    private CanalNotification canal;
    private StatutEnvoi statut;
    private LocalDateTime timestampEnvoi;
    private LocalDateTime timestampLecture;
    private String messageErreur;
    private Integer tentativeNumero;
}
