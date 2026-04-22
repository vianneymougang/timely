package com.timely.reportservice.dto.client;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record ReservationDTO(
        UUID id,
        UUID salleId,
        UUID coursId,
        UUID enseignantId,
        LocalDate dateReservation,
        LocalTime heureDebut,
        LocalTime heureFin) {}
