package com.timely.reportservice.dto.client;

import java.util.UUID;

public record ConflitDTO(
        UUID id,
        String typeConflit,
        String description,
        String severite,
        String statutResolution) {}
