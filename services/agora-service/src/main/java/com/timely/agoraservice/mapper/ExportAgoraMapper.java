package com.timely.agoraservice.mapper;

import com.timely.agoraservice.dto.response.ExportAgoraResponse;
import com.timely.agoraservice.entity.ExportAgora;
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
