package com.timely.authservice.dto;

import com.timely.authservice.model.Role;
import com.timely.authservice.model.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    @Builder.Default
    private final String tokenType = "Bearer";
    private UUID userId;
    private String email;
    private Role role;
    private String name;
    private UserStatus status;
}
