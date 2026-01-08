package com.timely.userservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import com.timely.userservice.model.UserCodeSequence;

import jakarta.persistence.LockModeType;

public interface UserCodeSequenceRepository extends JpaRepository<UserCodeSequence, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<UserCodeSequence> findBySequenceType(String sequenceType);
}
