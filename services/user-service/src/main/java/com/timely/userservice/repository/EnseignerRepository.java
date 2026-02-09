package com.timely.userservice.repository;

import com.timely.userservice.model.Enseigner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for managing teacher-course assignments.
 */
@Repository
public interface EnseignerRepository extends JpaRepository<Enseigner, UUID> {

    /**
     * Find all courses assigned to a specific teacher
     */
    List<Enseigner> findByEnseignantId(UUID enseignantId);

    /**
     * Find all teachers assigned to a specific course
     */
    List<Enseigner> findByCoursId(UUID coursId);

    /**
     * Check if a teacher is already assigned to a course
     */
    Optional<Enseigner> findByEnseignantIdAndCoursId(UUID enseignantId, UUID coursId);

    /**
     * Check if an assignment exists
     */
    boolean existsByEnseignantIdAndCoursId(UUID enseignantId, UUID coursId);
}
