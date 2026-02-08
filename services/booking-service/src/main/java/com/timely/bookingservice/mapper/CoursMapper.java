package com.timely.bookingservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.timely.bookingservice.dto.request.CoursRequest;
import com.timely.bookingservice.dto.response.CoursResponse;
import com.timely.bookingservice.entity.Cours;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CoursMapper {

    @Mapping(source = "ue.id", target = "ueId")
    @Mapping(source = "ue.intitule", target = "ueIntitule")
    @Mapping(source = "classe.id", target = "classeId")
    @Mapping(source = "classe.code", target = "classeCode")
    CoursResponse toResponse(Cours cours);

    @Mapping(target = "ue", ignore = true)
    @Mapping(target = "classe", ignore = true)
    Cours toEntity(CoursRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "ue", ignore = true)
    @Mapping(target = "classe", ignore = true)
    void updateEntity(CoursRequest request, @MappingTarget Cours cours);
}
