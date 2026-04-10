package com.timely.planningservice.config;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

import lombok.Getter;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class PlanningGenerationConfig {

    private final int slotDurationMinutes = 60;
    private final LocalTime dayStart = LocalTime.of(8, 0);
    private final LocalTime dayEnd = LocalTime.of(17, 0);
    private final LocalTime lunchStart = LocalTime.of(12, 0);
    private final LocalTime lunchEnd = LocalTime.of(13, 0);
    private final int slotsPerDay = 8;
    private final DayOfWeek[] activeDays = {
        DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
        DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY
    };
    private final long maxGenerationDurationMs = 120_000L;

    private final int scoreCmMorning = 40;
    private final int scoreMidWeek = 10;
    private final int penaltyLateAfternoon = 20;
    private final int scoreGroupSameDay = 50;

    public List<LocalTime> getSlotStartTimes() {
        return List.of(
            LocalTime.of(8, 0), LocalTime.of(9, 0), LocalTime.of(10, 0), LocalTime.of(11, 0),
            LocalTime.of(13, 0), LocalTime.of(14, 0), LocalTime.of(15, 0), LocalTime.of(16, 0)
        );
    }

    public boolean isConsecutive(LocalTime first, LocalTime second) {
        if (first.equals(LocalTime.of(11, 0)) && second.equals(LocalTime.of(13, 0))) {
            return false;
        }
        return first.plusMinutes(slotDurationMinutes).equals(second);
    }
}
