package com.timely.authservice.service;

public interface PasswordResetService {
    /**
     * Request a password reset - generates token and sends email
     * @param email User email
     */
    void requestPasswordReset(String email);
    
    /**
     * Validate a reset token
     * @param token Reset token
     * @return true if token is valid, false otherwise
     */
    boolean validateResetToken(String token);
    
    /**
     * Reset password using token
     * @param token Reset token
     * @param newPassword New password (will be encoded)
     */
    void resetPassword(String token, String newPassword);
}
