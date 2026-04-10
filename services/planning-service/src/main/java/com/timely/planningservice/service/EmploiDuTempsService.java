package com.timely.planningservice.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.planningservice.config.RabbitMQConfig;
import com.timely.planningservice.dto.request.EmploiDuTempsRequestDTO;
import com.timely.planningservice.dto.request.SearchPlanningRequest;
import com.timely.planningservice.dto.response.EmploiDuTempsResponseDTO;
import com.timely.planningservice.entity.EmploiDuTemps;
import com.timely.planningservice.entity.enums.StatutEmploi;
import com.timely.planningservice.event.EmploiDuTempsPublieEvent;
import com.timely.planningservice.exception.ResourceNotFoundException;
import com.timely.planningservice.mapper.EmploiDuTempsMapper;
import com.timely.planningservice.repository.EmploiDuTempsRepository;
import com.timely.planningservice.repository.specification.EmploiDuTempsSpecification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmploiDuTempsService {

    private final EmploiDuTempsRepository emploiDuTempsRepository;
    private final EmploiDuTempsMapper emploiDuTempsMapper;
    private final RabbitTemplate rabbitTemplate;
    private final PlanningDataEnricher dataEnricher;

    @Transactional
    public EmploiDuTempsResponseDTO createEmploiDuTemps(EmploiDuTempsRequestDTO requestDTO) {
        log.info("Creating new EmploiDuTemps for ecole: {}", requestDTO.getEcoleId());

        EmploiDuTemps emploi = emploiDuTempsMapper.toEntity(requestDTO);
        EmploiDuTemps savedEmploi = emploiDuTempsRepository.save(emploi);

        log.info("EmploiDuTemps created with ID: {}", savedEmploi.getId());
        return emploiDuTempsMapper.toResponseDTO(savedEmploi);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "planning:emploi", key = "#id")
    public EmploiDuTempsResponseDTO getEmploiDuTempsById(UUID id) {
        log.debug("Fetching EmploiDuTemps with ID: {}", id);

        EmploiDuTemps emploi = emploiDuTempsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmploiDuTemps not found with ID: " + id));

        EmploiDuTempsResponseDTO response = emploiDuTempsMapper.toResponseDTO(emploi);

        // Enrich creneaux with data from other services
        try {
            PlanningDataEnricher.EnrichedPlanningData enrichedData = dataEnricher.enrichEmploiDuTemps(emploi);

            if (response.getCreneaux() != null) {
                response.getCreneaux().forEach(dto -> {
                    enrichedData.creneaux().stream()
                            .filter(c -> c.id().equals(dto.getId()))
                            .findFirst()
                            .ifPresent(enriched -> {
                                dto.setCoursIntitule(enriched.nomCours());
                                dto.setCoursType(enriched.typeCours());
                                dto.setEnseignantNom(enriched.nomEnseignant());
                                dto.setSalleNom(enriched.numeroSalle());
                                dto.setGroupeNom(enriched.nomGroupe());
                            });
                });
            }
        } catch (Exception e) {
            log.warn("Failed to enrich emploi du temps {}: {}", id, e.getMessage());
        }

        return response;
    }

    @Transactional(readOnly = true)
    public Page<EmploiDuTempsResponseDTO> getAllEmploisDuTemps(Pageable pageable) {
        log.debug("Fetching all EmploisDuTemps with pagination");

        return emploiDuTempsRepository.findAll(pageable)
                .map(emploiDuTempsMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public List<EmploiDuTempsResponseDTO> getEmploisByEcole(UUID ecoleId) {
        log.debug("Fetching EmploisDuTemps for ecole: {}", ecoleId);

        return emploiDuTempsRepository.findByEcoleId(ecoleId)
                .stream()
                .map(emploiDuTempsMapper::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EmploiDuTempsResponseDTO> searchEmplois(
            UUID ecoleId,
            LocalDate dateDebut,
            LocalDate dateFin,
            StatutEmploi statut
    ) {
        log.debug("Searching EmploisDuTemps with filters - ecole: {}, dates: {} to {}, statut: {}",
                ecoleId, dateDebut, dateFin, statut);

        if (ecoleId != null && dateDebut != null && dateFin != null) {
            return emploiDuTempsRepository.findByEcoleIdAndDateRange(ecoleId, dateDebut, dateFin)
                    .stream()
                    .filter(e -> statut == null || e.getStatut() == statut)
                    .map(emploiDuTempsMapper::toResponseDTO)
                    .toList();
        } else if (statut != null && dateDebut != null && dateFin != null) {
            return emploiDuTempsRepository.findByStatutAndDateRange(statut, dateDebut, dateFin)
                    .stream()
                    .map(emploiDuTempsMapper::toResponseDTO)
                    .toList();
        } else if (statut != null) {
            return emploiDuTempsRepository.findByStatut(statut)
                    .stream()
                    .map(emploiDuTempsMapper::toResponseDTO)
                    .toList();
        } else if (ecoleId != null) {
            return getEmploisByEcole(ecoleId);
        }

        return getAllEmploisDuTemps(Pageable.unpaged()).getContent();
    }

    @Transactional
    @CacheEvict(value = {"planning:emploi", "planning:creneaux"}, allEntries = true)
    public EmploiDuTempsResponseDTO updateEmploiDuTemps(UUID id, EmploiDuTempsRequestDTO requestDTO) {
        log.info("Updating EmploiDuTemps with ID: {}", id);

        EmploiDuTemps emploi = emploiDuTempsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmploiDuTemps not found with ID: " + id));

        emploiDuTempsMapper.updateEntityFromDTO(requestDTO, emploi);
        EmploiDuTemps updatedEmploi = emploiDuTempsRepository.save(emploi);

        log.info("EmploiDuTemps updated successfully: {}", id);
        return emploiDuTempsMapper.toResponseDTO(updatedEmploi);
    }

    @Transactional
    @CacheEvict(value = {"planning:emploi", "planning:creneaux"}, allEntries = true)
    public void deleteEmploiDuTemps(UUID id) {
        log.info("Deleting EmploiDuTemps with ID: {}", id);

        if (!emploiDuTempsRepository.existsById(id)) {
            throw new ResourceNotFoundException("EmploiDuTemps not found with ID: " + id);
        }

        emploiDuTempsRepository.deleteById(id);
        log.info("EmploiDuTemps deleted successfully: {}", id);
    }

    @Transactional
    @CacheEvict(value = {"planning:emploi", "planning:creneaux"}, allEntries = true)
    public EmploiDuTempsResponseDTO validateEmploi(UUID id, String validatorEmail) {
        log.info("Validating EmploiDuTemps with ID: {}", id);

        EmploiDuTemps emploi = emploiDuTempsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmploiDuTemps not found with ID: " + id));

        emploi.setStatut(StatutEmploi.VALIDATED);
        emploi.setUtilisateurValidation(validatorEmail);

        EmploiDuTemps validatedEmploi = emploiDuTempsRepository.save(emploi);

        log.info("EmploiDuTemps validated by: {}", validatorEmail);
        return emploiDuTempsMapper.toResponseDTO(validatedEmploi);
    }

    @Transactional
    @CacheEvict(value = {"planning:emploi", "planning:creneaux"}, allEntries = true)
    public EmploiDuTempsResponseDTO publishEmploi(UUID id, String publisherEmail) {
        log.info("Publishing EmploiDuTemps with ID: {}", id);

        EmploiDuTemps emploi = emploiDuTempsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmploiDuTemps not found with ID: " + id));

        if (emploi.getStatut() != StatutEmploi.VALIDATED) {
            throw new IllegalStateException("Only validated EmploisDuTemps can be published");
        }

        emploi.setStatut(StatutEmploi.PUBLISHED);
        emploi.setDatePublication(LocalDateTime.now());
        if (emploi.getUtilisateurValidation() == null) {
            emploi.setUtilisateurValidation(publisherEmail);
        }

        EmploiDuTemps publishedEmploi = emploiDuTempsRepository.save(emploi);

        // Publish event to RabbitMQ
        EmploiDuTempsPublieEvent event = new EmploiDuTempsPublieEvent(
                publishedEmploi.getId(),
                publishedEmploi.getEcoleId(),
                publishedEmploi.getDateDebut(),
                publishedEmploi.getDateFin(),
                publishedEmploi.getDatePublication()
        );

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.PLANNING_EXCHANGE,
                RabbitMQConfig.PLANNING_PUBLISHED_ROUTING_KEY,
                event
        );

        log.info("EmploiDuTemps published successfully and event sent to queue");
        return emploiDuTempsMapper.toResponseDTO(publishedEmploi);
    }

    @Transactional(readOnly = true)
    public Page<EmploiDuTempsResponseDTO> searchAdvanced(SearchPlanningRequest request) {
        log.info("Advanced search with filters - ecole: {}, enseignant: {}, salle: {}, groupe: {}, statut: {}",
                request.getEcoleId(), request.getEnseignantId(), request.getSalleId(),
                request.getGroupeId(), request.getStatut());

        // Build specification from filters
        Specification<EmploiDuTemps> spec = EmploiDuTempsSpecification.buildSearchSpecification(
                request.getEcoleId(),
                request.getEnseignantId(),
                request.getSalleId(),
                request.getGroupeId(),
                request.getSemaine(),
                request.getStatut()
        );

        // Build pageable with sort
        Sort.Direction direction = "DESC".equalsIgnoreCase(request.getSortDirection())
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, request.getSortBy());
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);

        // Execute query
        Page<EmploiDuTemps> emploisPage = emploiDuTempsRepository.findAll(spec, pageable);

        // Map to DTOs
        Page<EmploiDuTempsResponseDTO> responsePage = emploisPage.map(emploiDuTempsMapper::toResponseDTO);

        log.info("Advanced search returned {} results out of {} total",
                responsePage.getNumberOfElements(), responsePage.getTotalElements());

        return responsePage;
    }
}
