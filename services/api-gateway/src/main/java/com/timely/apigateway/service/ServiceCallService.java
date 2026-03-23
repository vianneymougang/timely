package com.timely.apigateway.service;

import java.net.URI;
import java.util.function.Supplier;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.timelimiter.TimeLimiter;
import io.github.resilience4j.timelimiter.TimeLimiterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for making calls to downstream services with circuit breaker and time limiter
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ServiceCallService {

    private final RestTemplate restTemplate;
    private final CircuitBreakerRegistry circuitBreakerRegistry;
    private final TimeLimiterRegistry timeLimiterRegistry;

    /**
     * Execute a service call with circuit breaker and time limiter protection
     */
    public ResponseEntity<String> executeServiceCall(
            String serviceName,
            URI targetUri,
            HttpMethod method,
            HttpEntity<String> entity) {

        // Get circuit breaker and time limiter for this service
        CircuitBreaker circuitBreaker = circuitBreakerRegistry.circuitBreaker(serviceName);
        TimeLimiter timeLimiter = timeLimiterRegistry.timeLimiter(serviceName);

        // Create the supplier that will execute the actual call
        Supplier<ResponseEntity<String>> callSupplier = () -> {
            try {
                log.debug("Calling {} with circuit breaker: state={}", serviceName, circuitBreaker.getState());
                return restTemplate.exchange(targetUri, method, entity, String.class);
            } catch (HttpClientErrorException e) {
                log.debug("Client error from {}: {}", serviceName, e.getStatusCode());
                return ResponseEntity.status(e.getStatusCode())
                        .headers(e.getResponseHeaders())
                        .body(e.getResponseBodyAsString());
            } catch (Exception e) {
                log.error("Error calling {}: {}", serviceName, e.getMessage());
                throw new RuntimeException("Service call failed: " + e.getMessage(), e);
            }
        };

        // Decorate with circuit breaker
        Supplier<ResponseEntity<String>> decoratedSupplier = CircuitBreaker
                .decorateSupplier(circuitBreaker, callSupplier);

        try {
            // Execute the call
            return decoratedSupplier.get();
        } catch (Exception e) {
            // Fallback response when circuit is open or call fails
            log.error("Circuit breaker triggered for {} or call failed: {}", serviceName, e.getMessage());
            return createFallbackResponse(serviceName);
        }
    }

    /**
     * Create fallback response when service is unavailable
     */
    private ResponseEntity<String> createFallbackResponse(String serviceName) {
        String fallbackBody = String.format(
            "{\"error\": \"Service Unavailable\", \"message\": \"%s is temporarily unavailable. Please try again later.\"}",
            serviceName
        );
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .header("Content-Type", "application/json")
                .body(fallbackBody);
    }
}
