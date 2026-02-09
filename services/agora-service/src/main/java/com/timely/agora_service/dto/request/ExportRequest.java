package com.timely.agora_service.dto.request;

import com.timely.agora_service.entity.enums.FormatExportAgora;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ExportRequest {

    @NotNull(message = "L'ID de l'emploi du temps est obligatoire")
    private UUID emploiDuTempsId;

    @NotNull(message = "Le format d'export est obligatoire")
    private FormatExportAgora format;
}
