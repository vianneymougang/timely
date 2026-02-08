package com.timely.planningservice.dto.request;

import java.util.UUID;

import com.timely.planningservice.entity.enums.Severite;
import com.timely.planningservice.entity.enums.TypeConflit;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConflitRequestDTO {

    @NotNull(message = "Le type de conflit est obligatoire")
    private TypeConflit typeConflit;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    @NotNull(message = "La sévérité est obligatoire")
    private Severite severite;

    private String suggestionResolution;
    private UUID reservation1Id;
    private UUID reservation2Id;
}
