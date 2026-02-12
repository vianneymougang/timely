package com.timely.bookingservice.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.timely.bookingservice.entity.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    List<Reservation> findBySalleId(UUID salleId);

    Page<Reservation> findBySalleId(UUID salleId, Pageable pageable);

    List<Reservation> findByCoursId(UUID coursId);

    List<Reservation> findByEnseignantId(UUID enseignantId);

    @Query("SELECT r FROM Reservation r WHERE r.salle.id = :salleId " +
            "AND r.dateReservation = :date " +
            "AND r.statut <> 'ANNULEE' " +
            "AND r.heureDebut < :heureFin " +
            "AND r.heureFin > :heureDebut")
    List<Reservation> findChevauchements(
            @Param("salleId") UUID salleId,
            @Param("date") LocalDate date,
            @Param("heureDebut") LocalTime heureDebut,
            @Param("heureFin") LocalTime heureFin);

    @Query("SELECT r FROM Reservation r " +
           "LEFT JOIN FETCH r.salle " +
           "LEFT JOIN FETCH r.cours " +
           "WHERE r.dateReservation = :date")
    List<Reservation> findByDateWithRelations(@Param("date") LocalDate date);

    @Query("SELECT r FROM Reservation r " +
           "LEFT JOIN FETCH r.salle " +
           "LEFT JOIN FETCH r.cours " +
           "WHERE r.salle.id = :salleId " +
           "AND r.dateReservation BETWEEN :dateDebut AND :dateFin")
    List<Reservation> findBySalleAndDateRangeWithRelations(
            @Param("salleId") UUID salleId,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin);
}
