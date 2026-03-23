package com.timely.reportservice.mapper;

import com.timely.reportservice.dto.response.AuditLogResponse;
import com.timely.reportservice.entity.AuditLog;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AuditLogMapper {

    AuditLogResponse toResponse(AuditLog entity);

    List<AuditLogResponse> toResponseList(List<AuditLog> entities);
}
