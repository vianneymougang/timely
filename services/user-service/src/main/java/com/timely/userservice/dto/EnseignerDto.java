package com.timely.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO for teacher-course assignment responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnseignerDto {
    private UUID id;
    private UUID enseignantId;
    private UUID coursId;
    private LocalDate dateDebut;
    private LocalDate dateFin;
}
