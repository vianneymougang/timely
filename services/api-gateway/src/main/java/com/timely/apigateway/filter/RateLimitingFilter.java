package com.timely.apigateway.filter;

import java.io.IOException;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.timely.apigateway.config.RateLimiterConfig;
import com.timely.apigateway.util.JwtUtil;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Rate Limiting Filter
 * Applies rate limiting to all requests (100 requests/minute per user/IP)
 */
@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RateLimiterConfig rateLimiterConfig;
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Extract userId from JWT token if present
        String userId = extractUserId(request);

        // Get IP address as fallback
        String ipAddress = getClientIP(request);

        // Resolve rate limit key (userId or IP)
        String key = rateLimiterConfig.resolveKey(userId, ipAddress);

        // Get bucket for this key
        Bucket bucket = rateLimiterConfig.resolveBucket(key);

        // Try to consume 1 token from bucket
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            // Request allowed - add rate limit headers
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            // Rate limit exceeded
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitForRefill));
            response.setContentType("application/json");
            response.getWriter().write(String.format(
                "{\"error\": \"Too many requests\", \"message\": \"Rate limit exceeded. Try again in %d seconds\"}",
                waitForRefill
            ));
            log.warn("Rate limit exceeded for key: {} (IP: {})", key, ipAddress);
        }
    }

    /**
     * Extract userId from JWT token if present
     */
    private String extractUserId(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            try {
                String token = bearerToken.substring(7);
                if (jwtUtil.validateToken(token)) {
                    return jwtUtil.extractUserId(token);
                }
            } catch (Exception e) {
                log.debug("Could not extract userId from JWT: {}", e.getMessage());
            }
        }
        return null;
    }

    /**
     * Get client IP address
     */
    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty()) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
