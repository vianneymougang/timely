package com.timely.bookingservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.timely.bookingservice.dto.request.UERequest;
import com.timely.bookingservice.dto.response.UEResponse;
import com.timely.bookingservice.entity.UE;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UEMapper {

    @Mapping(source = "filiere.id", target = "filiereId")
    @Mapping(source = "filiere.nom", target = "filiereNom")
    UEResponse toResponse(UE ue);

    @Mapping(target = "filiere", ignore = true)
    UE toEntity(UERequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "filiere", ignore = true)
    void updateEntity(UERequest request, @MappingTarget UE ue);
}
