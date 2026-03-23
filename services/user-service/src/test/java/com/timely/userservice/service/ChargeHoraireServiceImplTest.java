package com.timely.userservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.timely.userservice.client.BookingServiceClient;
import com.timely.userservice.dto.ChargeHoraireResponse;
import com.timely.userservice.dto.CoursResponseDto;
import com.timely.userservice.dto.EnseignerDto;
import com.timely.userservice.exception.UserNotFoundException;
import com.timely.userservice.repository.UserRepository;

/**
 * Unit tests for ChargeHoraireServiceImpl.
 * Validates F2.3 workload calculation functionality with mocked dependencies.
 *
 * Tests cover:
 * - Multiple courses calculation with correct total hours
 * - Aggregation by course type (CM, TD, TP)
 * - Aggregation by school
 * - No courses assigned scenario
 * - Feign client error handling
 */
@ExtendWith(MockitoExtension.class)
class ChargeHoraireServiceImplTest {

    @Mock
    private AffectationService affectationService;

    @Mock
    private BookingServiceClient bookingServiceClient;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ChargeHoraireServiceImpl chargeHoraireService;

    // Test data setup methods

    private UUID createTestTeacherId() {
        return UUID.fromString("12345678-1234-5678-1234-567812345678");
    }

    private UUID createTestCourseId(int index) {
        return UUID.fromString(String.format("00000000-0000-0000-0000-0000000000%02d", index));
    }

    private UUID createTestSchoolId(int index) {
        return UUID.fromString(String.format("ffffffff-ffff-ffff-ffff-0000000000%02d", index));
    }

    private EnseignerDto createTeacherCourseAssignment(UUID coursId) {
        return EnseignerDto.builder()
                .id(UUID.randomUUID())
                .enseignantId(createTestTeacherId())
                .coursId(coursId)
                .build();
    }

    private CoursResponseDto createCourse(UUID id, String type, int volumeHoraire, UUID ecoleId) {
        return CoursResponseDto.builder()
                .id(id)
                .code("COURS-" + id.toString().substring(0, 4).toUpperCase())
                .libelle("Test Course")
                .typeCours(type)
                .volumeHoraire(volumeHoraire)
                .ecoleId(ecoleId)
                .build();
    }

    // GIVEN-WHEN-THEN Tests following AAA pattern

    /**
     * Test F2.3.1: Calculate multiple courses with correct total hours aggregation.
     *
     * Scenario: Teacher has 3 courses with different volumes
     * Expected: Total hours = 48 + 30 + 20 = 98 hours
     */
    @Test
    void calculate_multipleCourses_correctTotalHours() {
        // Given
        UUID teacherId = createTestTeacherId();
        UUID course1Id = createTestCourseId(1);
        UUID course2Id = createTestCourseId(2);
        UUID course3Id = createTestCourseId(3);
        UUID schoolId = createTestSchoolId(1);

        List<EnseignerDto> assignments = Arrays.asList(
                createTeacherCourseAssignment(course1Id),
                createTeacherCourseAssignment(course2Id),
                createTeacherCourseAssignment(course3Id)
        );

        CoursResponseDto course1 = createCourse(course1Id, "CM", 48, schoolId);
        CoursResponseDto course2 = createCourse(course2Id, "TD", 30, schoolId);
        CoursResponseDto course3 = createCourse(course3Id, "TP", 20, schoolId);

        when(userRepository.existsById(teacherId)).thenReturn(true);
        when(affectationService.getTeacherCours(teacherId)).thenReturn(assignments);
        when(bookingServiceClient.getCoursById(course1Id)).thenReturn(course1);
        when(bookingServiceClient.getCoursById(course2Id)).thenReturn(course2);
        when(bookingServiceClient.getCoursById(course3Id)).thenReturn(course3);

        // When
        ChargeHoraireResponse result = chargeHoraireService.calculateChargeHoraire(teacherId);

        // Then
        assertThat(result)
                .isNotNull()
                .extracting("totalHeures", "nombreCours")
                .containsExactly(98, 3);
        assertThat(result.getEnseignantId()).isEqualTo(teacherId);

        verify(userRepository).existsById(teacherId);
        verify(affectationService).getTeacherCours(teacherId);
        verify(bookingServiceClient).getCoursById(course1Id);
        verify(bookingServiceClient).getCoursById(course2Id);
        verify(bookingServiceClient).getCoursById(course3Id);
    }

    /**
     * Test F2.3.2: Aggregate hours by course type (CM, TD, TP).
     *
     * Scenario: Teacher has courses with different types
     * Expected: CM=48, TD=30, TP=20 (proper breakdown by type)
     */
    @Test
    void calculate_aggregatesByType_CM_TD_TP() {
        // Given
        UUID teacherId = createTestTeacherId();
        UUID cmCourseId = createTestCourseId(1);
        UUID tdCourseId = createTestCourseId(2);
        UUID tpCourseId = createTestCourseId(3);
        UUID schoolId = createTestSchoolId(1);

        List<EnseignerDto> assignments = Arrays.asList(
                createTeacherCourseAssignment(cmCourseId),
                createTeacherCourseAssignment(tdCourseId),
                createTeacherCourseAssignment(tpCourseId)
        );

        CoursResponseDto cmCourse = createCourse(cmCourseId, "CM", 48, schoolId);
        CoursResponseDto tdCourse = createCourse(tdCourseId, "TD", 30, schoolId);
        CoursResponseDto tpCourse = createCourse(tpCourseId, "TP", 20, schoolId);

        when(userRepository.existsById(teacherId)).thenReturn(true);
        when(affectationService.getTeacherCours(teacherId)).thenReturn(assignments);
        when(bookingServiceClient.getCoursById(cmCourseId)).thenReturn(cmCourse);
        when(bookingServiceClient.getCoursById(tdCourseId)).thenReturn(tdCourse);
        when(bookingServiceClient.getCoursById(tpCourseId)).thenReturn(tpCourse);

        // When
        ChargeHoraireResponse result = chargeHoraireService.calculateChargeHoraire(teacherId);

        // Then
        assertThat(result.getHeuresParType())
                .isNotNull()
                .hasSize(3)
                .containsEntry("CM", 48)
                .containsEntry("TD", 30)
                .containsEntry("TP", 20);

        verify(userRepository).existsById(teacherId);
        verify(affectationService).getTeacherCours(teacherId);
    }

    /**
     * Test F2.3.3: Aggregate hours by school for proper load distribution.
     *
     * Scenario: Teacher teaches at 2 different schools
     * Expected: School 1 = 78 hours (CM 48 + TD 30), School 2 = 20 hours (TP)
     */
    @Test
    void calculate_aggregatesBySchool_correctGrouping() {
        // Given
        UUID teacherId = createTestTeacherId();
        UUID school1Id = createTestSchoolId(1);
        UUID school2Id = createTestSchoolId(2);

        UUID course1Id = createTestCourseId(1);
        UUID course2Id = createTestCourseId(2);
        UUID course3Id = createTestCourseId(3);

        List<EnseignerDto> assignments = Arrays.asList(
                createTeacherCourseAssignment(course1Id),
                createTeacherCourseAssignment(course2Id),
                createTeacherCourseAssignment(course3Id)
        );

        CoursResponseDto course1 = createCourse(course1Id, "CM", 48, school1Id);
        CoursResponseDto course2 = createCourse(course2Id, "TD", 30, school1Id);
        CoursResponseDto course3 = createCourse(course3Id, "TP", 20, school2Id);

        when(userRepository.existsById(teacherId)).thenReturn(true);
        when(affectationService.getTeacherCours(teacherId)).thenReturn(assignments);
        when(bookingServiceClient.getCoursById(course1Id)).thenReturn(course1);
        when(bookingServiceClient.getCoursById(course2Id)).thenReturn(course2);
        when(bookingServiceClient.getCoursById(course3Id)).thenReturn(course3);

        // When
        ChargeHoraireResponse result = chargeHoraireService.calculateChargeHoraire(teacherId);

        // Then
        assertThat(result.getHeuresParEcole())
                .isNotNull()
                .hasSize(2)
                .containsEntry(school1Id, 78)
                .containsEntry(school2Id, 20);
        assertThat(result.getTotalHeures()).isEqualTo(98);

        verify(userRepository).existsById(teacherId);
        verify(affectationService).getTeacherCours(teacherId);
    }

    /**
     * Test F2.3.4: Handle case where no courses are assigned to teacher.
     *
     * Scenario: Teacher exists but has no assigned courses
     * Expected: Empty response with 0 hours and no breakdown
     */
    @Test
    void calculate_noCoursesAssigned_returnsZeroHours() {
        // Given
        UUID teacherId = createTestTeacherId();
        List<EnseignerDto> emptyAssignments = new ArrayList<>();

        when(userRepository.existsById(teacherId)).thenReturn(true);
        when(affectationService.getTeacherCours(teacherId)).thenReturn(emptyAssignments);

        // When
        ChargeHoraireResponse result = chargeHoraireService.calculateChargeHoraire(teacherId);

        // Then
        assertThat(result)
                .isNotNull()
                .extracting("enseignantId", "totalHeures", "nombreCours")
                .containsExactly(teacherId, 0, 0);
        assertThat(result.getHeuresParType()).isEmpty();
        assertThat(result.getHeuresParEcole()).isEmpty();

        verify(userRepository).existsById(teacherId);
        verify(affectationService).getTeacherCours(teacherId);
        verify(bookingServiceClient, never()).getCoursById(any());
    }

    /**
     * Test F2.3.5: Handle Feign client errors gracefully.
     *
     * Scenario: Booking service throws exception for one course
     * Expected: Continue processing other courses, log warning
     */
    @Test
    void calculate_feignClientError_throwsException() {
        // Given
        UUID teacherId = createTestTeacherId();
        UUID failingCourseId = createTestCourseId(1);
        UUID successfulCourseId = createTestCourseId(2);
        UUID schoolId = createTestSchoolId(1);

        List<EnseignerDto> assignments = Arrays.asList(
                createTeacherCourseAssignment(failingCourseId),
                createTeacherCourseAssignment(successfulCourseId)
        );

        CoursResponseDto successfulCourse = createCourse(successfulCourseId, "CM", 48, schoolId);

        when(userRepository.existsById(teacherId)).thenReturn(true);
        when(affectationService.getTeacherCours(teacherId)).thenReturn(assignments);
        when(bookingServiceClient.getCoursById(failingCourseId))
                .thenThrow(new RuntimeException("Service unavailable"));
        when(bookingServiceClient.getCoursById(successfulCourseId)).thenReturn(successfulCourse);

        // When
        ChargeHoraireResponse result = chargeHoraireService.calculateChargeHoraire(teacherId);

        // Then - Should successfully calculate partial result
        assertThat(result)
                .isNotNull()
                .extracting("totalHeures", "nombreCours")
                .containsExactly(48, 2);  // One course succeeded
        assertThat(result.getHeuresParType())
                .containsEntry("CM", 48);

        verify(userRepository).existsById(teacherId);
        verify(affectationService).getTeacherCours(teacherId);
        verify(bookingServiceClient).getCoursById(failingCourseId);
        verify(bookingServiceClient).getCoursById(successfulCourseId);
    }

    /**
     * Additional test: User not found scenario.
     *
     * Scenario: Teacher does not exist in the system
     * Expected: UserNotFoundException is thrown
     */
    @Test
    void calculate_teacherNotFound_throwsUserNotFoundException() {
        // Given
        UUID nonExistentTeacherId = UUID.randomUUID();
        when(userRepository.existsById(nonExistentTeacherId)).thenReturn(false);

        // When/Then
        assertThatThrownBy(() -> chargeHoraireService.calculateChargeHoraire(nonExistentTeacherId))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("Teacher not found with id");

        verify(userRepository).existsById(nonExistentTeacherId);
        verify(affectationService, never()).getTeacherCours(any());
    }

    /**
     * Additional test: Course with null volume horaire.
     *
     * Scenario: Booking service returns course with null volume
     * Expected: Null courses are skipped, other courses processed
     */
    @Test
    void calculate_courseWithNullVolume_isSkipped() {
        // Given
        UUID teacherId = createTestTeacherId();
        UUID nullVolumeCourseId = createTestCourseId(1);
        UUID validCourseId = createTestCourseId(2);
        UUID schoolId = createTestSchoolId(1);

        List<EnseignerDto> assignments = Arrays.asList(
                createTeacherCourseAssignment(nullVolumeCourseId),
                createTeacherCourseAssignment(validCourseId)
        );

        CoursResponseDto nullVolumeCourse = CoursResponseDto.builder()
                .id(nullVolumeCourseId)
                .code("NULL-COURSE")
                .typeCours("CM")
                .volumeHoraire(null)  // Null volume
                .ecoleId(schoolId)
                .build();

        CoursResponseDto validCourse = createCourse(validCourseId, "TD", 30, schoolId);

        when(userRepository.existsById(teacherId)).thenReturn(true);
        when(affectationService.getTeacherCours(teacherId)).thenReturn(assignments);
        when(bookingServiceClient.getCoursById(nullVolumeCourseId)).thenReturn(nullVolumeCourse);
        when(bookingServiceClient.getCoursById(validCourseId)).thenReturn(validCourse);

        // When
        ChargeHoraireResponse result = chargeHoraireService.calculateChargeHoraire(teacherId);

        // Then
        assertThat(result.getTotalHeures()).isEqualTo(30);  // Only valid course
        assertThat(result.getHeuresParType()).containsEntry("TD", 30);
    }

    /**
     * Additional test: Course with null type (should default to OTHER).
     *
     * Scenario: Booking service returns course with null typeCours
     * Expected: Course is categorized as "OTHER"
     */
    @Test
    void calculate_courseWithNullType_defaultsToOther() {
        // Given
        UUID teacherId = createTestTeacherId();
        UUID courseId = createTestCourseId(1);
        UUID schoolId = createTestSchoolId(1);

        List<EnseignerDto> assignments = Arrays.asList(
                createTeacherCourseAssignment(courseId)
        );

        CoursResponseDto courseWithNullType = CoursResponseDto.builder()
                .id(courseId)
                .code("NULL-TYPE")
                .typeCours(null)  // Null type
                .volumeHoraire(25)
                .ecoleId(schoolId)
                .build();

        when(userRepository.existsById(teacherId)).thenReturn(true);
        when(affectationService.getTeacherCours(teacherId)).thenReturn(assignments);
        when(bookingServiceClient.getCoursById(courseId)).thenReturn(courseWithNullType);

        // When
        ChargeHoraireResponse result = chargeHoraireService.calculateChargeHoraire(teacherId);

        // Then
        assertThat(result.getTotalHeures()).isEqualTo(25);
        assertThat(result.getHeuresParType())
                .containsEntry("OTHER", 25);
    }

    /**
     * Additional test: Multiple courses of same type aggregation.
     *
     * Scenario: Teacher has 2 CM courses (48 + 36 hours)
     * Expected: CM type shows 84 hours total
     */
    @Test
    void calculate_multipleCoursesOfSameType_correctAggregation() {
        // Given
        UUID teacherId = createTestTeacherId();
        UUID cm1CourseId = createTestCourseId(1);
        UUID cm2CourseId = createTestCourseId(2);
        UUID schoolId = createTestSchoolId(1);

        List<EnseignerDto> assignments = Arrays.asList(
                createTeacherCourseAssignment(cm1CourseId),
                createTeacherCourseAssignment(cm2CourseId)
        );

        CoursResponseDto cm1Course = createCourse(cm1CourseId, "CM", 48, schoolId);
        CoursResponseDto cm2Course = createCourse(cm2CourseId, "CM", 36, schoolId);

        when(userRepository.existsById(teacherId)).thenReturn(true);
        when(affectationService.getTeacherCours(teacherId)).thenReturn(assignments);
        when(bookingServiceClient.getCoursById(cm1CourseId)).thenReturn(cm1Course);
        when(bookingServiceClient.getCoursById(cm2CourseId)).thenReturn(cm2Course);

        // When
        ChargeHoraireResponse result = chargeHoraireService.calculateChargeHoraire(teacherId);

        // Then
        assertThat(result.getTotalHeures()).isEqualTo(84);
        assertThat(result.getHeuresParType())
                .containsEntry("CM", 84)
                .hasSize(1);
    }
}
