package com.timely.bookingservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.timely.bookingservice.dto.request.FiliereRequest;
import com.timely.bookingservice.dto.response.FiliereResponse;
import com.timely.bookingservice.entity.Filiere;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FiliereMapper {

    @Mapping(source = "ecole.id", target = "ecoleId")
    @Mapping(source = "ecole.nom", target = "ecoleNom")
    FiliereResponse toResponse(Filiere filiere);

    @Mapping(target = "ecole", ignore = true)
    Filiere toEntity(FiliereRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "ecole", ignore = true)
    void updateEntity(FiliereRequest request, @MappingTarget Filiere filiere);
}
