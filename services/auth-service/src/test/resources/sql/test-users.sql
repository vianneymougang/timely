-- Test data for auth-service integration tests
-- Creates users in the auth-service local database

-- Note: This SQL is used for testing auth-service only
-- In production, auth-service delegates to user-service via Feign client
-- For testing, we need local test data

-- Create test user: john.doe@iusjc.edu with password123
-- Password is typically hashed by Spring Security in real scenarios
-- For testing purposes, we assume the password has been encoded appropriately

-- Since auth-service now delegates to user-service, we need to mock the response
-- This file serves as documentation for test data structure
-- The actual user validation happens through UserServiceClient (mocked in tests)

-- If local user storage was needed, structure would be:
-- CREATE TABLE users (
--     id UUID PRIMARY KEY,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     password_hash VARCHAR(255) NOT NULL,
--     enabled BOOLEAN DEFAULT true,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
--
-- INSERT INTO users (id, email, password_hash, enabled)
-- VALUES (
--     'f47ac10b-58cc-4372-a567-0e02b2c3d479',
--     'john.doe@iusjc.edu',
--     '$2a$10$...',  -- bcrypt hash of 'password123'
--     true
-- );

-- For integration tests, UserServiceClient is mocked with @MockBean
-- Test data is provided through mock responses in test setup
