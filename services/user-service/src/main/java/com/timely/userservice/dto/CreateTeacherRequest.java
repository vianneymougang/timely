package com.timely.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTeacherRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Surname is required")
    private String surname;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    private Long telephoneNumber;

    @NotBlank(message = "Matricule is required")
    private String matricule;

    @NotBlank(message = "Grade is required")
    private String grade;

    @NotBlank(message = "Rank is required")
    private String rank;

    @NotBlank(message = "Hourly rate is required")
    private String hourlyRate;
}
