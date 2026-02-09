package com.timely.bookingservice.dto.request;

import com.timely.bookingservice.entity.enums.TypeCours;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

/**
 * Request DTO for automatic room assignment.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AutoAssignSalleRequest {

    @NotNull(message = "École ID is required")
    private UUID ecoleId;

    @NotNull(message = "Type de cours is required")
    private TypeCours typeCours;

    @NotNull(message = "Capacité requise is required")
    private Integer capaciteRequise;

    @NotNull(message = "Date de réservation is required")
    private LocalDate dateReservation;

    @NotNull(message = "Heure début is required")
    private LocalTime heureDebut;

    @NotNull(message = "Heure fin is required")
    private LocalTime heureFin;

    /**
     * Optional list of required equipment IDs.
     */
    private List<UUID> equipementIds;
}
