package com.timely.authservice.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.authservice.client.UserServiceClient;
import com.timely.authservice.dto.InternalUserDto;
import com.timely.authservice.dto.UpdatePasswordRequest;
import com.timely.authservice.event.PasswordResetEvent;
import com.timely.authservice.exception.InvalidTokenException;
import com.timely.authservice.model.PasswordResetToken;
import com.timely.authservice.repository.PasswordResetTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {
    
    private static final Logger logger = LoggerFactory.getLogger(PasswordResetServiceImpl.class);
    private static final int TOKEN_EXPIRATION_HOURS = 24;
    
    private final PasswordResetTokenRepository tokenRepository;
    private final UserServiceClient userServiceClient;
    private final RabbitTemplate rabbitTemplate;
    
    private static final String EXCHANGE = "timely.notifications";
    private static final String ROUTING_KEY = "password.reset";
    
    @Override
    @Transactional
    public void requestPasswordReset(String email) {
        // Always return success to prevent email enumeration
        try {
            // Check if user exists
            if (!userServiceClient.existsByEmail(email)) {
                logger.info("Password reset requested for non-existent email (security: no disclosure)");
                return; // Don't reveal that email doesn't exist
            }
            
            InternalUserDto user = userServiceClient.findByEmail(email);
            
            // Invalidate all previous tokens for this user
            tokenRepository.invalidateAllUserTokens(user.getId());
            
            // Generate new reset token
            String token = UUID.randomUUID().toString();
            
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUserId(user.getId());
            resetToken.setExpiryDate(LocalDateTime.now().plusHours(TOKEN_EXPIRATION_HOURS));
            resetToken.setUsed(false);
            
            tokenRepository.save(resetToken);
            
            // Send email with reset link
            String resetLink = String.format("http://localhost:4200/auth/reset-password?token=%s", token);
            sendResetEmail(email, resetLink);
            
            logger.info("Password reset token generated for user: {}", user.getId());
            
        } catch (Exception e) {
            // Log error but don't expose it to prevent information disclosure
            logger.error("Error processing password reset request", e);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean validateResetToken(String token) {
        return tokenRepository.findByToken(token)
                .map(resetToken -> !resetToken.isExpired() && !resetToken.isUsed())
                .orElse(false);
    }
    
    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired reset token"));
        
        if (resetToken.isExpired()) {
            throw new InvalidTokenException("Reset token has expired");
        }
        
        if (resetToken.isUsed()) {
            throw new InvalidTokenException("Reset token has already been used");
        }
        
        // Get user and update password via UserServiceClient
        InternalUserDto user = userServiceClient.findById(resetToken.getUserId());
        
        // Call user-service to update password
        UpdatePasswordRequest updateRequest = new UpdatePasswordRequest(newPassword);
        userServiceClient.updatePassword(user.getId(), updateRequest);
        
        logger.info("Password reset successful for user: {}", user.getId());
        
        // Mark token as used
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
        
        // Invalidate all other tokens for this user
        tokenRepository.invalidateAllUserTokens(user.getId());
    }
    
    /**
     * Publish password reset event to RabbitMQ
     */
    private void sendResetEmail(String email, String resetLink) {
        logger.info("Publishing password reset event for email: {}", email);
        
        try {
            // Extract name from email or use email as fallback
            String recipientName = email.substring(0, email.indexOf('@'));
            
            PasswordResetEvent event = new PasswordResetEvent(email, resetLink, recipientName);
            rabbitTemplate.convertAndSend(EXCHANGE, ROUTING_KEY, event);
            
            logger.info("Password reset event published successfully for: {}", email);
        } catch (Exception e) {
            logger.error("Failed to publish password reset event for: {}", email, e);
            // Don't throw exception - we don't want to interrupt the password reset flow
        }
    }
}
