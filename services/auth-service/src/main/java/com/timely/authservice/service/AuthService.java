package com.timely.authservice.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.authservice.client.UserServiceClient;
import com.timely.authservice.dto.AuthResponse;
import com.timely.authservice.dto.InternalUserDto;
import com.timely.authservice.dto.LoginRequest;
import com.timely.authservice.model.RefreshToken;
import com.timely.authservice.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserServiceClient userServiceClient;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final CustomUserDetailsService userDetailsService;

    /**
     * Authenticate user and generate tokens
     */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Load user details
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        // Find user from user-service
        InternalUserDto user = userServiceClient.findByEmail(request.getEmail());

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(userDetails);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        // Build response
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .name(user.getName() + " " + user.getSurname())
                .status(user.getStatus())
                .build();
    }

    /**
     * Refresh access token using refresh token
     */
    @Transactional
    public AuthResponse refreshToken(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenStr)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        // Verify expiration
        refreshTokenService.verifyExpiration(refreshToken);

        // Get user from user-service
        InternalUserDto user = userServiceClient.findById(refreshToken.getUserId());

        // Generate new access token
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String newAccessToken = jwtUtil.generateAccessToken(userDetails);

        // Create new refresh token (token rotation)
        refreshTokenService.deleteToken(refreshToken);
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId());

        // Build response
        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken.getToken())
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .name(user.getName() + " " + user.getSurname())
                .status(user.getStatus())
                .build();
    }

    /**
     * Logout user by invalidating refresh token
     */
    @Transactional
    public void logout(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenStr)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));
        
        refreshTokenService.deleteToken(refreshToken);
    }
}
