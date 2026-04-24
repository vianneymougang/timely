package com.timely.reportservice.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Configuration
public class FeignClientConfig {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    /**
     * Intercepteur Feign qui propage le JWT token de la requête entrante
     * vers tous les appels inter-services sortants.
     *
     * Sans cet intercepteur, les appels Feign vers booking-service, user-service
     * et planning-service retournent 403 car aucun token n'est transmis.
     */
    @Bean
    public RequestInterceptor jwtPropagationInterceptor() {
        return new JwtPropagationInterceptor();
    }

    static class JwtPropagationInterceptor implements RequestInterceptor {

        @Override
        public void apply(RequestTemplate template) {
            ServletRequestAttributes attributes =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

            if (attributes == null) {
                log.debug("No request context available for Feign call to {}, skipping JWT propagation",
                        template.url());
                return;
            }

            HttpServletRequest request = attributes.getRequest();
            String authorizationHeader = request.getHeader(AUTHORIZATION_HEADER);

            if (authorizationHeader != null && authorizationHeader.startsWith(BEARER_PREFIX)) {
                template.header(AUTHORIZATION_HEADER, authorizationHeader);
                log.debug("Propagated JWT token to Feign call: {}", template.url());
            } else {
                log.warn("No valid Bearer token found in current request for Feign call to {}",
                        template.url());
            }
        }
    }
}