package com.timely.reportservice.service;

import com.timely.reportservice.dto.notification.SendEmailRequest;
import com.timely.reportservice.dto.request.GenerateReportRequest;
import com.timely.reportservice.dto.request.ScheduleReportRequest;
import com.timely.reportservice.dto.response.RapportResponse;
import com.timely.reportservice.dto.response.ScheduledReportResponse;
import com.timely.reportservice.client.NotificationServiceClient;
import com.timely.reportservice.entity.ScheduledReport;
import com.timely.reportservice.exception.ResourceNotFoundException;
import com.timely.reportservice.mapper.ScheduledReportMapper;
import com.timely.reportservice.repository.ScheduledReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Service gérant la planification et l'exécution automatique des rapports.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ReportSchedulerService {

    private final ScheduledReportRepository scheduledReportRepository;
    private final ScheduledReportMapper scheduledReportMapper;
    private final ReportService reportService;
    private final FileGenerationService fileGenerationService;
    private final NotificationServiceClient notificationServiceClient;

    private static final String TIMEZONE = "Africa/Douala";

    /**
     * Crée un nouveau rapport planifié.
     */
    @Transactional
    public ScheduledReportResponse scheduleReport(ScheduleReportRequest request, String utilisateurCreateur) {
        log.info("Planification d'un nouveau rapport: type={}, cron={}", request.getTypeRapport(), request.getCronExpression());

        // Valider l'expression cron
        validateCronExpression(request.getCronExpression());

        // Mapper vers entité
        ScheduledReport scheduledReport = scheduledReportMapper.toEntity(request);
        scheduledReport.setUtilisateurCreateur(utilisateurCreateur);

        // Calculer la prochaine exécution
        LocalDateTime nextExecution = calculateNextExecution(request.getCronExpression());
        scheduledReport.setProchaineExecution(nextExecution);

        // Sauvegarder
        ScheduledReport saved = scheduledReportRepository.save(scheduledReport);
        log.info("Rapport planifié créé avec succès: id={}, prochaine exécution={}", saved.getId(), nextExecution);

        return scheduledReportMapper.toResponse(saved);
    }

    /**
     * Récupère un rapport planifié par ID.
     */
    @Transactional(readOnly = true)
    public ScheduledReportResponse getScheduledReportById(UUID id) {
        log.debug("Récupération du rapport planifié: id={}", id);
        ScheduledReport scheduledReport = scheduledReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rapport planifié non trouvé avec l'id: " + id));
        return scheduledReportMapper.toResponse(scheduledReport);
    }

    /**
     * Récupère tous les rapports planifiés.
     */
    @Transactional(readOnly = true)
    public List<ScheduledReportResponse> getAllScheduledReports() {
        log.debug("Récupération de tous les rapports planifiés");
        return scheduledReportMapper.toResponseList(scheduledReportRepository.findAll());
    }

    /**
     * Récupère tous les rapports planifiés actifs.
     */
    @Transactional(readOnly = true)
    public List<ScheduledReportResponse> getActiveScheduledReports() {
        log.debug("Récupération des rapports planifiés actifs");
        return scheduledReportMapper.toResponseList(scheduledReportRepository.findByActifTrue());
    }

    /**
     * Récupère les rapports planifiés pour une école.
     */
    @Transactional(readOnly = true)
    public List<ScheduledReportResponse> getScheduledReportsByEcoleId(UUID ecoleId) {
        log.debug("Récupération des rapports planifiés pour l'école: id={}", ecoleId);
        return scheduledReportMapper.toResponseList(scheduledReportRepository.findByEcoleId(ecoleId));
    }

    /**
     * Active ou désactive un rapport planifié.
     */
    @Transactional
    public ScheduledReportResponse toggleScheduledReport(UUID id, Boolean actif) {
        log.info("Modification du statut du rapport planifié: id={}, actif={}", id, actif);
        ScheduledReport scheduledReport = scheduledReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rapport planifié non trouvé avec l'id: " + id));

        scheduledReport.setActif(actif);

        // Si activé, recalculer la prochaine exécution
        if (actif) {
            LocalDateTime nextExecution = calculateNextExecution(scheduledReport.getCronExpression());
            scheduledReport.setProchaineExecution(nextExecution);
            log.info("Rapport planifié réactivé, prochaine exécution: {}", nextExecution);
        }

        ScheduledReport updated = scheduledReportRepository.save(scheduledReport);
        return scheduledReportMapper.toResponse(updated);
    }

    /**
     * Supprime un rapport planifié.
     */
    @Transactional
    public void deleteScheduledReport(UUID id) {
        log.info("Suppression du rapport planifié: id={}", id);
        if (!scheduledReportRepository.existsById(id)) {
            throw new ResourceNotFoundException("Rapport planifié non trouvé avec l'id: " + id);
        }
        scheduledReportRepository.deleteById(id);
        log.info("Rapport planifié supprimé avec succès: id={}", id);
    }

    /**
     * Tâche planifiée exécutée toutes les 5 minutes pour vérifier et exécuter les rapports dus.
     */
    @Scheduled(cron = "0 */5 * * * ?")
    @Transactional
    public void executeScheduledReports() {
        log.debug("Vérification des rapports planifiés à exécuter...");

        LocalDateTime now = LocalDateTime.now();
        List<ScheduledReport> activeReports = scheduledReportRepository.findByActifTrue();

        long executedCount = 0;
        for (ScheduledReport scheduledReport : activeReports) {
            // Vérifier si le rapport doit être exécuté
            if (scheduledReport.getProchaineExecution() != null &&
                scheduledReport.getProchaineExecution().isBefore(now)) {

                try {
                    executeReport(scheduledReport);
                    executedCount++;
                } catch (Exception e) {
                    log.error("Erreur lors de l'exécution du rapport planifié: id={}, erreur={}",
                            scheduledReport.getId(), e.getMessage(), e);
                }
            }
        }

        if (executedCount > 0) {
            log.info("Exécution automatique terminée: {} rapport(s) exécuté(s)", executedCount);
        }
    }

    /**
     * Exécute un rapport planifié individuellement.
     */
    @Transactional
    public void executeReport(ScheduledReport scheduledReport) {
        log.info("Exécution du rapport planifié: id={}, type={}", scheduledReport.getId(), scheduledReport.getTypeRapport());

        try {
            // 1. Générer le rapport
            GenerateReportRequest generateRequest = buildGenerateRequest(scheduledReport);
            RapportResponse rapportResponse = reportService.generateReport(
                    generateRequest,
                    scheduledReport.getUtilisateurCreateur()
            );

            // 2. Générer le fichier
            String filePath = fileGenerationService.generateFile(rapportResponse.getId());
            log.info("Fichier de rapport généré: path={}", filePath);

            // 3. Envoyer par email aux destinataires
            sendReportByEmail(scheduledReport, rapportResponse, filePath);

            // 4. Mettre à jour les métadonnées de la planification
            scheduledReport.setDerniereExecution(LocalDateTime.now());
            scheduledReport.setNombreExecutions(scheduledReport.getNombreExecutions() + 1);
            scheduledReport.setProchaineExecution(calculateNextExecution(scheduledReport.getCronExpression()));
            scheduledReportRepository.save(scheduledReport);

            log.info("Rapport planifié exécuté avec succès: id={}, prochaine exécution={}",
                    scheduledReport.getId(), scheduledReport.getProchaineExecution());

        } catch (Exception e) {
            log.error("Erreur lors de l'exécution du rapport planifié: id={}", scheduledReport.getId(), e);
            throw new RuntimeException("Erreur lors de l'exécution du rapport planifié: " + e.getMessage(), e);
        }
    }

    /**
     * Construit une GenerateReportRequest à partir d'un ScheduledReport.
     */
    private GenerateReportRequest buildGenerateRequest(ScheduledReport scheduledReport) {
        GenerateReportRequest request = new GenerateReportRequest();
        request.setTypeRapport(scheduledReport.getTypeRapport());
        request.setTitre(scheduledReport.getTitre());
        request.setDescription(scheduledReport.getDescription());
        request.setEcoleId(scheduledReport.getEcoleId());
        request.setFormat(scheduledReport.getFormat());
        request.setParametresRapport(scheduledReport.getParametresRapport());
        return request;
    }

    /**
     * Envoie le rapport généré par email aux destinataires.
     */
    private void sendReportByEmail(ScheduledReport scheduledReport, RapportResponse rapport, String filePath) {
        log.info("Envoi du rapport par email: destinataires={}", scheduledReport.getDestinatairesEmail());

        try {
            SendEmailRequest emailRequest = SendEmailRequest.builder()
                    .destinataires(scheduledReport.getDestinatairesAsList())
                    .sujet(String.format("Rapport automatique: %s", scheduledReport.getTitre()))
                    .corps(buildEmailBody(scheduledReport, rapport))
                    .isHtml(true)
                    .attachments(List.of(filePath))
                    .priority("NORMAL")
                    .build();

            notificationServiceClient.sendBulkEmails(emailRequest);
            log.info("Email envoyé avec succès aux destinataires");

        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email: {}", e.getMessage(), e);
            // Ne pas propager l'exception pour ne pas bloquer l'exécution du rapport
        }
    }

    /**
     * Construit le corps de l'email.
     */
    private String buildEmailBody(ScheduledReport scheduledReport, RapportResponse rapport) {
        return String.format("""
                <html>
                <body>
                    <h2>Rapport automatique: %s</h2>
                    <p><strong>Type:</strong> %s</p>
                    <p><strong>Date de génération:</strong> %s</p>
                    <p><strong>Description:</strong> %s</p>
                    <p>Ce rapport a été généré automatiquement selon la planification définie.</p>
                    <p>Vous trouverez le rapport en pièce jointe.</p>
                    <hr>
                    <p><em>Timely - Système de gestion des emplois du temps IUSJC</em></p>
                </body>
                </html>
                """,
                scheduledReport.getTitre(),
                scheduledReport.getTypeRapport(),
                LocalDateTime.now(),
                scheduledReport.getDescription() != null ? scheduledReport.getDescription() : "N/A"
        );
    }

    /**
     * Calcule la prochaine exécution basée sur l'expression cron.
     */
    private LocalDateTime calculateNextExecution(String cronExpression) {
        try {
            CronExpression cron = CronExpression.parse(cronExpression);
            ZonedDateTime now = ZonedDateTime.now(ZoneId.of(TIMEZONE));
            ZonedDateTime next = cron.next(now);

            if (next == null) {
                throw new IllegalArgumentException("Expression cron invalide, aucune prochaine exécution trouvée");
            }

            return next.toLocalDateTime();
        } catch (Exception e) {
            log.error("Erreur lors du calcul de la prochaine exécution: cron={}", cronExpression, e);
            throw new IllegalArgumentException("Expression cron invalide: " + e.getMessage(), e);
        }
    }

    /**
     * Valide une expression cron.
     */
    private void validateCronExpression(String cronExpression) {
        try {
            CronExpression.parse(cronExpression);
        } catch (Exception e) {
            throw new IllegalArgumentException("Expression cron invalide: " + e.getMessage(), e);
        }
    }
}
