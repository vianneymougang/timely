package com.timely.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO for teacher-school assignment responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IntervenirEcoleDto {
    private UUID id;
    private UUID enseignantId;
    private UUID ecoleId;
    private LocalDate dateDebut;
    private LocalDate dateFin;
}
