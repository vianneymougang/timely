package com.timely.reportservice.dto.response;

import com.timely.reportservice.entity.enums.FormatExport;
import com.timely.reportservice.entity.enums.TypeRapport;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * DTO de réponse pour un rapport planifié.
 */
@Getter
@Setter
public class ScheduledReportResponse {

    private UUID id;
    private TypeRapport typeRapport;
    private String titre;
    private String description;
    private String cronExpression;
    private UUID ecoleId;
    private FormatExport format;
    private List<String> destinatairesEmail;
    private Boolean actif;
    private String utilisateurCreateur;
    private Map<String, Object> parametresRapport;
    private LocalDateTime derniereExecution;
    private LocalDateTime prochaineExecution;
    private Integer nombreExecutions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
