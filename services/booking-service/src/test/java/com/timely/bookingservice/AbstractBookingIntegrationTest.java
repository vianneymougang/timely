package com.timely.bookingservice;

import com.redis.testcontainers.RedisContainer;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Abstract base class for integration tests in the booking-service.
 *
 * Configures PostgreSQL and Redis containers for testing with proper
 * datasource and Redis properties. Disables Eureka client registration
 * during tests.
 *
 * Usage: Extend this class in your integration tests and use @Test
 * annotations as normal. Containers are automatically started and
 * stopped for the entire test class lifecycle.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@ActiveProfiles("test")
public abstract class AbstractBookingIntegrationTest {

	/**
	 * PostgreSQL container for integration tests.
	 * Uses postgres:16-alpine image with default credentials.
	 */
	@Container
	protected static final PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:16-alpine")
			.withDatabaseName("booking-service-db")
			.withUsername("admin")
			.withPassword("password");

	/**
	 * Redis container for caching tests.
	 * Uses redis:7-alpine image configured as a standalone instance.
	 */
	@Container
	protected static final RedisContainer redisContainer = new RedisContainer("redis:7-alpine");

	/**
	 * Dynamically configures Spring properties to use the testcontainers
	 * instead of the default localhost configuration.
	 *
	 * Sets the following properties:
	 * - spring.datasource.url: PostgreSQL JDBC URL
	 * - spring.datasource.username: Database username
	 * - spring.datasource.password: Database password
	 * - spring.data.redis.host: Redis server host
	 * - spring.data.redis.port: Redis server port
	 *
	 * @param registry DynamicPropertyRegistry provided by Spring Test
	 */
	@DynamicPropertySource
	static void configureTestProperties(DynamicPropertyRegistry registry) {
		// PostgreSQL datasource configuration
		registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
		registry.add("spring.datasource.username", postgreSQLContainer::getUsername);
		registry.add("spring.datasource.password", postgreSQLContainer::getPassword);

		// Redis configuration
		registry.add("spring.data.redis.host", redisContainer::getHost);
		registry.add("spring.data.redis.port", redisContainer::getFirstMappedPort);
	}
}
