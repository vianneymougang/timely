package com.timely.planningservice.config;

import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

/**
 * Configuration globale pour le décodage des erreurs Feign.
 * Convertit les erreurs HTTP en exceptions appropriées avec logging.
 */
@Configuration
@Slf4j
public class FeignErrorDecoderConfig {

    @Bean
    public ErrorDecoder errorDecoder() {
        return new CustomFeignErrorDecoder();
    }

    @Slf4j
    public static class CustomFeignErrorDecoder implements ErrorDecoder {

        private final ErrorDecoder defaultDecoder = new Default();

        @Override
        public Exception decode(String methodKey, Response response) {
            int status = response.status();
            String requestUrl = response.request().url();
            String responseBody = getResponseBody(response);

            log.error("Feign client error - Method: {}, URL: {}, Status: {}, Response: {}",
                    methodKey, requestUrl, status, responseBody);

            // Convertir les codes HTTP en exceptions spécifiques
            if (status == HttpStatus.NOT_FOUND.value()) {
                return new ResourceNotFoundException(
                        String.format("Resource not found at %s: %s", requestUrl, responseBody)
                );
            } else if (status == HttpStatus.BAD_REQUEST.value()) {
                return new IllegalArgumentException(
                        String.format("Bad request to %s: %s", requestUrl, responseBody)
                );
            } else if (status == HttpStatus.UNAUTHORIZED.value() || status == HttpStatus.FORBIDDEN.value()) {
                return new SecurityException(
                        String.format("Authentication/Authorization failed for %s: %s", requestUrl, responseBody)
                );
            } else if (status >= 500) {
                return new ServiceUnavailableException(
                        String.format("Service unavailable at %s (HTTP %d): %s", requestUrl, status, responseBody)
                );
            }

            // Utiliser le décodeur par défaut pour les autres cas
            return defaultDecoder.decode(methodKey, response);
        }

        private String getResponseBody(Response response) {
            try {
                if (response.body() == null) {
                    return "No response body";
                }

                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(response.body().asInputStream(), StandardCharsets.UTF_8)
                );
                String body = reader.lines().collect(Collectors.joining("\n"));
                reader.close();
                return body;
            } catch (IOException e) {
                log.warn("Failed to read response body", e);
                return "Failed to read response body";
            }
        }
    }

    /**
     * Exception pour les ressources non trouvées (404).
     */
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }

    /**
     * Exception pour les services indisponibles (5xx).
     */
    public static class ServiceUnavailableException extends RuntimeException {
        public ServiceUnavailableException(String message) {
            super(message);
        }
    }
}
