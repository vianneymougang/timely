package com.timely.bookingservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.timely.bookingservice.dto.request.EtudiantRequest;
import com.timely.bookingservice.dto.response.EtudiantResponse;
import com.timely.bookingservice.entity.Etudiant;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EtudiantMapper {

    @Mapping(source = "classe.id", target = "classeId")
    @Mapping(source = "classe.code", target = "classeCode")
    EtudiantResponse toResponse(Etudiant etudiant);

    @Mapping(target = "classe", ignore = true)
    Etudiant toEntity(EtudiantRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "classe", ignore = true)
    void updateEntity(EtudiantRequest request, @MappingTarget Etudiant etudiant);
}
