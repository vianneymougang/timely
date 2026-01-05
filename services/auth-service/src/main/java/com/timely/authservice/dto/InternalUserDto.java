package com.timely.authservice.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.timely.authservice.model.Role;
import com.timely.authservice.model.UserStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InternalUserDto {
    private UUID id;
    private String name;
    private String surname;
    private String email;
    private Integer telephoneNumber;
    private String password;  // Included for authentication
    private Role role;
    private UserStatus status;
    private LocalDate creationDate;
}
