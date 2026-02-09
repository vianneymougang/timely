package com.timely.agora_service.mapper;

import com.timely.agora_service.dto.request.MappingRequest;
import com.timely.agora_service.dto.response.MappingResponse;
import com.timely.agora_service.entity.MappingEntites;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MappingEntitesMapper {

    MappingResponse toResponse(MappingEntites entity);

    MappingEntites toEntity(MappingRequest request);

    List<MappingResponse> toResponseList(List<MappingEntites> entities);
}
