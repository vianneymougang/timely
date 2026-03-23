package com.timely.notificationservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationQueueService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final NotificationService notificationService;

    private static final String PENDING_QUEUE = "notifications:pending";
    private static final String RETRY_QUEUE = "notifications:retry";
    private static final String FAILED_QUEUE = "notifications:failed";

    /**
     * Ajouter une notification à la file d'attente
     */
    public void enqueue(String notificationId) {
        try {
            redisTemplate.opsForList().leftPush(PENDING_QUEUE, notificationId);
            log.debug("Notification {} added to pending queue", notificationId);
        } catch (Exception e) {
            log.error("Failed to enqueue notification {}", notificationId, e);
        }
    }

    /**
     * Ajouter une notification à la file de retry avec délai exponentiel
     */
    public void enqueueForRetry(String notificationId, int attemptNumber) {
        try {
            // Calculer le délai exponentiel (2^attempt minutes)
            long delayMinutes = (long) Math.pow(2, attemptNumber);
            LocalDateTime retryTime = LocalDateTime.now().plusMinutes(delayMinutes);

            // Stocker avec timestamp de retry
            String key = RETRY_QUEUE + ":" + notificationId;
            redisTemplate.opsForValue().set(key, retryTime.toString(), delayMinutes, TimeUnit.MINUTES);

            log.info("Notification {} scheduled for retry in {} minutes (attempt {})",
                    notificationId, delayMinutes, attemptNumber);
        } catch (Exception e) {
            log.error("Failed to enqueue notification {} for retry", notificationId, e);
        }
    }

    /**
     * Marquer une notification comme échouée définitivement
     */
    public void markAsFailed(String notificationId) {
        try {
            redisTemplate.opsForSet().add(FAILED_QUEUE, notificationId);
            log.warn("Notification {} marked as permanently failed", notificationId);
        } catch (Exception e) {
            log.error("Failed to mark notification {} as failed", notificationId, e);
        }
    }

    /**
     * Traiter les notifications en attente (exécuté toutes les 10 secondes)
     */
    @Scheduled(fixedDelay = 10000)
    public void processPendingNotifications() {
        try {
            String notificationId = (String) redisTemplate.opsForList().rightPop(PENDING_QUEUE);

            if (notificationId != null) {
                log.debug("Processing pending notification: {}", notificationId);
                notificationService.sendNotificationAsync(notificationId);
            }
        } catch (Exception e) {
            log.error("Error processing pending notifications", e);
        }
    }

    /**
     * Traiter les retry (exécuté toutes les minutes)
     */
    @Scheduled(fixedDelay = 60000)
    public void processRetryQueue() {
        try {
            Set<String> keys = redisTemplate.keys(RETRY_QUEUE + ":*");

            if (keys != null) {
                for (String key : keys) {
                    String retryTimeStr = (String) redisTemplate.opsForValue().get(key);

                    if (retryTimeStr != null) {
                        LocalDateTime retryTime = LocalDateTime.parse(retryTimeStr);

                        if (LocalDateTime.now().isAfter(retryTime)) {
                            String notificationId = key.replace(RETRY_QUEUE + ":", "");
                            log.info("Retrying notification: {}", notificationId);

                            notificationService.sendNotificationAsync(notificationId);
                            redisTemplate.delete(key);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error processing retry queue", e);
        }
    }

    /**
     * Nettoyer les notifications échouées de plus de 7 jours
     */
    @Scheduled(cron = "0 0 2 * * ?") // Tous les jours à 2h du matin
    public void cleanupFailedNotifications() {
        try {
            Long failedCount = redisTemplate.opsForSet().size(FAILED_QUEUE);
            log.info("Cleanup: {} failed notifications in queue", failedCount);

            // TODO: Archiver ou supprimer les notifications échouées anciennes
        } catch (Exception e) {
            log.error("Error cleaning up failed notifications", e);
        }
    }

    /**
     * Obtenir les statistiques de la file d'attente
     */
    public QueueStats getQueueStats() {
        QueueStats stats = new QueueStats();

        try {
            stats.pendingCount = redisTemplate.opsForList().size(PENDING_QUEUE);
            stats.retryCount = redisTemplate.keys(RETRY_QUEUE + ":*").size();
            stats.failedCount = redisTemplate.opsForSet().size(FAILED_QUEUE);
        } catch (Exception e) {
            log.error("Error getting queue stats", e);
        }

        return stats;
    }

    public static class QueueStats {
        public Long pendingCount = 0L;
        public Integer retryCount = 0;
        public Long failedCount = 0L;
    }
}
