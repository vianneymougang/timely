package com.timely.userservice.dto;

import com.timely.userservice.model.UserStatus;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String name;
    private String surname;
    
    @Email(message = "Email should be valid")
    private String email;
    
    private Long telephoneNumber;
    private UserStatus status;
    
    // Teacher-specific fields (optional)
    private String matricule;
    private String grade;
    private String rank;
    private String hourlyRate;
    
    // Admin-specific fields (optional)
    private Integer accessLevel;
    private Integer department;
}
