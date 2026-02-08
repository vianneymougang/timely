package com.timely.notificationservice.repository;

import com.timely.notificationservice.document.HistoriqueEnvoi;
import com.timely.notificationservice.document.enums.StatutEnvoi;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface HistoriqueEnvoiRepository extends MongoRepository<HistoriqueEnvoi, String> {

    List<HistoriqueEnvoi> findByNotificationId(String notificationId);

    List<HistoriqueEnvoi> findByUtilisateurId(UUID utilisateurId);

    List<HistoriqueEnvoi> findByStatut(StatutEnvoi statut);

    List<HistoriqueEnvoi> findByTimestampEnvoiBetween(LocalDateTime debut, LocalDateTime fin);
}
