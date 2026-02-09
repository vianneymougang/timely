package com.timely.apigateway.config;

import static org.springframework.web.servlet.function.RequestPredicates.*;
import static org.springframework.web.servlet.function.RouterFunctions.*;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import com.timely.apigateway.service.ServiceCallService;

import lombok.extern.slf4j.Slf4j;

/**
 * Gateway Configuration for Request Routing
 * Routes requests to microservices using Eureka service discovery with circuit breaker
 */
@Slf4j
@Configuration
public class GatewayConfig {

    private final DiscoveryClient discoveryClient;
    private final LoadBalancerClient loadBalancerClient;
    private final RestTemplate restTemplate;
    private final ServiceCallService serviceCallService;

    public GatewayConfig(DiscoveryClient discoveryClient,
                         LoadBalancerClient loadBalancerClient,
                         RestTemplate restTemplate,
                         ServiceCallService serviceCallService) {
        this.discoveryClient = discoveryClient;
        this.loadBalancerClient = loadBalancerClient;
        this.restTemplate = restTemplate;
        this.serviceCallService = serviceCallService;
    }

    @Bean
    public RouterFunction<ServerResponse> gatewayRoutes() {
        return route()
                // Auth Service Routes - Forward all /api/auth/** requests
                .add(route(path("/api/auth/**"), this::forwardToAuthService))

                // User Service Routes - Forward all /api/users/** requests
                .add(route(path("/api/users/**"), this::forwardToUserService))

                // Availability Routes - Forward all /api/availability/** requests
                .add(route(path("/api/availability/**"), this::forwardToUserService))

                // Booking Service Routes - Forward all /api/bookings/** requests
                .add(route(path("/api/bookings/**"), this::forwardToBookingService))

                // Planning Service Routes - Forward all /api/planning/** requests
                .add(route(path("/api/planning/**"), this::forwardToPlanningService))

                // Notification Service Routes - Forward all /api/notifications/** requests
                .add(route(path("/api/notifications/**"), this::forwardToNotificationService))

                // Report Service Routes - Forward all /api/reports/** requests
                .add(route(path("/api/reports/**"), this::forwardToReportService))

                // Agora Service Routes - Forward all /api/agora/** requests
                .add(route(path("/api/agora/**"), this::forwardToAgoraService))

                // Health check endpoint
                .GET("/gateway/health", request ->
                    ServerResponse.ok().body("API Gateway is running"))

                // Service discovery info endpoint
                .GET("/gateway/services", request -> {
                    List<String> services = discoveryClient.getServices();
                    return ServerResponse.ok().body(services);
                })

                .build();
    }

    /**
     * Generic method to forward requests to any service
     */
    private ServerResponse forwardToService(ServerRequest request, String serviceName) {
        try {
            ServiceInstance instance = loadBalancerClient.choose(serviceName);
            if (instance == null) {
                log.error("No instances available for {}", serviceName);
                return ServerResponse.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(serviceName.toLowerCase() + " is currently unavailable");
            }
            
            // Build target URI
            String targetPath = request.uri().getPath();
            String query = request.uri().getQuery();
            URI targetUri = URI.create(instance.getUri().toString() + targetPath + 
                    (query != null ? "?" + query : ""));
            
            log.debug("Forwarding {} request to: {}", request.method(), targetUri);
            
            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            request.headers().asHttpHeaders().forEach((name, values) -> {
                // Copy all headers except Host
                if (!"Host".equalsIgnoreCase(name)) {
                    headers.addAll(name, values);
                }
            });
            
            // Ensure Content-Type is set for POST/PUT/PATCH
            if (!headers.containsKey(HttpHeaders.CONTENT_TYPE) && 
                (request.method() == HttpMethod.POST || 
                 request.method() == HttpMethod.PUT || 
                 request.method() == HttpMethod.PATCH)) {
                headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            }
            
            // Get request body if present
            String requestBody = null;
            try {
                if (request.method() == HttpMethod.POST || 
                    request.method() == HttpMethod.PUT || 
                    request.method() == HttpMethod.PATCH) {
                    requestBody = new String(request.servletRequest().getInputStream().readAllBytes(), 
                                            StandardCharsets.UTF_8);
                    log.debug("Request body: {}", requestBody);
                }
            } catch (IOException e) {
                log.error("Could not read request body", e);
                return ServerResponse.status(HttpStatus.BAD_REQUEST)
                        .body("Error reading request body: " + e.getMessage());
            }
            
            // Create HTTP entity
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            // Forward request with circuit breaker protection
            ResponseEntity<String> response;
            try {
                log.debug("Forwarding to {} with circuit breaker: method={}", serviceName, request.method());
                response = serviceCallService.executeServiceCall(
                    getCircuitBreakerName(serviceName),
                    targetUri,
                    request.method(),
                    entity
                );
                log.debug("Received response: status={}", response.getStatusCode());
            } catch (Exception e) {
                log.error("Error calling {}: {}", serviceName, e.getMessage(), e);
                return ServerResponse.status(HttpStatus.BAD_GATEWAY)
                        .body("Error communicating with " + serviceName.toLowerCase() + ": " + e.getMessage());
            }
            
            // Build response
            ServerResponse.BodyBuilder responseBuilder = ServerResponse.status(response.getStatusCode());
            
            // Copy response headers (except transfer-encoding)
            if (response.getHeaders() != null) {
                response.getHeaders().forEach((name, values) -> {
                    if (!"Transfer-Encoding".equalsIgnoreCase(name) && 
                        !"Connection".equalsIgnoreCase(name)) {
                        values.forEach(value -> responseBuilder.header(name, value));
                    }
                });
            }
            
            return responseBuilder.body(response.getBody() != null ? response.getBody() : "");

        } catch (Exception e) {
            log.error("Error forwarding request to {}", serviceName, e);
            return ServerResponse.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error routing request: " + e.getMessage());
        }
    }

    /**
     * Forward request to Auth Service using RestTemplate
     */
    private ServerResponse forwardToAuthService(ServerRequest request) {
        return forwardToService(request, "AUTH-SERVICE");
    }

    /**
     * Forward request to User Service using RestTemplate
     */
    private ServerResponse forwardToUserService(ServerRequest request) {
        return forwardToService(request, "USER-SERVICE");
    }

    /**
     * Forward request to Booking Service using RestTemplate
     */
    private ServerResponse forwardToBookingService(ServerRequest request) {
        return forwardToService(request, "BOOKING-SERVICE");
    }

    /**
     * Forward request to Planning Service using RestTemplate
     */
    private ServerResponse forwardToPlanningService(ServerRequest request) {
        return forwardToService(request, "PLANNING-SERVICE");
    }

    /**
     * Forward request to Notification Service using RestTemplate
     */
    private ServerResponse forwardToNotificationService(ServerRequest request) {
        return forwardToService(request, "NOTIFICATION-SERVICE");
    }

    /**
     * Forward request to Report Service using RestTemplate
     */
    private ServerResponse forwardToReportService(ServerRequest request) {
        return forwardToService(request, "REPORT-SERVICE");
    }

    /**
     * Forward request to Agora Service using RestTemplate
     */
    private ServerResponse forwardToAgoraService(ServerRequest request) {
        return forwardToService(request, "AGORA-SERVICE");
    }

    /**
     * Map service name to circuit breaker name
     */
    private String getCircuitBreakerName(String serviceName) {
        return switch (serviceName) {
            case "AUTH-SERVICE" -> "authService";
            case "USER-SERVICE" -> "userService";
            case "BOOKING-SERVICE" -> "bookingService";
            case "PLANNING-SERVICE" -> "planningService";
            case "NOTIFICATION-SERVICE" -> "notificationService";
            case "REPORT-SERVICE" -> "reportService";
            case "AGORA-SERVICE" -> "agoraService";
            default -> "default";
        };
    }
}
