package com.timely.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO representing a course from booking-service.
 * Used for Feign client communication.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoursResponseDto {
    private UUID id;
    private String code;
    private String libelle;
    private String typeCours; // CM, TD, TP
    private Integer volumeHoraire;
    private UUID ecoleId;
}
