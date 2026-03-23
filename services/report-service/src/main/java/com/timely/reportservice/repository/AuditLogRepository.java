package com.timely.reportservice.repository;

import com.timely.reportservice.entity.AuditLog;
import com.timely.reportservice.entity.enums.AuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    /**
     * Trouve tous les logs d'audit pour une entité donnée.
     */
    List<AuditLog> findByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, UUID entityId);

    /**
     * Trouve tous les logs d'audit par type d'action.
     */
    Page<AuditLog> findByActionTypeOrderByTimestampDesc(AuditAction actionType, Pageable pageable);

    /**
     * Trouve tous les logs d'audit pour un utilisateur.
     */
    Page<AuditLog> findByUtilisateurOrderByTimestampDesc(String utilisateur, Pageable pageable);

    /**
     * Trouve tous les logs d'audit pour un type d'entité.
     */
    Page<AuditLog> findByEntityTypeOrderByTimestampDesc(String entityType, Pageable pageable);

    /**
     * Trouve tous les logs d'audit dans une période donnée.
     */
    @Query("SELECT a FROM AuditLog a WHERE a.timestamp BETWEEN :startDate AND :endDate ORDER BY a.timestamp DESC")
    Page<AuditLog> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    /**
     * Trouve tous les logs d'audit pour un service source.
     */
    Page<AuditLog> findBySourceServiceOrderByTimestampDesc(String sourceService, Pageable pageable);

    /**
     * Compte le nombre d'actions par type pour une période donnée.
     */
    @Query("SELECT a.actionType, COUNT(a) FROM AuditLog a WHERE a.timestamp BETWEEN :startDate AND :endDate GROUP BY a.actionType")
    List<Object[]> countActionsByTypeBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Trouve les derniers logs d'audit (pour dashboard).
     */
    List<AuditLog> findTop10ByOrderByTimestampDesc();
}
