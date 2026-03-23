package com.timely.bookingservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.timely.bookingservice.dto.request.SalleRequest;
import com.timely.bookingservice.dto.response.SalleResponse;
import com.timely.bookingservice.entity.Salle;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {EquipementMapper.class})
public interface SalleMapper {

    @Mapping(source = "ecole.id", target = "ecoleId")
    @Mapping(source = "ecole.nom", target = "ecoleNom")
    SalleResponse toResponse(Salle salle);

    @Mapping(target = "ecole", ignore = true)
    @Mapping(target = "equipements", ignore = true)
    Salle toEntity(SalleRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "ecole", ignore = true)
    @Mapping(target = "equipements", ignore = true)
    void updateEntity(SalleRequest request, @MappingTarget Salle salle);
}
