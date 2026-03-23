package com.timely.userservice.service;

import com.timely.userservice.client.BookingServiceClient;
import com.timely.userservice.dto.ChargeHoraireResponse;
import com.timely.userservice.dto.CoursResponseDto;
import com.timely.userservice.dto.EnseignerDto;
import com.timely.userservice.exception.UserNotFoundException;
import com.timely.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service implementation for calculating teacher workload.
 * Integrates with booking-service via Feign to get course details.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChargeHoraireServiceImpl implements ChargeHoraireService {

    private final AffectationService affectationService;
    private final BookingServiceClient bookingServiceClient;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public ChargeHoraireResponse calculateChargeHoraire(UUID enseignantId) {
        log.info("Calculating workload for teacher {}", enseignantId);

        // Validate teacher exists
        if (!userRepository.existsById(enseignantId)) {
            throw new UserNotFoundException("Teacher not found with id: " + enseignantId);
        }

        // Get all course assignments for this teacher
        List<EnseignerDto> assignments = affectationService.getTeacherCours(enseignantId);

        if (assignments.isEmpty()) {
            log.info("No courses assigned to teacher {}", enseignantId);
            return buildEmptyResponse(enseignantId);
        }

        // Fetch course details from booking-service
        Map<String, Integer> heuresParType = new HashMap<>();
        Map<UUID, Integer> heuresParEcole = new HashMap<>();
        int totalHeures = 0;

        for (EnseignerDto assignment : assignments) {
            try {
                CoursResponseDto cours = bookingServiceClient.getCoursById(assignment.getCoursId());

                if (cours.getVolumeHoraire() != null) {
                    int volumeHoraire = cours.getVolumeHoraire();
                    totalHeures += volumeHoraire;

                    // Aggregate by course type
                    String typeCours = cours.getTypeCours() != null ? cours.getTypeCours() : "OTHER";
                    heuresParType.merge(typeCours, volumeHoraire, Integer::sum);

                    // Aggregate by school
                    if (cours.getEcoleId() != null) {
                        heuresParEcole.merge(cours.getEcoleId(), volumeHoraire, Integer::sum);
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to fetch course details for coursId {}: {}", assignment.getCoursId(), e.getMessage());
                // Continue processing other courses
            }
        }

        log.info("Teacher {} has total workload of {} hours from {} courses",
                enseignantId, totalHeures, assignments.size());

        return ChargeHoraireResponse.builder()
                .enseignantId(enseignantId)
                .totalHeures(totalHeures)
                .heuresParType(heuresParType)
                .heuresParEcole(heuresParEcole)
                .nombreCours(assignments.size())
                .build();
    }

    private ChargeHoraireResponse buildEmptyResponse(UUID enseignantId) {
        return ChargeHoraireResponse.builder()
                .enseignantId(enseignantId)
                .totalHeures(0)
                .heuresParType(new HashMap<>())
                .heuresParEcole(new HashMap<>())
                .nombreCours(0)
                .build();
    }
}
