package com.timely.notificationservice.mapper;

import com.timely.notificationservice.document.Template;
import com.timely.notificationservice.dto.request.TemplateRequest;
import com.timely.notificationservice.dto.response.TemplateResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TemplateMapper {

    TemplateResponse toResponse(Template template);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateModification", ignore = true)
    Template toEntity(TemplateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateModification", ignore = true)
    void updateEntity(TemplateRequest request, @MappingTarget Template template);
}
