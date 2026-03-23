package com.timely.bookingservice.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.bookingservice.dto.request.EquipementRequest;
import com.timely.bookingservice.dto.response.EquipementResponse;
import com.timely.bookingservice.entity.Equipement;
import com.timely.bookingservice.exception.DuplicateResourceException;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.EquipementMapper;
import com.timely.bookingservice.repository.EquipementRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EquipementService {

    private final EquipementRepository equipementRepository;
    private final EquipementMapper equipementMapper;

    @Transactional
    public EquipementResponse create(EquipementRequest request) {
        if (equipementRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Un équipement avec le code '" + request.getCode() + "' existe déjà");
        }
        Equipement equipement = equipementMapper.toEntity(request);
        return equipementMapper.toResponse(equipementRepository.save(equipement));
    }

    @Transactional(readOnly = true)
    public EquipementResponse getById(UUID id) {
        Equipement equipement = equipementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Équipement non trouvé avec l'id: " + id));
        return equipementMapper.toResponse(equipement);
    }

    @Transactional(readOnly = true)
    public List<EquipementResponse> getAll() {
        return equipementRepository.findAll().stream()
                .map(equipementMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EquipementResponse update(UUID id, EquipementRequest request) {
        Equipement equipement = equipementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Équipement non trouvé avec l'id: " + id));

        if (request.getCode() != null && !request.getCode().equals(equipement.getCode())
                && equipementRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Un équipement avec le code '" + request.getCode() + "' existe déjà");
        }

        equipementMapper.updateEntity(request, equipement);
        return equipementMapper.toResponse(equipementRepository.save(equipement));
    }

    @Transactional
    public void delete(UUID id) {
        if (!equipementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Équipement non trouvé avec l'id: " + id);
        }
        equipementRepository.deleteById(id);
    }
}
