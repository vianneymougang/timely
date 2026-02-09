package com.timely.authservice.service;

import java.time.Duration;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.timely.authservice.util.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for managing JWT token blacklist in Redis
 * Revoked tokens are stored with TTL = remaining token lifetime
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final JwtUtil jwtUtil;

    private static final String BLACKLIST_PREFIX = "blacklist:token:";

    /**
     * Add a token to the blacklist
     * @param token The JWT token to blacklist
     */
    public void blacklistToken(String token) {
        try {
            // Extract expiration date from token
            Date expirationDate = jwtUtil.extractExpiration(token);

            // Calculate TTL (time until token expires)
            long ttlMillis = expirationDate.getTime() - System.currentTimeMillis();

            if (ttlMillis > 0) {
                String key = BLACKLIST_PREFIX + token;

                // Store token in Redis with TTL
                redisTemplate.opsForValue().set(key, "revoked", Duration.ofMillis(ttlMillis));

                log.info("Token added to blacklist with TTL: {} seconds", ttlMillis / 1000);
            } else {
                log.debug("Token already expired, not adding to blacklist");
            }
        } catch (Exception e) {
            log.error("Error blacklisting token: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to blacklist token", e);
        }
    }

    /**
     * Check if a token is blacklisted
     * @param token The JWT token to check
     * @return true if token is blacklisted, false otherwise
     */
    public boolean isTokenBlacklisted(String token) {
        try {
            String key = BLACKLIST_PREFIX + token;
            Boolean exists = redisTemplate.hasKey(key);

            if (Boolean.TRUE.equals(exists)) {
                log.debug("Token found in blacklist");
                return true;
            }

            return false;
        } catch (Exception e) {
            log.error("Error checking token blacklist: {}", e.getMessage(), e);
            // In case of error, assume token is not blacklisted (fail open)
            return false;
        }
    }

    /**
     * Remove a token from the blacklist (mainly for testing)
     * @param token The JWT token to remove
     */
    public void removeFromBlacklist(String token) {
        try {
            String key = BLACKLIST_PREFIX + token;
            redisTemplate.delete(key);
            log.debug("Token removed from blacklist");
        } catch (Exception e) {
            log.error("Error removing token from blacklist: {}", e.getMessage(), e);
        }
    }

    /**
     * Get remaining TTL for a blacklisted token
     * @param token The JWT token
     * @return TTL in seconds, or -1 if not blacklisted
     */
    public long getBlacklistTTL(String token) {
        try {
            String key = BLACKLIST_PREFIX + token;
            Long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);
            return ttl != null ? ttl : -1;
        } catch (Exception e) {
            log.error("Error getting blacklist TTL: {}", e.getMessage(), e);
            return -1;
        }
    }
}
