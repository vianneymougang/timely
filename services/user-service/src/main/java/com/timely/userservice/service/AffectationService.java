package com.timely.userservice.service;

import com.timely.userservice.dto.AssignTeacherRequest;
import com.timely.userservice.dto.EnseignerDto;
import com.timely.userservice.dto.IntervenirEcoleDto;

import java.util.List;
import java.util.UUID;

/**
 * Service interface for managing teacher assignments (schools and courses).
 */
public interface AffectationService {

    /**
     * Assign a teacher to a school
     */
    IntervenirEcoleDto assignTeacherToEcole(UUID enseignantId, UUID ecoleId, AssignTeacherRequest request);

    /**
     * Remove a teacher from a school
     */
    void removeTeacherFromEcole(UUID enseignantId, UUID ecoleId);

    /**
     * Get all schools assigned to a teacher
     */
    List<IntervenirEcoleDto> getTeacherEcoles(UUID enseignantId);

    /**
     * Assign a teacher to a course
     */
    EnseignerDto assignTeacherToCours(UUID enseignantId, UUID coursId, AssignTeacherRequest request);

    /**
     * Remove a teacher from a course
     */
    void removeTeacherFromCours(UUID enseignantId, UUID coursId);

    /**
     * Get all courses assigned to a teacher
     */
    List<EnseignerDto> getTeacherCours(UUID enseignantId);
}
