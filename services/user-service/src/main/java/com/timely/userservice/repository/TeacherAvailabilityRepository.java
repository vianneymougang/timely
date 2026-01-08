package com.timely.userservice.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.timely.userservice.model.TeacherAvailability;

/**
 * Repository for TeacherAvailability entity
 */
@Repository
public interface TeacherAvailabilityRepository extends JpaRepository<TeacherAvailability, UUID> {
    
    /**
     * Find availability by teacher ID
     */
    Optional<TeacherAvailability> findByTeacherId(UUID teacherId);
    
    /**
     * Check if availability exists for a teacher
     */
    boolean existsByTeacherId(UUID teacherId);
    
    /**
     * Delete availability by teacher ID
     */
    void deleteByTeacherId(UUID teacherId);
}
