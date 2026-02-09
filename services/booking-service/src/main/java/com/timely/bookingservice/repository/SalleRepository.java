package com.timely.bookingservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.timely.bookingservice.entity.Salle;
import com.timely.bookingservice.entity.enums.StatutSalle;
import com.timely.bookingservice.entity.enums.TypeSalle;

public interface SalleRepository extends JpaRepository<Salle, UUID> {

    List<Salle> findByEcoleId(UUID ecoleId);

    List<Salle> findByStatut(StatutSalle statut);

    List<Salle> findByEcoleIdAndStatut(UUID ecoleId, StatutSalle statut);

    @Query("SELECT s FROM Salle s WHERE s.statut = 'ACTIVE' AND s.capacite >= :capaciteMin AND (:typeSalle IS NULL OR s.typeSalle = :typeSalle)")
    List<Salle> findSallesDisponibles(@Param("capaciteMin") Integer capaciteMin, @Param("typeSalle") TypeSalle typeSalle);
}
