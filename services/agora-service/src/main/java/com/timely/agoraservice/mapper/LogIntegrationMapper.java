package com.timely.agoraservice.mapper;

import com.timely.agoraservice.dto.response.LogResponse;
import com.timely.agoraservice.entity.LogIntegration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LogIntegrationMapper {

    @Mapping(source = "exportAgora.id", target = "exportAgoraId")
    LogResponse toResponse(LogIntegration entity);

    List<LogResponse> toResponseList(List<LogIntegration> entities);
}
