package com.timely.authservice.service;

import com.timely.authservice.model.RefreshToken;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(UUID userId);

    Optional<RefreshToken> findByToken(String token);

    RefreshToken verifyExpiration(RefreshToken token);

    void deleteToken(RefreshToken token);

    void deleteByUserId(UUID userId);
}