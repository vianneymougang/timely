package com.timely.notificationservice.listener;

import com.timely.notificationservice.config.RabbitMQConfig;
import com.timely.notificationservice.event.ConflitDetecteEvent;
import com.timely.notificationservice.event.EmploiDuTempsPublieEvent;
import com.timely.notificationservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PlanningEventListener {

    private final EmailService emailService;

    @RabbitListener(queues = RabbitMQConfig.PLANNING_PUBLISHED_QUEUE)
    public void handleEmploiDuTempsPublie(EmploiDuTempsPublieEvent event) {
        log.info("Received EmploiDuTempsPublie event for emploi: {}", event.getEmploiDuTempsId());

        try {
            String subject = "Nouvel emploi du temps publié";
            String body = String.format(
                    "Bonjour,\n\n" +
                            "Un nouvel emploi du temps a été publié.\n\n" +
                            "Période: %s\n" +
                            "Date de publication: %s\n" +
                            "Validé par: %s\n\n" +
                            "Cordialement,\n" +
                            "L'équipe Timely",
                    event.getPeriode(),
                    event.getDatePublication(),
                    event.getUtilisateurValidation()
            );

            // TODO: Récupérer les emails des utilisateurs concernés
            // Pour l'instant, on envoie à une adresse de test
            String toEmail = "admin@timely.com";

            emailService.sendEmail(toEmail, subject, body);

            log.info("Notification sent for emploi du temps: {}", event.getEmploiDuTempsId());
        } catch (Exception e) {
            log.error("Error sending notification for emploi du temps published event", e);
        }
    }

    @RabbitListener(queues = RabbitMQConfig.PLANNING_CONFLICT_QUEUE)
    public void handleConflitDetecte(ConflitDetecteEvent event) {
        log.info("Received ConflitDetecte event for conflit: {}", event.getConflitId());

        try {
            String subject = String.format("Conflit détecté - Sévérité: %s", event.getSeverite());
            String body = String.format(
                    "Bonjour,\n\n" +
                            "Un conflit a été détecté dans l'emploi du temps.\n\n" +
                            "Type de conflit: %s\n" +
                            "Sévérité: %s\n" +
                            "Description: %s\n" +
                            "Date de détection: %s\n\n" +
                            "Veuillez consulter le système pour plus de détails et résoudre ce conflit.\n\n" +
                            "Cordialement,\n" +
                            "L'équipe Timely",
                    event.getTypeConflit(),
                    event.getSeverite(),
                    event.getDescription(),
                    event.getDateDetection()
            );

            // Envoyer uniquement aux admins
            String toEmail = "admin@timely.com";

            emailService.sendEmail(toEmail, subject, body);

            log.info("Conflict notification sent for conflit: {}", event.getConflitId());
        } catch (Exception e) {
            log.error("Error sending notification for conflict detected event", e);
        }
    }
}
