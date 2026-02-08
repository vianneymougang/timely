package com.timely.planningservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.timely.planningservice.dto.request.ConflitRequestDTO;
import com.timely.planningservice.dto.response.ConflitResponseDTO;
import com.timely.planningservice.entity.Conflit;

@Mapper(componentModel = "spring")
public interface ConflitMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "emploiDuTemps", ignore = true)
    @Mapping(target = "statutResolution", constant = "NON_RESOLU")
    @Mapping(target = "dateDetection", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "dateResolution", ignore = true)
    Conflit toEntity(ConflitRequestDTO dto);

    @Mapping(target = "emploiDuTempsId", source = "emploiDuTemps.id")
    ConflitResponseDTO toResponseDTO(Conflit entity);
}
