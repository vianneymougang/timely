# Auth-Service Integration Tests - F1.4 Authentication Workflow

## Overview

Comprehensive integration tests for auth-service covering the F1.4 authentication workflow specification. Tests validate the complete authentication flow including login, token generation, logout, token blacklist, and token validation with Redis and PostgreSQL testcontainers.

**Test File**: `/services/auth-service/src/test/java/com/timely/authservice/integration/AuthIntegrationTest.java`

**Base Class**: `AbstractAuthIntegrationTest` (PostgreSQL 16 + Redis 7 Testcontainers)

---

## Test Cases (5 E2E Tests)

### 1. `login_andValidate_fullWorkflow()`
**Purpose**: Validates complete login workflow with token generation

**Test Scenario**:
- User provides valid credentials (john.doe@iusjc.edu / password123)
- POST request to `/api/auth/login` endpoint
- System validates credentials and generates tokens

**Assertions**:
- HTTP 200 response
- Access token present (valid JWT format with 3 parts)
- Refresh token present (UUID-based, stored in PostgreSQL)
- User metadata returned (email, role, name, user ID, status)
- Token type is "Bearer"
- Refresh token exists in database via `RefreshTokenService`
- Token validates successfully (not blacklisted yet)

**Key Validations**:
- JWT token structure (3 dot-separated parts)
- Refresh token persistence in PostgreSQL
- Token validation without blacklist

---

### 2. `logout_tokenBecomesInvalid()`
**Purpose**: Validates logout invalidates refresh token in database

**Test Scenario**:
- User logs in and obtains tokens
- User logs out with refresh token and access token in Authorization header
- POST request to `/api/auth/logout` endpoint

**Assertions**:
- HTTP 200 response
- Response message: "Logout successful"
- Refresh token is deleted from PostgreSQL database
- Refresh token no longer retrievable via `RefreshTokenService.findByToken()`

**Key Validations**:
- Database deletion of refresh token
- Service layer properly deletes token from repository
- User cannot re-use deleted refresh token

---

### 3. `logout_tokenBlacklistedInRedis_withTTL()`
**Purpose**: Validates logout blacklists access token in Redis with proper TTL

**Test Scenario**:
- User logs in and obtains tokens
- User logs out with both refresh and access tokens
- System blacklists the access token in Redis
- Access token TTL should equal remaining token lifetime

**Assertions**:
- HTTP 200 response
- Access token is blacklisted in Redis (checked via `TokenBlacklistService.isTokenBlacklisted()`)
- TTL is set on blacklisted token (positive value)
- TTL is less than or equal to token expiration (3600 seconds for 1-hour token)

**Key Validations**:
- Redis blacklist functionality with `RedisTemplate`
- TTL calculation based on token expiration
- Blacklist persistence with automatic expiration

---

### 4. `refreshToken_afterLogout_fails()`
**Purpose**: Validates refresh token fails after logout (token deleted from database)

**Test Scenario**:
- User logs in
- User logs out (refresh token deleted from PostgreSQL)
- User attempts to refresh token with the deleted refresh token
- POST request to `/api/auth/refresh` endpoint

**Assertions**:
- HTTP 500 error (internal server error due to missing refresh token)
- Refresh token is not found in database
- `RefreshTokenService.findByToken()` returns empty Optional

**Key Validations**:
- Token rotation is prevented after logout
- Access is denied to deleted refresh tokens
- Database consistency enforced

---

### 5. `validateToken_afterBlacklist_returnsFalse()`
**Purpose**: Validates token validation endpoint checks Redis blacklist

**Test Scenario**:
- User logs in
- User logs out (token is blacklisted in Redis)
- Validate endpoint is called with blacklisted access token
- GET request to `/api/auth/validate` with Authorization header

**Assertions**:
- Before logout: HTTP 200, `valid: true`
- After logout: HTTP 401, `valid: false`
- Response contains message: "Token is invalid or has been revoked"
- `TokenBlacklistService.isTokenBlacklisted()` returns true

**Key Validations**:
- Token blacklist checked before signature validation
- Revoked tokens rejected even if signature is valid
- Proper error response for microservice token validation

---

## Architecture & Dependencies

### Testcontainers Configuration
- **PostgreSQL 16 Alpine**: Stores refresh tokens and user data
- **Redis 7 Alpine**: Stores JWT blacklist with TTL

### Mocked Dependencies
- **UserServiceClient**: Mocked with `@MockBean` to return test user data
  - Email: john.doe@iusjc.edu
  - Role: ROLE_TEACHER
  - Status: ACTIVE

### Injected Services
- `AuthService`: Main authentication service
- `RefreshTokenService`: Manages refresh tokens in PostgreSQL
- `TokenBlacklistService`: Manages token blacklist in Redis
- `TestRestTemplate`: HTTP client for REST API testing

---

## Test Data

### SQL Scripts
1. **`test-users.sql`**: Documentation for test user structure (data provided via mocks)
2. **`test-refresh-tokens-clean.sql`**: Cleans refresh_tokens table before each test

### Mock User (In-Memory)
```java
Email: john.doe@iusjc.edu
Password: password123 (verified by AuthenticationManager)
User ID: Random UUID (generated per test)
Role: ROLE_TEACHER
Status: ACTIVE
```

### Test Data Isolation
- Each test cleans refresh_tokens table via `@Sql` annotation
- BeforeEach hook reinitializes mock responses
- No test data leakage between tests

---

## Key Features Tested

### 1. F1.4 Authentication Workflow
- **Login**: User credentials → Access + Refresh tokens
- **Logout**: Token deletion + Blacklist in Redis
- **Refresh**: Valid refresh token → New access token
- **Validate**: Check signature + blacklist status

### 2. Redis Integration
- Blacklist tokens with automatic TTL expiration
- TTL = Remaining token lifetime (not absolute expiration)
- Efficient token revocation without database query

### 3. PostgreSQL Integration
- Persistent refresh token storage
- Token rotation on refresh
- Automatic cleanup of expired tokens (scheduled job)

### 4. Security Validations
- Token format validation (JWT structure)
- Signature verification (not tested here, in unit tests)
- Blacklist check before signature validation
- TTL-based automatic expiration in Redis

---

## Compilation & Execution

### Compile Tests
```bash
cd services/auth-service
mvn test-compile
```

### Run Integration Tests
```bash
# Requires Docker running for Testcontainers
mvn test -Dtest=AuthIntegrationTest
```

### Run All Auth-Service Tests
```bash
mvn test
```

---

## Test Coverage

| Feature | Test Case | Status |
|---------|-----------|--------|
| Login workflow | `login_andValidate_fullWorkflow` | ✓ E2E |
| Logout database | `logout_tokenBecomesInvalid` | ✓ E2E |
| Logout Redis | `logout_tokenBlacklistedInRedis_withTTL` | ✓ E2E |
| Refresh after logout | `refreshToken_afterLogout_fails` | ✓ E2E |
| Token validation | `validateToken_afterBlacklist_returnsFalse` | ✓ E2E |

---

## Related Unit Tests

File: `/services/auth-service/src/test/java/com/timely/authservice/service/AuthServiceTest.java`

- Login validation
- Token refresh logic
- Logout with/without access token
- Token validation (blacklist + expiration)
- Error handling for expired/invalid tokens

---

## Configuration Files

### Test Configuration
- **`application-test.yaml`**: Spring Boot test profile
  - Flyway migrations enabled
  - Hibernate DDL: `create-drop`
  - Redis timeout: 2000ms
  - JWT settings (secret, expiration times)

### Database Migrations
Located in: `/resources/db/migration/`
1. `V1__create_user_tables.sql` - User structure
2. `V2__create_refresh_token_table.sql` - Refresh tokens table
3. `V3__drop_users_table.sql` - Auth-service delegates to user-service
4. `V4__update_refresh_tokens.sql` - Updates to refresh token schema
5. `V5__create_password_reset_tokens_table.sql` - Password reset flow

---

## Notes

1. **Auth-Service Architecture**: Delegates user authentication to user-service via Feign client; only stores refresh tokens locally
2. **Token Blacklist**: Uses Redis for fast revocation without database overhead
3. **Test Isolation**: Each test runs with clean refresh_tokens table
4. **Mock Clients**: UserServiceClient is mocked to provide consistent test data
5. **E2E Testing**: Tests validate full REST API flow through real Spring Boot context

---

## Future Enhancements

1. Test token expiration scenarios
2. Test refresh token rotation edge cases
3. Test concurrent logout attempts
4. Performance testing for Redis blacklist operations
5. Integration with API Gateway token validation
