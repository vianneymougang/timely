package com.timely.agoraservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.timely.agoraservice.client.PlanningServiceClient;
import com.timely.agoraservice.entity.ExportAgora;
import com.timely.agoraservice.entity.LogIntegration;
import com.timely.agoraservice.entity.enums.FormatExportAgora;
import com.timely.agoraservice.entity.enums.StatutExportAgora;
import com.timely.agoraservice.entity.enums.TypeLog;
import com.timely.agoraservice.exception.ResourceNotFoundException;
import com.timely.agoraservice.repository.ExportAgoraRepository;
import com.timely.agoraservice.repository.LogIntegrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class AgoraExportService {

    private final ExportAgoraRepository exportAgoraRepository;
    private final LogIntegrationRepository logIntegrationRepository;
    private final PlanningServiceClient planningServiceClient;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${agora.api.url}")
    private String agoraApiUrl;

    @Value("${agora.api.username}")
    private String agoraUsername;

    @Value("${agora.api.password}")
    private String agoraPassword;

    @Value("${agora.api.timeout:30000}")
    private int agoraTimeout;

    @Async
    @Transactional
    public void exportToAgoraAsync(UUID exportId) {
        log.info("Début de l'export asynchrone vers Agora pour export: {}", exportId);

        // Récupérer l'ExportAgora par ID
        ExportAgora export = exportAgoraRepository.findById(exportId)
                .orElseThrow(() -> new ResourceNotFoundException("Export non trouvé: " + exportId));

        // Si statut != EN_ATTENTE et statut != ECHEC, skip
        if (export.getStatut() != StatutExportAgora.EN_ATTENTE && export.getStatut() != StatutExportAgora.ECHEC) {
            log.info("Export {} déjà traité avec statut: {}, skip", exportId, export.getStatut());
            return;
        }

        // Incrémenter numeroTentative
        export.setNumeroTentative(export.getNumeroTentative() + 1);
        export.setDateDerniereTentative(LocalDateTime.now());
        exportAgoraRepository.save(export);

        try {
            // Récupérer l'emploi du temps via planningServiceClient
            Object emploi = planningServiceClient.getEmploiDuTemps(export.getEmploiDuTempsId());
            if (emploi == null) {
                throw new ResourceNotFoundException("Emploi du temps non trouvé: " + export.getEmploiDuTempsId());
            }

            // Convertir en format JSON ou XML selon export.format
            String content;
            if (export.getFormat() == FormatExportAgora.JSON) {
                content = convertToJson(emploi);
            } else {
                content = convertToXml(emploi);
            }

            // Envoyer à l'API Agora
            Map<String, Object> response = sendToAgoraApi(export.getId().toString(), content, export.getFormat());

            // Succès: mettre à jour statut = ENVOYE
            export.setStatut(StatutExportAgora.ENVOYE);
            export.setReponseAgora(response);
            export.setMessageErreur(null);
            exportAgoraRepository.save(export);

            // Créer log INFO "Export réussi"
            LogIntegration logSuccess = new LogIntegration();
            logSuccess.setExportAgora(export);
            logSuccess.setTypeLog(TypeLog.INFO);
            logSuccess.setMessage("Export réussi vers Agora pour emploi: " + export.getEmploiDuTempsId());
            logIntegrationRepository.save(logSuccess);

            log.info("Export {} envoyé avec succès vers Agora", exportId);

        } catch (Exception e) {
            // Échec: mettre à jour statut = ECHEC
            export.setStatut(StatutExportAgora.ECHEC);
            export.setMessageErreur(e.getMessage());
            exportAgoraRepository.save(export);

            // Créer log ERROR avec stackTrace
            LogIntegration logError = new LogIntegration();
            logError.setExportAgora(export);
            logError.setTypeLog(TypeLog.ERROR);
            logError.setMessage("Erreur lors de l'export vers Agora: " + e.getMessage());
            logError.setStackTrace(getStackTraceAsString(e));
            logIntegrationRepository.save(logError);

            log.error("Échec de l'export {} vers Agora (tentative {})", exportId, export.getNumeroTentative(), e);
        }
    }

    public String convertToJson(Object emploi) {
        try {
            return objectMapper.writeValueAsString(emploi);
        } catch (Exception e) {
            log.error("Erreur lors de la conversion en JSON", e);
            throw new RuntimeException("Erreur de conversion JSON: " + e.getMessage(), e);
        }
    }

    public String convertToXml(Object emploi) {
        try {
            XmlMapper xmlMapper = new XmlMapper();
            return xmlMapper.writeValueAsString(emploi);
        } catch (Exception e) {
            log.error("Erreur lors de la conversion en XML", e);
            throw new RuntimeException("Erreur de conversion XML: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> sendToAgoraApi(String exportId, String content, FormatExportAgora format) {
        try {
            // Construire l'URL
            String url = agoraApiUrl + "/emplois";

            // Construire les headers
            HttpHeaders headers = new HttpHeaders();
            if (format == FormatExportAgora.JSON) {
                headers.setContentType(MediaType.APPLICATION_JSON);
            } else {
                headers.setContentType(MediaType.APPLICATION_XML);
            }

            // Basic Auth
            String auth = agoraUsername + ":" + agoraPassword;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            headers.set("Authorization", "Basic " + encodedAuth);

            // Construire la requête
            HttpEntity<String> request = new HttpEntity<>(content, headers);

            // Envoyer la requête
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

            log.info("Réponse de l'API Agora pour export {}: {}", exportId, response.getStatusCode());

            return response.getBody();

        } catch (Exception e) {
            log.error("Erreur lors de l'envoi vers l'API Agora", e);
            throw new RuntimeException("Erreur d'envoi vers Agora: " + e.getMessage(), e);
        }
    }

    @Scheduled(fixedDelay = 300000) // 5 minutes
    @Transactional
    public void retryFailedExports() {
        log.info("Scheduled: Recherche des exports échoués à retenter");

        // Récupérer tous les exports avec statut = ECHEC et numeroTentative < 3
        List<ExportAgora> failedExports = exportAgoraRepository.findByStatutAndNumeroTentativeLessThan(StatutExportAgora.ECHEC, 3);

        if (!failedExports.isEmpty()) {
            log.info("Trouvé {} exports échoués à retenter", failedExports.size());

            // Pour chaque export, appeler exportToAgoraAsync
            for (ExportAgora export : failedExports) {
                log.info("Retry de l'export {}", export.getId());
                exportToAgoraAsync(export.getId());
            }
        } else {
            log.debug("Aucun export échoué à retenter");
        }
    }

    private String getStackTraceAsString(Exception e) {
        StringBuilder sb = new StringBuilder();
        sb.append(e.toString()).append("\n");
        for (StackTraceElement element : e.getStackTrace()) {
            sb.append("\tat ").append(element.toString()).append("\n");
        }
        return sb.toString();
    }
}
