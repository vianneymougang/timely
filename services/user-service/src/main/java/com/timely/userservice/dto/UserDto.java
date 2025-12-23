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
public class UserDto {
    private UUID id;
    private String name;
    private String surname;
    private String email;
    private Long telephoneNumber;
    private Role role;
    private UserStatus status;
    private LocalDate creationDate;
}
