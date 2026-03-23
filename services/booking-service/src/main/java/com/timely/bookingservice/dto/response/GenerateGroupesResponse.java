package com.timely.bookingservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for automatic group generation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerateGroupesResponse {
    private List<GroupeEtudiantResponse> groupes;
    private Integer totalGroupes;
    private Integer totalEtudiants;
    private String message;
}
