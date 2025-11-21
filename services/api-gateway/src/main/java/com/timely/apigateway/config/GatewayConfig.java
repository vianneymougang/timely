package com.timely.apigateway.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;
import org.springframework.context.annotation.Bean;

import java.net.URI;
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

    public GatewayConfig(DiscoveryClient discoveryClient, LoadBalancerClient loadBalancerClient) {
        this.discoveryClient = discoveryClient;
        this.loadBalancerClient = loadBalancerClient;
    }

    @Bean
    public RouterFunction<ServerResponse> gatewayRoutes() {
        return route()
                // Auth Service Routes
                .add(route(path("/api/auth/**"), 
                    request -> {
                        try {
                            ServiceInstance instance = loadBalancerClient.choose("auth-service");
                            if (instance == null) {
                                log.error("No instances available for auth-service");
                                return ServerResponse.status(503)
                                        .body("Auth service is currently unavailable");
                            }
                            
                            URI targetUri = URI.create(instance.getUri().toString() + request.uri().getPath() + 
                                    (request.uri().getQuery() != null ? "?" + request.uri().getQuery() : ""));
                            
                            log.debug("Routing request to auth-service: {}", targetUri);
                            
                            // For now, we return a placeholder response
                            // In production, you would use WebClient or RestTemplate to forward the request
                            return ServerResponse.status(200)
                                    .body("Routing to: " + targetUri);
                        } catch (Exception e) {
                            log.error("Error routing to auth-service", e);
                            return ServerResponse.status(500)
                                    .body("Error routing request: " + e.getMessage());
                        }
                    }))
                
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
}
