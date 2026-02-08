package com.timely.planningservice.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.timely.planningservice.entity.EmploiDuTemps;
import com.timely.planningservice.entity.enums.StatutEmploi;

@Repository
public interface EmploiDuTempsRepository extends JpaRepository<EmploiDuTemps, UUID> {

    List<EmploiDuTemps> findByEcoleId(UUID ecoleId);

    List<EmploiDuTemps> findByStatut(StatutEmploi statut);

    @Query("SELECT e FROM EmploiDuTemps e WHERE e.ecoleId = :ecoleId " +
           "AND e.dateDebut >= :dateDebut AND e.dateFin <= :dateFin")
    List<EmploiDuTemps> findByEcoleIdAndDateRange(
            @Param("ecoleId") UUID ecoleId,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin
    );

    @Query("SELECT e FROM EmploiDuTemps e WHERE e.statut = :statut " +
           "AND e.dateDebut >= :dateDebut AND e.dateFin <= :dateFin")
    List<EmploiDuTemps> findByStatutAndDateRange(
            @Param("statut") StatutEmploi statut,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin
    );
}
