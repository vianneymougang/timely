package com.timely.bookingservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.timely.bookingservice.dto.request.GroupeEtudiantRequest;
import com.timely.bookingservice.dto.response.GroupeEtudiantResponse;
import com.timely.bookingservice.entity.GroupeEtudiant;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface GroupeEtudiantMapper {

    @Mapping(source = "cours.id", target = "coursId")
    @Mapping(source = "cours.intitule", target = "coursIntitule")
    GroupeEtudiantResponse toResponse(GroupeEtudiant groupeEtudiant);

    @Mapping(target = "cours", ignore = true)
    GroupeEtudiant toEntity(GroupeEtudiantRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "cours", ignore = true)
    void updateEntity(GroupeEtudiantRequest request, @MappingTarget GroupeEtudiant groupeEtudiant);
}
