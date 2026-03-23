package com.timely.userservice.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
     * Find availability by teacher ID with time slots eagerly loaded
     * Use this method when you need to access the timeSlots collection
     * to avoid N+1 queries
     */
    @Query("SELECT ta FROM TeacherAvailability ta LEFT JOIN FETCH ta.timeSlots WHERE ta.teacherId = :teacherId")
    Optional<TeacherAvailability> findByTeacherIdWithTimeSlots(@Param("teacherId") UUID teacherId);

    /**
     * Check if availability exists for a teacher
     */
    boolean existsByTeacherId(UUID teacherId);

    /**
     * Delete availability by teacher ID
     */
    void deleteByTeacherId(UUID teacherId);
}
