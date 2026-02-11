package com.timely.reportservice.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

/**
 * DTO pour envoyer un email via notification-service.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendEmailRequest {

    /**
     * Destinataires principaux.
     */
    private List<String> destinataires;

    /**
     * Sujet de l'email.
     */
    private String sujet;

    /**
     * Corps de l'email (peut être HTML).
     */
    private String corps;

    /**
     * Indique si le corps est au format HTML.
     */
    private Boolean isHtml = false;

    /**
     * Template à utiliser (optionnel).
     */
    private String template;

    /**
     * Variables pour le template (optionnel).
     */
    private Map<String, Object> templateVariables;

    /**
     * Pièces jointes (chemins de fichiers).
     */
    private List<String> attachments;

    /**
     * Priorité de l'email (HIGH, NORMAL, LOW).
     */
    private String priority = "NORMAL";
}
