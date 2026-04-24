package com.timely.bookingservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.timely.bookingservice.dto.request.ClasseRequest;
import com.timely.bookingservice.dto.response.ClasseResponse;
import com.timely.bookingservice.entity.Classe;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ClasseMapper {

    @Mapping(source = "filiere.id", target = "filiereId")
    @Mapping(source = "filiere.nom", target = "filiereNom")
    @Mapping(expression = "java(classe.getFiliere() != null && classe.getFiliere().getCycleType() != null ? classe.getFiliere().getCycleType().name() : null)", target = "cycleType")
    @Mapping(expression = "java(classe.getFiliere() != null && classe.getFiliere().getCycleType() != null && classe.getYearIndex() != null ? classe.getFiliere().getCycleType().getDisplayLabel(classe.getYearIndex()) : null)", target = "displayLevel")
    ClasseResponse toResponse(Classe classe);

    @Mapping(target = "filiere", ignore = true)
    Classe toEntity(ClasseRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "filiere", ignore = true)
    void updateEntity(ClasseRequest request, @MappingTarget Classe classe);
}
