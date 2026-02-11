package com.timely.reportservice.repository;

import com.timely.reportservice.entity.ScheduledReport;
import com.timely.reportservice.entity.enums.TypeRapport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScheduledReportRepository extends JpaRepository<ScheduledReport, UUID> {

    /**
     * Trouve tous les rapports planifiés actifs.
     */
    List<ScheduledReport> findByActifTrue();

    /**
     * Trouve tous les rapports planifiés pour une école donnée.
     */
    List<ScheduledReport> findByEcoleId(UUID ecoleId);

    /**
     * Trouve tous les rapports planifiés par type.
     */
    List<ScheduledReport> findByTypeRapport(TypeRapport typeRapport);

    /**
     * Trouve tous les rapports planifiés par utilisateur créateur.
     */
    List<ScheduledReport> findByUtilisateurCreateur(String utilisateurCreateur);

    /**
     * Trouve tous les rapports planifiés actifs pour une école donnée.
     */
    List<ScheduledReport> findByEcoleIdAndActifTrue(UUID ecoleId);
}
