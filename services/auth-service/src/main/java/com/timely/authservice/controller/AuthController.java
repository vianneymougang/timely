package com.timely.authservice.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timely.authservice.dto.AuthResponse;
import com.timely.authservice.dto.LoginRequest;
import com.timely.authservice.dto.RefreshTokenRequest;
import com.timely.authservice.service.AuthService;
import com.timely.authservice.util.JwtUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    // Constructeur (injection de dépendances)
    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Refresh access token endpoint
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request.getToken());
        return ResponseEntity.ok(response);
    }

    /**
     * Logout endpoint
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request.getToken());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }

    /**
     * Validate token endpoint (for other microservices)
     */
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Vérifier que l'en-tête commence par "Bearer "
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("valid", false);
                response.put("message", "Invalid authorization header format");
                return ResponseEntity.status(401).body(response);
            }

            String token = authHeader.substring(7); // Remove "Bearer " prefix

            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.extractUsername(token);
                String role = jwtUtil.extractRole(token);

                response.put("valid", true);
                response.put("email", email);
                response.put("role", role);

                return ResponseEntity.ok(response);
            } else {
                response.put("valid", false);
                response.put("message", "Token is invalid or expired");
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            response.put("valid", false);
            response.put("message", "Token validation failed: " + e.getMessage());
            return ResponseEntity.status(401).body(response);
        }
    }
}