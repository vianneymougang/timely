package com.timely.bookingservice.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.bookingservice.dto.request.GroupeEtudiantRequest;
import com.timely.bookingservice.dto.response.GroupeEtudiantResponse;
import com.timely.bookingservice.entity.Cours;
import com.timely.bookingservice.entity.Etudiant;
import com.timely.bookingservice.entity.GroupeEtudiant;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.GroupeEtudiantMapper;
import com.timely.bookingservice.repository.CoursRepository;
import com.timely.bookingservice.repository.EtudiantRepository;
import com.timely.bookingservice.repository.GroupeEtudiantRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GroupeEtudiantService {

    private final GroupeEtudiantRepository groupeEtudiantRepository;
    private final CoursRepository coursRepository;
    private final EtudiantRepository etudiantRepository;
    private final GroupeEtudiantMapper groupeEtudiantMapper;

    @Transactional
    public GroupeEtudiantResponse create(GroupeEtudiantRequest request) {
        Cours cours = coursRepository.findById(request.getCoursId())
                .orElseThrow(() -> new ResourceNotFoundException("Cours non trouvé avec l'id: " + request.getCoursId()));

        GroupeEtudiant groupe = groupeEtudiantMapper.toEntity(request);
        groupe.setCours(cours);
        return groupeEtudiantMapper.toResponse(groupeEtudiantRepository.save(groupe));
    }

    @Transactional(readOnly = true)
    public GroupeEtudiantResponse getById(UUID id) {
        GroupeEtudiant groupe = groupeEtudiantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Groupe non trouvé avec l'id: " + id));
        return groupeEtudiantMapper.toResponse(groupe);
    }

    @Transactional(readOnly = true)
    public List<GroupeEtudiantResponse> getAll() {
        return groupeEtudiantRepository.findAll().stream()
                .map(groupeEtudiantMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GroupeEtudiantResponse> getByCoursId(UUID coursId) {
        return groupeEtudiantRepository.findByCoursId(coursId).stream()
                .map(groupeEtudiantMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public GroupeEtudiantResponse update(UUID id, GroupeEtudiantRequest request) {
        GroupeEtudiant groupe = groupeEtudiantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Groupe non trouvé avec l'id: " + id));

        if (request.getCoursId() != null && !request.getCoursId().equals(groupe.getCours().getId())) {
            Cours cours = coursRepository.findById(request.getCoursId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cours non trouvé avec l'id: " + request.getCoursId()));
            groupe.setCours(cours);
        }

        groupeEtudiantMapper.updateEntity(request, groupe);
        return groupeEtudiantMapper.toResponse(groupeEtudiantRepository.save(groupe));
    }

    @Transactional
    public void delete(UUID id) {
        if (!groupeEtudiantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Groupe non trouvé avec l'id: " + id);
        }
        groupeEtudiantRepository.deleteById(id);
    }

    @Transactional
    public GroupeEtudiantResponse addEtudiant(UUID groupeId, UUID etudiantId) {
        GroupeEtudiant groupe = groupeEtudiantRepository.findById(groupeId)
                .orElseThrow(() -> new ResourceNotFoundException("Groupe non trouvé avec l'id: " + groupeId));
        Etudiant etudiant = etudiantRepository.findById(etudiantId)
                .orElseThrow(() -> new ResourceNotFoundException("Étudiant non trouvé avec l'id: " + etudiantId));

        groupe.getEtudiants().add(etudiant);
        groupe.setEffectif(groupe.getEtudiants().size());
        return groupeEtudiantMapper.toResponse(groupeEtudiantRepository.save(groupe));
    }

    @Transactional
    public GroupeEtudiantResponse removeEtudiant(UUID groupeId, UUID etudiantId) {
        GroupeEtudiant groupe = groupeEtudiantRepository.findById(groupeId)
                .orElseThrow(() -> new ResourceNotFoundException("Groupe non trouvé avec l'id: " + groupeId));

        groupe.getEtudiants().removeIf(e -> e.getId().equals(etudiantId));
        groupe.setEffectif(groupe.getEtudiants().size());
        return groupeEtudiantMapper.toResponse(groupeEtudiantRepository.save(groupe));
    }
}
