package com.timely.planningservice.config;

import feign.Request;
import feign.Retryer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Configuration globale pour les clients Feign.
 * Configure les timeouts et la stratégie de retry.
 */
@Configuration
@Slf4j
public class FeignClientConfig {

    /**
     * Configuration du timeout des requêtes Feign.
     * - Connect timeout: 5 secondes
     * - Read timeout: 10 secondes
     */
    @Bean
    public Request.Options requestOptions() {
        return new Request.Options(
                Duration.ofSeconds(5),  // connect timeout
                Duration.ofSeconds(10), // read timeout
                true                    // follow redirects
        );
    }

    /**
     * Configuration de la stratégie de retry.
     * - Période initiale: 100ms
     * - Période maximale: 2000ms (2 secondes)
     * - Nombre maximum de tentatives: 3
     * - Backoff exponentiel avec multiplicateur 1.5
     */
    @Bean
    public Retryer retryer() {
        return new Retryer.Default(
                100,    // période initiale en ms
                2000,   // période max en ms
                3       // nombre max de tentatives
        );
    }
}
