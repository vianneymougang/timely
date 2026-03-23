package com.timely.bookingservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.timely.bookingservice.dto.request.EquipementRequest;
import com.timely.bookingservice.dto.response.EquipementResponse;
import com.timely.bookingservice.entity.Equipement;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EquipementMapper {

    EquipementResponse toResponse(Equipement equipement);

    Equipement toEntity(EquipementRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(EquipementRequest request, @MappingTarget Equipement equipement);
}
