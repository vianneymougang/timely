package com.timely.userservice.service;

import com.timely.userservice.dto.AssignTeacherRequest;
import com.timely.userservice.dto.EnseignerDto;
import com.timely.userservice.dto.IntervenirEcoleDto;
import com.timely.userservice.exception.ResourceNotFoundException;
import com.timely.userservice.exception.UserNotFoundException;
import com.timely.userservice.model.Enseigner;
import com.timely.userservice.model.IntervenirEcole;
import com.timely.userservice.model.Teacher;
import com.timely.userservice.repository.EnseignerRepository;
import com.timely.userservice.repository.IntervenirEcoleRepository;
import com.timely.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service implementation for managing teacher assignments.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AffectationServiceImpl implements AffectationService {

    private final IntervenirEcoleRepository intervenirEcoleRepository;
    private final EnseignerRepository enseignerRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public IntervenirEcoleDto assignTeacherToEcole(UUID enseignantId, UUID ecoleId, AssignTeacherRequest request) {
        log.info("Assigning teacher {} to school {}", enseignantId, ecoleId);

        // Validate teacher exists
        Teacher teacher = userRepository.findById(enseignantId)
            .filter(user -> user instanceof Teacher)
            .map(user -> (Teacher) user)
            .orElseThrow(() -> new UserNotFoundException("Teacher not found with id: " + enseignantId));

        // Check if assignment already exists
        if (intervenirEcoleRepository.existsByEnseignantIdAndEcoleId(enseignantId, ecoleId)) {
            throw new IllegalStateException(
                String.format("Teacher %s is already assigned to school %s", enseignantId, ecoleId)
            );
        }

        // Create assignment
        IntervenirEcole intervenirEcole = IntervenirEcole.builder()
            .enseignantId(enseignantId)
            .ecoleId(ecoleId)
            .dateDebut(request.getDateDebut())
            .dateFin(request.getDateFin())
            .build();

        IntervenirEcole saved = intervenirEcoleRepository.save(intervenirEcole);
        log.info("Successfully assigned teacher {} to school {}", enseignantId, ecoleId);

        return mapToIntervenirEcoleDto(saved);
    }

    @Override
    @Transactional
    public void removeTeacherFromEcole(UUID enseignantId, UUID ecoleId) {
        log.info("Removing teacher {} from school {}", enseignantId, ecoleId);

        IntervenirEcole intervenirEcole = intervenirEcoleRepository
            .findByEnseignantIdAndEcoleId(enseignantId, ecoleId)
            .orElseThrow(() -> new ResourceNotFoundException(
                String.format("Assignment not found for teacher %s and school %s", enseignantId, ecoleId)
            ));

        intervenirEcoleRepository.delete(intervenirEcole);
        log.info("Successfully removed teacher {} from school {}", enseignantId, ecoleId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IntervenirEcoleDto> getTeacherEcoles(UUID enseignantId) {
        log.debug("Fetching schools for teacher {}", enseignantId);

        // Validate teacher exists
        if (!userRepository.existsById(enseignantId)) {
            throw new UserNotFoundException("Teacher not found with id: " + enseignantId);
        }

        List<IntervenirEcole> assignments = intervenirEcoleRepository.findByEnseignantId(enseignantId);
        return assignments.stream()
            .map(this::mapToIntervenirEcoleDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EnseignerDto assignTeacherToCours(UUID enseignantId, UUID coursId, AssignTeacherRequest request) {
        log.info("Assigning teacher {} to course {}", enseignantId, coursId);

        // Validate teacher exists
        Teacher teacher = userRepository.findById(enseignantId)
            .filter(user -> user instanceof Teacher)
            .map(user -> (Teacher) user)
            .orElseThrow(() -> new UserNotFoundException("Teacher not found with id: " + enseignantId));

        // Check if assignment already exists
        if (enseignerRepository.existsByEnseignantIdAndCoursId(enseignantId, coursId)) {
            throw new IllegalStateException(
                String.format("Teacher %s is already assigned to course %s", enseignantId, coursId)
            );
        }

        // Create assignment
        Enseigner enseigner = Enseigner.builder()
            .enseignantId(enseignantId)
            .coursId(coursId)
            .dateDebut(request.getDateDebut())
            .dateFin(request.getDateFin())
            .build();

        Enseigner saved = enseignerRepository.save(enseigner);
        log.info("Successfully assigned teacher {} to course {}", enseignantId, coursId);

        return mapToEnseignerDto(saved);
    }

    @Override
    @Transactional
    public void removeTeacherFromCours(UUID enseignantId, UUID coursId) {
        log.info("Removing teacher {} from course {}", enseignantId, coursId);

        Enseigner enseigner = enseignerRepository
            .findByEnseignantIdAndCoursId(enseignantId, coursId)
            .orElseThrow(() -> new ResourceNotFoundException(
                String.format("Assignment not found for teacher %s and course %s", enseignantId, coursId)
            ));

        enseignerRepository.delete(enseigner);
        log.info("Successfully removed teacher {} from course {}", enseignantId, coursId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnseignerDto> getTeacherCours(UUID enseignantId) {
        log.debug("Fetching courses for teacher {}", enseignantId);

        // Validate teacher exists
        if (!userRepository.existsById(enseignantId)) {
            throw new UserNotFoundException("Teacher not found with id: " + enseignantId);
        }

        List<Enseigner> assignments = enseignerRepository.findByEnseignantId(enseignantId);
        return assignments.stream()
            .map(this::mapToEnseignerDto)
            .collect(Collectors.toList());
    }

    // Mapping methods
    private IntervenirEcoleDto mapToIntervenirEcoleDto(IntervenirEcole entity) {
        return IntervenirEcoleDto.builder()
            .id(entity.getId())
            .enseignantId(entity.getEnseignantId())
            .ecoleId(entity.getEcoleId())
            .dateDebut(entity.getDateDebut())
            .dateFin(entity.getDateFin())
            .build();
    }

    private EnseignerDto mapToEnseignerDto(Enseigner entity) {
        return EnseignerDto.builder()
            .id(entity.getId())
            .enseignantId(entity.getEnseignantId())
            .coursId(entity.getCoursId())
            .dateDebut(entity.getDateDebut())
            .dateFin(entity.getDateFin())
            .build();
    }
}
