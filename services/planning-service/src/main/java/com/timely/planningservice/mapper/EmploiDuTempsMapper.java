package com.timely.planningservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.timely.planningservice.dto.request.EmploiDuTempsRequestDTO;
import com.timely.planningservice.dto.response.EmploiDuTempsResponseDTO;
import com.timely.planningservice.entity.EmploiDuTemps;

@Mapper(componentModel = "spring", uses = {CreneauMapper.class, ConflitMapper.class})
public interface EmploiDuTempsMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "statut", constant = "BROUILLON")
    @Mapping(target = "dateCreation", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "datePublication", ignore = true)
    @Mapping(target = "utilisateurValidation", ignore = true)
    @Mapping(target = "creneaux", ignore = true)
    @Mapping(target = "conflits", ignore = true)
    EmploiDuTemps toEntity(EmploiDuTempsRequestDTO dto);

    @Mapping(target = "creneaux", source = "creneaux")
    @Mapping(target = "conflits", source = "conflits")
    EmploiDuTempsResponseDTO toResponseDTO(EmploiDuTemps entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "datePublication", ignore = true)
    @Mapping(target = "utilisateurValidation", ignore = true)
    @Mapping(target = "creneaux", ignore = true)
    @Mapping(target = "conflits", ignore = true)
    void updateEntityFromDTO(EmploiDuTempsRequestDTO dto, @MappingTarget EmploiDuTemps entity);
}
