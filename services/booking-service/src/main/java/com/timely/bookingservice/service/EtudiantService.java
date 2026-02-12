package com.timely.bookingservice.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.bookingservice.dto.request.EtudiantRequest;
import com.timely.bookingservice.dto.response.EtudiantResponse;
import com.timely.bookingservice.entity.Classe;
import com.timely.bookingservice.entity.Etudiant;
import com.timely.bookingservice.exception.DuplicateResourceException;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.EtudiantMapper;
import com.timely.bookingservice.repository.ClasseRepository;
import com.timely.bookingservice.repository.EtudiantRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EtudiantService {

    private final EtudiantRepository etudiantRepository;
    private final ClasseRepository classeRepository;
    private final EtudiantMapper etudiantMapper;

    @Transactional
    public EtudiantResponse create(EtudiantRequest request) {
        if (etudiantRepository.existsByMatricule(request.getMatricule())) {
            throw new DuplicateResourceException("Un étudiant avec le matricule '" + request.getMatricule() + "' existe déjà");
        }
        Classe classe = classeRepository.findById(request.getClasseId())
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée avec l'id: " + request.getClasseId()));

        Etudiant etudiant = etudiantMapper.toEntity(request);
        etudiant.setClasse(classe);
        return etudiantMapper.toResponse(etudiantRepository.save(etudiant));
    }

    @Transactional(readOnly = true)
    public EtudiantResponse getById(UUID id) {
        Etudiant etudiant = etudiantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Étudiant non trouvé avec l'id: " + id));
        return etudiantMapper.toResponse(etudiant);
    }

    @Transactional(readOnly = true)
    public Page<EtudiantResponse> getAll(Pageable pageable) {
        return etudiantRepository.findAll(pageable)
                .map(etudiantMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<EtudiantResponse> getByClasseId(UUID classeId, Pageable pageable) {
        return etudiantRepository.findByClasseId(classeId, pageable)
                .map(etudiantMapper::toResponse);
    }

    @Transactional
    public EtudiantResponse update(UUID id, EtudiantRequest request) {
        Etudiant etudiant = etudiantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Étudiant non trouvé avec l'id: " + id));

        if (request.getMatricule() != null && !request.getMatricule().equals(etudiant.getMatricule())
                && etudiantRepository.existsByMatricule(request.getMatricule())) {
            throw new DuplicateResourceException("Un étudiant avec le matricule '" + request.getMatricule() + "' existe déjà");
        }

        if (request.getClasseId() != null && !request.getClasseId().equals(etudiant.getClasse().getId())) {
            Classe classe = classeRepository.findById(request.getClasseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée avec l'id: " + request.getClasseId()));
            etudiant.setClasse(classe);
        }

        etudiantMapper.updateEntity(request, etudiant);
        return etudiantMapper.toResponse(etudiantRepository.save(etudiant));
    }

    @Transactional
    public void delete(UUID id) {
        if (!etudiantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Étudiant non trouvé avec l'id: " + id);
        }
        etudiantRepository.deleteById(id);
    }
}
