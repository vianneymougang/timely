package com.timely.bookingservice.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.bookingservice.dto.request.ClasseRequest;
import com.timely.bookingservice.dto.response.ClasseResponse;
import com.timely.bookingservice.entity.Classe;
import com.timely.bookingservice.entity.Filiere;
import com.timely.bookingservice.exception.DuplicateResourceException;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.ClasseMapper;
import com.timely.bookingservice.repository.ClasseRepository;
import com.timely.bookingservice.repository.FiliereRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClasseService {

    private final ClasseRepository classeRepository;
    private final FiliereRepository filiereRepository;
    private final ClasseMapper classeMapper;

    @Transactional
    public ClasseResponse create(ClasseRequest request) {
        if (classeRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Une classe avec le code '" + request.getCode() + "' existe déjà");
        }
        Filiere filiere = filiereRepository.findById(request.getFiliereId())
                .orElseThrow(() -> new ResourceNotFoundException("Filière non trouvée avec l'id: " + request.getFiliereId()));

        Classe classe = classeMapper.toEntity(request);
        classe.setFiliere(filiere);
        return classeMapper.toResponse(classeRepository.save(classe));
    }

    @Transactional(readOnly = true)
    public ClasseResponse getById(UUID id) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée avec l'id: " + id));
        return classeMapper.toResponse(classe);
    }

    @Transactional(readOnly = true)
    public List<ClasseResponse> getAll() {
        return classeRepository.findAll().stream()
                .map(classeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ClasseResponse> getByFiliereId(UUID filiereId) {
        return classeRepository.findByFiliereId(filiereId).stream()
                .map(classeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClasseResponse update(UUID id, ClasseRequest request) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée avec l'id: " + id));

        if (request.getCode() != null && !request.getCode().equals(classe.getCode())
                && classeRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Une classe avec le code '" + request.getCode() + "' existe déjà");
        }

        if (request.getFiliereId() != null && !request.getFiliereId().equals(classe.getFiliere().getId())) {
            Filiere filiere = filiereRepository.findById(request.getFiliereId())
                    .orElseThrow(() -> new ResourceNotFoundException("Filière non trouvée avec l'id: " + request.getFiliereId()));
            classe.setFiliere(filiere);
        }

        classeMapper.updateEntity(request, classe);
        return classeMapper.toResponse(classeRepository.save(classe));
    }

    @Transactional
    public void delete(UUID id) {
        if (!classeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Classe non trouvée avec l'id: " + id);
        }
        classeRepository.deleteById(id);
    }
}
