package com.timely.userservice;

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
 * Provides a shared PostgreSQL container for all integration tests in user-service.
 * Extends this class to inherit the containerized database configuration.
 *
 * Configuration:
 * - Uses @SpringBootTest with RANDOM_PORT for application context
 * - Activates "test" profile (loads application-test.yaml)
 * - Testcontainers automatically starts/stops containers for test lifecycle
 * - PostgreSQL 16-alpine image for lightweight container
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@ActiveProfiles("test")
public abstract class AbstractUserIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("timely_test")
            .withUsername("testuser")
            .withPassword("testpassword");

    /**
     * Dynamically configures Spring datasource properties from the PostgreSQL container.
     *
     * This method is called before the application context is initialized,
     * allowing us to inject container connection details into Spring configuration.
     *
     * @param registry The DynamicPropertyRegistry to register properties
     */
    @DynamicPropertySource
    static void configureDatasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.datasource.driver-class-name", () -> "org.postgresql.Driver");
    }

}
