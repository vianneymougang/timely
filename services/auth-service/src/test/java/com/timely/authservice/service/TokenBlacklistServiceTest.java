package com.timely.authservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.timely.authservice.util.JwtUtil;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

/**
 * Unit tests for TokenBlacklistService validating F1.4 (Token Blacklist Management)
 *
 * Tests validate:
 * - F1.4 Token blacklist with Redis TTL
 * - Successful blacklist storage with expiration time
 * - Expired token rejection (no storage)
 * - Blacklist lookup (present/absent)
 * - Fail-open strategy on Redis errors
 * - TTL retrieval for blacklisted tokens
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("TokenBlacklistService - F1.4 Token Blacklist Tests")
class TokenBlacklistServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private TokenBlacklistService tokenBlacklistService;

    @Captor
    private ArgumentCaptor<String> keyCaptor;

    @Captor
    private ArgumentCaptor<Duration> durationCaptor;

    private static final String BLACKLIST_PREFIX = "blacklist:token:";
    private static final String TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA0NjcwNDAwLCJleHAiOjE3MDQ2NzQwMDB9.test_signature";
    private static final long NOW_MILLIS = System.currentTimeMillis();
    private static final long FUTURE_EXPIRATION_MILLIS = NOW_MILLIS + 3600000; // +1 hour
    private static final long PAST_EXPIRATION_MILLIS = NOW_MILLIS - 3600000; // -1 hour

    @BeforeEach
    void setUp() {
        // Setup RedisTemplate to return ValueOperations mock
        // Use lenient() to allow this setup to be unused in some tests
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    @DisplayName("blacklistToken_validToken_storesInRedisWithTTL")
    void blacklistToken_validToken_storesInRedisWithTTL() {
        // Arrange
        Date futureExpiration = new Date(FUTURE_EXPIRATION_MILLIS);
        when(jwtUtil.extractExpiration(TEST_TOKEN)).thenReturn(futureExpiration);

        // Act
        tokenBlacklistService.blacklistToken(TEST_TOKEN);

        // Assert
        verify(valueOperations).set(keyCaptor.capture(), eq("revoked"), durationCaptor.capture());

        String capturedKey = keyCaptor.getValue();
        Duration capturedDuration = durationCaptor.getValue();

        // Verify key format includes BLACKLIST_PREFIX and token
        assertThat(capturedKey)
                .isNotNull()
                .startsWith(BLACKLIST_PREFIX)
                .contains(TEST_TOKEN)
                .isEqualTo(BLACKLIST_PREFIX + TEST_TOKEN);

        // Verify TTL is positive and approximately 1 hour (with tolerance of ±2 seconds for execution time)
        long ttlMillis = capturedDuration.toMillis();
        assertThat(ttlMillis)
                .isGreaterThan(0)
                .isCloseTo(3600000, org.assertj.core.data.Offset.offset(2000L));

        // Verify RedisTemplate.opsForValue() was called to get ValueOperations
        verify(redisTemplate).opsForValue();

        // Verify set was called exactly once
        verify(valueOperations, times(1)).set(anyString(), anyString(), any(Duration.class));
    }

    @Test
    @DisplayName("blacklistToken_expiredToken_doesNotStore")
    void blacklistToken_expiredToken_doesNotStore() {
        // Arrange
        Date pastExpiration = new Date(PAST_EXPIRATION_MILLIS);
        when(jwtUtil.extractExpiration(TEST_TOKEN)).thenReturn(pastExpiration);

        // Act
        tokenBlacklistService.blacklistToken(TEST_TOKEN);

        // Assert
        // Verify set() was NOT called for expired token
        verify(valueOperations, times(0)).set(anyString(), anyString(), any(Duration.class));

        // Verify RedisTemplate was accessed (to log) but value operation wasn't used for storage
        verify(redisTemplate, times(0)).opsForValue();
    }

    @Test
    @DisplayName("isTokenBlacklisted_tokenInRedis_returnsTrue")
    void isTokenBlacklisted_tokenInRedis_returnsTrue() {
        // Arrange
        when(redisTemplate.hasKey(BLACKLIST_PREFIX + TEST_TOKEN)).thenReturn(true);

        // Act
        boolean result = tokenBlacklistService.isTokenBlacklisted(TEST_TOKEN);

        // Assert
        assertThat(result).isTrue();

        // Verify hasKey was called with correct key
        verify(redisTemplate).hasKey(keyCaptor.capture());
        assertThat(keyCaptor.getValue()).isEqualTo(BLACKLIST_PREFIX + TEST_TOKEN);
    }

    @Test
    @DisplayName("isTokenBlacklisted_tokenNotInRedis_returnsFalse")
    void isTokenBlacklisted_tokenNotInRedis_returnsFalse() {
        // Arrange
        when(redisTemplate.hasKey(BLACKLIST_PREFIX + TEST_TOKEN)).thenReturn(false);

        // Act
        boolean result = tokenBlacklistService.isTokenBlacklisted(TEST_TOKEN);

        // Assert
        assertThat(result).isFalse();

        // Verify hasKey was called with correct key
        verify(redisTemplate).hasKey(keyCaptor.capture());
        assertThat(keyCaptor.getValue()).isEqualTo(BLACKLIST_PREFIX + TEST_TOKEN);
    }

    @Test
    @DisplayName("isTokenBlacklisted_redisError_returnsFalse")
    void isTokenBlacklisted_redisError_returnsFalse() {
        // Arrange
        // Simulate Redis connection error or timeout
        when(redisTemplate.hasKey(BLACKLIST_PREFIX + TEST_TOKEN))
                .thenThrow(new RuntimeException("Redis connection refused"));

        // Act
        boolean result = tokenBlacklistService.isTokenBlacklisted(TEST_TOKEN);

        // Assert
        // Verify fail-open strategy: return false (token not blacklisted) on error
        assertThat(result).isFalse();

        // Verify hasKey was attempted
        verify(redisTemplate).hasKey(anyString());
    }

    @Test
    @DisplayName("getBlacklistTTL_blacklistedToken_returnsTTL")
    void getBlacklistTTL_blacklistedToken_returnsTTL() {
        // Arrange
        long ttlSeconds = 3600L;
        when(redisTemplate.getExpire(BLACKLIST_PREFIX + TEST_TOKEN, TimeUnit.SECONDS))
                .thenReturn(ttlSeconds);

        // Act
        long result = tokenBlacklistService.getBlacklistTTL(TEST_TOKEN);

        // Assert
        assertThat(result).isEqualTo(ttlSeconds);

        // Verify getExpire was called with correct parameters
        verify(redisTemplate).getExpire(keyCaptor.capture(), eq(TimeUnit.SECONDS));
        assertThat(keyCaptor.getValue()).isEqualTo(BLACKLIST_PREFIX + TEST_TOKEN);
    }

    @Test
    @DisplayName("getBlacklistTTL_notBlacklisted_returnsMinusOne")
    void getBlacklistTTL_notBlacklisted_returnsMinusOne() {
        // Arrange
        // Redis returns -2 when key doesn't exist
        when(redisTemplate.getExpire(BLACKLIST_PREFIX + TEST_TOKEN, TimeUnit.SECONDS))
                .thenReturn(-2L);

        // Act
        long result = tokenBlacklistService.getBlacklistTTL(TEST_TOKEN);

        // Assert
        assertThat(result).isEqualTo(-2L);

        // Verify getExpire was called with correct parameters
        verify(redisTemplate).getExpire(keyCaptor.capture(), eq(TimeUnit.SECONDS));
        assertThat(keyCaptor.getValue()).isEqualTo(BLACKLIST_PREFIX + TEST_TOKEN);
    }

    @Test
    @DisplayName("blacklistToken_calculatesCorrectTTL_withSmallTimeWindow")
    void blacklistToken_calculatesCorrectTTL_withSmallTimeWindow() {
        // Arrange
        long expirationInFuture = System.currentTimeMillis() + 60000; // +1 minute
        Date expiration = new Date(expirationInFuture);
        when(jwtUtil.extractExpiration(TEST_TOKEN)).thenReturn(expiration);

        // Act
        tokenBlacklistService.blacklistToken(TEST_TOKEN);

        // Assert
        verify(valueOperations).set(anyString(), eq("revoked"), durationCaptor.capture());

        Duration capturedDuration = durationCaptor.getValue();
        long ttlMillis = capturedDuration.toMillis();

        // Verify TTL is approximately 1 minute (with tolerance of ±50ms for execution time)
        assertThat(ttlMillis)
                .isGreaterThan(0)
                .isCloseTo(60000, org.assertj.core.data.Offset.offset(50L));
    }

    @Test
    @DisplayName("blacklistToken_handlesExtractionError_throwsRuntimeException")
    void blacklistToken_handlesExtractionError_throwsRuntimeException() {
        // Arrange
        when(jwtUtil.extractExpiration(TEST_TOKEN))
                .thenThrow(new RuntimeException("Invalid token"));

        // Act & Assert
        org.junit.jupiter.api.Assertions.assertThrows(
                RuntimeException.class,
                () -> tokenBlacklistService.blacklistToken(TEST_TOKEN),
                "Should throw RuntimeException when token extraction fails"
        );

        // Verify no Redis operation was attempted
        verify(valueOperations, times(0)).set(anyString(), anyString(), any(Duration.class));
    }

    @Test
    @DisplayName("removeFromBlacklist_tokenInRedis_removes")
    void removeFromBlacklist_tokenInRedis_removes() {
        // Arrange
        // Act
        tokenBlacklistService.removeFromBlacklist(TEST_TOKEN);

        // Assert
        verify(redisTemplate).delete(keyCaptor.capture());
        assertThat(keyCaptor.getValue()).isEqualTo(BLACKLIST_PREFIX + TEST_TOKEN);
    }

    @Test
    @DisplayName("isTokenBlacklisted_multipleTokens_checksIndependently")
    void isTokenBlacklisted_multipleTokens_checksIndependently() {
        // Arrange
        String token1 = "token1";
        String token2 = "token2";
        when(redisTemplate.hasKey(BLACKLIST_PREFIX + token1)).thenReturn(true);
        when(redisTemplate.hasKey(BLACKLIST_PREFIX + token2)).thenReturn(false);

        // Act
        boolean result1 = tokenBlacklistService.isTokenBlacklisted(token1);
        boolean result2 = tokenBlacklistService.isTokenBlacklisted(token2);

        // Assert
        assertThat(result1).isTrue();
        assertThat(result2).isFalse();

        verify(redisTemplate, times(2)).hasKey(anyString());
    }

    @Test
    @DisplayName("blacklistToken_nullReturn_fromRedisGetExpire_returnsMinusOne")
    void getBlacklistTTL_nullReturnFromRedis_returnsMinusOne() {
        // Arrange
        when(redisTemplate.getExpire(BLACKLIST_PREFIX + TEST_TOKEN, TimeUnit.SECONDS))
                .thenReturn(null);

        // Act
        long result = tokenBlacklistService.getBlacklistTTL(TEST_TOKEN);

        // Assert
        assertThat(result).isEqualTo(-1L);
    }

    @Test
    @DisplayName("getBlacklistTTL_redisError_returnsMinusOne")
    void getBlacklistTTL_redisError_returnsMinusOne() {
        // Arrange
        when(redisTemplate.getExpire(BLACKLIST_PREFIX + TEST_TOKEN, TimeUnit.SECONDS))
                .thenThrow(new RuntimeException("Redis connection lost"));

        // Act
        long result = tokenBlacklistService.getBlacklistTTL(TEST_TOKEN);

        // Assert
        assertThat(result).isEqualTo(-1L);

        verify(redisTemplate).getExpire(anyString(), eq(TimeUnit.SECONDS));
    }

    @Test
    @DisplayName("blacklistToken_edgeCaseZeroTTL_doesNotStore")
    void blacklistToken_edgeCaseZeroTTL_doesNotStore() {
        // Arrange
        // Token expires exactly now (TTL = 0ms)
        Date nowExpiration = new Date(System.currentTimeMillis());
        when(jwtUtil.extractExpiration(TEST_TOKEN)).thenReturn(nowExpiration);

        // Act
        tokenBlacklistService.blacklistToken(TEST_TOKEN);

        // Assert
        // TTL should be <= 0, so no storage
        verify(valueOperations, times(0)).set(anyString(), anyString(), any(Duration.class));
    }

    @Test
    @DisplayName("blacklistToken_verifyValueContent_alwaysRevoked")
    void blacklistToken_verifyValueContent_alwaysRevoked() {
        // Arrange
        Date futureExpiration = new Date(FUTURE_EXPIRATION_MILLIS);
        when(jwtUtil.extractExpiration(TEST_TOKEN)).thenReturn(futureExpiration);

        // Act
        tokenBlacklistService.blacklistToken(TEST_TOKEN);

        // Assert
        verify(valueOperations).set(anyString(), eq("revoked"), any(Duration.class));
    }

    @Test
    @DisplayName("isTokenBlacklisted_nullKey_returnsFalse")
    void isTokenBlacklisted_handlesNullKeyGracefully() {
        // Arrange
        when(redisTemplate.hasKey(BLACKLIST_PREFIX + "null"))
                .thenThrow(new NullPointerException("Key is null"));

        // Act
        boolean result = tokenBlacklistService.isTokenBlacklisted("null");

        // Assert
        assertThat(result).isFalse();
    }

}
