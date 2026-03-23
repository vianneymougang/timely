package com.timely.userservice.repository;

import com.timely.userservice.model.IntervenirEcole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for managing teacher-school assignments.
 */
@Repository
public interface IntervenirEcoleRepository extends JpaRepository<IntervenirEcole, UUID> {

    /**
     * Find all schools assigned to a specific teacher
     */
    List<IntervenirEcole> findByEnseignantId(UUID enseignantId);

    /**
     * Find all teachers assigned to a specific school
     */
    List<IntervenirEcole> findByEcoleId(UUID ecoleId);

    /**
     * Check if a teacher is already assigned to a school
     */
    Optional<IntervenirEcole> findByEnseignantIdAndEcoleId(UUID enseignantId, UUID ecoleId);

    /**
     * Check if an assignment exists
     */
    boolean existsByEnseignantIdAndEcoleId(UUID enseignantId, UUID ecoleId);
}
