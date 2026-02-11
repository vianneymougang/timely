package com.timely.authservice.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.User;

import com.timely.authservice.client.UserServiceClient;
import com.timely.authservice.dto.AuthResponse;
import com.timely.authservice.dto.InternalUserDto;
import com.timely.authservice.dto.LoginRequest;
import com.timely.authservice.model.RefreshToken;
import com.timely.authservice.model.Role;
import com.timely.authservice.model.UserStatus;
import com.timely.authservice.util.JwtUtil;

/**
 * Unit tests for AuthService.
 *
 * Tests the authentication flow including login, token refresh, logout, and validation.
 * Uses Mockito for mocking dependencies and AssertJ for assertions.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock
    private UserServiceClient userServiceClient;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private CustomUserDetailsService customUserDetailsService;

    @Mock
    private TokenBlacklistService tokenBlacklistService;

    @InjectMocks
    private AuthService authService;

    private LoginRequest loginRequest;
    private InternalUserDto userDto;
    private RefreshToken refreshToken;
    private UserDetails userDetails;
    private Authentication authentication;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();

        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        userDto = new InternalUserDto(
                userId,
                "John",
                "Doe",
                "test@example.com",
                123456789,
                "hashedPassword",
                Role.ROLE_TEACHER,
                UserStatus.ACTIVE,
                LocalDate.now()
        );

        refreshToken = new RefreshToken();
        refreshToken.setId(UUID.randomUUID());
        refreshToken.setToken("refresh_token_value");
        refreshToken.setUserId(userId);
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));
        refreshToken.setCreatedDate(LocalDateTime.now());

        userDetails = User.builder()
                .username("test@example.com")
                .password("hashedPassword")
                .roles("TEACHER")
                .build();

        authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                "password123",
                userDetails.getAuthorities()
        );
    }

    @Test
    @DisplayName("login with valid credentials returns tokens and user info")
    void login_validCredentials_returnsTokens() {
        // Arrange
        String accessTokenValue = "access_token_jwt";
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userServiceClient.findByEmail(loginRequest.getEmail()))
                .thenReturn(userDto);
        when(jwtUtil.generateAccessToken(userDetails))
                .thenReturn(accessTokenValue);
        when(refreshTokenService.createRefreshToken(userId))
                .thenReturn(refreshToken);

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertThat(response)
                .isNotNull()
                .satisfies(r -> {
                    assertThat(r.getAccessToken()).isEqualTo(accessTokenValue);
                    assertThat(r.getRefreshToken()).isEqualTo(refreshToken.getToken());
                    assertThat(r.getUserId()).isEqualTo(userId);
                    assertThat(r.getEmail()).isEqualTo("test@example.com");
                    assertThat(r.getRole()).isEqualTo(Role.ROLE_TEACHER);
                    assertThat(r.getName()).isEqualTo("John Doe");
                    assertThat(r.getStatus()).isEqualTo(UserStatus.ACTIVE);
                    assertThat(r.getTokenType()).isEqualTo("Bearer");
                });

        // Verify interactions
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userServiceClient).findByEmail(loginRequest.getEmail());
        verify(jwtUtil).generateAccessToken(userDetails);
        verify(refreshTokenService).createRefreshToken(userId);
    }

    @Test
    @DisplayName("login with invalid credentials throws exception")
    void login_invalidCredentials_throwsException() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new org.springframework.security.core.AuthenticationException("Invalid credentials") {});

        // Act & Assert
        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(org.springframework.security.core.AuthenticationException.class)
                .hasMessageContaining("Invalid credentials");

        // Verify interactions
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userServiceClient, never()).findByEmail(anyString());
        verify(jwtUtil, never()).generateAccessToken(any());
        verify(refreshTokenService, never()).createRefreshToken(any());
    }

    @Test
    @DisplayName("refreshToken with valid refresh token returns new access token")
    void refreshToken_validRefreshToken_returnsNewAccessToken() {
        // Arrange
        String newAccessTokenValue = "new_access_token_jwt";
        RefreshToken newRefreshToken = new RefreshToken();
        newRefreshToken.setId(UUID.randomUUID());
        newRefreshToken.setToken("new_refresh_token_value");
        newRefreshToken.setUserId(userId);
        newRefreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));
        newRefreshToken.setCreatedDate(LocalDateTime.now());

        when(refreshTokenService.findByToken(refreshToken.getToken()))
                .thenReturn(Optional.of(refreshToken));
        when(refreshTokenService.verifyExpiration(refreshToken))
                .thenReturn(refreshToken);
        when(userServiceClient.findById(userId))
                .thenReturn(userDto);
        when(customUserDetailsService.loadUserByUsername("test@example.com"))
                .thenReturn(userDetails);
        when(jwtUtil.generateAccessToken(userDetails))
                .thenReturn(newAccessTokenValue);
        when(refreshTokenService.createRefreshToken(userId))
                .thenReturn(newRefreshToken);

        // Act
        AuthResponse response = authService.refreshToken(refreshToken.getToken());

        // Assert
        assertThat(response)
                .isNotNull()
                .satisfies(r -> {
                    assertThat(r.getAccessToken()).isEqualTo(newAccessTokenValue);
                    assertThat(r.getRefreshToken()).isEqualTo(newRefreshToken.getToken());
                    assertThat(r.getUserId()).isEqualTo(userId);
                    assertThat(r.getEmail()).isEqualTo("test@example.com");
                    assertThat(r.getRole()).isEqualTo(Role.ROLE_TEACHER);
                    assertThat(r.getName()).isEqualTo("John Doe");
                    assertThat(r.getStatus()).isEqualTo(UserStatus.ACTIVE);
                });

        // Verify interactions
        verify(refreshTokenService).findByToken(refreshToken.getToken());
        verify(refreshTokenService).verifyExpiration(refreshToken);
        verify(userServiceClient).findById(userId);
        verify(customUserDetailsService).loadUserByUsername("test@example.com");
        verify(jwtUtil).generateAccessToken(userDetails);
        verify(refreshTokenService).deleteToken(refreshToken);
        verify(refreshTokenService).createRefreshToken(userId);
    }

    @Test
    @DisplayName("refreshToken with expired refresh token throws exception")
    void refreshToken_expiredRefreshToken_throwsException() {
        // Arrange
        String refreshTokenStr = "expired_refresh_token";
        when(refreshTokenService.findByToken(refreshTokenStr))
                .thenReturn(Optional.of(refreshToken));
        when(refreshTokenService.verifyExpiration(refreshToken))
                .thenThrow(new RuntimeException("Refresh token has expired. Please login again."));

        // Act & Assert
        assertThatThrownBy(() -> authService.refreshToken(refreshTokenStr))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Refresh token has expired");

        // Verify interactions
        verify(refreshTokenService).findByToken(refreshTokenStr);
        verify(refreshTokenService).verifyExpiration(refreshToken);
        verify(userServiceClient, never()).findById(any());
        verify(jwtUtil, never()).generateAccessToken(any());
    }

    @Test
    @DisplayName("logout with access token blacklists token and deletes refresh token")
    void logout_withAccessToken_blacklistsTokenAndDeletesRefreshToken() {
        // Arrange
        String accessToken = "access_token_value";
        when(refreshTokenService.findByToken(refreshToken.getToken()))
                .thenReturn(Optional.of(refreshToken));
        doNothing().when(refreshTokenService).deleteToken(refreshToken);
        doNothing().when(tokenBlacklistService).blacklistToken(accessToken);

        // Act
        authService.logout(refreshToken.getToken(), accessToken);

        // Assert - no exception thrown

        // Verify interactions
        verify(refreshTokenService).findByToken(refreshToken.getToken());
        verify(refreshTokenService).deleteToken(refreshToken);
        verify(tokenBlacklistService).blacklistToken(accessToken);
    }

    @Test
    @DisplayName("logout without access token only deletes refresh token")
    void logout_withoutAccessToken_onlyDeletesRefreshToken() {
        // Arrange
        when(refreshTokenService.findByToken(refreshToken.getToken()))
                .thenReturn(Optional.of(refreshToken));
        doNothing().when(refreshTokenService).deleteToken(refreshToken);

        // Act
        authService.logout(refreshToken.getToken(), null);

        // Assert - no exception thrown

        // Verify interactions
        verify(refreshTokenService).findByToken(refreshToken.getToken());
        verify(refreshTokenService).deleteToken(refreshToken);
        verify(tokenBlacklistService, never()).blacklistToken(anyString());
    }

    @Test
    @DisplayName("logout with empty access token only deletes refresh token")
    void logout_withEmptyAccessToken_onlyDeletesRefreshToken() {
        // Arrange
        when(refreshTokenService.findByToken(refreshToken.getToken()))
                .thenReturn(Optional.of(refreshToken));
        doNothing().when(refreshTokenService).deleteToken(refreshToken);

        // Act
        authService.logout(refreshToken.getToken(), "");

        // Assert - no exception thrown

        // Verify interactions
        verify(refreshTokenService).findByToken(refreshToken.getToken());
        verify(refreshTokenService).deleteToken(refreshToken);
        verify(tokenBlacklistService, never()).blacklistToken(anyString());
    }

    @Test
    @DisplayName("validateToken with valid token returns true")
    void validateToken_validToken_returnsTrue() {
        // Arrange
        String token = "valid_token_jwt";
        when(tokenBlacklistService.isTokenBlacklisted(token))
                .thenReturn(false);
        when(jwtUtil.validateToken(token))
                .thenReturn(true);

        // Act
        boolean isValid = authService.validateToken(token);

        // Assert
        assertThat(isValid).isTrue();

        // Verify interactions
        verify(tokenBlacklistService).isTokenBlacklisted(token);
        verify(jwtUtil).validateToken(token);
    }

    @Test
    @DisplayName("validateToken with blacklisted token returns false")
    void validateToken_blacklistedToken_returnsFalse() {
        // Arrange
        String token = "blacklisted_token_jwt";
        when(tokenBlacklistService.isTokenBlacklisted(token))
                .thenReturn(true);

        // Act
        boolean isValid = authService.validateToken(token);

        // Assert
        assertThat(isValid).isFalse();

        // Verify interactions
        verify(tokenBlacklistService).isTokenBlacklisted(token);
        verify(jwtUtil, never()).validateToken(token);
    }

    @Test
    @DisplayName("validateToken with expired token returns false")
    void validateToken_expiredToken_returnsFalse() {
        // Arrange
        String token = "expired_token_jwt";
        when(tokenBlacklistService.isTokenBlacklisted(token))
                .thenReturn(false);
        when(jwtUtil.validateToken(token))
                .thenReturn(false);

        // Act
        boolean isValid = authService.validateToken(token);

        // Assert
        assertThat(isValid).isFalse();

        // Verify interactions
        verify(tokenBlacklistService).isTokenBlacklisted(token);
        verify(jwtUtil).validateToken(token);
    }
}
