package com.timely.userservice.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class WeeklyOverridesRequest {

    @NotNull
    private LocalDate weekStart;

    @Valid
    private List<WeeklyOverrideItemDto> overrides;
}
