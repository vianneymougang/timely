package com.timely.authservice.dto;

import com.timely.authservice.model.Teacher;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO for Teacher response
 * Used to return teacher information without sensitive data (password)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherResponseDTO {
    private UUID id;
    private String name;
    private String surname;
    private String email;
    private Integer telephoneNumber;
    private String matricule;
    private String grade;
    private String rank;
    private String hourlyRate;
    private String status;

    /**
     * Convert Teacher entity to DTO
     */
    public static TeacherResponseDTO fromTeacher(Teacher teacher) {
        return TeacherResponseDTO.builder()
                .id(teacher.getId())
                .name(teacher.getName())
                .surname(teacher.getSurname())
                .email(teacher.getEmail())
                .telephoneNumber(teacher.getTelephoneNumber())
                .matricule(teacher.getMatricule())
                .grade(teacher.getGrade())
                .rank(teacher.getRank())
                .hourlyRate(teacher.getHourlyRate())
                .status(teacher.getStatus() != null ? teacher.getStatus().name() : "ACTIVE")
                .build();
    }
}

