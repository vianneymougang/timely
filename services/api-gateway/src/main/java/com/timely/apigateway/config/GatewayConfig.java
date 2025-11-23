package com.timely.apigateway.config;

import java.util.List;

import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import static org.springframework.web.servlet.function.RouterFunctions.route;
import org.springframework.web.servlet.function.ServerResponse;

import lombok.extern.slf4j.Slf4j;

/**
 * Gateway Configuration for Request Routing
 * Routes requests to microservices using Eureka service discovery
 */
@Slf4j
@Configuration
public class GatewayConfig {

    private final DiscoveryClient discoveryClient;

    public GatewayConfig(DiscoveryClient discoveryClient) {
        this.discoveryClient = discoveryClient;
    }

    @Bean
    public RouterFunction<ServerResponse> gatewayRoutes() {
        return route()
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
