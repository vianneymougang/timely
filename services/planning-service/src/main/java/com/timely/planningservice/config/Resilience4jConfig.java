package com.timely.planningservice.config;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JCircuitBreakerFactory;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JConfigBuilder;
import org.springframework.cloud.client.circuitbreaker.Customizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Configuration globale pour Resilience4j (Circuit Breaker, Time Limiter, Retry).
 * Appliquée sur tous les appels Feign pour une gestion d'erreurs robuste.
 */
@Configuration
@Slf4j
public class Resilience4jConfig {

    /**
     * Configuration par défaut du Circuit Breaker pour tous les services.
     */
    @Bean
    public Customizer<Resilience4JCircuitBreakerFactory> defaultCustomizer() {
        return factory -> factory.configureDefault(id -> new Resilience4JConfigBuilder(id)
                .circuitBreakerConfig(circuitBreakerConfig())
                .timeLimiterConfig(timeLimiterConfig())
                .build());
    }

    /**
     * Configuration du Circuit Breaker.
     * - Sliding window: 10 appels
     * - Failure rate threshold: 50% (circuit ouvert si ≥50% échecs)
     * - Wait duration in open state: 30 secondes
     * - Minimum number of calls: 5 appels avant calcul du taux d'échec
     * - Permitted calls in half-open state: 3 appels de test
     */
    private CircuitBreakerConfig circuitBreakerConfig() {
        return CircuitBreakerConfig.custom()
                .slidingWindowSize(10)
                .minimumNumberOfCalls(5)
                .failureRateThreshold(50.0f)
                .waitDurationInOpenState(Duration.ofSeconds(30))
                .permittedNumberOfCallsInHalfOpenState(3)
                .automaticTransitionFromOpenToHalfOpenEnabled(true)
                .recordExceptions(
                        Exception.class
                )
                .ignoreExceptions(
                        IllegalArgumentException.class  // Ne pas compter les erreurs de validation
                )
                .build();
    }

    /**
     * Configuration du Time Limiter.
     * - Timeout: 10 secondes par requête
     */
    private TimeLimiterConfig timeLimiterConfig() {
        return TimeLimiterConfig.custom()
                .timeoutDuration(Duration.ofSeconds(10))
                .build();
    }
}
