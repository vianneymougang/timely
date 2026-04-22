package com.timely.reportservice.dto.client;

import java.util.UUID;

public record SalleDTO(UUID id, String nom, Integer capacite, String typeSalle) {}
