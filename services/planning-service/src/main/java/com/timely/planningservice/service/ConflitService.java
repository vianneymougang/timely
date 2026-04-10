package com.timely.planningservice.service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.planningservice.client.BookingServiceClient;
import com.timely.planningservice.client.UserServiceClient;
import com.timely.planningservice.config.RabbitMQConfig;
import com.timely.planningservice.dto.request.ConflitRequestDTO;
import com.timely.planningservice.dto.response.ConflitResponseDTO;
import com.timely.planningservice.entity.Conflit;
import com.timely.planningservice.entity.Creneau;
import com.timely.planningservice.entity.enums.Severite;
import com.timely.planningservice.entity.enums.StatutResolution;
import com.timely.planningservice.entity.enums.TypeConflit;
import com.timely.planningservice.event.ConflitDetecteEvent;
import com.timely.planningservice.exception.ResourceNotFoundException;
import com.timely.planningservice.mapper.ConflitMapper;
import com.timely.planningservice.repository.ConflitRepository;
import com.timely.planningservice.repository.CreneauRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConflitService {

    private final ConflitRepository conflitRepository;
    private final CreneauRepository creneauRepository;
    private final ConflitMapper conflitMapper;
    private final RabbitTemplate rabbitTemplate;
    private final UserServiceClient userServiceClient;
    private final BookingServiceClient bookingServiceClient;

    @Transactional
    public ConflitResponseDTO createConflit(UUID emploiDuTempsId, ConflitRequestDTO requestDTO) {
        log.info("Creating new Conflit for EmploiDuTemps: {}", emploiDuTempsId);

        Conflit conflit = conflitMapper.toEntity(requestDTO);

        // The emploiDuTemps should be fetched and set here
        // For now, we'll leave it as it needs the EmploiDuTempsRepository

        Conflit savedConflit = conflitRepository.save(conflit);

        // Publish conflict detected event
        publishConflitEvent(savedConflit);

        log.info("Conflit created with ID: {}", savedConflit.getId());
        return conflitMapper.toResponseDTO(savedConflit);
    }

    @Transactional(readOnly = true)
    public ConflitResponseDTO getConflitById(UUID id) {
        log.debug("Fetching Conflit with ID: {}", id);

        Conflit conflit = conflitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conflit not found with ID: " + id));

        return conflitMapper.toResponseDTO(conflit);
    }

    @Transactional(readOnly = true)
    public List<ConflitResponseDTO> getConflitsByEmploi(UUID emploiDuTempsId) {
        log.debug("Fetching Conflits for EmploiDuTemps: {}", emploiDuTempsId);

        return conflitRepository.findByEmploiDuTempsId(emploiDuTempsId)
                .stream()
                .map(conflitMapper::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ConflitResponseDTO> getConflitsByStatut(StatutResolution statut) {
        log.debug("Fetching Conflits with statut: {}", statut);

        return conflitRepository.findByStatutResolution(statut)
                .stream()
                .map(conflitMapper::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public long countNonResolus(UUID emploiDuTempsId) {
        return conflitRepository.countNonResolusParEmploi(emploiDuTempsId);
    }

    @Transactional(readOnly = true)
    public List<ConflitResponseDTO> getAllConflits() {
        log.debug("Fetching all Conflits");
        return conflitRepository.findAll()
                .stream()
                .map(conflitMapper::toResponseDTO)
                .toList();
    }

    @Transactional
    public ConflitResponseDTO resolveConflit(UUID id, String resolution) {
        log.info("Resolving Conflit with ID: {}", id);

        Conflit conflit = conflitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conflit not found with ID: " + id));

        conflit.setStatutResolution(StatutResolution.RESOLU);
        conflit.setDateResolution(LocalDateTime.now());
        conflit.setSuggestionResolution(resolution);

        Conflit resolvedConflit = conflitRepository.save(conflit);

        log.info("Conflit resolved successfully: {}", id);
        return conflitMapper.toResponseDTO(resolvedConflit);
    }

    @Transactional
    public void detectConflitsForCreneau(Creneau creneau) {
        log.info("Detecting conflicts for Creneau: {}", creneau.getId());

        // 1. Check for enseignant conflicts
        if (creneau.getEnseignantId() != null) {
            detectEnseignantConflicts(creneau);
            checkEnseignantDisponibilite(creneau);
        }

        // 2. Check for salle conflicts
        if (creneau.getSalleId() != null) {
            detectSalleConflicts(creneau);
        }

        // 3. Check for groupe conflicts
        if (creneau.getGroupeId() != null) {
            detectGroupeConflicts(creneau);
        }

        log.info("Conflict detection completed for Creneau: {}", creneau.getId());
    }

    private void detectEnseignantConflicts(Creneau creneau) {
        List<Creneau> conflictingCreneaux = creneauRepository.findActiveCreneauxByEnseignantAndJour(
                creneau.getEnseignantId(),
                creneau.getJourSemaine()
        );

        for (Creneau existing : conflictingCreneaux) {
            if (!existing.getId().equals(creneau.getId()) &&
                hasTimeOverlap(creneau, existing)) {

                Conflit conflit = new Conflit(
                        creneau.getEmploiDuTemps(),
                        TypeConflit.ENSEIGNANT,
                        "L'enseignant est déjà assigné à un autre créneau au même horaire",
                        Severite.CRITIQUE
                );
                conflit.setReservation1Id(creneau.getReservationId());
                conflit.setReservation2Id(existing.getReservationId());

                Conflit savedConflit = conflitRepository.save(conflit);
                publishConflitEvent(savedConflit);
            }
        }
    }

    private void checkEnseignantDisponibilite(Creneau creneau) {
        try {
            boolean disponible = userServiceClient.checkDisponibilite(
                    creneau.getEnseignantId(),
                    creneau.getJourSemaine().toString(),
                    creneau.getHeureDebut().toString(),
                    creneau.getHeureFin().toString()
            );

            if (!disponible) {
                Conflit conflit = new Conflit(
                        creneau.getEmploiDuTemps(),
                        TypeConflit.HORAIRE,
                        "Le créneau ne correspond pas aux disponibilités de l'enseignant",
                        Severite.MOYENNE
                );
                conflit.setReservation1Id(creneau.getReservationId());

                Conflit savedConflit = conflitRepository.save(conflit);
                publishConflitEvent(savedConflit);
            }
        } catch (Exception e) {
            log.warn("Could not check enseignant disponibilite: {}", e.getMessage());
        }
    }

    private void detectSalleConflicts(Creneau creneau) {
        List<Creneau> conflictingCreneaux = creneauRepository.findActiveCreneauxBySalleAndJour(
                creneau.getSalleId(),
                creneau.getJourSemaine()
        );

        for (Creneau existing : conflictingCreneaux) {
            if (!existing.getId().equals(creneau.getId()) &&
                hasTimeOverlap(creneau, existing)) {

                Conflit conflit = new Conflit(
                        creneau.getEmploiDuTemps(),
                        TypeConflit.SALLE,
                        "La salle est déjà réservée à cet horaire",
                        Severite.CRITIQUE
                );
                conflit.setReservation1Id(creneau.getReservationId());
                conflit.setReservation2Id(existing.getReservationId());

                Conflit savedConflit = conflitRepository.save(conflit);
                publishConflitEvent(savedConflit);
            }
        }
    }

    private void detectGroupeConflicts(Creneau creneau) {
        List<Creneau> conflictingCreneaux = creneauRepository.findByEmploiDuTempsId(
                creneau.getEmploiDuTemps().getId()
        ).stream()
                .filter(c -> creneau.getGroupeId().equals(c.getGroupeId()))
                .filter(c -> creneau.getJourSemaine().equals(c.getJourSemaine()))
                .toList();

        for (Creneau existing : conflictingCreneaux) {
            if (!existing.getId().equals(creneau.getId()) &&
                hasTimeOverlap(creneau, existing)) {

                Conflit conflit = new Conflit(
                        creneau.getEmploiDuTemps(),
                        TypeConflit.GROUPE,
                        "Le groupe d'étudiants a déjà un cours à cet horaire",
                        Severite.CRITIQUE
                );
                conflit.setReservation1Id(creneau.getReservationId());
                conflit.setReservation2Id(existing.getReservationId());

                Conflit savedConflit = conflitRepository.save(conflit);
                publishConflitEvent(savedConflit);
            }
        }
    }

    private boolean hasTimeOverlap(Creneau c1, Creneau c2) {
        return c1.getHeureDebut().isBefore(c2.getHeureFin()) &&
               c2.getHeureDebut().isBefore(c1.getHeureFin());
    }

    private void publishConflitEvent(Conflit conflit) {
        ConflitDetecteEvent event = new ConflitDetecteEvent(
                conflit.getId(),
                conflit.getEmploiDuTemps().getId(),
                conflit.getTypeConflit(),
                conflit.getSeverite(),
                conflit.getDescription()
        );

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.PLANNING_EXCHANGE,
                RabbitMQConfig.PLANNING_CONFLICT_ROUTING_KEY,
                event
        );

        log.info("Conflit event published for conflit: {}", conflit.getId());
    }
}
