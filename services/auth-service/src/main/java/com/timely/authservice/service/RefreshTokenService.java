package com.timely.authservice.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.authservice.model.RefreshToken;
import com.timely.authservice.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    /**
     * Create a new refresh token for a user
     */
    @Transactional
    public RefreshToken createRefreshToken(UUID userId) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(userId);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000));
        refreshToken.setCreatedDate(LocalDateTime.now());
        
        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * Find refresh token by token string
     */
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    /**
     * Verify if refresh token is expired
     */
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token has expired. Please login again.");
        }
        return token;
    }

    /**
     * Delete all refresh tokens for a user (used during logout)
     */
    @Transactional
    public int deleteByUserId(@NonNull UUID userId) {
        return refreshTokenRepository.deleteByUserId(userId);
    }

    /**
     * Delete a specific refresh token
     */
    @Transactional
    public void deleteToken(@NonNull RefreshToken token) {
        refreshTokenRepository.delete(token);
    }

    /**
     * Scheduled task to clean up expired refresh tokens
     * Runs daily at 2 AM
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void deleteExpiredTokens() {
        int deletedCount = refreshTokenRepository.deleteByExpiryDateBefore(LocalDateTime.now());
        log.info("Deleted {} expired refresh tokens", deletedCount);
    }
}
