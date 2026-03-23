package com.timely.planningservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.timely.planningservice.entity.Conflit;
import com.timely.planningservice.entity.enums.Severite;
import com.timely.planningservice.entity.enums.StatutResolution;
import com.timely.planningservice.entity.enums.TypeConflit;

@Repository
public interface ConflitRepository extends JpaRepository<Conflit, UUID> {

    List<Conflit> findByEmploiDuTempsId(UUID emploiDuTempsId);

    List<Conflit> findByStatutResolution(StatutResolution statutResolution);

    List<Conflit> findBySeverite(Severite severite);

    List<Conflit> findByTypeConflit(TypeConflit typeConflit);

    @Query("SELECT c FROM Conflit c WHERE c.emploiDuTemps.id = :emploiId " +
           "AND c.statutResolution = :statut")
    List<Conflit> findByEmploiIdAndStatut(
            @Param("emploiId") UUID emploiId,
            @Param("statut") StatutResolution statut
    );

    @Query("SELECT c FROM Conflit c WHERE c.emploiDuTemps.id = :emploiId " +
           "AND c.severite IN ('CRITIQUE', 'MAJEURE')")
    List<Conflit> findCriticalConflitsByEmploiId(@Param("emploiId") UUID emploiId);

    @Query("SELECT COUNT(c) FROM Conflit c WHERE c.emploiDuTemps.id = :emploiId " +
           "AND c.statutResolution = 'NON_RESOLU'")
    long countNonResolusParEmploi(@Param("emploiId") UUID emploiId);
}
