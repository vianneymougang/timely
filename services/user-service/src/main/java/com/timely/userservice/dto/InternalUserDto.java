package com.timely.userservice.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.timely.userservice.model.Role;
import com.timely.userservice.model.UserStatus;

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
    private Long telephoneNumber;
    private String password;  // Included for auth-service
    private Role role;
    private UserStatus status;
    private LocalDate creationDate;
}
