package com.timely.agoraservice.client;

import com.timely.agoraservice.dto.booking.CreateEtudiantRequest;
import com.timely.agoraservice.dto.booking.EtudiantResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.UUID;

/**
 * Client Feign pour communiquer avec le booking-service.
 */
@FeignClient(name = "booking-service", path = "/api/bookings")
public interface BookingServiceClient {

    /**
     * Crée un nouvel étudiant.
     */
    @PostMapping("/etudiants")
    EtudiantResponse createEtudiant(@RequestBody CreateEtudiantRequest request);

    /**
     * Met à jour un étudiant existant.
     */
    @PutMapping("/etudiants/{id}")
    EtudiantResponse updateEtudiant(@PathVariable("id") UUID id, @RequestBody CreateEtudiantRequest request);

    /**
     * Récupère un étudiant par son matricule.
     */
    @GetMapping("/etudiants/matricule/{matricule}")
    EtudiantResponse getEtudiantByMatricule(@PathVariable("matricule") String matricule);

    /**
     * Récupère tous les étudiants d'une classe.
     */
    @GetMapping("/etudiants/classe/{classeId}")
    List<EtudiantResponse> getEtudiantsByClasseId(@PathVariable("classeId") UUID classeId);

    /**
     * Vérifie si un étudiant existe par matricule.
     */
    @GetMapping("/etudiants/exists")
    Boolean existsByMatricule(@RequestParam("matricule") String matricule);
}
