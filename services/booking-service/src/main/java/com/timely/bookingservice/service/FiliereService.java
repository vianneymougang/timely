package com.timely.bookingservice.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.bookingservice.dto.request.FiliereRequest;
import com.timely.bookingservice.dto.response.FiliereResponse;
import com.timely.bookingservice.entity.Ecole;
import com.timely.bookingservice.entity.Filiere;
import com.timely.bookingservice.exception.DuplicateResourceException;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.FiliereMapper;
import com.timely.bookingservice.repository.EcoleRepository;
import com.timely.bookingservice.repository.FiliereRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FiliereService {

    private final FiliereRepository filiereRepository;
    private final EcoleRepository ecoleRepository;
    private final FiliereMapper filiereMapper;

    @Transactional
    public FiliereResponse create(FiliereRequest request) {
        if (filiereRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Une filière avec le code '" + request.getCode() + "' existe déjà");
        }
        Ecole ecole = ecoleRepository.findById(request.getEcoleId())
                .orElseThrow(() -> new ResourceNotFoundException("École non trouvée avec l'id: " + request.getEcoleId()));

        Filiere filiere = filiereMapper.toEntity(request);
        filiere.setEcole(ecole);
        return filiereMapper.toResponse(filiereRepository.save(filiere));
    }

    @Transactional(readOnly = true)
    public FiliereResponse getById(UUID id) {
        Filiere filiere = filiereRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Filière non trouvée avec l'id: " + id));
        return filiereMapper.toResponse(filiere);
    }

    @Transactional(readOnly = true)
    public List<FiliereResponse> getAll() {
        return filiereRepository.findAll().stream()
                .map(filiereMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FiliereResponse> getByEcoleId(UUID ecoleId) {
        return filiereRepository.findByEcoleId(ecoleId).stream()
                .map(filiereMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public FiliereResponse update(UUID id, FiliereRequest request) {
        Filiere filiere = filiereRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Filière non trouvée avec l'id: " + id));

        if (request.getCode() != null && !request.getCode().equals(filiere.getCode())
                && filiereRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Une filière avec le code '" + request.getCode() + "' existe déjà");
        }

        if (request.getEcoleId() != null && !request.getEcoleId().equals(filiere.getEcole().getId())) {
            Ecole ecole = ecoleRepository.findById(request.getEcoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("École non trouvée avec l'id: " + request.getEcoleId()));
            filiere.setEcole(ecole);
        }

        filiereMapper.updateEntity(request, filiere);
        return filiereMapper.toResponse(filiereRepository.save(filiere));
    }

    @Transactional
    public void delete(UUID id) {
        if (!filiereRepository.existsById(id)) {
            throw new ResourceNotFoundException("Filière non trouvée avec l'id: " + id);
        }
        filiereRepository.deleteById(id);
    }
}
