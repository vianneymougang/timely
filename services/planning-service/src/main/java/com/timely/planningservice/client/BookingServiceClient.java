package com.timely.planningservice.client;

import java.util.List;
import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "booking-service", path = "/internal")
public interface BookingServiceClient {

    @GetMapping("/cours/{id}")
    CoursDTO getCours(@PathVariable("id") UUID id);

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
}
