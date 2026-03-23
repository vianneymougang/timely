package com.timely.agoraservice;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Abstract base class for integration tests using Testcontainers with PostgreSQL.
 *
 * Provides a shared PostgreSQL container for all integration tests in the agora-service.
 * This class uses Spring Boot Test with random port allocation and the "test" profile
 * to ensure isolated testing environments.
 *
 * Key features:
 * - PostgreSQL container running postgres:16-alpine image
 * - Dynamic property configuration for datasource connection
 * - Automatic container lifecycle management
 * - Test profile activation with application-test.yaml configuration
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@ActiveProfiles("test")
public abstract class AbstractAgoraIntegrationTest {

    /**
     * PostgreSQL container instance shared across all test classes.
     * Uses postgres:16-alpine for minimal footprint and fast startup.
     */
    @Container
    static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("agora-test-db")
            .withUsername("test")
            .withPassword("test");

    /**
     * Dynamically configures Spring datasource properties to point to the Testcontainers instance.
     * This method is called automatically by Spring during test context initialization.
     *
     * @param registry the DynamicPropertyRegistry to register dynamic properties
     */
    @DynamicPropertySource
    static void configureTestcontainers(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgreSQLContainer::getUsername);
        registry.add("spring.datasource.password", postgreSQLContainer::getPassword);
    }
}
