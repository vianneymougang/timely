package com.timely.authservice.service;

<<<<<<< HEAD
import com.timely.authservice.dto.AuthResponse;
import com.timely.authservice.dto.LoginRequest;
import com.timely.authservice.dto.RegisterTeacherRequest;
import com.timely.authservice.model.RefreshToken;
import com.timely.authservice.model.Role;
import com.timely.authservice.model.Teacher;
import com.timely.authservice.model.User;
import com.timely.authservice.model.UserStatus;
import com.timely.authservice.repository.UserRepository;
import com.timely.authservice.util.JwtUtil;
=======
>>>>>>> 0ea8e076f89dd6ae6a11210df6b146a8af9075d8
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
public class AuthService {

    private final UserServiceClient userServiceClient;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                      JwtUtil jwtUtil, AuthenticationManager authenticationManager,
                      RefreshTokenService refreshTokenService, CustomUserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.refreshTokenService = refreshTokenService;
        this.userDetailsService = userDetailsService;
    }

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
