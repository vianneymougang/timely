package com.timely.planningservice.dto.response;

import java.util.List;
import java.util.UUID;

public record SchoolResult(
        UUID ecoleId,
        String ecoleNom,
        UUID emploiDuTempsId,
        int coursesScheduled,
        int coursesUnscheduled,
        List<CoursNonPlanifie> unscheduledCourses,
        double successRate
) {}
