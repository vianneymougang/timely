package com.timely.agoraservice.dto.request;

import com.timely.agoraservice.entity.enums.FormatExportAgora;
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
