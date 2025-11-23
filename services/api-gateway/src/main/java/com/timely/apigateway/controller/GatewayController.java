package com.timely.apigateway.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.http.*;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Gateway Controller for Request Routing
 * Forwards requests to microservices using Eureka service discovery
 */
@Slf4j
@RestController
public class GatewayController {

    private final LoadBalancerClient loadBalancerClient;
    private final WebClient webClient;

    public GatewayController(LoadBalancerClient loadBalancerClient) {
        this.loadBalancerClient = loadBalancerClient;
        this.webClient = WebClient.builder().build();
    }

    /**
     * Forward all auth service requests
     * Note: OPTIONS requests are handled by Spring Security CORS configuration
     */
    @RequestMapping(value = "/api/auth/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<String> forwardAuthRequest(HttpServletRequest servletRequest) {
        try {
            HttpMethod method = HttpMethod.valueOf(servletRequest.getMethod());
            String requestPath = servletRequest.getRequestURI();
            String queryString = servletRequest.getQueryString();
            
            log.info("Received {} request to forward: {}", method, requestPath);
            
            // Read body for POST/PUT/PATCH requests
            String body = null;
            if (method == HttpMethod.POST || method == HttpMethod.PUT || method == HttpMethod.PATCH) {
                try {
                    body = StreamUtils.copyToString(servletRequest.getInputStream(), StandardCharsets.UTF_8);
                    if (body.isEmpty()) {
                        body = null;
                    }
                } catch (IOException e) {
                    log.warn("Could not read request body: {}", e.getMessage());
                }
            }
            
            // Get auth-service instance
            ServiceInstance instance = loadBalancerClient.choose("auth-service");
            if (instance == null) {
                log.error("No instances available for auth-service. Please ensure:");
                log.error("1. Discovery Server (Eureka) is running on http://localhost:8761");
                log.error("2. Auth Service is running and registered with Eureka");
                log.error("3. Check Eureka dashboard at http://localhost:8761 to verify service registration");
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"error\":\"Auth service is currently unavailable. Please check that the service is running and registered with Eureka.\"}");
            }
            
            log.info("Found auth-service instance: {}", instance.getUri());
            
            // Build target URL - preserve the full path
            String targetUrl = instance.getUri().toString() + requestPath + 
                    (queryString != null && !queryString.isEmpty() ? "?" + queryString : "");
            
            log.info("Forwarding {} request to auth-service: {}", method, targetUrl);
            
            // Build WebClient request
            WebClient.RequestBodySpec requestSpec = webClient
                    .method(method)
                    .uri(targetUrl);
            
            // Copy headers (except Host and Content-Length)
            HttpHeaders forwardHeaders = new HttpHeaders();
            servletRequest.getHeaderNames().asIterator().forEachRemaining(headerName -> {
                if (!headerName.equalsIgnoreCase("host") && !headerName.equalsIgnoreCase("content-length")) {
                    forwardHeaders.add(headerName, servletRequest.getHeader(headerName));
                }
            });
            
            requestSpec.headers(httpHeaders -> httpHeaders.addAll(forwardHeaders));
            
            // Handle request body
            WebClient.ResponseSpec responseSpec;
            if (method == HttpMethod.POST || method == HttpMethod.PUT || method == HttpMethod.PATCH) {
                if (body != null && !body.isEmpty()) {
                    responseSpec = requestSpec
                            .contentType(MediaType.APPLICATION_JSON)
                            .bodyValue(body)
                            .retrieve();
                } else {
                    responseSpec = requestSpec.retrieve();
                }
            } else {
                responseSpec = requestSpec.retrieve();
            }
            
            // Execute and get response
            ResponseEntity<String> responseEntity = responseSpec
                    .toEntity(String.class)
                    .block();
            
            if (responseEntity == null) {
                log.error("No response received from auth-service");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"error\":\"No response from auth service\"}");
            }
            
            log.info("Received response from auth-service: status={}, body length={}", 
                    responseEntity.getStatusCode().value(), 
                    responseEntity.getBody() != null ? responseEntity.getBody().length() : 0);
            
            // Return response with same status and headers (excluding CORS headers which are handled by Spring Security)
            HttpHeaders responseHeaders = new HttpHeaders();
            responseEntity.getHeaders().forEach((name, values) -> {
                String lowerName = name.toLowerCase();
                // Exclude CORS headers and content-length (Spring Security handles CORS)
                if (!lowerName.equals("content-length") 
                    && !lowerName.startsWith("access-control-")) {
                    responseHeaders.put(name, values);
                } else {
                    log.debug("Filtered out CORS header from auth-service response: {}", name);
                }
            });
            
            log.debug("Response headers after filtering: {}", responseHeaders.keySet());
            
            return ResponseEntity.status(responseEntity.getStatusCode())
                    .headers(responseHeaders)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(responseEntity.getBody() != null ? responseEntity.getBody() : "{}");
                    
        } catch (WebClientResponseException e) {
            log.error("Error from auth-service: status={}, message={}", e.getStatusCode(), e.getMessage());
            return ResponseEntity.status(e.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Error forwarding request to auth-service", e);
            String errorMessage = e.getMessage() != null ? e.getMessage().replace("\"", "\\\"") : "Unknown error";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\":\"Error routing request: " + errorMessage + "\"}");
        }
    }
}

