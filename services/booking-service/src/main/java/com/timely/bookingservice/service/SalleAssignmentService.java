package com.timely.bookingservice.service;

import com.timely.bookingservice.dto.request.AutoAssignSalleRequest;
import com.timely.bookingservice.dto.response.SalleResponse;
import com.timely.bookingservice.entity.Equipement;
import com.timely.bookingservice.entity.Reservation;
import com.timely.bookingservice.entity.Salle;
import com.timely.bookingservice.entity.enums.StatutSalle;
import com.timely.bookingservice.entity.enums.TypeCours;
import com.timely.bookingservice.entity.enums.TypeSalle;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.SalleMapper;
import com.timely.bookingservice.repository.ReservationRepository;
import com.timely.bookingservice.repository.SalleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for automatic room assignment using progressive filtering algorithm.
 * Implements Algorithm 2 from the conception document.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SalleAssignmentService {

    private final SalleRepository salleRepository;
    private final ReservationRepository reservationRepository;
    private final SalleMapper salleMapper;

    /**
     * Find optimal room using progressive filtering algorithm:
     * 1. Filter by availability
     * 2. Filter by compatible room type
     * 3. Filter by capacity
     * 4. Filter by equipment
     * 5. Select room with closest capacity (minimize waste)
     */
    @Transactional(readOnly = true)
    public SalleResponse findOptimalSalle(AutoAssignSalleRequest request) {
        log.info("Starting automatic room assignment for school {} with type {} and capacity {}",
                request.getEcoleId(), request.getTypeCours(), request.getCapaciteRequise());

        // Step 1: Get all active rooms in the school
        List<Salle> candidateSalles = salleRepository.findByEcoleIdAndStatut(
                request.getEcoleId(),
                StatutSalle.ACTIVE
        );

        if (candidateSalles.isEmpty()) {
            throw new ResourceNotFoundException("No active rooms found for school " + request.getEcoleId());
        }

        log.debug("Found {} active rooms in school", candidateSalles.size());

        // Step 2: Filter by availability (no time conflicts)
        List<Salle> availableSalles = candidateSalles.stream()
                .filter(salle -> isAvailable(salle, request))
                .toList();

        if (availableSalles.isEmpty()) {
            throw new ResourceNotFoundException("No available rooms found for the requested time slot");
        }

        log.debug("Filtered to {} available rooms", availableSalles.size());

        // Step 3: Filter by compatible room type
        List<Salle> compatibleSalles = availableSalles.stream()
                .filter(salle -> isTypeCompatible(request.getTypeCours(), salle.getTypeSalle()))
                .toList();

        if (compatibleSalles.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No compatible rooms found for course type " + request.getTypeCours()
            );
        }

        log.debug("Filtered to {} compatible rooms", compatibleSalles.size());

        // Step 4: Filter by sufficient capacity
        List<Salle> capacitySalles = compatibleSalles.stream()
                .filter(salle -> salle.getCapacite() >= request.getCapaciteRequise())
                .toList();

        if (capacitySalles.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No rooms with sufficient capacity (" + request.getCapaciteRequise() + ") found"
            );
        }

        log.debug("Filtered to {} rooms with sufficient capacity", capacitySalles.size());

        // Step 5: Filter by equipment (if specified)
        List<Salle> equipmentSalles = capacitySalles;
        if (request.getEquipementIds() != null && !request.getEquipementIds().isEmpty()) {
            equipmentSalles = capacitySalles.stream()
                    .filter(salle -> hasRequiredEquipment(salle, request.getEquipementIds()))
                    .toList();

            if (equipmentSalles.isEmpty()) {
                throw new ResourceNotFoundException(
                        "No rooms found with required equipment"
                );
            }

            log.debug("Filtered to {} rooms with required equipment", equipmentSalles.size());
        }

        // Step 6: Optimize - select room with closest capacity (minimize waste)
        Salle optimalSalle = equipmentSalles.stream()
                .min(Comparator.comparingInt(salle ->
                        Math.abs(salle.getCapacite() - request.getCapaciteRequise())
                ))
                .orElseThrow(() -> new ResourceNotFoundException("Unable to find optimal room"));

        log.info("Found optimal room: {} (capacity: {}, waste: {})",
                optimalSalle.getNumero(),
                optimalSalle.getCapacite(),
                optimalSalle.getCapacite() - request.getCapaciteRequise()
        );

        return salleMapper.toResponse(optimalSalle);
    }

    /**
     * Check if room is available at the requested time slot.
     */
    private boolean isAvailable(Salle salle, AutoAssignSalleRequest request) {
        List<Reservation> conflicts = reservationRepository.findChevauchements(
                salle.getId(),
                request.getDateReservation(),
                request.getHeureDebut(),
                request.getHeureFin()
        );
        return conflicts.isEmpty();
    }

    /**
     * Check if room type is compatible with course type.
     * CM -> AMPHITHEATRE or SALLE_COURS
     * TD -> SALLE_COURS
     * TP -> LABORATOIRE
     */
    private boolean isTypeCompatible(TypeCours typeCours, TypeSalle typeSalle) {
        return switch (typeCours) {
            case CM -> typeSalle == TypeSalle.AMPHITHEATRE || typeSalle == TypeSalle.SALLE_COURS;
            case TD -> typeSalle == TypeSalle.SALLE_COURS;
            case TP -> typeSalle == TypeSalle.LABORATOIRE;
        };
    }

    /**
     * Check if room has all required equipment.
     */
    private boolean hasRequiredEquipment(Salle salle, List<UUID> requiredEquipmentIds) {
        Set<UUID> salleEquipmentIds = salle.getEquipements().stream()
                .map(Equipement::getId)
                .collect(Collectors.toSet());

        return salleEquipmentIds.containsAll(requiredEquipmentIds);
    }
}
