package com.timely.userservice.controller;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timely.userservice.dto.AvailabilitySlotDto;
import com.timely.userservice.service.AvailabilityService;

import lombok.RequiredArgsConstructor;

/**
 * Internal REST controller for teacher and availability inter-service communication.
 * No security constraints - should only be called by other microservices.
 * NOT exposed via API Gateway.
 */
@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
public class InternalAvailabilityController {

    private final AvailabilityService availabilityService;

    /**
     * Get all availability slots for a teacher
     */
    @GetMapping("/disponibilites/enseignant/{enseignantId}")
    public ResponseEntity<List<AvailabilitySlotDto>> getDisponibilites(@PathVariable UUID enseignantId) {
        List<AvailabilitySlotDto> slots = availabilityService.getAvailabilityByTeacherId(enseignantId);
        return ResponseEntity.ok(slots);
    }

    /**
     * Check if a teacher is available at a specific time
     */
    @GetMapping("/disponibilites/check")
    public ResponseEntity<Boolean> checkDisponibilite(
            @RequestParam UUID enseignantId,
            @RequestParam String jourSemaine,
            @RequestParam String heureDebut,
            @RequestParam String heureFin) {

        LocalTime startTime = LocalTime.parse(heureDebut);
        LocalTime endTime = LocalTime.parse(heureFin);

        // Get all availabilities for the teacher
        List<AvailabilitySlotDto> availabilities = availabilityService.getAvailabilityByTeacherId(enseignantId);

        // Convert French day name to DayOfWeek enum
        DayOfWeek requestedDay = convertFrenchDayToDayOfWeek(jourSemaine);

        // Check if any slot matches the requested time
        // A slot is available if it covers the entire requested time range
        boolean isAvailable = availabilities.stream()
                .anyMatch(slot ->
                    slot.getDayOfWeek().equals(requestedDay) &&
                    !slot.getStartTime().isAfter(startTime) &&
                    !slot.getEndTime().isBefore(endTime)
                );

        return ResponseEntity.ok(isAvailable);
    }

    /**
     * Get teacher info (simplified - returns basic info)
     */
    @GetMapping("/enseignants/{id}")
    public ResponseEntity<EnseignantDTO> getEnseignant(@PathVariable UUID id) {
        // This is a placeholder - in a real system, you'd have a proper teacher service
        // For now, return a simple DTO
        EnseignantDTO dto = new EnseignantDTO(
            id,
            "Unknown",  // nom - would be fetched from User service
            "Teacher",  // prenom
            "teacher@example.com",  // email
            "General",  // specialite
            "Assistant"  // grade
        );
        return ResponseEntity.ok(dto);
    }

    /**
     * Simple DTO for teacher information (matches planning-service expectations)
     */
    public record EnseignantDTO(
        UUID id,
        String nom,
        String prenom,
        String email,
        String specialite,
        String grade
    ) {}

    /**
     * Simple DTO for availability (matches planning-service expectations)
     */
    public record DisponibiliteDTO(
        UUID id,
        UUID enseignantId,
        String jourSemaine,
        String heureDebut,
        String heureFin,
        boolean estDisponible
    ) {}

    /**
     * Helper method to convert French day names to DayOfWeek enum
     */
    private DayOfWeek convertFrenchDayToDayOfWeek(String frenchDay) {
        return switch (frenchDay.toLowerCase()) {
            case "lundi" -> DayOfWeek.MONDAY;
            case "mardi" -> DayOfWeek.TUESDAY;
            case "mercredi" -> DayOfWeek.WEDNESDAY;
            case "jeudi" -> DayOfWeek.THURSDAY;
            case "vendredi" -> DayOfWeek.FRIDAY;
            case "samedi" -> DayOfWeek.SATURDAY;
            case "dimanche" -> DayOfWeek.SUNDAY;
            default -> throw new IllegalArgumentException("Invalid French day name: " + frenchDay);
        };
    }
}
