package com.timely.reportservice.client;

import com.timely.reportservice.dto.client.CoursDTO;
import com.timely.reportservice.dto.client.ReservationDTO;
import com.timely.reportservice.dto.client.SalleDTO;
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
    List<SalleDTO> getSalles();

    @GetMapping("/internal/salles/{id}")
    SalleDTO getSalle(@PathVariable UUID id);

    @GetMapping("/internal/reservations")
    List<ReservationDTO> getReservations(
            @RequestParam(required = false) LocalDate dateDebut,
            @RequestParam(required = false) LocalDate dateFin
    );

    @GetMapping("/internal/cours")
    List<CoursDTO> getCours();

    @GetMapping("/internal/etudiants")
    List<Object> getEtudiants();
}
