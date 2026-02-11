package com.timely.bookingservice.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.bookingservice.dto.request.SalleRequest;
import com.timely.bookingservice.dto.response.SalleResponse;
import com.timely.bookingservice.entity.Ecole;
import com.timely.bookingservice.entity.Equipement;
import com.timely.bookingservice.entity.Salle;
import com.timely.bookingservice.entity.enums.TypeSalle;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.SalleMapper;
import com.timely.bookingservice.repository.EcoleRepository;
import com.timely.bookingservice.repository.EquipementRepository;
import com.timely.bookingservice.repository.SalleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SalleService {

    private final SalleRepository salleRepository;
    private final EcoleRepository ecoleRepository;
    private final EquipementRepository equipementRepository;
    private final SalleMapper salleMapper;

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "salles:disponibles", allEntries = true),
        @CacheEvict(value = "salles:ecole", allEntries = true)
    })
    public SalleResponse create(SalleRequest request) {
        Ecole ecole = ecoleRepository.findById(request.getEcoleId())
                .orElseThrow(() -> new ResourceNotFoundException("École non trouvée avec l'id: " + request.getEcoleId()));

        Salle salle = salleMapper.toEntity(request);
        salle.setEcole(ecole);

        if (request.getEquipementIds() != null && !request.getEquipementIds().isEmpty()) {
            Set<Equipement> equipements = new HashSet<>(equipementRepository.findAllById(request.getEquipementIds()));
            salle.setEquipements(equipements);
        }

        return salleMapper.toResponse(salleRepository.save(salle));
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "salles:details", key = "#id")
    public SalleResponse getById(UUID id) {
        Salle salle = salleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salle non trouvée avec l'id: " + id));
        return salleMapper.toResponse(salle);
    }

    @Transactional(readOnly = true)
    public List<SalleResponse> getAll() {
        return salleRepository.findAll().stream()
                .map(salleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "salles:ecole", key = "#ecoleId")
    public List<SalleResponse> getByEcoleId(UUID ecoleId) {
        return salleRepository.findByEcoleId(ecoleId).stream()
                .map(salleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "salles:disponibles", key = "#capaciteMin + '-' + #typeSalle")
    public List<SalleResponse> getDisponibles(Integer capaciteMin, TypeSalle typeSalle) {
        return salleRepository.findSallesDisponibles(capaciteMin, typeSalle).stream()
                .map(salleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "salles:details", key = "#id"),
        @CacheEvict(value = "salles:disponibles", allEntries = true),
        @CacheEvict(value = "salles:ecole", allEntries = true)
    })
    public SalleResponse update(UUID id, SalleRequest request) {
        Salle salle = salleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salle non trouvée avec l'id: " + id));

        if (request.getEcoleId() != null && !request.getEcoleId().equals(salle.getEcole().getId())) {
            Ecole ecole = ecoleRepository.findById(request.getEcoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("École non trouvée avec l'id: " + request.getEcoleId()));
            salle.setEcole(ecole);
        }

        if (request.getEquipementIds() != null) {
            Set<Equipement> equipements = new HashSet<>(equipementRepository.findAllById(request.getEquipementIds()));
            salle.setEquipements(equipements);
        }

        salleMapper.updateEntity(request, salle);
        return salleMapper.toResponse(salleRepository.save(salle));
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "salles:details", key = "#id"),
        @CacheEvict(value = "salles:disponibles", allEntries = true),
        @CacheEvict(value = "salles:ecole", allEntries = true)
    })
    public void delete(UUID id) {
        if (!salleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Salle non trouvée avec l'id: " + id);
        }
        salleRepository.deleteById(id);
    }
}
