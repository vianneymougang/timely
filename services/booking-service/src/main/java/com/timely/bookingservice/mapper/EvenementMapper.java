package com.timely.bookingservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.timely.bookingservice.dto.request.EvenementRequest;
import com.timely.bookingservice.dto.response.EvenementResponse;
import com.timely.bookingservice.entity.Evenement;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EvenementMapper {

    @Mapping(source = "ecole.id", target = "ecoleId")
    @Mapping(source = "ecole.nom", target = "ecoleNom")
    EvenementResponse toResponse(Evenement evenement);

    @Mapping(target = "ecole", ignore = true)
    Evenement toEntity(EvenementRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "ecole", ignore = true)
    void updateEntity(EvenementRequest request, @MappingTarget Evenement evenement);
}
