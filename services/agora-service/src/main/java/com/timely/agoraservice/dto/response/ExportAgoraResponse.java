package com.timely.agoraservice.dto.response;

import com.timely.agoraservice.entity.enums.FormatExportAgora;
import com.timely.agoraservice.entity.enums.StatutExportAgora;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
public class ExportAgoraResponse {

    private UUID id;
    private UUID emploiDuTempsId;
    private LocalDateTime dateExport;
    private FormatExportAgora format;
    private StatutExportAgora statut;
    private Integer numeroTentative;
    private String messageErreur;
    private Map<String, Object> reponseAgora;
    private LocalDateTime dateDerniereTentative;
    private LocalDateTime createdAt;
    private Integer logsCount;
}
