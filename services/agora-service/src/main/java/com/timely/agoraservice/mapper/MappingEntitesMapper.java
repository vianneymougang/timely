package com.timely.agoraservice.mapper;

import com.timely.agoraservice.dto.request.MappingRequest;
import com.timely.agoraservice.dto.response.MappingResponse;
import com.timely.agoraservice.entity.MappingEntites;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MappingEntitesMapper {

    MappingResponse toResponse(MappingEntites entity);

    MappingEntites toEntity(MappingRequest request);

    List<MappingResponse> toResponseList(List<MappingEntites> entities);
}
