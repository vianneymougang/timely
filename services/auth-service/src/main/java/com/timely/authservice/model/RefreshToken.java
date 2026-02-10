package com.timely.authservice.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private Instant expiryDate;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    // Constructeurs
    public RefreshToken() {
        this.createdAt = Instant.now();
    }

    public RefreshToken(String token, UUID userId, Instant expiryDate) {
        this();
        this.token = token;
        this.userId = userId;
        this.expiryDate = expiryDate;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public UUID getUserId() {
        return userId;
    }

    public Instant getExpiryDate() {
        return expiryDate;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    // Setters
    public void setId(UUID id) {
        this.id = id;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void setExpiryDate(Instant expiryDate) {
        this.expiryDate = expiryDate;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    // Méthode utilitaire
    public boolean isExpired() {
        return Instant.now().isAfter(this.expiryDate);
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}