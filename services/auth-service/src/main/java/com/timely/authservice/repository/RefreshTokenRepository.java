package com.timely.authservice.repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.timely.authservice.model.RefreshToken;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);
    
    @Modifying
    @Transactional
    int deleteByUserId(UUID userId);
    
    @Modifying
    @Transactional
    int deleteByExpiryDateBefore(LocalDateTime now);
}
