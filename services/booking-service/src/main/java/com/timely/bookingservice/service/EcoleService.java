package com.timely.bookingservice.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.bookingservice.dto.request.EcoleRequest;
import com.timely.bookingservice.dto.response.EcoleResponse;
import com.timely.bookingservice.entity.Ecole;
import com.timely.bookingservice.exception.DuplicateResourceException;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.EcoleMapper;
import com.timely.bookingservice.repository.EcoleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EcoleService {

    private final EcoleRepository ecoleRepository;
    private final EcoleMapper ecoleMapper;

    @Transactional
    public EcoleResponse create(EcoleRequest request) {
        if (ecoleRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Une école avec le code '" + request.getCode() + "' existe déjà");
        }
        Ecole ecole = ecoleMapper.toEntity(request);
        return ecoleMapper.toResponse(ecoleRepository.save(ecole));
    }

    @Transactional(readOnly = true)
    public EcoleResponse getById(UUID id) {
        Ecole ecole = ecoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("École non trouvée avec l'id: " + id));
        return ecoleMapper.toResponse(ecole);
    }

    @Transactional(readOnly = true)
    public List<EcoleResponse> getAll() {
        return ecoleRepository.findAll().stream()
                .map(ecoleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EcoleResponse update(UUID id, EcoleRequest request) {
        Ecole ecole = ecoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("École non trouvée avec l'id: " + id));

        if (request.getCode() != null && !request.getCode().equals(ecole.getCode())
                && ecoleRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Une école avec le code '" + request.getCode() + "' existe déjà");
        }

        ecoleMapper.updateEntity(request, ecole);
        return ecoleMapper.toResponse(ecoleRepository.save(ecole));
    }

    @Transactional
    public void delete(UUID id) {
        if (!ecoleRepository.existsById(id)) {
            throw new ResourceNotFoundException("École non trouvée avec l'id: " + id);
        }
        ecoleRepository.deleteById(id);
    }
}
