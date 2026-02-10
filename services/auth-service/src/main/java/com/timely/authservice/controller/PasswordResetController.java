package com.timely.authservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timely.authservice.dto.ForgotPasswordRequest;
import com.timely.authservice.dto.MessageResponse;
import com.timely.authservice.dto.ResetPasswordRequest;
import com.timely.authservice.dto.ValidateTokenResponse;
import com.timely.authservice.service.PasswordResetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {
    
    @Autowired
    private PasswordResetService passwordResetService;
    
    /**
     * Request password reset - sends email with reset link
     * Always returns success to prevent email enumeration
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok(new MessageResponse("If an account exists with this email, you will receive a password reset link."));
    }
    
    /**
     * Validate reset token
     */
    @GetMapping("/validate-reset-token/{token}")
    public ResponseEntity<ValidateTokenResponse> validateResetToken(@PathVariable String token) {
        boolean isValid = passwordResetService.validateResetToken(token);
        return ResponseEntity.ok(new ValidateTokenResponse(isValid));
    }
    
    /**
     * Reset password using token
     */
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(new MessageResponse("Password has been reset successfully."));
    }
}
