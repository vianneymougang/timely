package com.timely.authservice.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.timely.authservice.model.PasswordResetToken;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByToken(String token);
    
    List<PasswordResetToken> findByUserId(UUID userId);
    
    @Modifying
    @Query("DELETE FROM PasswordResetToken prt WHERE prt.expiryDate < :now")
    void deleteExpiredTokens(LocalDateTime now);
    
    @Modifying
    @Query("UPDATE PasswordResetToken prt SET prt.used = true WHERE prt.userId = :userId AND prt.used = false")
    void invalidateAllUserTokens(UUID userId);
}
