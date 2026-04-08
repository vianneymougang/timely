package com.timely.reportservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@FeignClient(name = "booking-service")
public interface BookingServiceClient {

    @GetMapping("/internal/salles")
    List<Object> getSalles();

    @GetMapping("/internal/salles/{id}")
    Object getSalle(@PathVariable UUID id);

    @GetMapping("/internal/reservations")
    List<Object> getReservations(
            @RequestParam(required = false) LocalDate dateDebut,
            @RequestParam(required = false) LocalDate dateFin
    );

    @GetMapping("/internal/cours")
    List<Object> getCours();

    @GetMapping("/internal/etudiants")
    List<Object> getEtudiants();
}