package com.timely.userservice.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class TeacherDto extends UserDto {
    private String matricule;
    private String grade;
    private String rank;
    private String hourlyRate;
}
