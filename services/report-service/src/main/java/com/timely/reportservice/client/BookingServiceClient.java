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

    @GetMapping("/api/bookings/salles")
    List<Object> getSalles();

    @GetMapping("/api/bookings/salles/{id}")
    Object getSalle(@PathVariable UUID id);

    @GetMapping("/api/bookings/reservations")
    List<Object> getReservations(
            @RequestParam(required = false) UUID ecoleId,
            @RequestParam(required = false) LocalDate dateDebut,
            @RequestParam(required = false) LocalDate dateFin
    );

    @GetMapping("/api/bookings/cours")
    List<Object> getCours();

    @GetMapping("/api/bookings/etudiants")
    List<Object> getEtudiants();
}
