package com.timely.agora_service.repository;

import com.timely.agora_service.entity.ExportAgora;
import com.timely.agora_service.entity.enums.StatutExportAgora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExportAgoraRepository extends JpaRepository<ExportAgora, UUID> {

    List<ExportAgora> findByStatut(StatutExportAgora statut);

    List<ExportAgora> findByEmploiDuTempsId(UUID emploiDuTempsId);

    List<ExportAgora> findByDateExportBetween(LocalDateTime debut, LocalDateTime fin);

    List<ExportAgora> findByStatutAndDateExportBetween(StatutExportAgora statut, LocalDateTime debut, LocalDateTime fin);

    Optional<ExportAgora> findFirstByEmploiDuTempsIdOrderByDateExportDesc(UUID emploiDuTempsId);

    List<ExportAgora> findByStatutAndNumeroTentativeLessThan(StatutExportAgora statut, Integer numeroTentative);
}
