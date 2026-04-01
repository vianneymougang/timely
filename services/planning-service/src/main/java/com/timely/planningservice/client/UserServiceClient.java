package com.timely.planningservice.client;

import java.util.List;
import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service", path = "/internal")
public interface UserServiceClient {

    @GetMapping("/enseignants/{id}")
    EnseignantDTO getEnseignant(@PathVariable("id") UUID id);

    @GetMapping("/disponibilites/enseignant/{enseignantId}")
    List<DisponibiliteDTO> getDisponibilites(@PathVariable("enseignantId") UUID enseignantId);

    @GetMapping("/disponibilites/effective")
    List<DisponibiliteDTO> getEffectiveDisponibilites(
            @RequestParam UUID enseignantId,
            @RequestParam String weekStart
    );

    @GetMapping("/disponibilites/check")
    boolean checkDisponibilite(
            @RequestParam UUID enseignantId,
            @RequestParam String jourSemaine,
            @RequestParam String heureDebut,
            @RequestParam String heureFin
    );

    record EnseignantDTO(
            UUID id,
            String nom,
            String prenom,
            String email,
            String specialite,
            String grade
    ) {}

    record DisponibiliteDTO(
            UUID id,
            UUID enseignantId,
            String jourSemaine,
            String heureDebut,
            String heureFin,
            boolean estDisponible
    ) {}
}
