package com.timely.reportservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.timely.reportservice.dto.request.GenerateReportRequest;
import com.timely.reportservice.dto.response.RapportResponse;
import com.timely.reportservice.entity.Rapport;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RapportMapper {

    RapportResponse toResponse(Rapport rapport);

    @Mapping(target = "exports", ignore = true)
    @Mapping(target = "cheminFichier", ignore = true)
    @Mapping(target = "dateGeneration", ignore = true)
    Rapport toEntity(GenerateReportRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "exports", ignore = true)
    @Mapping(target = "cheminFichier", ignore = true)
    @Mapping(target = "dateGeneration", ignore = true)
    void updateEntity(GenerateReportRequest request, @MappingTarget Rapport rapport);
}
