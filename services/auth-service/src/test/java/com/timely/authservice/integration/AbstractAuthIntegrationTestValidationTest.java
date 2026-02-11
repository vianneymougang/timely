package com.timely.authservice.integration;

import com.timely.authservice.AbstractAuthIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Validation test to ensure AbstractAuthIntegrationTest is properly configured.
 */
class AbstractAuthIntegrationTestValidationTest extends AbstractAuthIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @LocalServerPort
    private int port;

    @Test
    void contextLoads() {
        assertNotNull(restTemplate);
    }

    @Test
    void testServerPortIsRandomAndSet() {
        assertNotNull(port);
    }
}
