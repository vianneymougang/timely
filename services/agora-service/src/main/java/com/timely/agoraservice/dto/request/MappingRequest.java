package com.timely.agoraservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class MappingRequest {

    @NotBlank(message = "Le type d'entite locale est obligatoire")
    @Size(max = 50, message = "Le type d'entite locale ne peut pas depasser 50 caracteres")
    private String entiteLocaleType;

    @NotNull(message = "L'ID de l'entite locale est obligatoire")
    private UUID entiteLocaleId;

    @NotBlank(message = "L'ID de l'entite Agora est obligatoire")
    @Size(max = 100, message = "L'ID de l'entite Agora ne peut pas depasser 100 caracteres")
    private String entiteAgoraId;

    @Size(max = 50, message = "Le type de mapping ne peut pas depasser 50 caracteres")
    private String typeMapping;
}
