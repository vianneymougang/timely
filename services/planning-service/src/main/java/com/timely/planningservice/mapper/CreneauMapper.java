package com.timely.planningservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.timely.planningservice.dto.request.CreneauRequestDTO;
import com.timely.planningservice.dto.response.CreneauResponseDTO;
import com.timely.planningservice.entity.Creneau;

@Mapper(componentModel = "spring")
public interface CreneauMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "emploiDuTemps", ignore = true)
    @Mapping(target = "statutCreneau", constant = "DISPONIBLE")
    Creneau toEntity(CreneauRequestDTO dto);

    @Mapping(target = "emploiDuTempsId", source = "emploiDuTemps.id")
    CreneauResponseDTO toResponseDTO(Creneau entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "emploiDuTemps", ignore = true)
    @Mapping(target = "statutCreneau", ignore = true)
    void updateEntityFromDTO(CreneauRequestDTO dto, @MappingTarget Creneau entity);
}
