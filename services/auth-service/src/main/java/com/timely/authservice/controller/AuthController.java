package com.timely.authservice.controller;

import com.timely.authservice.dto.AuthResponse;
import com.timely.authservice.dto.LoginRequest;
import com.timely.authservice.dto.RefreshTokenRequest;
import com.timely.authservice.dto.RegisterTeacherRequest;
import com.timely.authservice.repository.UserRepository;
import com.timely.authservice.service.AuthService;
import com.timely.authservice.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    /**
     * Login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Register teacher endpoint (Admin-only)
     */
    @PostMapping("/register/teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuthResponse> registerTeacher(@Valid @RequestBody RegisterTeacherRequest request) {
        AuthResponse response = authService.registerTeacher(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Refresh access token endpoint
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }

    /**
     * Logout endpoint
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request.getRefreshToken());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }

    /**
     * Validate token endpoint (for other microservices)
     */
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String email = jwtUtil.extractUsername(token);
            
            if (jwtUtil.validateToken(token)) {
                Map<String, Object> response = new HashMap<>();
                response.put("valid", true);
                response.put("email", email);
                
                // Optionally include user details
                userRepository.findByEmail(email).ifPresent(user -> {
                    response.put("userId", user.getId());
                    response.put("role", user.getRole());
                    response.put("status", user.getStatus());
                });
                
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            // Token is invalid
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", false);
        return ResponseEntity.status(401).body(response);
    }

    /**
     * Delete teacher endpoint (Admin-only)
     */
    @DeleteMapping("/teachers/{teacherId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteTeacher(@PathVariable UUID teacherId) {
        userRepository.deleteById(teacherId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Teacher deleted successfully");
        return ResponseEntity.ok(response);
    }
}
