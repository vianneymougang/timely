package com.timely.agora_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@FeignClient(name = "planning-service")
public interface PlanningServiceClient {

    @GetMapping("/api/planning/plannings/{id}")
    Object getEmploiDuTemps(@PathVariable UUID id);

    @GetMapping("/api/planning/plannings")
    List<Object> getAllEmploisDuTemps();

    @GetMapping("/api/planning/plannings/search")
    List<Object> searchEmplois(
            @RequestParam(required = false) UUID ecoleId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) String statut
    );

    @GetMapping("/api/planning/plannings/{emploiId}/creneaux")
    List<Object> getCreneauxByEmploi(@PathVariable UUID emploiId);
}
