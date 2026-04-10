package com.timely.planningservice.dto.response;

import java.util.List;

public record CampusGenerationResponse(
        List<SchoolResult> schoolResults,
        int totalCourses,
        int totalScheduled,
        int totalUnscheduled,
        double overallSuccessRate,
        long generationDurationMs
) {}
