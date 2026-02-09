package com.timely.userservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Request DTO for assigning teachers to schools or courses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignTeacherRequest {

    @NotNull(message = "Start date is required")
    private LocalDate dateDebut;

    private LocalDate dateFin;
}
