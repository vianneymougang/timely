package com.timely.agora_service.mapper;

import com.timely.agora_service.dto.response.ExportAgoraResponse;
import com.timely.agora_service.entity.ExportAgora;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExportAgoraMapper {

    @Mapping(target = "logsCount", expression = "java(entity.getLogs() != null ? entity.getLogs().size() : 0)")
    ExportAgoraResponse toResponse(ExportAgora entity);

    List<ExportAgoraResponse> toResponseList(List<ExportAgora> entities);
}
