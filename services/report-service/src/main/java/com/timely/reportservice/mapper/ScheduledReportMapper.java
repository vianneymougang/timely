package com.timely.reportservice.mapper;

import com.timely.reportservice.dto.request.ScheduleReportRequest;
import com.timely.reportservice.dto.response.ScheduledReportResponse;
import com.timely.reportservice.entity.ScheduledReport;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ScheduledReportMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "utilisateurCreateur", ignore = true)
    @Mapping(target = "derniereExecution", ignore = true)
    @Mapping(target = "prochaineExecution", ignore = true)
    @Mapping(target = "nombreExecutions", constant = "0")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "destinatairesEmail", source = "destinatairesEmail", qualifiedByName = "listToString")
    ScheduledReport toEntity(ScheduleReportRequest request);

    @Mapping(target = "destinatairesEmail", source = "destinatairesEmail", qualifiedByName = "stringToList")
    ScheduledReportResponse toResponse(ScheduledReport entity);

    List<ScheduledReportResponse> toResponseList(List<ScheduledReport> entities);

    /**
     * Convertit une liste d'emails en string séparée par des virgules.
     */
    @Named("listToString")
    default String listToString(List<String> emails) {
        if (emails == null || emails.isEmpty()) {
            return "";
        }
        return String.join(",", emails);
    }

    /**
     * Convertit un string d'emails séparés par des virgules en liste.
     */
    @Named("stringToList")
    default List<String> stringToList(String emails) {
        if (emails == null || emails.isBlank()) {
            return List.of();
        }
        return List.of(emails.split(","))
                .stream()
                .map(String::trim)
                .filter(email -> !email.isBlank())
                .toList();
    }
}
