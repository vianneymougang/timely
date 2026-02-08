package com.timely.planningservice.service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.planningservice.dto.request.CreneauRequestDTO;
import com.timely.planningservice.dto.response.CreneauResponseDTO;
import com.timely.planningservice.entity.Creneau;
import com.timely.planningservice.entity.EmploiDuTemps;
import com.timely.planningservice.exception.ResourceNotFoundException;
import com.timely.planningservice.mapper.CreneauMapper;
import com.timely.planningservice.repository.CreneauRepository;
import com.timely.planningservice.repository.EmploiDuTempsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CreneauService {

    private final CreneauRepository creneauRepository;
    private final EmploiDuTempsRepository emploiDuTempsRepository;
    private final CreneauMapper creneauMapper;
    private final ConflitService conflitService;

    @Transactional
    public CreneauResponseDTO createCreneau(UUID emploiDuTempsId, CreneauRequestDTO requestDTO) {
        log.info("Creating new Creneau for EmploiDuTemps: {}", emploiDuTempsId);

        EmploiDuTemps emploi = emploiDuTempsRepository.findById(emploiDuTempsId)
                .orElseThrow(() -> new ResourceNotFoundException("EmploiDuTemps not found with ID: " + emploiDuTempsId));

        Creneau creneau = creneauMapper.toEntity(requestDTO);
        creneau.setEmploiDuTemps(emploi);

        Creneau savedCreneau = creneauRepository.save(creneau);

        // Detect conflicts after creating creneau
        conflitService.detectConflitsForCreneau(savedCreneau);

        log.info("Creneau created with ID: {}", savedCreneau.getId());
        return creneauMapper.toResponseDTO(savedCreneau);
    }

    @Transactional(readOnly = true)
    public CreneauResponseDTO getCreneauById(UUID id) {
        log.debug("Fetching Creneau with ID: {}", id);

        Creneau creneau = creneauRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Creneau not found with ID: " + id));

        return creneauMapper.toResponseDTO(creneau);
    }

    @Transactional(readOnly = true)
    public List<CreneauResponseDTO> getCreneauxByEmploi(UUID emploiDuTempsId) {
        log.debug("Fetching Creneaux for EmploiDuTemps: {}", emploiDuTempsId);

        return creneauRepository.findByEmploiDuTempsId(emploiDuTempsId)
                .stream()
                .map(creneauMapper::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CreneauResponseDTO> getCreneauxByEnseignant(UUID enseignantId) {
        log.debug("Fetching Creneaux for enseignant: {}", enseignantId);

        return creneauRepository.findByEnseignantId(enseignantId)
                .stream()
                .map(creneauMapper::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CreneauResponseDTO> getCreneauxBySalle(UUID salleId) {
        log.debug("Fetching Creneaux for salle: {}", salleId);

        return creneauRepository.findBySalleId(salleId)
                .stream()
                .map(creneauMapper::toResponseDTO)
                .toList();
    }

    @Transactional
    public CreneauResponseDTO updateCreneau(UUID id, CreneauRequestDTO requestDTO) {
        log.info("Updating Creneau with ID: {}", id);

        Creneau creneau = creneauRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Creneau not found with ID: " + id));

        creneauMapper.updateEntityFromDTO(requestDTO, creneau);
        Creneau updatedCreneau = creneauRepository.save(creneau);

        // Re-detect conflicts after update
        conflitService.detectConflitsForCreneau(updatedCreneau);

        log.info("Creneau updated successfully: {}", id);
        return creneauMapper.toResponseDTO(updatedCreneau);
    }

    @Transactional
    public void deleteCreneau(UUID id) {
        log.info("Deleting Creneau with ID: {}", id);

        if (!creneauRepository.existsById(id)) {
            throw new ResourceNotFoundException("Creneau not found with ID: " + id);
        }

        creneauRepository.deleteById(id);
        log.info("Creneau deleted successfully: {}", id);
    }

    @Transactional(readOnly = true)
    public boolean hasTimeOverlap(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        return start1.isBefore(end2) && start2.isBefore(end1);
    }

    @Transactional(readOnly = true)
    public List<Creneau> findConflictingCreneaux(UUID enseignantId, DayOfWeek jour, LocalTime heureDebut, LocalTime heureFin) {
        List<Creneau> creneaux = creneauRepository.findActiveCreneauxByEnseignantAndJour(enseignantId, jour);

        return creneaux.stream()
                .filter(c -> hasTimeOverlap(c.getHeureDebut(), c.getHeureFin(), heureDebut, heureFin))
                .toList();
    }
}
