package com.timely.userservice.model;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.DayOfWeek;

@Entity
@Table(name = "teacher_weekly_overrides")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeacherWeeklyOverride {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "teacher_id", nullable = false)
    @NotNull
    private UUID teacherId;

    @Column(name = "week_start", nullable = false)
    @NotNull
    private LocalDate weekStart;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false, length = 10)
    @NotNull
    private DayOfWeek dayOfWeek;

    @Column(name = "hour_start", nullable = false)
    @NotNull
    @Min(8)
    @Max(16)
    private Integer hourStart;

    @Column(name = "hour_end", nullable = false)
    @NotNull
    @Min(9)
    @Max(17)
    private Integer hourEnd;

    @Enumerated(EnumType.STRING)
    @Column(name = "override_type", nullable = false, length = 15)
    @NotNull
    private OverrideType overrideType;

    public enum OverrideType {
        UNAVAILABLE,
        AVAILABLE
    }
}
