package com.timely.apigateway.config;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Rate Limiter Configuration using Bucket4j
 * Configures rate limiting: 100 requests per minute per user/IP
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class RateLimiterConfig {

    private final RedisTemplate<String, Object> redisTemplate;

    private final ConcurrentHashMap<String, Bucket> cache = new ConcurrentHashMap<>();

    /**
     * Get or create a rate limit bucket for a given key
     * @param key User ID or IP address
     * @return Bucket for rate limiting
     */
    public Bucket resolveBucket(String key) {
        return cache.computeIfAbsent(key, k -> createNewBucket());
    }

    /**
     * Create a new bucket with rate limit: 100 requests per minute
     */
    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Extract rate limit key from request
     * Priority: userId from JWT > IP address
     */
    public String resolveKey(String userId, String ipAddress) {
        if (userId != null && !userId.isEmpty()) {
            log.debug("Rate limiting by userId: {}", userId);
            return "user:" + userId;
        }

        log.debug("Rate limiting by IP: {}", ipAddress);
        return "ip:" + ipAddress;
    }
}
