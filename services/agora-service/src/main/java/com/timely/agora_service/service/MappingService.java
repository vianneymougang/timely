package com.timely.agora_service.service;

import com.timely.agora_service.dto.request.MappingRequest;
import com.timely.agora_service.dto.response.MappingResponse;
import com.timely.agora_service.entity.MappingEntites;
import com.timely.agora_service.exception.DuplicateResourceException;
import com.timely.agora_service.exception.ResourceNotFoundException;
import com.timely.agora_service.mapper.MappingEntitesMapper;
import com.timely.agora_service.repository.MappingEntitesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MappingService {

    private final MappingEntitesRepository mappingEntitesRepository;
    private final MappingEntitesMapper mappingEntitesMapper;

    @Transactional
    public MappingResponse createMapping(MappingRequest request) {
        log.info("Creation d'un nouveau mapping pour l'entite locale {}:{}",
                request.getEntiteLocaleType(), request.getEntiteLocaleId());

        // Verifier si le mapping existe deja
        if (mappingEntitesRepository.existsByEntiteLocaleTypeAndEntiteLocaleId(
                request.getEntiteLocaleType(), request.getEntiteLocaleId())) {
            throw new DuplicateResourceException(
                    String.format("Mapping deja existant pour l'entite locale %s:%s",
                            request.getEntiteLocaleType(), request.getEntiteLocaleId())
            );
        }

        MappingEntites entity = mappingEntitesMapper.toEntity(request);
        MappingEntites savedEntity = mappingEntitesRepository.save(entity);

        log.info("Mapping cree avec succes avec l'ID: {}", savedEntity.getId());
        return mappingEntitesMapper.toResponse(savedEntity);
    }

    @Transactional(readOnly = true)
    public MappingResponse getMappingById(UUID id) {
        log.info("Recuperation du mapping avec l'ID: {}", id);

        MappingEntites entity = mappingEntitesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Mapping non trouve avec l'ID: " + id));

        return mappingEntitesMapper.toResponse(entity);
    }

    @Transactional(readOnly = true)
    public List<MappingResponse> getAllMappings() {
        log.info("Recuperation de tous les mappings");

        List<MappingEntites> entities = mappingEntitesRepository.findAll();
        return mappingEntitesMapper.toResponseList(entities);
    }

    @Transactional(readOnly = true)
    public MappingResponse getMappingByLocaleEntity(String type, UUID id) {
        log.info("Recuperation du mapping pour l'entite locale {}:{}", type, id);

        MappingEntites entity = mappingEntitesRepository
                .findByEntiteLocaleTypeAndEntiteLocaleId(type, id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Mapping non trouve pour l'entite locale %s:%s", type, id)));

        return mappingEntitesMapper.toResponse(entity);
    }

    @Transactional(readOnly = true)
    public List<MappingResponse> getMappingsByType(String type) {
        log.info("Recuperation des mappings pour le type: {}", type);

        List<MappingEntites> entities = mappingEntitesRepository.findByEntiteLocaleType(type);
        return mappingEntitesMapper.toResponseList(entities);
    }

    @Transactional(readOnly = true)
    public MappingResponse getMappingByAgoraId(String agoraId) {
        log.info("Recuperation du mapping pour l'ID Agora: {}", agoraId);

        MappingEntites entity = mappingEntitesRepository.findByEntiteAgoraId(agoraId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Mapping non trouve pour l'ID Agora: " + agoraId));

        return mappingEntitesMapper.toResponse(entity);
    }

    @Transactional
    public MappingResponse updateMapping(UUID id, MappingRequest request) {
        log.info("Mise a jour du mapping avec l'ID: {}", id);

        MappingEntites entity = mappingEntitesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Mapping non trouve avec l'ID: " + id));

        // Mettre a jour uniquement les champs modifiables
        entity.setEntiteAgoraId(request.getEntiteAgoraId());
        entity.setTypeMapping(request.getTypeMapping());
        // Ne pas modifier entiteLocaleType et entiteLocaleId

        MappingEntites updatedEntity = mappingEntitesRepository.save(entity);

        log.info("Mapping mis a jour avec succes: {}", id);
        return mappingEntitesMapper.toResponse(updatedEntity);
    }

    @Transactional
    public void deleteMapping(UUID id) {
        log.info("Suppression du mapping avec l'ID: {}", id);

        if (!mappingEntitesRepository.existsById(id)) {
            throw new ResourceNotFoundException("Mapping non trouve avec l'ID: " + id);
        }

        mappingEntitesRepository.deleteById(id);
        log.info("Mapping supprime avec succes: {}", id);
    }
}
