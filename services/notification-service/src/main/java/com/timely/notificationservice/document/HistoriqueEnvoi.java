package com.timely.notificationservice.document;

import com.timely.notificationservice.document.enums.CanalNotification;
import com.timely.notificationservice.document.enums.StatutEnvoi;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "historique_envois")
@Getter
@Setter
@NoArgsConstructor
public class HistoriqueEnvoi {

    @Id
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
