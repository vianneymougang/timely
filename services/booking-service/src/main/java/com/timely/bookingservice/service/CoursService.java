package com.timely.bookingservice.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.bookingservice.dto.request.CoursRequest;
import com.timely.bookingservice.dto.response.CoursResponse;
import com.timely.bookingservice.entity.Classe;
import com.timely.bookingservice.entity.Cours;
import com.timely.bookingservice.entity.UE;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.CoursMapper;
import com.timely.bookingservice.repository.ClasseRepository;
import com.timely.bookingservice.repository.CoursRepository;
import com.timely.bookingservice.repository.UERepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoursService {

    private final CoursRepository coursRepository;
    private final UERepository ueRepository;
    private final ClasseRepository classeRepository;
    private final CoursMapper coursMapper;

    @Transactional
    public CoursResponse create(CoursRequest request) {
        UE ue = ueRepository.findById(request.getUeId())
                .orElseThrow(() -> new ResourceNotFoundException("UE non trouvée avec l'id: " + request.getUeId()));
        Classe classe = classeRepository.findById(request.getClasseId())
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée avec l'id: " + request.getClasseId()));

        Cours cours = coursMapper.toEntity(request);
        cours.setUe(ue);
        cours.setClasse(classe);
        return coursMapper.toResponse(coursRepository.save(cours));
    }

    @Transactional(readOnly = true)
    public CoursResponse getById(UUID id) {
        Cours cours = coursRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cours non trouvé avec l'id: " + id));
        return coursMapper.toResponse(cours);
    }

    @Transactional(readOnly = true)
    public List<CoursResponse> getAll() {
        return coursRepository.findAll().stream()
                .map(coursMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CoursResponse> getByUeId(UUID ueId) {
        return coursRepository.findByUeId(ueId).stream()
                .map(coursMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CoursResponse> getByClasseId(UUID classeId) {
        return coursRepository.findByClasseId(classeId).stream()
                .map(coursMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CoursResponse update(UUID id, CoursRequest request) {
        Cours cours = coursRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cours non trouvé avec l'id: " + id));

        if (request.getUeId() != null && !request.getUeId().equals(cours.getUe().getId())) {
            UE ue = ueRepository.findById(request.getUeId())
                    .orElseThrow(() -> new ResourceNotFoundException("UE non trouvée avec l'id: " + request.getUeId()));
            cours.setUe(ue);
        }

        if (request.getClasseId() != null && !request.getClasseId().equals(cours.getClasse().getId())) {
            Classe classe = classeRepository.findById(request.getClasseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée avec l'id: " + request.getClasseId()));
            cours.setClasse(classe);
        }

        coursMapper.updateEntity(request, cours);
        return coursMapper.toResponse(coursRepository.save(cours));
    }

    @Transactional
    public void delete(UUID id) {
        if (!coursRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cours non trouvé avec l'id: " + id);
        }
        coursRepository.deleteById(id);
    }
}
