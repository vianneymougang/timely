package com.timely.notificationservice.repository;

import com.timely.notificationservice.document.Notification;
import com.timely.notificationservice.document.enums.StatutNotification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByDestinataireId(UUID destinataireId);

    List<Notification> findByStatut(StatutNotification statut);

    List<Notification> findByDestinataireIdAndStatut(UUID destinataireId, StatutNotification statut);
}
