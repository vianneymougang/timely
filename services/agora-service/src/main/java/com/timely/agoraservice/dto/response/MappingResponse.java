package com.timely.agoraservice.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class MappingResponse {

    private UUID id;
    private String entiteLocaleType;
    private UUID entiteLocaleId;
    private String entiteAgoraId;
    private String typeMapping;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
