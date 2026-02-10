package com.timely.userservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_code_sequences")
public class UserCodeSequence {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String sequenceType;  // "TEACHER", "ADMIN", "STUDENT"

    @Column(nullable = false)
    private Long currentValue;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Constructeurs
    public UserCodeSequence() {
        this.currentValue = 0L;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public UserCodeSequence(String sequenceType) {
        this();
        this.sequenceType = sequenceType;
    }

    public UserCodeSequence(String sequenceType, Long currentValue) {
        this();
        this.sequenceType = sequenceType;
        this.currentValue = currentValue;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public String getSequenceType() {
        return sequenceType;
    }

    public Long getCurrentValue() {
        return currentValue;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // Setters
    public void setId(UUID id) {
        this.id = id;
    }

    public void setSequenceType(String sequenceType) {
        this.sequenceType = sequenceType;
    }

    public void setCurrentValue(Long currentValue) {
        this.currentValue = currentValue;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Méthode utilitaire pour incrémenter
    public void increment() {
        this.currentValue++;
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "UserCodeSequence{" +
                "id=" + id +
                ", sequenceType='" + sequenceType + '\'' +
                ", currentValue=" + currentValue +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}