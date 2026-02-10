package com.timely.userservice.repository;

import com.timely.userservice.model.UserCodeSequence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserCodeSequenceRepository extends JpaRepository<UserCodeSequence, UUID> {

    /**
     * Find sequence by type with pessimistic lock to ensure thread-safety
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM UserCodeSequence s WHERE s.sequenceType = :type")
    Optional<UserCodeSequence> findBySequenceTypeWithLock(@Param("type") String sequenceType);

    /**
     * Find sequence by type without lock
     */
    Optional<UserCodeSequence> findBySequenceType(String sequenceType);

    /**
     * Check if sequence exists for a type
     */
    boolean existsBySequenceType(String sequenceType);
}