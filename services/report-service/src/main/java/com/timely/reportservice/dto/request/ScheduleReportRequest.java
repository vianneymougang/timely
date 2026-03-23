package com.timely.reportservice.dto.request;

import com.timely.reportservice.entity.enums.FormatExport;
import com.timely.reportservice.entity.enums.TypeRapport;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * DTO pour planifier un rapport automatique récurrent.
 */
@Getter
@Setter
public class ScheduleReportRequest {

    @NotNull(message = "Le type de rapport est obligatoire")
    private TypeRapport typeRapport;

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private String description;

    /**
     * Expression cron définissant la périodicité.
     * Exemples:
     * - "0 0 9 * * MON" : Tous les lundis à 9h
     * - "0 0 9 1 * ?" : Le 1er de chaque mois à 9h
     * - "0 0 9 * * ?" : Tous les jours à 9h
     */
    @NotBlank(message = "L'expression cron est obligatoire")
    private String cronExpression;

    private UUID ecoleId;

    @NotNull(message = "Le format d'export est obligatoire")
    private FormatExport format;

    /**
     * Liste des adresses email des destinataires.
     */
    @NotEmpty(message = "Au moins un destinataire est requis")
    private List<@Email(message = "Email invalide") String> destinatairesEmail;

    /**
     * Paramètres additionnels pour la génération du rapport.
     */
    private Map<String, Object> parametresRapport;

    /**
     * Indique si le rapport planifié est actif dès sa création.
     * Par défaut: true
     */
    private Boolean actif = true;
}
