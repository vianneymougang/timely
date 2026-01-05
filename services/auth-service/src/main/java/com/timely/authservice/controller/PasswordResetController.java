package com.timely.authservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timely.authservice.dto.ForgotPasswordRequest;
import com.timely.authservice.dto.ResetPasswordRequest;
import com.timely.authservice.service.PasswordResetService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {
    
    private final PasswordResetService passwordResetService;
    
    /**
     * Request password reset - sends email with reset link
     * Always returns success to prevent email enumeration
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok("If an account exists with this email, you will receive a password reset link.");
    }
    
    /**
     * Validate reset token
     */
    @GetMapping("/validate-reset-token/{token}")
    public ResponseEntity<Void> validateResetToken(@PathVariable String token) {
        boolean isValid = passwordResetService.validateResetToken(token);
        return isValid ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
    
    /**
     * Reset password using token
     */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Password has been reset successfully.");
    }
}
