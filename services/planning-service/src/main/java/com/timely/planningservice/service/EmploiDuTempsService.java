package com.timely.planningservice.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.planningservice.config.RabbitMQConfig;
import com.timely.planningservice.dto.request.EmploiDuTempsRequestDTO;
import com.timely.planningservice.dto.response.EmploiDuTempsResponseDTO;
import com.timely.planningservice.entity.EmploiDuTemps;
import com.timely.planningservice.entity.enums.StatutEmploi;
import com.timely.planningservice.event.EmploiDuTempsPublieEvent;
import com.timely.planningservice.exception.ResourceNotFoundException;
import com.timely.planningservice.mapper.EmploiDuTempsMapper;
import com.timely.planningservice.repository.EmploiDuTempsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmploiDuTempsService {

    private final EmploiDuTempsRepository emploiDuTempsRepository;
    private final EmploiDuTempsMapper emploiDuTempsMapper;
    private final RabbitTemplate rabbitTemplate;

    @Transactional
    public EmploiDuTempsResponseDTO createEmploiDuTemps(EmploiDuTempsRequestDTO requestDTO) {
        log.info("Creating new EmploiDuTemps for ecole: {}", requestDTO.getEcoleId());

        EmploiDuTemps emploi = emploiDuTempsMapper.toEntity(requestDTO);
        EmploiDuTemps savedEmploi = emploiDuTempsRepository.save(emploi);

        log.info("EmploiDuTemps created with ID: {}", savedEmploi.getId());
        return emploiDuTempsMapper.toResponseDTO(savedEmploi);
    }

    @Transactional(readOnly = true)
    public EmploiDuTempsResponseDTO getEmploiDuTempsById(UUID id) {
        log.debug("Fetching EmploiDuTemps with ID: {}", id);

        EmploiDuTemps emploi = emploiDuTempsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmploiDuTemps not found with ID: " + id));

        return emploiDuTempsMapper.toResponseDTO(emploi);
    }

    @Transactional(readOnly = true)
    public List<EmploiDuTempsResponseDTO> getAllEmploisDuTemps() {
        log.debug("Fetching all EmploisDuTemps");

        return emploiDuTempsRepository.findAll()
                .stream()
                .map(emploiDuTempsMapper::toResponseDTO)
                .toList();
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

        return getAllEmploisDuTemps();
    }

    @Transactional
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
    public void deleteEmploiDuTemps(UUID id) {
        log.info("Deleting EmploiDuTemps with ID: {}", id);

        if (!emploiDuTempsRepository.existsById(id)) {
            throw new ResourceNotFoundException("EmploiDuTemps not found with ID: " + id);
        }

        emploiDuTempsRepository.deleteById(id);
        log.info("EmploiDuTemps deleted successfully: {}", id);
    }

    @Transactional
    public EmploiDuTempsResponseDTO validateEmploi(UUID id, String validatorEmail) {
        log.info("Validating EmploiDuTemps with ID: {}", id);

        EmploiDuTemps emploi = emploiDuTempsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmploiDuTemps not found with ID: " + id));

        emploi.setStatut(StatutEmploi.VALIDE);
        emploi.setUtilisateurValidation(validatorEmail);

        EmploiDuTemps validatedEmploi = emploiDuTempsRepository.save(emploi);

        log.info("EmploiDuTemps validated by: {}", validatorEmail);
        return emploiDuTempsMapper.toResponseDTO(validatedEmploi);
    }

    @Transactional
    public EmploiDuTempsResponseDTO publishEmploi(UUID id, String publisherEmail) {
        log.info("Publishing EmploiDuTemps with ID: {}", id);

        EmploiDuTemps emploi = emploiDuTempsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmploiDuTemps not found with ID: " + id));

        if (emploi.getStatut() != StatutEmploi.VALIDE) {
            throw new IllegalStateException("Only validated EmploisDuTemps can be published");
        }

        emploi.setStatut(StatutEmploi.PUBLIE);
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
}
