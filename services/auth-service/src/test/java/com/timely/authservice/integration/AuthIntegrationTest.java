package com.timely.authservice.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.jdbc.Sql;

import com.timely.authservice.AbstractAuthIntegrationTest;
import com.timely.authservice.client.UserServiceClient;
import com.timely.authservice.dto.AuthResponse;
import com.timely.authservice.dto.InternalUserDto;
import com.timely.authservice.dto.LoginRequest;
import com.timely.authservice.dto.RefreshTokenRequest;
import com.timely.authservice.model.Role;
import com.timely.authservice.model.UserStatus;
import com.timely.authservice.service.AuthService;
import com.timely.authservice.service.RefreshTokenService;
import com.timely.authservice.service.TokenBlacklistService;

/**
 * Integration tests for auth-service.
 *
 * Tests cover F1.4 authentication workflow:
 * - Login with credentials and token generation
 * - Logout with token blacklist
 * - Token refresh with refresh token rotation
 * - Token validation with blacklist check
 * - Redis TTL management for blacklisted tokens
 *
 * Uses PostgreSQL and Redis Testcontainers.
 */
@DisplayName("Auth Service Integration Tests - F1.4 Authentication Workflow")
class AuthIntegrationTest extends AbstractAuthIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private AuthService authService;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @MockBean
    private UserServiceClient userServiceClient;

    private static final String LOGIN_ENDPOINT = "/api/auth/login";
    private static final String LOGOUT_ENDPOINT = "/api/auth/logout";
    private static final String REFRESH_ENDPOINT = "/api/auth/refresh";
    private static final String VALIDATE_ENDPOINT = "/api/auth/validate";

    private UUID testUserId;
    private InternalUserDto testUserDto;

    @BeforeEach
    void setUp() {
        // Initialize test user data
        testUserId = UUID.randomUUID();
        testUserDto = new InternalUserDto(
            testUserId,
            "John",
            "Doe",
            "john.doe@iusjc.edu",
            123456789,
            "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/DiO", // bcrypt hash of "password123"
            Role.ROLE_TEACHER,
            UserStatus.ACTIVE,
            LocalDate.now()
        );

        // Mock UserServiceClient responses
        when(userServiceClient.findByEmail(anyString())).thenReturn(testUserDto);
        when(userServiceClient.findById(any(UUID.class))).thenReturn(testUserDto);
    }

    @Test
    @DisplayName("F1.4 - Full authentication workflow: login validates credentials and generates tokens")
    @Sql(scripts = { "classpath:sql/test-refresh-tokens-clean.sql" })
    void login_andValidate_fullWorkflow() {
        // Given: Valid user credentials
        String email = "john.doe@iusjc.edu";
        String password = "password123";
        LoginRequest loginRequest = new LoginRequest(email, password);

        // When: User logs in
        ResponseEntity<AuthResponse> loginResponse = restTemplate.postForEntity(
            LOGIN_ENDPOINT,
            loginRequest,
            AuthResponse.class
        );

        // Then: Login is successful with valid response
        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        AuthResponse authResponse = loginResponse.getBody();
        assertNotNull(authResponse);
        assertNotNull(authResponse.getAccessToken());
        assertNotNull(authResponse.getRefreshToken());
        assertThat(authResponse.getEmail()).isEqualTo(email);
        assertThat(authResponse.getTokenType()).isEqualTo("Bearer");
        assertNotNull(authResponse.getUserId());
        assertNotNull(authResponse.getRole());
        assertNotNull(authResponse.getName());

        // Verify tokens are JWT formatted (contains 3 parts separated by dots)
        assertThat(authResponse.getAccessToken().split("\\.")).hasSize(3);
        assertThat(authResponse.getRefreshToken()).isNotEmpty();

        // Verify refresh token exists in database
        assertTrue(refreshTokenService.findByToken(authResponse.getRefreshToken()).isPresent());

        // Verify token is valid (not blacklisted yet)
        assertTrue(authService.validateToken(authResponse.getAccessToken()));
    }

    @Test
    @DisplayName("F1.4 - Logout invalidates refresh token in database")
    @Sql(scripts = { "classpath:sql/test-refresh-tokens-clean.sql" })
    void logout_tokenBecomesInvalid() {
        // Given: User is logged in
        LoginRequest loginRequest = new LoginRequest("john.doe@iusjc.edu", "password123");
        ResponseEntity<AuthResponse> loginResponse = restTemplate.postForEntity(
            LOGIN_ENDPOINT,
            loginRequest,
            AuthResponse.class
        );
        AuthResponse authResponse = loginResponse.getBody();
        assertNotNull(authResponse);

        String refreshToken = authResponse.getRefreshToken();
        String accessToken = authResponse.getAccessToken();

        // Verify refresh token exists before logout
        assertTrue(refreshTokenService.findByToken(refreshToken).isPresent());
        assertTrue(authService.validateToken(accessToken));

        // When: User logs out
        RefreshTokenRequest logoutRequest = new RefreshTokenRequest(refreshToken);
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<RefreshTokenRequest> entity = new HttpEntity<>(logoutRequest, headers);

        ResponseEntity<Map> logoutResponse = restTemplate.postForEntity(
            LOGOUT_ENDPOINT,
            entity,
            Map.class
        );

        // Then: Logout is successful
        assertThat(logoutResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(logoutResponse.getBody())
            .containsEntry("message", "Logout successful");

        // Verify refresh token is deleted from database
        assertFalse(refreshTokenService.findByToken(refreshToken).isPresent());
    }

    @Test
    @DisplayName("F1.4 - Logout blacklists access token in Redis with TTL equals token expiration")
    @Sql(scripts = { "classpath:sql/test-refresh-tokens-clean.sql" })
    void logout_tokenBlacklistedInRedis_withTTL() {
        // Given: User is logged in
        LoginRequest loginRequest = new LoginRequest("john.doe@iusjc.edu", "password123");
        ResponseEntity<AuthResponse> loginResponse = restTemplate.postForEntity(
            LOGIN_ENDPOINT,
            loginRequest,
            AuthResponse.class
        );
        AuthResponse authResponse = loginResponse.getBody();
        assertNotNull(authResponse);

        String refreshToken = authResponse.getRefreshToken();
        String accessToken = authResponse.getAccessToken();

        // Verify token is not blacklisted before logout
        assertFalse(tokenBlacklistService.isTokenBlacklisted(accessToken));

        // When: User logs out
        RefreshTokenRequest logoutRequest = new RefreshTokenRequest(refreshToken);
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<RefreshTokenRequest> entity = new HttpEntity<>(logoutRequest, headers);

        ResponseEntity<Map> logoutResponse = restTemplate.postForEntity(
            LOGOUT_ENDPOINT,
            entity,
            Map.class
        );

        // Then: Logout is successful and token is blacklisted
        assertThat(logoutResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Verify token is now blacklisted in Redis
        assertTrue(tokenBlacklistService.isTokenBlacklisted(accessToken));

        // Verify TTL is set (should be positive, less than or equal to token expiration)
        long ttl = tokenBlacklistService.getBlacklistTTL(accessToken);
        assertThat(ttl).isGreaterThan(0);
        // Access token expiration is 3600000 ms (1 hour), so TTL should be close to that
        assertThat(ttl).isLessThanOrEqualTo(3600);  // 1 hour in seconds
    }

    @Test
    @DisplayName("F1.4 - Refresh token fails after logout because refresh token is deleted")
    @Sql(scripts = { "classpath:sql/test-refresh-tokens-clean.sql" })
    void refreshToken_afterLogout_fails() {
        // Given: User is logged in
        LoginRequest loginRequest = new LoginRequest("john.doe@iusjc.edu", "password123");
        ResponseEntity<AuthResponse> loginResponse = restTemplate.postForEntity(
            LOGIN_ENDPOINT,
            loginRequest,
            AuthResponse.class
        );
        AuthResponse authResponse = loginResponse.getBody();
        assertNotNull(authResponse);

        String refreshToken = authResponse.getRefreshToken();
        String accessToken = authResponse.getAccessToken();

        // When: User logs out
        RefreshTokenRequest logoutRequest = new RefreshTokenRequest(refreshToken);
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<RefreshTokenRequest> entity = new HttpEntity<>(logoutRequest, headers);

        ResponseEntity<Map> logoutResponse = restTemplate.postForEntity(
            LOGOUT_ENDPOINT,
            entity,
            Map.class
        );
        assertThat(logoutResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // When: User tries to refresh token after logout
        RefreshTokenRequest refreshRequest = new RefreshTokenRequest(refreshToken);
        ResponseEntity<AuthResponse> refreshResponse = restTemplate.postForEntity(
            REFRESH_ENDPOINT,
            refreshRequest,
            AuthResponse.class
        );

        // Then: Refresh fails because refresh token was deleted
        assertThat(refreshResponse.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    @DisplayName("F1.4 - Validate token endpoint returns false for blacklisted token")
    @Sql(scripts = { "classpath:sql/test-refresh-tokens-clean.sql" })
    void validateToken_afterBlacklist_returnsFalse() {
        // Given: User is logged in
        LoginRequest loginRequest = new LoginRequest("john.doe@iusjc.edu", "password123");
        ResponseEntity<AuthResponse> loginResponse = restTemplate.postForEntity(
            LOGIN_ENDPOINT,
            loginRequest,
            AuthResponse.class
        );
        AuthResponse authResponse = loginResponse.getBody();
        assertNotNull(authResponse);

        String accessToken = authResponse.getAccessToken();
        String refreshToken = authResponse.getRefreshToken();

        // Verify token is valid before logout
        HttpHeaders headersBeforeLogout = new HttpHeaders();
        headersBeforeLogout.set("Authorization", "Bearer " + accessToken);
        ResponseEntity<Map> validateBeforeLogout = restTemplate.getForEntity(
            VALIDATE_ENDPOINT,
            Map.class,
            headersBeforeLogout
        );
        assertThat(validateBeforeLogout.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(validateBeforeLogout.getBody()).containsEntry("valid", true);

        // When: User logs out (which blacklists the access token)
        RefreshTokenRequest logoutRequest = new RefreshTokenRequest(refreshToken);
        HttpHeaders logoutHeaders = new HttpHeaders();
        logoutHeaders.set("Authorization", "Bearer " + accessToken);
        HttpEntity<RefreshTokenRequest> logoutEntity = new HttpEntity<>(logoutRequest, logoutHeaders);

        ResponseEntity<Map> logoutResponse = restTemplate.postForEntity(
            LOGOUT_ENDPOINT,
            logoutEntity,
            Map.class
        );
        assertThat(logoutResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // When: Validate endpoint is called with blacklisted token
        HttpHeaders headersAfterLogout = new HttpHeaders();
        headersAfterLogout.set("Authorization", "Bearer " + accessToken);

        // Create a new request with the headers
        ResponseEntity<Map> validateResponse = restTemplate.exchange(
            VALIDATE_ENDPOINT,
            org.springframework.http.HttpMethod.GET,
            new HttpEntity<>(headersAfterLogout),
            Map.class
        );

        // Then: Validation fails because token is blacklisted
        assertThat(validateResponse.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(validateResponse.getBody()).containsEntry("valid", false);
        assertThat(validateResponse.getBody())
            .containsEntry("message", "Token is invalid or has been revoked");
    }
}
