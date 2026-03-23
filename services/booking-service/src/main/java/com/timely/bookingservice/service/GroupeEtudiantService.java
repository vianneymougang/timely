package com.timely.bookingservice.service;

import com.timely.bookingservice.dto.request.GenerateGroupesRequest;
import com.timely.bookingservice.dto.request.GroupeEtudiantRequest;
import com.timely.bookingservice.dto.response.GenerateGroupesResponse;
import com.timely.bookingservice.dto.response.GroupeEtudiantResponse;
import com.timely.bookingservice.entity.Cours;
import com.timely.bookingservice.entity.Etudiant;
import com.timely.bookingservice.entity.GroupeEtudiant;
import com.timely.bookingservice.entity.enums.TypeCours;
import com.timely.bookingservice.entity.enums.TypeGroupe;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.GroupeEtudiantMapper;
import com.timely.bookingservice.repository.CoursRepository;
import com.timely.bookingservice.repository.EtudiantRepository;
import com.timely.bookingservice.repository.GroupeEtudiantRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroupeEtudiantService {

    private final GroupeEtudiantRepository groupeEtudiantRepository;
    private final CoursRepository coursRepository;
    private final EtudiantRepository etudiantRepository;
    private final GroupeEtudiantMapper groupeEtudiantMapper;

    @Transactional
    public GroupeEtudiantResponse create(GroupeEtudiantRequest request) {
        Cours cours = coursRepository
            .findById(request.getCoursId())
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Cours non trouvé avec l'id: " + request.getCoursId()
                )
            );

        GroupeEtudiant groupe = groupeEtudiantMapper.toEntity(request);
        groupe.setCours(cours);
        return groupeEtudiantMapper.toResponse(
            groupeEtudiantRepository.save(groupe)
        );
    }

    @Transactional(readOnly = true)
    public GroupeEtudiantResponse getById(UUID id) {
        GroupeEtudiant groupe = groupeEtudiantRepository
            .findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Groupe non trouvé avec l'id: " + id
                )
            );
        return groupeEtudiantMapper.toResponse(groupe);
    }

    @Transactional(readOnly = true)
    public List<GroupeEtudiantResponse> getAll() {
        return groupeEtudiantRepository
            .findAll()
            .stream()
            .map(groupeEtudiantMapper::toResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GroupeEtudiantResponse> getByCoursId(UUID coursId) {
        return groupeEtudiantRepository
            .findByCoursId(coursId)
            .stream()
            .map(groupeEtudiantMapper::toResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public GroupeEtudiantResponse update(
        UUID id,
        GroupeEtudiantRequest request
    ) {
        GroupeEtudiant groupe = groupeEtudiantRepository
            .findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Groupe non trouvé avec l'id: " + id
                )
            );

        if (
            request.getCoursId() != null &&
            !request.getCoursId().equals(groupe.getCours().getId())
        ) {
            Cours cours = coursRepository
                .findById(request.getCoursId())
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Cours non trouvé avec l'id: " + request.getCoursId()
                    )
                );
            groupe.setCours(cours);
        }

        groupeEtudiantMapper.updateEntity(request, groupe);
        return groupeEtudiantMapper.toResponse(
            groupeEtudiantRepository.save(groupe)
        );
    }

    @Transactional
    public void delete(UUID id) {
        if (!groupeEtudiantRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                "Groupe non trouvé avec l'id: " + id
            );
        }
        groupeEtudiantRepository.deleteById(id);
    }

    @Transactional
    public GroupeEtudiantResponse addEtudiant(UUID groupeId, UUID etudiantId) {
        GroupeEtudiant groupe = groupeEtudiantRepository
            .findById(groupeId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Groupe non trouvé avec l'id: " + groupeId
                )
            );
        Etudiant etudiant = etudiantRepository
            .findById(etudiantId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Étudiant non trouvé avec l'id: " + etudiantId
                )
            );

        groupe.getEtudiants().add(etudiant);
        groupe.setEffectif(groupe.getEtudiants().size());
        return groupeEtudiantMapper.toResponse(
            groupeEtudiantRepository.save(groupe)
        );
    }

    @Transactional
    public GroupeEtudiantResponse removeEtudiant(
        UUID groupeId,
        UUID etudiantId
    ) {
        GroupeEtudiant groupe = groupeEtudiantRepository
            .findById(groupeId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Groupe non trouvé avec l'id: " + groupeId
                )
            );

        groupe.getEtudiants().removeIf(e -> e.getId().equals(etudiantId));
        groupe.setEffectif(groupe.getEtudiants().size());
        return groupeEtudiantMapper.toResponse(
            groupeEtudiantRepository.save(groupe)
        );
    }

    /**
     * Generate groups automatically for a course based on class students.
     * Distribution rules:
     * - CM: 1 group (entire class)
     * - TD: 2 groups
     * - TP: 3 groups (configurable via request)
     */
    @Transactional
    public GenerateGroupesResponse generateGroupes(
        UUID coursId,
        GenerateGroupesRequest request
    ) {
        log.info("Generating groups automatically for course {}", coursId);

        // Get course details
        Cours cours = coursRepository
            .findById(coursId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Cours non trouvé avec l'id: " + coursId
                )
            );

        // Get all students from the class
        List<Etudiant> etudiants = cours.getClasse().getEtudiants();

        if (etudiants.isEmpty()) {
            throw new IllegalStateException(
                "No students found in class " + cours.getClasse().getCode()
            );
        }

        // Determine number of groups based on course type
        int nombreGroupes = determineNombreGroupes(
            cours.getTypeCours(),
            request.getNombreGroupes()
        );

        log.info(
            "Creating {} groups for {} students",
            nombreGroupes,
            etudiants.size()
        );

        // Delete existing groups for this course
        List<GroupeEtudiant> existingGroupes =
            groupeEtudiantRepository.findByCoursId(coursId);
        if (!existingGroupes.isEmpty()) {
            log.info("Deleting {} existing groups", existingGroupes.size());
            groupeEtudiantRepository.deleteAll(existingGroupes);
        }

        // Create groups and distribute students evenly
        List<GroupeEtudiant> groupes = new ArrayList<>();
        int studentsPerGroup = etudiants.size() / nombreGroupes;
        int remainingStudents = etudiants.size() % nombreGroupes;

        int studentIndex = 0;
        for (int i = 1; i <= nombreGroupes; i++) {
            GroupeEtudiant groupe = new GroupeEtudiant();
            groupe.setCours(cours);
            groupe.setNumeroGroupe(i);
            groupe.setTypeGroupe(
                mapTypeCoursToTypeGroupe(cours.getTypeCours())
            );

            // Calculate how many students for this group (distribute remainder evenly)
            int groupSize = studentsPerGroup + (i <= remainingStudents ? 1 : 0);

            // Add students to this group
            for (
                int j = 0;
                j < groupSize && studentIndex < etudiants.size();
                j++
            ) {
                groupe.getEtudiants().add(etudiants.get(studentIndex));
                studentIndex++;
            }

            groupe.setEffectif(groupe.getEtudiants().size());
            groupes.add(groupeEtudiantRepository.save(groupe));

            log.debug(
                "Created group {} with {} students",
                i,
                groupe.getEffectif()
            );
        }

        // Build response
        List<GroupeEtudiantResponse> groupeResponses = groupes
            .stream()
            .map(groupeEtudiantMapper::toResponse)
            .collect(Collectors.toList());

        String message = String.format(
            "Successfully generated %d groups for course %s (%s). Total %d students distributed.",
            nombreGroupes,
            cours.getIntitule(),
            cours.getTypeCours(),
            etudiants.size()
        );

        return GenerateGroupesResponse.builder()
            .groupes(groupeResponses)
            .totalGroupes(nombreGroupes)
            .totalEtudiants(etudiants.size())
            .message(message)
            .build();
    }

    /**
     * Determine number of groups based on course type.
     */
    private int determineNombreGroupes(
        TypeCours typeCours,
        Integer requestedNombre
    ) {
        if (requestedNombre != null && requestedNombre > 0) {
            return requestedNombre;
        }

        // Default rules
        return switch (typeCours) {
            case CM -> 1; // Entire class for lectures
            case TD -> 2; // 2 groups for tutorials
            case TP -> 3; // 3 groups for practicals
        };
    }

    /**
     * Map course type to group type.
     */
    private TypeGroupe mapTypeCoursToTypeGroupe(TypeCours typeCours) {
        return switch (typeCours) {
            case CM -> TypeGroupe.SEANCE_COMPLETE;
            case TD -> TypeGroupe.DEMI_GROUPE;
            case TP -> TypeGroupe.TIERS_GROUPE;
        };
    }
}
