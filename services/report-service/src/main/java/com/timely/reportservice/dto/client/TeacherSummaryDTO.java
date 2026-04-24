package com.timely.reportservice.dto.client;

import java.util.UUID;

public record TeacherSummaryDTO(UUID id, String name, String surname, String email) {}
