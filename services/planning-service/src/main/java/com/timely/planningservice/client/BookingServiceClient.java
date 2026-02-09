package com.timely.planningservice.client;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "booking-service", path = "/internal")
public interface BookingServiceClient {

    @GetMapping("/cours/{id}")
    CoursDTO getCours(@PathVariable("id") UUID id);

    @GetMapping("/cours/ecole/{ecoleId}")
    List<CoursDTO> getCoursByEcole(@PathVariable UUID ecoleId);

    @GetMapping("/salles/{id}")
    SalleDTO getSalle(@PathVariable("id") UUID id);

    @GetMapping("/reservations/{id}")
    ReservationDTO getReservation(@PathVariable("id") UUID id);

    @GetMapping("/reservations/search")
    List<ReservationDTO> getReservationsByFilters(
            @RequestParam(required = false) UUID salleId,
            @RequestParam(required = false) UUID coursId,
            @RequestParam(required = false) String dateDebut,
            @RequestParam(required = false) String dateFin
    );

    @GetMapping("/salles/disponibles")
    List<SalleDTO> getSallesDisponibles(
            @RequestParam String heureDebut,
            @RequestParam String heureFin,
            @RequestParam String jourSemaine
    );

    @PostMapping("/reservations")
    ReservationDTO createReservation(@RequestBody CreateReservationRequest request);

    @GetMapping("/groupes/cours/{coursId}")
    List<GroupeDTO> getGroupesByCours(@PathVariable UUID coursId);

    @PostMapping("/reservations/auto-assign")
    SalleDTO autoAssignSalle(@RequestBody AutoAssignSalleRequest request);

    record CoursDTO(
            UUID id,
            String intitule,
            String typeCours,
            Integer volumeHoraire,
            Integer effectifGroupe,
            UUID ueId,
            UUID classeId,
            UUID enseignantId
    ) {}

    record SalleDTO(
            UUID id,
            String numero,
            String nom,
            String typeSalle,
            Integer capacite,
            UUID ecoleId
    ) {}

    record ReservationDTO(
            UUID id,
            String dateReservation,
            String heureDebut,
            String heureFin,
            String jourSemaine,
            String recurrence,
            String statut,
            UUID coursId,
            UUID salleId,
            UUID groupeEtudiantId,
            UUID enseignantId
    ) {}

    record GroupeDTO(
            UUID id,
            Integer numeroGroupe,
            Integer effectif
    ) {}

    record CreateReservationRequest(
            LocalDate dateReservation,
            LocalTime heureDebut,
            LocalTime heureFin,
            DayOfWeek jourSemaine,
            String recurrence,
            UUID coursId,
            UUID salleId,
            UUID groupeEtudiantId,
            UUID enseignantId
    ) {}

    record AutoAssignSalleRequest(
            UUID ecoleId,
            String typeCours,
            Integer capaciteRequise,
            LocalDate dateReservation,
            LocalTime heureDebut,
            LocalTime heureFin,
            List<UUID> equipementIds
    ) {}
}
