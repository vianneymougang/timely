package com.timely.userservice.controller;

import java.time.DayOfWeek;
import java.time.LocalDate;
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
import com.timely.userservice.exception.ResourceNotFoundException;
import com.timely.userservice.model.Teacher;
import com.timely.userservice.model.User;
import com.timely.userservice.repository.UserRepository;
import com.timely.userservice.service.AvailabilityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
public class InternalAvailabilityController {

    private final AvailabilityService availabilityService;
    private final UserRepository userRepository;

    @GetMapping("/disponibilites/enseignant/{enseignantId}")
    public ResponseEntity<List<DisponibiliteDTO>> getDisponibilites(@PathVariable UUID enseignantId) {
        List<AvailabilitySlotDto> slots = availabilityService.getAvailabilityByTeacherId(enseignantId);
        List<DisponibiliteDTO> dtos = slots.stream()
                .map(slot -> new DisponibiliteDTO(
                        slot.getId(),
                        slot.getTeacherId(),
                        slot.getDayOfWeek() != null ? slot.getDayOfWeek().name() : null,
                        slot.getStartTime() != null ? slot.getStartTime().toString() : null,
                        slot.getEndTime() != null ? slot.getEndTime().toString() : null,
                        true
                ))
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/disponibilites/effective")
    public ResponseEntity<List<DisponibiliteDTO>> getEffectiveDisponibilites(
            @RequestParam UUID enseignantId,
            @RequestParam String weekStart) {
        LocalDate week = LocalDate.parse(weekStart);
        List<AvailabilitySlotDto> slots = availabilityService.getEffectiveAvailability(enseignantId, week);
        List<DisponibiliteDTO> dtos = slots.stream()
                .map(slot -> new DisponibiliteDTO(
                        slot.getId(),
                        slot.getTeacherId(),
                        slot.getDayOfWeek() != null ? slot.getDayOfWeek().name() : null,
                        slot.getStartTime() != null ? slot.getStartTime().toString() : null,
                        slot.getEndTime() != null ? slot.getEndTime().toString() : null,
                        true
                ))
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/disponibilites/check")
    public ResponseEntity<Boolean> checkDisponibilite(
            @RequestParam UUID enseignantId,
            @RequestParam String jourSemaine,
            @RequestParam String heureDebut,
            @RequestParam String heureFin) {

        LocalTime startTime = LocalTime.parse(heureDebut);
        LocalTime endTime = LocalTime.parse(heureFin);

        DayOfWeek requestedDay = DayOfWeek.valueOf(jourSemaine.toUpperCase());

        List<AvailabilitySlotDto> availabilities = availabilityService.getAvailabilityByTeacherId(enseignantId);

        boolean isAvailable = availabilities.stream()
                .anyMatch(slot ->
                    slot.getDayOfWeek().equals(requestedDay) &&
                    !slot.getStartTime().isAfter(startTime) &&
                    !slot.getEndTime().isBefore(endTime)
                );

        return ResponseEntity.ok(isAvailable);
    }

    @GetMapping("/enseignants/{id}")
    public ResponseEntity<EnseignantDTO> getEnseignant(@PathVariable UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found: " + id));

        Teacher teacher = user instanceof Teacher t ? t : null;

        EnseignantDTO dto = new EnseignantDTO(
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.getEmail(),
                teacher != null ? teacher.getRank() : null,
                teacher != null ? teacher.getGrade() : null
        );
        return ResponseEntity.ok(dto);
    }

    public record EnseignantDTO(
            UUID id,
            String nom,
            String prenom,
            String email,
            String specialite,
            String grade
    ) {}

    public record DisponibiliteDTO(
            UUID id,
            UUID enseignantId,
            String jourSemaine,
            String heureDebut,
            String heureFin,
            boolean estDisponible
    ) {}
}
