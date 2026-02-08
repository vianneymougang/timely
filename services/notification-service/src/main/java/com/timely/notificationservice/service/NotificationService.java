package com.timely.notificationservice.service;

import com.timely.notificationservice.document.HistoriqueEnvoi;
import com.timely.notificationservice.document.Notification;
import com.timely.notificationservice.document.enums.CanalNotification;
import com.timely.notificationservice.document.enums.StatutEnvoi;
import com.timely.notificationservice.document.enums.StatutNotification;
import com.timely.notificationservice.dto.request.ScheduleNotificationRequest;
import com.timely.notificationservice.dto.request.SendNotificationRequest;
import com.timely.notificationservice.dto.response.HistoriqueResponse;
import com.timely.notificationservice.dto.response.NotificationDetailsResponse;
import com.timely.notificationservice.dto.response.NotificationResponse;
import com.timely.notificationservice.exception.ResourceNotFoundException;
import com.timely.notificationservice.mapper.NotificationMapper;
import com.timely.notificationservice.repository.HistoriqueEnvoiRepository;
import com.timely.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final HistoriqueEnvoiRepository historiqueEnvoiRepository;
    private final NotificationMapper notificationMapper;
    private final EmailService emailService;
    private final SMSService smsService;
    private final PushNotificationService pushNotificationService;
    private final TemplateEngineService templateEngineService;

    private static final int MAX_TENTATIVES = 3;

    @Transactional
    public NotificationResponse sendNotification(SendNotificationRequest request) {
        log.info("Sending notification to user: {} via {}", request.getDestinataireId(), request.getCanal());

        Notification notification = notificationMapper.toEntity(request);
        notification.setStatut(StatutNotification.PENDING);
        notification.setDateCreation(LocalDateTime.now());
        notification.setTentativesRestantes(MAX_TENTATIVES);

        Notification savedNotification = notificationRepository.save(notification);

        // Envoyer immédiatement
        boolean success = sendViaCanal(savedNotification);

        if (success) {
            savedNotification.setStatut(StatutNotification.SENT);
            savedNotification.setDateEnvoi(LocalDateTime.now());
            log.info("Notification sent successfully with id: {}", savedNotification.getId());
        } else {
            savedNotification.setStatut(StatutNotification.FAILED);
            savedNotification.setTentativesRestantes(savedNotification.getTentativesRestantes() - 1);
            log.error("Failed to send notification with id: {}", savedNotification.getId());
        }

        savedNotification = notificationRepository.save(savedNotification);

        // Enregistrer dans l'historique
        enregistrerHistorique(savedNotification, success, null);

        return notificationMapper.toResponse(savedNotification);
    }

    @Transactional
    public List<NotificationResponse> sendBulkNotifications(List<SendNotificationRequest> requests) {
        log.info("Sending bulk notifications: {} notifications", requests.size());

        return requests.stream()
                .map(this::sendNotification)
                .collect(Collectors.toList());
    }

    @Async("notificationExecutor")
    public CompletableFuture<Boolean> sendNotificationAsync(String notificationId) {
        log.info("Sending notification asynchronously: {}", notificationId);

        try {
            Notification notification = notificationRepository.findById(notificationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Notification non trouvée avec l'id: " + notificationId));

            boolean success = sendViaCanal(notification);

            if (success) {
                notification.setStatut(StatutNotification.SENT);
                notification.setDateEnvoi(LocalDateTime.now());
                log.info("Async notification sent successfully: {}", notificationId);
            } else {
                notification.setStatut(StatutNotification.FAILED);
                notification.setTentativesRestantes(notification.getTentativesRestantes() - 1);
                log.error("Failed to send async notification: {}", notificationId);
            }

            notificationRepository.save(notification);
            enregistrerHistorique(notification, success, null);

            return CompletableFuture.completedFuture(success);
        } catch (Exception e) {
            log.error("Error in async notification sending: {}", e.getMessage(), e);
            return CompletableFuture.completedFuture(false);
        }
    }

    @Transactional
    public NotificationResponse scheduleNotification(ScheduleNotificationRequest request) {
        log.info("Scheduling notification for user: {} at {}",
                request.getDestinataireId(), request.getDateEnvoiPrevue());

        Notification notification = new Notification();
        notification.setDestinataireId(request.getDestinataireId());
        notification.setTypeNotification(request.getTypeNotification());
        notification.setSujet(request.getSujet());
        notification.setContenu(request.getContenu());
        notification.setCanal(request.getCanal());
        notification.setStatut(StatutNotification.PENDING);
        notification.setDateCreation(LocalDateTime.now());
        notification.setTentativesRestantes(MAX_TENTATIVES);

        Notification savedNotification = notificationRepository.save(notification);
        log.info("Notification scheduled successfully with id: {}", savedNotification.getId());

        return notificationMapper.toResponse(savedNotification);
    }

    @Transactional(readOnly = true)
    public NotificationResponse getNotificationStatus(String id) {
        log.debug("Fetching notification status with id: {}", id);
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification non trouvée avec l'id: " + id));
        return notificationMapper.toResponse(notification);
    }

    @Transactional(readOnly = true)
    public NotificationDetailsResponse getNotificationDetails(String id) {
        log.debug("Fetching notification details with id: {}", id);
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification non trouvée avec l'id: " + id));

        NotificationDetailsResponse details = new NotificationDetailsResponse();
        details.setId(notification.getId());
        details.setDestinataireId(notification.getDestinataireId());
        details.setTypeNotification(notification.getTypeNotification());
        details.setSujet(notification.getSujet());
        details.setContenu(notification.getContenu());
        details.setCanal(notification.getCanal());
        details.setStatut(notification.getStatut());
        details.setDateCreation(notification.getDateCreation());
        details.setDateEnvoi(notification.getDateEnvoi());
        details.setDateLecture(notification.getDateLecture());
        details.setTentativesRestantes(notification.getTentativesRestantes());

        // Récupérer l'historique
        List<HistoriqueEnvoi> historiques = historiqueEnvoiRepository.findByNotificationId(id);
        details.setHistorique(historiques.stream()
                .map(this::toHistoriqueResponse)
                .collect(Collectors.toList()));
        details.setNombreTentatives(historiques.size());

        // Récupérer le dernier message d'erreur s'il existe
        historiques.stream()
                .filter(h -> h.getMessageErreur() != null)
                .findFirst()
                .ifPresent(h -> details.setDernierMessageErreur(h.getMessageErreur()));

        return details;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsByUser(UUID userId) {
        log.debug("Fetching notifications for user: {}", userId);
        return notificationRepository.findByDestinataireId(userId).stream()
                .map(notificationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HistoriqueResponse> getHistorique(LocalDateTime dateDebut, LocalDateTime dateFin) {
        log.debug("Fetching historique between {} and {}", dateDebut, dateFin);
        List<HistoriqueEnvoi> historiques = historiqueEnvoiRepository
                .findByTimestampEnvoiBetween(dateDebut, dateFin);

        return historiques.stream()
                .map(this::toHistoriqueResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void retryFailedNotifications() {
        log.info("Retrying failed notifications");
        List<Notification> failedNotifications = notificationRepository
                .findByStatut(StatutNotification.FAILED);

        for (Notification notification : failedNotifications) {
            if (notification.getTentativesRestantes() > 0) {
                log.info("Retrying notification with id: {}", notification.getId());
                boolean success = sendViaCanal(notification);

                if (success) {
                    notification.setStatut(StatutNotification.SENT);
                    notification.setDateEnvoi(LocalDateTime.now());
                } else {
                    notification.setTentativesRestantes(notification.getTentativesRestantes() - 1);
                }

                notificationRepository.save(notification);
                enregistrerHistorique(notification, success, null);
            }
        }
    }

    private boolean sendViaCanal(Notification notification) {
        try {
            switch (notification.getCanal()) {
                case EMAIL:
                    return sendEmail(notification);
                case SMS:
                    return sendSMS(notification);
                case PUSH:
                    return sendPush(notification);
                default:
                    log.error("Unknown canal: {}", notification.getCanal());
                    return false;
            }
        } catch (Exception e) {
            log.error("Error sending notification via {}: {}", notification.getCanal(), e.getMessage(), e);
            return false;
        }
    }

    private boolean sendEmail(Notification notification) {
        try {
            // Utiliser le EmailService existant
            emailService.sendEmail(
                    notification.getDestinataireId().toString() + "@example.com",
                    notification.getSujet(),
                    notification.getContenu()
            );
            return true;
        } catch (Exception e) {
            log.error("Error sending email: {}", e.getMessage(), e);
            return false;
        }
    }

    private boolean sendSMS(Notification notification) {
        try {
            if (!smsService.isEnabled()) {
                log.warn("SMS service is disabled");
                return false;
            }

            // TODO: Récupérer le numéro de téléphone du destinataire depuis user-service
            String phoneNumber = "+1234567890"; // Placeholder

            return smsService.sendSMS(phoneNumber, notification.getContenu());
        } catch (Exception e) {
            log.error("Error sending SMS: {}", e.getMessage(), e);
            return false;
        }
    }

    private boolean sendPush(Notification notification) {
        try {
            if (!pushNotificationService.isEnabled()) {
                log.warn("Push notification service is disabled");
                return false;
            }

            // TODO: Récupérer le token FCM du destinataire depuis user-service
            String fcmToken = "placeholder-fcm-token"; // Placeholder

            return pushNotificationService.sendPushNotification(
                    fcmToken,
                    notification.getSujet(),
                    notification.getContenu()
            );
        } catch (Exception e) {
            log.error("Error sending push notification: {}", e.getMessage(), e);
            return false;
        }
    }

    private void enregistrerHistorique(Notification notification, boolean success, String messageErreur) {
        HistoriqueEnvoi historique = new HistoriqueEnvoi();
        historique.setNotificationId(notification.getId());
        historique.setUtilisateurId(notification.getDestinataireId());
        historique.setCanal(notification.getCanal());
        historique.setStatut(success ? StatutEnvoi.ENVOYE : StatutEnvoi.ECHOUE);
        historique.setTimestampEnvoi(LocalDateTime.now());
        historique.setMessageErreur(messageErreur);
        historique.setTentativeNumero(MAX_TENTATIVES - notification.getTentativesRestantes() + 1);

        historiqueEnvoiRepository.save(historique);
    }

    private HistoriqueResponse toHistoriqueResponse(HistoriqueEnvoi historique) {
        HistoriqueResponse response = new HistoriqueResponse();
        response.setId(historique.getId());
        response.setNotificationId(historique.getNotificationId());
        response.setUtilisateurId(historique.getUtilisateurId());
        response.setCanal(historique.getCanal());
        response.setStatut(historique.getStatut());
        response.setTimestampEnvoi(historique.getTimestampEnvoi());
        response.setTimestampLecture(historique.getTimestampLecture());
        response.setMessageErreur(historique.getMessageErreur());
        response.setTentativeNumero(historique.getTentativeNumero());
        return response;
    }
}
