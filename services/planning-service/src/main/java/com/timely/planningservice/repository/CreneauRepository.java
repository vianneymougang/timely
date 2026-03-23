package com.timely.planningservice.repository;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.timely.planningservice.entity.Creneau;

@Repository
public interface CreneauRepository extends JpaRepository<Creneau, UUID> {

    List<Creneau> findByEmploiDuTempsId(UUID emploiDuTempsId);

    Page<Creneau> findByEmploiDuTempsId(UUID emploiDuTempsId, Pageable pageable);

    List<Creneau> findByEnseignantId(UUID enseignantId);

    List<Creneau> findBySalleId(UUID salleId);

    List<Creneau> findByGroupeId(UUID groupeId);

    List<Creneau> findByCoursId(UUID coursId);

    @Query("SELECT c FROM Creneau c WHERE c.jourSemaine = :jourSemaine " +
           "AND c.emploiDuTemps.id = :emploiId")
    List<Creneau> findByJourSemaineAndEmploiId(
            @Param("jourSemaine") DayOfWeek jourSemaine,
            @Param("emploiId") UUID emploiId
    );

    @Query("SELECT c FROM Creneau c WHERE c.enseignantId = :enseignantId " +
           "AND c.jourSemaine = :jourSemaine " +
           "AND c.statutCreneau = 'ACTIF'")
    List<Creneau> findActiveCreneauxByEnseignantAndJour(
            @Param("enseignantId") UUID enseignantId,
            @Param("jourSemaine") DayOfWeek jourSemaine
    );

    @Query("SELECT c FROM Creneau c WHERE c.salleId = :salleId " +
           "AND c.jourSemaine = :jourSemaine " +
           "AND c.statutCreneau = 'ACTIF'")
    List<Creneau> findActiveCreneauxBySalleAndJour(
            @Param("salleId") UUID salleId,
            @Param("jourSemaine") DayOfWeek jourSemaine
    );

    @Query("SELECT c FROM Creneau c " +
           "LEFT JOIN FETCH c.emploiDuTemps " +
           "WHERE c.emploiDuTemps.id = :emploiId")
    List<Creneau> findByEmploiDuTempsIdWithRelations(@Param("emploiId") UUID emploiId);

    @Query("SELECT c FROM Creneau c " +
           "LEFT JOIN FETCH c.emploiDuTemps " +
           "WHERE c.jourSemaine = :jour " +
           "AND c.heureDebut >= :heureDebut " +
           "AND c.heureFin <= :heureFin")
    List<Creneau> findByJourAndHeuresWithRelations(
            @Param("jour") DayOfWeek jour,
            @Param("heureDebut") LocalTime heureDebut,
            @Param("heureFin") LocalTime heureFin);
}
