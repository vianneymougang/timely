package com.timely.apigateway.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;
import org.springframework.context.annotation.Bean;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.springframework.web.servlet.function.RouterFunctions.route;
import static org.springframework.web.servlet.function.RequestPredicates.*;

/**
 * Gateway Configuration for Request Routing
 * Routes requests to microservices using Eureka service discovery
 */
@Slf4j
@Configuration
public class GatewayConfig {

    private final DiscoveryClient discoveryClient;
    private final LoadBalancerClient loadBalancerClient;
    private final RestTemplate restTemplate;

    public GatewayConfig(DiscoveryClient discoveryClient,
                         LoadBalancerClient loadBalancerClient,
                         RestTemplate restTemplate) {
        this.discoveryClient = discoveryClient;
        this.loadBalancerClient = loadBalancerClient;
        this.restTemplate = restTemplate;
    }

    @Bean
    public RouterFunction<ServerResponse> gatewayRoutes() {
        return route()
                // Auth Service Routes - Forward all /api/auth/** requests
                .add(route(path("/api/auth/**"), this::forwardToAuthService))
                
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
     * Forward request to Auth Service using RestTemplate
     */
    private ServerResponse forwardToAuthService(ServerRequest request) {
        try {
            ServiceInstance instance = loadBalancerClient.choose("AUTH-SERVICE");
            if (instance == null) {
                log.error("No instances available for Auth Service");
                return ServerResponse.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body("Auth service is currently unavailable");
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
            
            // Forward request based on HTTP method
            ResponseEntity<String> response;
            try {
                log.debug("Forwarding to {}: method={}, headers={}", targetUri, request.method(), headers);
                response = restTemplate.exchange(
                    targetUri,
                    request.method(),
                    entity,
                    String.class
                );
                log.debug("Received response: status={}", response.getStatusCode());
            } catch (Exception e) {
                log.error("Error calling Auth Service: {}", e.getMessage(), e);
                return ServerResponse.status(HttpStatus.BAD_GATEWAY)
                        .body("Error communicating with auth service: " + e.getMessage());
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
            log.error("Error forwarding request to Auth Service", e);
            return ServerResponse.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error routing request: " + e.getMessage());
        }
    }
}
