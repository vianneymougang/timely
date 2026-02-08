package com.timely.notificationservice.mapper;

import com.timely.notificationservice.document.Notification;
import com.timely.notificationservice.dto.request.SendNotificationRequest;
import com.timely.notificationservice.dto.response.NotificationResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    NotificationResponse toResponse(Notification notification);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateEnvoi", ignore = true)
    @Mapping(target = "dateLecture", ignore = true)
    @Mapping(target = "tentativesRestantes", ignore = true)
    Notification toEntity(SendNotificationRequest request);

    @Mapping(target = "id", ignore = true)
    void updateEntity(SendNotificationRequest request, @MappingTarget Notification notification);
}
