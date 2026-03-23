package com.timely.reportservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.timely.reportservice.dto.response.ExportResponse;
import com.timely.reportservice.entity.Export;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExportMapper {

    @Mapping(source = "rapport.id", target = "rapportId")
    ExportResponse toResponse(Export export);

    @Mapping(target = "rapport", ignore = true)
    @Mapping(target = "dateExport", ignore = true)
    @Mapping(target = "statut", ignore = true)
    Export toEntity(ExportResponse response);
}
