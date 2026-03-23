package com.timely.userservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.timely.userservice.dto.AssignTeacherRequest;
import com.timely.userservice.dto.EnseignerDto;
import com.timely.userservice.dto.IntervenirEcoleDto;
import com.timely.userservice.exception.ResourceNotFoundException;
import com.timely.userservice.exception.UserNotFoundException;
import com.timely.userservice.model.Enseigner;
import com.timely.userservice.model.IntervenirEcole;
import com.timely.userservice.model.Teacher;
import com.timely.userservice.repository.EnseignerRepository;
import com.timely.userservice.repository.IntervenirEcoleRepository;
import com.timely.userservice.repository.UserRepository;

/**
 * Unit tests for AffectationServiceImpl.
 * Tests F2.1: Teacher-School Assignments and F2.2: Teacher-Course Assignments
 */
@ExtendWith(MockitoExtension.class)
class AffectationServiceImplTest {

    @Mock
    private IntervenirEcoleRepository intervenirEcoleRepository;

    @Mock
    private EnseignerRepository enseignerRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AffectationServiceImpl affectationService;

    // ============================================================================
    // F2.1 Tests: Teacher-School Assignments (Intervenir Ecole)
    // ============================================================================

    /**
     * Test: Assign a teacher to a school with valid IDs creates the assignment.
     * Validates F2.1 - Create Teacher-School Assignment
     */
    @Test
    void assignToSchool_validIds_createsAffectation() {
        // Arrange
        UUID enseignantId = UUID.randomUUID();
        UUID ecoleId = UUID.randomUUID();
        LocalDate dateDebut = LocalDate.of(2025, 1, 1);
        LocalDate dateFin = LocalDate.of(2025, 12, 31);

        AssignTeacherRequest request = AssignTeacherRequest.builder()
            .dateDebut(dateDebut)
            .dateFin(dateFin)
            .build();

        Teacher teacher = new Teacher();
        teacher.setId(enseignantId);

        IntervenirEcole newAssignment = IntervenirEcole.builder()
            .enseignantId(enseignantId)
            .ecoleId(ecoleId)
            .dateDebut(dateDebut)
            .dateFin(dateFin)
            .build();

        UUID assignmentId = UUID.randomUUID();
        newAssignment.setId(assignmentId);

        when(userRepository.findById(enseignantId)).thenReturn(Optional.of(teacher));
        when(intervenirEcoleRepository.existsByEnseignantIdAndEcoleId(enseignantId, ecoleId))
            .thenReturn(false);
        when(intervenirEcoleRepository.save(any(IntervenirEcole.class)))
            .thenReturn(newAssignment);

        // Act
        IntervenirEcoleDto result = affectationService.assignTeacherToEcole(
            enseignantId,
            ecoleId,
            request
        );

        // Assert
        assertThat(result)
            .isNotNull()
            .extracting("id", "enseignantId", "ecoleId", "dateDebut", "dateFin")
            .containsExactly(assignmentId, enseignantId, ecoleId, dateDebut, dateFin);

        verify(userRepository).findById(enseignantId);
        verify(intervenirEcoleRepository).existsByEnseignantIdAndEcoleId(enseignantId, ecoleId);
        verify(intervenirEcoleRepository).save(any(IntervenirEcole.class));
    }

    /**
     * Test: Assigning a teacher to a school where they already exist throws exception.
     * Validates F2.1 - Prevent duplicate assignments
     */
    @Test
    void assignToSchool_duplicateAffectation_throwsException() {
        // Arrange
        UUID enseignantId = UUID.randomUUID();
        UUID ecoleId = UUID.randomUUID();
        LocalDate dateDebut = LocalDate.of(2025, 1, 1);

        AssignTeacherRequest request = AssignTeacherRequest.builder()
            .dateDebut(dateDebut)
            .build();

        Teacher teacher = new Teacher();
        teacher.setId(enseignantId);

        when(userRepository.findById(enseignantId)).thenReturn(Optional.of(teacher));
        when(intervenirEcoleRepository.existsByEnseignantIdAndEcoleId(enseignantId, ecoleId))
            .thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() ->
            affectationService.assignTeacherToEcole(enseignantId, ecoleId, request)
        )
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("already assigned");

        verify(userRepository).findById(enseignantId);
        verify(intervenirEcoleRepository).existsByEnseignantIdAndEcoleId(enseignantId, ecoleId);
        verify(intervenirEcoleRepository, never()).save(any());
    }

    /**
     * Test: Assigning a non-existent teacher to a school throws exception.
     * Validates F2.1 - Teacher validation
     */
    @Test
    void assignToSchool_enseignantNotFound_throwsException() {
        // Arrange
        UUID enseignantId = UUID.randomUUID();
        UUID ecoleId = UUID.randomUUID();
        LocalDate dateDebut = LocalDate.of(2025, 1, 1);

        AssignTeacherRequest request = AssignTeacherRequest.builder()
            .dateDebut(dateDebut)
            .build();

        when(userRepository.findById(enseignantId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() ->
            affectationService.assignTeacherToEcole(enseignantId, ecoleId, request)
        )
            .isInstanceOf(UserNotFoundException.class)
            .hasMessageContaining("Teacher not found");

        verify(userRepository).findById(enseignantId);
        verify(intervenirEcoleRepository, never()).existsByEnseignantIdAndEcoleId(any(), any());
        verify(intervenirEcoleRepository, never()).save(any());
    }

    /**
     * Test: Removing an existing teacher-school assignment deletes it.
     * Validates F2.1 - Delete Teacher-School Assignment
     */
    @Test
    void removeFromSchool_existingAffectation_deletesIt() {
        // Arrange
        UUID enseignantId = UUID.randomUUID();
        UUID ecoleId = UUID.randomUUID();
        UUID assignmentId = UUID.randomUUID();

        IntervenirEcole existingAssignment = IntervenirEcole.builder()
            .id(assignmentId)
            .enseignantId(enseignantId)
            .ecoleId(ecoleId)
            .dateDebut(LocalDate.of(2025, 1, 1))
            .build();

        when(intervenirEcoleRepository.findByEnseignantIdAndEcoleId(enseignantId, ecoleId))
            .thenReturn(Optional.of(existingAssignment));

        // Act
        affectationService.removeTeacherFromEcole(enseignantId, ecoleId);

        // Assert
        verify(intervenirEcoleRepository).findByEnseignantIdAndEcoleId(enseignantId, ecoleId);
        verify(intervenirEcoleRepository).delete(existingAssignment);
    }

    /**
     * Test: Getting schools for an existing teacher returns the list of assignments.
     * Validates F2.1 - Retrieve Teacher-School Assignments
     */
    @Test
    void getSchools_existingTeacher_returnsSchoolList() {
        // Arrange
        UUID enseignantId = UUID.randomUUID();

        Teacher teacher = new Teacher();
        teacher.setId(enseignantId);

        UUID ecoleId1 = UUID.randomUUID();
        UUID ecoleId2 = UUID.randomUUID();

        IntervenirEcole assignment1 = IntervenirEcole.builder()
            .id(UUID.randomUUID())
            .enseignantId(enseignantId)
            .ecoleId(ecoleId1)
            .dateDebut(LocalDate.of(2025, 1, 1))
            .dateFin(LocalDate.of(2025, 6, 30))
            .build();

        IntervenirEcole assignment2 = IntervenirEcole.builder()
            .id(UUID.randomUUID())
            .enseignantId(enseignantId)
            .ecoleId(ecoleId2)
            .dateDebut(LocalDate.of(2025, 7, 1))
            .dateFin(LocalDate.of(2025, 12, 31))
            .build();

        when(userRepository.existsById(enseignantId)).thenReturn(true);
        when(intervenirEcoleRepository.findByEnseignantId(enseignantId))
            .thenReturn(List.of(assignment1, assignment2));

        // Act
        List<IntervenirEcoleDto> result = affectationService.getTeacherEcoles(enseignantId);

        // Assert
        assertThat(result)
            .isNotNull()
            .hasSize(2)
            .extracting("ecoleId")
            .containsExactly(ecoleId1, ecoleId2);

        verify(userRepository).existsById(enseignantId);
        verify(intervenirEcoleRepository).findByEnseignantId(enseignantId);
    }

    // ============================================================================
    // F2.2 Tests: Teacher-Course Assignments (Enseigner)
    // ============================================================================

    /**
     * Test: Assign a teacher to a course with valid IDs creates the assignment.
     * Validates F2.2 - Create Teacher-Course Assignment
     */
    @Test
    void assignToCourse_validIds_createsAffectation() {
        // Arrange
        UUID enseignantId = UUID.randomUUID();
        UUID coursId = UUID.randomUUID();
        LocalDate dateDebut = LocalDate.of(2025, 1, 1);
        LocalDate dateFin = LocalDate.of(2025, 12, 31);

        AssignTeacherRequest request = AssignTeacherRequest.builder()
            .dateDebut(dateDebut)
            .dateFin(dateFin)
            .build();

        Enseigner newAssignment = Enseigner.builder()
            .enseignantId(enseignantId)
            .coursId(coursId)
            .dateDebut(dateDebut)
            .dateFin(dateFin)
            .build();

        UUID assignmentId = UUID.randomUUID();
        newAssignment.setId(assignmentId);

        when(userRepository.existsById(enseignantId)).thenReturn(true);
        when(enseignerRepository.existsByEnseignantIdAndCoursId(enseignantId, coursId))
            .thenReturn(false);
        when(enseignerRepository.save(any(Enseigner.class)))
            .thenReturn(newAssignment);

        // Act
        EnseignerDto result = affectationService.assignTeacherToCours(
            enseignantId,
            coursId,
            request
        );

        // Assert
        assertThat(result)
            .isNotNull()
            .extracting("id", "enseignantId", "coursId", "dateDebut", "dateFin")
            .containsExactly(assignmentId, enseignantId, coursId, dateDebut, dateFin);

        verify(userRepository).existsById(enseignantId);
        verify(enseignerRepository).existsByEnseignantIdAndCoursId(enseignantId, coursId);
        verify(enseignerRepository).save(any(Enseigner.class));
    }

    /**
     * Test: Assigning a teacher to a course where they already exist throws exception.
     * Validates F2.2 - Prevent duplicate assignments
     */
    @Test
    void assignToCourse_duplicateAffectation_throwsException() {
        // Arrange
        UUID enseignantId = UUID.randomUUID();
        UUID coursId = UUID.randomUUID();
        LocalDate dateDebut = LocalDate.of(2025, 1, 1);

        AssignTeacherRequest request = AssignTeacherRequest.builder()
            .dateDebut(dateDebut)
            .build();

        when(userRepository.existsById(enseignantId)).thenReturn(true);
        when(enseignerRepository.existsByEnseignantIdAndCoursId(enseignantId, coursId))
            .thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() ->
            affectationService.assignTeacherToCours(enseignantId, coursId, request)
        )
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("already assigned");

        verify(userRepository).existsById(enseignantId);
        verify(enseignerRepository).existsByEnseignantIdAndCoursId(enseignantId, coursId);
        verify(enseignerRepository, never()).save(any());
    }

    /**
     * Test: Removing an existing teacher-course assignment deletes it.
     * Validates F2.2 - Delete Teacher-Course Assignment
     */
    @Test
    void removeCourse_existingAffectation_deletesIt() {
        // Arrange
        UUID enseignantId = UUID.randomUUID();
        UUID coursId = UUID.randomUUID();
        UUID assignmentId = UUID.randomUUID();

        Enseigner existingAssignment = Enseigner.builder()
            .id(assignmentId)
            .enseignantId(enseignantId)
            .coursId(coursId)
            .dateDebut(LocalDate.of(2025, 1, 1))
            .build();

        when(enseignerRepository.findByEnseignantIdAndCoursId(enseignantId, coursId))
            .thenReturn(Optional.of(existingAssignment));

        // Act
        affectationService.removeTeacherFromCours(enseignantId, coursId);

        // Assert
        verify(enseignerRepository).findByEnseignantIdAndCoursId(enseignantId, coursId);
        verify(enseignerRepository).delete(existingAssignment);
    }

    /**
     * Test: Getting courses for an existing teacher returns the list of assignments.
     * Validates F2.2 - Retrieve Teacher-Course Assignments
     */
    @Test
    void getCourses_existingTeacher_returnsCourseList() {
        // Arrange
        UUID enseignantId = UUID.randomUUID();

        UUID coursId1 = UUID.randomUUID();
        UUID coursId2 = UUID.randomUUID();
        UUID coursId3 = UUID.randomUUID();

        Enseigner assignment1 = Enseigner.builder()
            .id(UUID.randomUUID())
            .enseignantId(enseignantId)
            .coursId(coursId1)
            .dateDebut(LocalDate.of(2025, 1, 1))
            .dateFin(LocalDate.of(2025, 6, 30))
            .build();

        Enseigner assignment2 = Enseigner.builder()
            .id(UUID.randomUUID())
            .enseignantId(enseignantId)
            .coursId(coursId2)
            .dateDebut(LocalDate.of(2025, 2, 1))
            .dateFin(LocalDate.of(2025, 5, 31))
            .build();

        Enseigner assignment3 = Enseigner.builder()
            .id(UUID.randomUUID())
            .enseignantId(enseignantId)
            .coursId(coursId3)
            .dateDebut(LocalDate.of(2025, 7, 1))
            .dateFin(LocalDate.of(2025, 12, 31))
            .build();

        when(userRepository.existsById(enseignantId)).thenReturn(true);
        when(enseignerRepository.findByEnseignantId(enseignantId))
            .thenReturn(List.of(assignment1, assignment2, assignment3));

        // Act
        List<EnseignerDto> result = affectationService.getTeacherCours(enseignantId);

        // Assert
        assertThat(result)
            .isNotNull()
            .hasSize(3)
            .extracting("coursId")
            .containsExactly(coursId1, coursId2, coursId3);

        verify(userRepository).existsById(enseignantId);
        verify(enseignerRepository).findByEnseignantId(enseignantId);
    }

    // ============================================================================
    // Additional Edge Cases and Error Handling
    // ============================================================================

    /**
     * Test: Removing a non-existent teacher-school assignment throws exception.
     */
    @Test
    void removeFromSchool_nonExistentAffectation_throwsException() {
        // Arrange
        UUID enseignantId = UUID.randomUUID();
        UUID ecoleId = UUID.randomUUID();

        when(intervenirEcoleRepository.findByEnseignantIdAndEcoleId(enseignantId, ecoleId))
            .thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() ->
            affectationService.removeTeacherFromEcole(enseignantId, ecoleId)
        )
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Assignment not found");

        verify(intervenirEcoleRepository, never()).delete(any());
    }

    /**
     * Test: Removing a non-existent teacher-course assignment throws exception.
     */
    @Test
    void removeCourse_nonExistentAffectation_throwsException() {
        // Arrange
        UUID enseignantId = UUID.randomUUID();
        UUID coursId = UUID.randomUUID();

        when(enseignerRepository.findByEnseignantIdAndCoursId(enseignantId, coursId))
            .thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() ->
            affectationService.removeTeacherFromCours(enseignantId, coursId)
        )
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Assignment not found");

        verify(enseignerRepository, never()).delete(any());
    }

    /**
     * Test: Getting schools for a non-existent teacher throws exception.
     */
    @Test
    void getSchools_nonExistentTeacher_throwsException() {
        // Arrange
        UUID enseignantId = UUID.randomUUID();

        when(userRepository.existsById(enseignantId)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() ->
            affectationService.getTeacherEcoles(enseignantId)
        )
            .isInstanceOf(UserNotFoundException.class)
            .hasMessageContaining("Teacher not found");

        verify(intervenirEcoleRepository, never()).findByEnseignantId(any());
    }

    /**
     * Test: Getting courses for a non-existent teacher throws exception.
     */
    @Test
    void getCourses_nonExistentTeacher_throwsException() {
        // Arrange
        UUID enseignantId = UUID.randomUUID();

        when(userRepository.existsById(enseignantId)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() ->
            affectationService.getTeacherCours(enseignantId)
        )
            .isInstanceOf(UserNotFoundException.class)
            .hasMessageContaining("Teacher not found");

        verify(enseignerRepository, never()).findByEnseignantId(any());
    }

    /**
     * Test: Getting schools for a teacher with no assignments returns empty list.
     */
    @Test
    void getSchools_teacherWithNoAssignments_returnsEmptyList() {
        // Arrange
        UUID enseignantId = UUID.randomUUID();

        when(userRepository.existsById(enseignantId)).thenReturn(true);
        when(intervenirEcoleRepository.findByEnseignantId(enseignantId))
            .thenReturn(new ArrayList<>());

        // Act
        List<IntervenirEcoleDto> result = affectationService.getTeacherEcoles(enseignantId);

        // Assert
        assertThat(result).isEmpty();
        verify(userRepository).existsById(enseignantId);
        verify(intervenirEcoleRepository).findByEnseignantId(enseignantId);
    }

    /**
     * Test: Getting courses for a teacher with no assignments returns empty list.
     */
    @Test
    void getCourses_teacherWithNoAssignments_returnsEmptyList() {
        // Arrange
        UUID enseignantId = UUID.randomUUID();

        when(userRepository.existsById(enseignantId)).thenReturn(true);
        when(enseignerRepository.findByEnseignantId(enseignantId))
            .thenReturn(new ArrayList<>());

        // Act
        List<EnseignerDto> result = affectationService.getTeacherCours(enseignantId);

        // Assert
        assertThat(result).isEmpty();
        verify(userRepository).existsById(enseignantId);
        verify(enseignerRepository).findByEnseignantId(enseignantId);
    }
}
