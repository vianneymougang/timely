package com.timely.agora_service.mapper;

import com.timely.agora_service.dto.response.LogResponse;
import com.timely.agora_service.entity.LogIntegration;
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
