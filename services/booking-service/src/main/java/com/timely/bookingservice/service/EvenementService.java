package com.timely.bookingservice.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.bookingservice.dto.request.EvenementRequest;
import com.timely.bookingservice.dto.response.EvenementResponse;
import com.timely.bookingservice.entity.Ecole;
import com.timely.bookingservice.entity.Evenement;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.EvenementMapper;
import com.timely.bookingservice.repository.EcoleRepository;
import com.timely.bookingservice.repository.EvenementRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EvenementService {

    private final EvenementRepository evenementRepository;
    private final EcoleRepository ecoleRepository;
    private final EvenementMapper evenementMapper;

    @Transactional
    public EvenementResponse create(EvenementRequest request) {
        Ecole ecole = ecoleRepository.findById(request.getEcoleId())
                .orElseThrow(() -> new ResourceNotFoundException("École non trouvée avec l'id: " + request.getEcoleId()));

        Evenement evenement = evenementMapper.toEntity(request);
        evenement.setEcole(ecole);
        return evenementMapper.toResponse(evenementRepository.save(evenement));
    }

    @Transactional(readOnly = true)
    public EvenementResponse getById(UUID id) {
        Evenement evenement = evenementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Événement non trouvé avec l'id: " + id));
        return evenementMapper.toResponse(evenement);
    }

    @Transactional(readOnly = true)
    public List<EvenementResponse> getAll() {
        return evenementRepository.findAll().stream()
                .map(evenementMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EvenementResponse> getByEcoleId(UUID ecoleId) {
        return evenementRepository.findByEcoleId(ecoleId).stream()
                .map(evenementMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EvenementResponse update(UUID id, EvenementRequest request) {
        Evenement evenement = evenementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Événement non trouvé avec l'id: " + id));

        if (request.getEcoleId() != null && !request.getEcoleId().equals(evenement.getEcole().getId())) {
            Ecole ecole = ecoleRepository.findById(request.getEcoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("École non trouvée avec l'id: " + request.getEcoleId()));
            evenement.setEcole(ecole);
        }

        evenementMapper.updateEntity(request, evenement);
        return evenementMapper.toResponse(evenementRepository.save(evenement));
    }

    @Transactional
    public void delete(UUID id) {
        if (!evenementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Événement non trouvé avec l'id: " + id);
        }
        evenementRepository.deleteById(id);
    }
}
