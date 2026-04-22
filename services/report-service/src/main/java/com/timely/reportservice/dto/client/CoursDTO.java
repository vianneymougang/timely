package com.timely.reportservice.dto.client;

import java.util.UUID;

public record CoursDTO(
        UUID id,
        String intitule,
        String typeCours,
        Integer volumeHoraire,
        UUID enseignantId,
        UUID ecoleId) {}
