package com.timely.userservice.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.transaction.annotation.Transactional;

import com.timely.userservice.AbstractUserIntegrationTest;
import com.timely.userservice.client.BookingServiceClient;
import com.timely.userservice.dto.AssignTeacherRequest;
import com.timely.userservice.dto.ChargeHoraireResponse;
import com.timely.userservice.dto.CoursResponseDto;
import com.timely.userservice.dto.CreateTeacherRequest;
import com.timely.userservice.dto.EnseignerDto;
import com.timely.userservice.dto.IntervenirEcoleDto;
import com.timely.userservice.dto.TeacherDto;
import com.timely.userservice.exception.UserNotFoundException;
import com.timely.userservice.model.Enseigner;
import com.timely.userservice.model.IntervenirEcole;
import com.timely.userservice.model.Teacher;
import com.timely.userservice.repository.EnseignerRepository;
import com.timely.userservice.repository.IntervenirEcoleRepository;
import com.timely.userservice.repository.TeacherRepository;
import com.timely.userservice.service.AffectationService;
import com.timely.userservice.service.ChargeHoraireService;
import com.timely.userservice.service.UserService;

/**
 * Comprehensive E2E integration tests for user-service.
 *
 * Validates functional requirements:
 * - F5.1: Teacher creation with automatic matricule generation
 * - F5.2: Teacher assignment to schools (IntervenirEcole)
 * - F5.3: Teacher assignment to courses (Enseigner)
 * - F5.4: Workload calculation (ChargeHoraire) with booking-service integration
 *
 * Uses PostgreSQL Testcontainers and mocked BookingServiceClient for complete integration testing.
 */
@DisplayName("User Service Integration Tests")
@Transactional
class UserServiceIntegrationTest extends AbstractUserIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private AffectationService affectationService;

    @Autowired
    private ChargeHoraireService chargeHoraireService;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private IntervenirEcoleRepository intervenirEcoleRepository;

    @Autowired
    private EnseignerRepository enseignerRepository;

    @MockBean
    private BookingServiceClient bookingServiceClient;

    private UUID testTeacherId;
    private UUID testEcoleId;
    private UUID testCoursId;

    @BeforeEach
    void setUp() {
        // Generate test UUIDs
        testTeacherId = UUID.randomUUID();
        testEcoleId = UUID.randomUUID();
        testCoursId = UUID.randomUUID();
    }

    // ==================== Test 1: createTeacher_andAssignToSchool_fullWorkflow ====================

    @Test
    @DisplayName("F5.1-5.2: Create teacher and assign to school - full workflow")
    void createTeacher_andAssignToSchool_fullWorkflow() {
        // Given: A teacher creation request
        CreateTeacherRequest createRequest = new CreateTeacherRequest();
        createRequest.setName("Jean");
        createRequest.setSurname("Dupont");
        createRequest.setEmail("jean.dupont@iusjc.edu");
        createRequest.setGrade("Professeur");
        createRequest.setRank("Senior");
        createRequest.setHourlyRate("50");
        createRequest.setTelephoneNumber(123456789L);

        // When: Create teacher
        TeacherDto createdTeacher = userService.createTeacher(createRequest);

        // Then: Teacher should be created with auto-generated matricule
        assertThat(createdTeacher).isNotNull();
        assertThat(createdTeacher.getId()).isNotNull();
        assertThat(createdTeacher.getEmail()).isEqualTo("jean.dupont@iusjc.edu");
        assertThat(createdTeacher.getName()).isEqualTo("Jean");
        assertThat(createdTeacher.getSurname()).isEqualTo("Dupont");
        assertThat(createdTeacher.getMatricule()).isNotNull();
        assertThat(createdTeacher.getGrade()).isEqualTo("Professeur");
        assertThat(createdTeacher.getRank()).isEqualTo("Senior");

        // Verify teacher exists in database
        Teacher savedTeacher = teacherRepository.findById(createdTeacher.getId()).orElse(null);
        assertThat(savedTeacher).isNotNull();
        assertThat(savedTeacher.getMatricule()).isNotBlank();

        // When: Assign teacher to school
        AssignTeacherRequest assignRequest = AssignTeacherRequest.builder()
                .dateDebut(LocalDate.now())
                .dateFin(LocalDate.now().plusDays(365))
                .build();

        IntervenirEcoleDto assignment = affectationService.assignTeacherToEcole(
                createdTeacher.getId(),
                testEcoleId,
                assignRequest);

        // Then: Assignment should be created successfully
        assertThat(assignment).isNotNull();
        assertThat(assignment.getId()).isNotNull();
        assertThat(assignment.getEnseignantId()).isEqualTo(createdTeacher.getId());
        assertThat(assignment.getEcoleId()).isEqualTo(testEcoleId);
        assertThat(assignment.getDateDebut()).isEqualTo(LocalDate.now());

        // Verify assignment exists in database
        IntervenirEcole saved = intervenirEcoleRepository
                .findByEnseignantIdAndEcoleId(createdTeacher.getId(), testEcoleId)
                .orElse(null);
        assertThat(saved).isNotNull();
    }

    // ==================== Test 2: assignToSchool_thenListSchools_returnsAssigned ====================

    @Test
    @DisplayName("F5.2: Assign to school, then list schools - returns assigned school")
    void assignToSchool_thenListSchools_returnsAssigned() {
        // Given: A teacher already created
        Teacher teacher = new Teacher();
        teacher.setId(testTeacherId);
        teacher.setName("Marie");
        teacher.setSurname("Martin");
        teacher.setEmail("marie.martin@iusjc.edu");
        teacher.setGrade("Maitre de Conférences");
        teacher.setRank("Junior");
        teacher.setHourlyRate("40");
        teacher.setMatricule("MAT001");
        teacher = teacherRepository.save(teacher);

        // Multiple school assignments
        UUID ecole1 = UUID.randomUUID();
        UUID ecole2 = UUID.randomUUID();
        UUID ecole3 = UUID.randomUUID();

        AssignTeacherRequest assignRequest = AssignTeacherRequest.builder()
                .dateDebut(LocalDate.now())
                .dateFin(LocalDate.now().plusDays(180))
                .build();

        // When: Assign teacher to multiple schools
        affectationService.assignTeacherToEcole(teacher.getId(), ecole1, assignRequest);
        affectationService.assignTeacherToEcole(teacher.getId(), ecole2, assignRequest);
        affectationService.assignTeacherToEcole(teacher.getId(), ecole3, assignRequest);

        // Then: Listing schools should return all assigned schools
        List<IntervenirEcoleDto> assignedSchools = affectationService.getTeacherEcoles(teacher.getId());

        assertThat(assignedSchools).hasSize(3);
        assertThat(assignedSchools)
                .extracting(IntervenirEcoleDto::getEcoleId)
                .containsExactlyInAnyOrder(ecole1, ecole2, ecole3);

        UUID teacherId = teacher.getId();
        assertThat(assignedSchools)
                .extracting(IntervenirEcoleDto::getEnseignantId)
                .allMatch(id -> id.equals(teacherId));
    }

    // ==================== Test 3: assignToSchool_duplicate_throwsConflict ====================

    @Test
    @DisplayName("F5.2: Assign to school duplicate - throws conflict exception")
    void assignToSchool_duplicate_throwsConflict() {
        // Given: A teacher already assigned to a school
        Teacher teacher = new Teacher();
        teacher.setId(testTeacherId);
        teacher.setName("Pierre");
        teacher.setSurname("Bernard");
        teacher.setEmail("pierre.bernard@iusjc.edu");
        teacher.setGrade("Professeur");
        teacher.setRank("Senior");
        teacher.setHourlyRate("55");
        teacher.setMatricule("MAT002");
        teacher = teacherRepository.save(teacher);

        final UUID schoolId = UUID.randomUUID();
        final UUID teacherId = teacher.getId();

        AssignTeacherRequest assignRequest = AssignTeacherRequest.builder()
                .dateDebut(LocalDate.now())
                .dateFin(LocalDate.now().plusDays(365))
                .build();

        // First assignment succeeds
        affectationService.assignTeacherToEcole(teacherId, schoolId, assignRequest);

        // When/Then: Duplicate assignment throws IllegalStateException
        assertThatThrownBy(() ->
            affectationService.assignTeacherToEcole(teacherId, schoolId, assignRequest))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already assigned to school");
    }

    // ==================== Test 4: assignToCourse_thenListCourses_returnsAssigned ====================

    @Test
    @DisplayName("F5.3: Assign to course, then list courses - returns assigned courses")
    void assignToCourse_thenListCourses_returnsAssigned() {
        // Given: A teacher already created
        Teacher teacher = new Teacher();
        teacher.setId(testTeacherId);
        teacher.setName("Sophie");
        teacher.setSurname("Laurent");
        teacher.setEmail("sophie.laurent@iusjc.edu");
        teacher.setGrade("Maitre de Conférences");
        teacher.setRank("Senior");
        teacher.setHourlyRate("45");
        teacher.setMatricule("MAT003");
        teacher = teacherRepository.save(teacher);

        // Multiple course assignments
        UUID cours1 = UUID.randomUUID();
        UUID cours2 = UUID.randomUUID();
        UUID cours3 = UUID.randomUUID();

        AssignTeacherRequest assignRequest = AssignTeacherRequest.builder()
                .dateDebut(LocalDate.now())
                .dateFin(LocalDate.now().plusDays(120))
                .build();

        // When: Assign teacher to multiple courses
        affectationService.assignTeacherToCours(teacher.getId(), cours1, assignRequest);
        affectationService.assignTeacherToCours(teacher.getId(), cours2, assignRequest);
        affectationService.assignTeacherToCours(teacher.getId(), cours3, assignRequest);

        // Then: Listing courses should return all assigned courses
        List<EnseignerDto> assignedCourses = affectationService.getTeacherCours(teacher.getId());

        assertThat(assignedCourses).hasSize(3);
        assertThat(assignedCourses)
                .extracting(EnseignerDto::getCoursId)
                .containsExactlyInAnyOrder(cours1, cours2, cours3);

        UUID teacherId = teacher.getId();
        LocalDate startDate = LocalDate.now();
        assertThat(assignedCourses)
                .extracting(EnseignerDto::getEnseignantId)
                .allMatch(id -> id.equals(teacherId));

        // Verify each assignment has correct date ranges
        assertThat(assignedCourses)
                .extracting(EnseignerDto::getDateDebut)
                .allMatch(date -> date.equals(startDate));
    }

    // ==================== Test 5: calculateChargeHoraire_withMockedBookingService_correctTotal ====================

    @Test
    @DisplayName("F5.4: Calculate charge horaire with mocked booking service - correct total")
    void calculateChargeHoraire_withMockedBookingService_correctTotal() {
        // Given: A teacher with multiple course assignments
        Teacher teacher = new Teacher();
        teacher.setId(testTeacherId);
        teacher.setName("Luc");
        teacher.setSurname("Moreau");
        teacher.setEmail("luc.moreau@iusjc.edu");
        teacher.setGrade("Professeur");
        teacher.setRank("Senior");
        teacher.setHourlyRate("50");
        teacher.setMatricule("MAT004");
        teacher = teacherRepository.save(teacher);

        // Create course assignments
        UUID cours1 = UUID.randomUUID();
        UUID cours2 = UUID.randomUUID();
        UUID cours3 = UUID.randomUUID();

        UUID ecole1 = UUID.randomUUID();
        UUID ecole2 = UUID.randomUUID();

        AssignTeacherRequest assignRequest = AssignTeacherRequest.builder()
                .dateDebut(LocalDate.now())
                .dateFin(LocalDate.now().plusDays(90))
                .build();

        // Create assignments in DB
        affectationService.assignTeacherToCours(teacher.getId(), cours1, assignRequest);
        affectationService.assignTeacherToCours(teacher.getId(), cours2, assignRequest);
        affectationService.assignTeacherToCours(teacher.getId(), cours3, assignRequest);

        // Mock booking service responses
        CoursResponseDto mockCours1 = CoursResponseDto.builder()
                .id(cours1)
                .code("ALGO101")
                .libelle("Algorithmique")
                .typeCours("CM")
                .volumeHoraire(30)
                .ecoleId(ecole1)
                .build();

        CoursResponseDto mockCours2 = CoursResponseDto.builder()
                .id(cours2)
                .code("ALGO102")
                .libelle("Algorithmique TP")
                .typeCours("TP")
                .volumeHoraire(20)
                .ecoleId(ecole1)
                .build();

        CoursResponseDto mockCours3 = CoursResponseDto.builder()
                .id(cours3)
                .code("PROG101")
                .libelle("Programmation")
                .typeCours("TD")
                .volumeHoraire(25)
                .ecoleId(ecole2)
                .build();

        when(bookingServiceClient.getCoursById(cours1)).thenReturn(mockCours1);
        when(bookingServiceClient.getCoursById(cours2)).thenReturn(mockCours2);
        when(bookingServiceClient.getCoursById(cours3)).thenReturn(mockCours3);

        // When: Calculate charge horaire
        ChargeHoraireResponse response = chargeHoraireService.calculateChargeHoraire(teacher.getId());

        // Then: Should return correct total hours and breakdown
        assertThat(response).isNotNull();
        assertThat(response.getEnseignantId()).isEqualTo(teacher.getId());
        assertThat(response.getTotalHeures()).isEqualTo(75); // 30 + 20 + 25
        assertThat(response.getNombreCours()).isEqualTo(3);

        // Verify breakdown by course type
        assertThat(response.getHeuresParType())
                .containsEntry("CM", 30)
                .containsEntry("TP", 20)
                .containsEntry("TD", 25);

        // Verify breakdown by school
        assertThat(response.getHeuresParEcole())
                .containsEntry(ecole1, 50) // 30 + 20
                .containsEntry(ecole2, 25); // 25
    }

    // ==================== Additional test: ChargeHoraire with no courses ====================

    @Test
    @DisplayName("F5.4: Calculate charge horaire with no courses - returns empty response")
    void calculateChargeHoraire_noCourses_returnsEmptyResponse() {
        // Given: A teacher with no course assignments
        Teacher teacher = new Teacher();
        teacher.setId(testTeacherId);
        teacher.setName("Anne");
        teacher.setSurname("Durand");
        teacher.setEmail("anne.durand@iusjc.edu");
        teacher.setGrade("Maitre de Conférences");
        teacher.setRank("Junior");
        teacher.setHourlyRate("40");
        teacher.setMatricule("MAT005");
        teacher = teacherRepository.save(teacher);

        // When: Calculate charge horaire with no courses
        ChargeHoraireResponse response = chargeHoraireService.calculateChargeHoraire(teacher.getId());

        // Then: Should return empty response with zeros
        assertThat(response).isNotNull();
        assertThat(response.getEnseignantId()).isEqualTo(teacher.getId());
        assertThat(response.getTotalHeures()).isEqualTo(0);
        assertThat(response.getNombreCours()).isEqualTo(0);
        assertThat(response.getHeuresParType()).isEmpty();
        assertThat(response.getHeuresParEcole()).isEmpty();
    }

    // ==================== Additional test: ChargeHoraire with invalid teacher ====================

    @Test
    @DisplayName("F5.4: Calculate charge horaire with invalid teacher - throws not found")
    void calculateChargeHoraire_invalidTeacher_throwsNotFound() {
        // Given: A non-existent teacher ID
        UUID nonExistentTeacherId = UUID.randomUUID();

        // When/Then: Should throw UserNotFoundException
        assertThatThrownBy(() -> chargeHoraireService.calculateChargeHoraire(nonExistentTeacherId))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("Teacher not found");
    }

    // ==================== Additional test: Course assignment duplicate ====================

    @Test
    @DisplayName("F5.3: Assign to course duplicate - throws conflict exception")
    void assignToCourse_duplicate_throwsConflict() {
        // Given: A teacher already assigned to a course
        Teacher teacher = new Teacher();
        teacher.setId(testTeacherId);
        teacher.setName("Claire");
        teacher.setSurname("Petit");
        teacher.setEmail("claire.petit@iusjc.edu");
        teacher.setGrade("Professeur");
        teacher.setRank("Senior");
        teacher.setHourlyRate("52");
        teacher.setMatricule("MAT006");
        teacher = teacherRepository.save(teacher);

        final UUID courseId = UUID.randomUUID();
        final UUID teacherId = teacher.getId();

        AssignTeacherRequest assignRequest = AssignTeacherRequest.builder()
                .dateDebut(LocalDate.now())
                .dateFin(LocalDate.now().plusDays(60))
                .build();

        // First assignment succeeds
        affectationService.assignTeacherToCours(teacherId, courseId, assignRequest);

        // When/Then: Duplicate assignment throws IllegalStateException
        assertThatThrownBy(() ->
            affectationService.assignTeacherToCours(teacherId, courseId, assignRequest))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already assigned to course");
    }

    // ==================== Additional test: ChargeHoraire with partial failure ====================

    @Test
    @DisplayName("F5.4: Calculate charge horaire with partial booking service failure - continues")
    void calculateChargeHoraire_partialFailure_continuesWithAvailable() {
        // Given: A teacher with multiple course assignments where one fails to fetch
        Teacher teacher = new Teacher();
        teacher.setId(testTeacherId);
        teacher.setName("Marc");
        teacher.setSurname("Renaud");
        teacher.setEmail("marc.renaud@iusjc.edu");
        teacher.setGrade("Maitre de Conférences");
        teacher.setRank("Senior");
        teacher.setHourlyRate("48");
        teacher.setMatricule("MAT007");
        teacher = teacherRepository.save(teacher);

        UUID cours1 = UUID.randomUUID();
        UUID cours2 = UUID.randomUUID();
        UUID cours3 = UUID.randomUUID();
        UUID ecole1 = UUID.randomUUID();

        AssignTeacherRequest assignRequest = AssignTeacherRequest.builder()
                .dateDebut(LocalDate.now())
                .dateFin(LocalDate.now().plusDays(90))
                .build();

        affectationService.assignTeacherToCours(teacher.getId(), cours1, assignRequest);
        affectationService.assignTeacherToCours(teacher.getId(), cours2, assignRequest);
        affectationService.assignTeacherToCours(teacher.getId(), cours3, assignRequest);

        // Mock first course successfully
        CoursResponseDto mockCours1 = CoursResponseDto.builder()
                .id(cours1)
                .code("MATH101")
                .libelle("Mathematiques")
                .typeCours("CM")
                .volumeHoraire(40)
                .ecoleId(ecole1)
                .build();

        // Second course fails
        when(bookingServiceClient.getCoursById(cours2))
                .thenThrow(new RuntimeException("Service temporarily unavailable"));

        // Third course succeeds
        CoursResponseDto mockCours3 = CoursResponseDto.builder()
                .id(cours3)
                .code("MATH102")
                .libelle("Mathematiques TP")
                .typeCours("TP")
                .volumeHoraire(30)
                .ecoleId(ecole1)
                .build();

        when(bookingServiceClient.getCoursById(cours1)).thenReturn(mockCours1);
        when(bookingServiceClient.getCoursById(cours3)).thenReturn(mockCours3);

        // When: Calculate charge horaire (should skip failed course)
        ChargeHoraireResponse response = chargeHoraireService.calculateChargeHoraire(teacher.getId());

        // Then: Should return only successful courses (first and third)
        assertThat(response).isNotNull();
        assertThat(response.getEnseignantId()).isEqualTo(teacher.getId());
        assertThat(response.getTotalHeures()).isEqualTo(70); // 40 + 30 (skips failed course)
        assertThat(response.getNombreCours()).isEqualTo(3); // All 3 assignments exist
        assertThat(response.getHeuresParType())
                .containsEntry("CM", 40)
                .containsEntry("TP", 30);
    }
}
