package com.timely.userservice.dto;

import com.timely.userservice.model.TeacherWeeklyOverride;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.DayOfWeek;

@Data
public class WeeklyOverrideItemDto {

    @NotNull
    private DayOfWeek dayOfWeek;

    @NotNull
    @Min(8)
    @Max(16)
    private Integer hourStart;

    @NotNull
    @Min(9)
    @Max(17)
    private Integer hourEnd;

    @NotNull
    private TeacherWeeklyOverride.OverrideType overrideType;
}
