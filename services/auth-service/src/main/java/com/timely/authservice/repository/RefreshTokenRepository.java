package com.timely.authservice.repository;

import com.timely.authservice.model.RefreshToken;
import com.timely.authservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);
    
    @Modifying
    @Transactional
    int deleteByUser(User user);
    
    @Modifying
    @Transactional
    int deleteByExpiryDateBefore(LocalDateTime now);
}
