package com.timely.bookingservice.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.bookingservice.dto.request.UERequest;
import com.timely.bookingservice.dto.response.UEResponse;
import com.timely.bookingservice.entity.Filiere;
import com.timely.bookingservice.entity.UE;
import com.timely.bookingservice.exception.DuplicateResourceException;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.UEMapper;
import com.timely.bookingservice.repository.FiliereRepository;
import com.timely.bookingservice.repository.UERepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UEService {

    private final UERepository ueRepository;
    private final FiliereRepository filiereRepository;
    private final UEMapper ueMapper;

    @Transactional
    public UEResponse create(UERequest request) {
        if (ueRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Une UE avec le code '" + request.getCode() + "' existe déjà");
        }
        Filiere filiere = filiereRepository.findById(request.getFiliereId())
                .orElseThrow(() -> new ResourceNotFoundException("Filière non trouvée avec l'id: " + request.getFiliereId()));

        UE ue = ueMapper.toEntity(request);
        ue.setFiliere(filiere);
        return ueMapper.toResponse(ueRepository.save(ue));
    }

    @Transactional(readOnly = true)
    public UEResponse getById(UUID id) {
        UE ue = ueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UE non trouvée avec l'id: " + id));
        return ueMapper.toResponse(ue);
    }

    @Transactional(readOnly = true)
    public List<UEResponse> getAll() {
        return ueRepository.findAll().stream()
                .map(ueMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UEResponse> getByFiliereId(UUID filiereId) {
        return ueRepository.findByFiliereId(filiereId).stream()
                .map(ueMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UEResponse update(UUID id, UERequest request) {
        UE ue = ueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UE non trouvée avec l'id: " + id));

        if (request.getCode() != null && !request.getCode().equals(ue.getCode())
                && ueRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Une UE avec le code '" + request.getCode() + "' existe déjà");
        }

        if (request.getFiliereId() != null && !request.getFiliereId().equals(ue.getFiliere().getId())) {
            Filiere filiere = filiereRepository.findById(request.getFiliereId())
                    .orElseThrow(() -> new ResourceNotFoundException("Filière non trouvée avec l'id: " + request.getFiliereId()));
            ue.setFiliere(filiere);
        }

        ueMapper.updateEntity(request, ue);
        return ueMapper.toResponse(ueRepository.save(ue));
    }

    @Transactional
    public void delete(UUID id) {
        if (!ueRepository.existsById(id)) {
            throw new ResourceNotFoundException("UE non trouvée avec l'id: " + id);
        }
        ueRepository.deleteById(id);
    }
}
