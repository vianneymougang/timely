package com.timely.agora_service.dto.response;

import com.timely.agora_service.entity.enums.TypeLog;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class LogResponse {

    private UUID id;
    private UUID exportAgoraId;
    private TypeLog typeLog;
    private String message;
    private LocalDateTime timestamp;
    private String stackTrace;
}
