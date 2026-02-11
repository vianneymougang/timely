package com.timely.agoraservice.service;

import com.timely.agoraservice.client.BookingServiceClient;
import com.timely.agoraservice.dto.agora.AgoraEtudiantDto;
import com.timely.agoraservice.dto.booking.CreateEtudiantRequest;
import com.timely.agoraservice.dto.booking.EtudiantResponse;
import com.timely.agoraservice.dto.request.ImportEtudiantsRequest;
import com.timely.agoraservice.dto.response.ImportEtudiantsResponse;
import com.timely.agoraservice.repository.LogIntegrationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AgoraImportService validating F4.2 requirements.
 * Tests Agora to Timely student import functionality with mode handling using AAA pattern and AssertJ assertions.
 *
 * Feature F4.2: Import Etudiants
 * - Import students from external Agora platform
 * - Handle duplicate students with SKIP/UPDATE modes
 * - Filter by classe if provided
 * - Report statistics and errors
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AgoraImportService Unit Tests")
class AgoraImportServiceTest {

    @Mock
    private BookingServiceClient bookingServiceClient;

    @Mock
    private LogIntegrationRepository logIntegrationRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private AgoraImportService agoraImportService;

    private UUID testEcoleId;
    private UUID testClasseId;
    private String testAnneeAcademique;
    private ImportEtudiantsRequest testRequest;
    private AgoraEtudiantDto testStudent;
    private EtudiantResponse testEtudiantResponse;

    @BeforeEach
    void setUp() {
        testEcoleId = UUID.randomUUID();
        testClasseId = UUID.randomUUID();
        testAnneeAcademique = "2025-2026";

        testRequest = new ImportEtudiantsRequest();
        testRequest.setEcoleId(testEcoleId);
        testRequest.setClasseId(testClasseId);
        testRequest.setAnneeAcademique(testAnneeAcademique);
        testRequest.setModeDoublons("UPDATE");

        testStudent = AgoraEtudiantDto.builder()
                .agoraId("AGR-001")
                .matricule("ETU00001")
                .nom("Dupont")
                .prenom("Jean")
                .email("jean.dupont@iusjc.cm")
                .agoraClasseId("CLS-001")
                .nomClasse("Licence 3 Informatique")
                .anneeAcademique(testAnneeAcademique)
                .telephone("+237600000001")
                .dateNaissance("2000-01-01")
                .genre("M")
                .build();

        testEtudiantResponse = new EtudiantResponse();
        testEtudiantResponse.setId(UUID.randomUUID());
        testEtudiantResponse.setMatricule("ETU00001");
        testEtudiantResponse.setNom("Dupont");
        testEtudiantResponse.setPrenom("Jean");
    }

    // ===== TEST 1: Import New Students - Creates in Booking =====

    @Test
    @DisplayName("importEtudiants_newStudents_createsInBooking")
    void testImportEtudiantsNewStudentsCreatesInBooking() {
        // Arrange
        List<AgoraEtudiantDto> agoraStudents = Arrays.asList(
                testStudent,
                createAgoraStudent("ETU00002", "Durand", "Marie"),
                createAgoraStudent("ETU00003", "Martin", "Pierre")
        );

        // Mock that students don't exist
        when(bookingServiceClient.existsByMatricule(anyString())).thenReturn(false);

        // Mock successful creation
        EtudiantResponse response = createEtudiantResponse("ETU00001", "Dupont", "Jean");
        when(bookingServiceClient.createEtudiant(any(CreateEtudiantRequest.class)))
                .thenReturn(response);

        // Act
        ImportEtudiantsResponse result = agoraImportService.importEtudiants(testRequest);

        // Assert
        assertThat(result)
                .isNotNull()
                .extracting(ImportEtudiantsResponse::getStatut,
                           ImportEtudiantsResponse::getEtudiantsCrees,
                           ImportEtudiantsResponse::getEchecs)
                .containsExactly("SUCCESS", 3, 0);

        assertThat(result)
                .extracting(ImportEtudiantsResponse::getTotalRecuperes,
                           ImportEtudiantsResponse::getEtudiantsMisAJour,
                           ImportEtudiantsResponse::getEtudiantsIgnores)
                .containsExactly(3, 0, 0);

        assertThat(result.getErreurs()).isEmpty();
        assertThat(result.getDureeMs()).isGreaterThanOrEqualTo(0);

        verify(bookingServiceClient, times(3)).createEtudiant(any(CreateEtudiantRequest.class));
        verify(bookingServiceClient, never()).updateEtudiant(any(), any());
    }

    // ===== TEST 2: Existing Student - Mode SKIP Ignores =====

    @Test
    @DisplayName("importEtudiants_existingStudent_modeSkip_ignores")
    void testImportEtudiantsExistingStudentModeSkipIgnores() {
        // Arrange
        testRequest.setModeDoublons("SKIP");

        List<AgoraEtudiantDto> agoraStudents = Arrays.asList(
                testStudent,
                createAgoraStudent("ETU00002", "Durand", "Marie")
        );

        // First student exists, second doesn't
        when(bookingServiceClient.existsByMatricule("ETU00001")).thenReturn(true);
        when(bookingServiceClient.existsByMatricule("ETU00002")).thenReturn(false);

        EtudiantResponse newResponse = createEtudiantResponse("ETU00002", "Durand", "Marie");
        when(bookingServiceClient.createEtudiant(any(CreateEtudiantRequest.class)))
                .thenReturn(newResponse);

        // Act
        ImportEtudiantsResponse result = agoraImportService.importEtudiants(testRequest);

        // Assert
        assertThat(result)
                .isNotNull()
                .extracting(ImportEtudiantsResponse::getStatut,
                           ImportEtudiantsResponse::getEtudiantsCrees,
                           ImportEtudiantsResponse::getEtudiantsIgnores,
                           ImportEtudiantsResponse::getEchecs)
                .containsExactly("SUCCESS", 1, 1, 0);

        assertThat(result)
                .extracting(ImportEtudiantsResponse::getTotalRecuperes,
                           ImportEtudiantsResponse::getEtudiantsMisAJour)
                .containsExactly(2, 0);

        // Only new student should be created
        verify(bookingServiceClient, times(1)).createEtudiant(any(CreateEtudiantRequest.class));
        verify(bookingServiceClient, never()).updateEtudiant(any(), any());
    }

    // ===== TEST 3: Existing Student - Mode UPDATE Updates =====

    @Test
    @DisplayName("importEtudiants_existingStudent_modeUpdate_updates")
    void testImportEtudiantsExistingStudentModeUpdateUpdates() {
        // Arrange
        testRequest.setModeDoublons("UPDATE");

        List<AgoraEtudiantDto> agoraStudents = Arrays.asList(
                testStudent,
                createAgoraStudent("ETU00002", "Durand", "Marie")
        );

        // First student exists, second is new
        when(bookingServiceClient.existsByMatricule("ETU00001")).thenReturn(true);
        when(bookingServiceClient.existsByMatricule("ETU00002")).thenReturn(false);

        // Mock get existing student
        when(bookingServiceClient.getEtudiantByMatricule("ETU00001"))
                .thenReturn(testEtudiantResponse);

        // Mock update
        when(bookingServiceClient.updateEtudiant(eq(testEtudiantResponse.getId()), any(CreateEtudiantRequest.class)))
                .thenReturn(testEtudiantResponse);

        // Mock create
        EtudiantResponse newResponse = createEtudiantResponse("ETU00002", "Durand", "Marie");
        when(bookingServiceClient.createEtudiant(any(CreateEtudiantRequest.class)))
                .thenReturn(newResponse);

        // Act
        ImportEtudiantsResponse result = agoraImportService.importEtudiants(testRequest);

        // Assert
        assertThat(result)
                .isNotNull()
                .extracting(ImportEtudiantsResponse::getStatut,
                           ImportEtudiantsResponse::getEtudiantsCrees,
                           ImportEtudiantsResponse::getEtudiantsMisAJour,
                           ImportEtudiantsResponse::getEchecs)
                .containsExactly("SUCCESS", 1, 1, 0);

        assertThat(result)
                .extracting(ImportEtudiantsResponse::getTotalRecuperes,
                           ImportEtudiantsResponse::getEtudiantsIgnores)
                .containsExactly(2, 0);

        verify(bookingServiceClient, times(1)).createEtudiant(any(CreateEtudiantRequest.class));
        verify(bookingServiceClient, times(1)).updateEtudiant(any(UUID.class), any(CreateEtudiantRequest.class));
    }

    // ===== TEST 4: Partial Failure - Continues and Reports =====

    @Test
    @DisplayName("importEtudiants_partialFailure_continuesAndReports")
    void testImportEtudiantsPartialFailureContinuesAndReports() {
        // Arrange
        List<AgoraEtudiantDto> agoraStudents = Arrays.asList(
                testStudent,
                createAgoraStudent("ETU00002", "Durand", "Marie"),
                createAgoraStudent("ETU00003", "Martin", "Pierre")
        );

        // All students don't exist
        when(bookingServiceClient.existsByMatricule(anyString())).thenReturn(false);

        // First student creation succeeds, second fails, third succeeds
        EtudiantResponse response1 = createEtudiantResponse("ETU00001", "Dupont", "Jean");
        EtudiantResponse response3 = createEtudiantResponse("ETU00003", "Martin", "Pierre");

        when(bookingServiceClient.createEtudiant(any(CreateEtudiantRequest.class)))
                .thenReturn(response1)
                .thenThrow(new RuntimeException("Service unavailable"))
                .thenReturn(response3);

        // Act
        ImportEtudiantsResponse result = agoraImportService.importEtudiants(testRequest);

        // Assert
        assertThat(result)
                .isNotNull()
                .extracting(ImportEtudiantsResponse::getStatut,
                           ImportEtudiantsResponse::getEtudiantsCrees,
                           ImportEtudiantsResponse::getEchecs)
                .containsExactly("PARTIAL_SUCCESS", 2, 1);

        assertThat(result)
                .extracting(ImportEtudiantsResponse::getTotalRecuperes,
                           ImportEtudiantsResponse::getEtudiantsMisAJour,
                           ImportEtudiantsResponse::getEtudiantsIgnores)
                .containsExactly(3, 0, 0);

        assertThat(result.getErreurs())
                .isNotEmpty()
                .hasSize(1)
                .allMatch(msg -> msg.contains("ETU00002") && msg.contains("Service unavailable"));

        verify(bookingServiceClient, times(3)).createEtudiant(any(CreateEtudiantRequest.class));
    }

    // ===== TEST 5: Returns Correct Statistics =====

    @Test
    @DisplayName("importEtudiants_returnsCorrectStatistics")
    void testImportEtudiantsReturnsCorrectStatistics() {
        // Arrange
        List<AgoraEtudiantDto> agoraStudents = Arrays.asList(
                testStudent,  // exists, will be updated
                createAgoraStudent("ETU00002", "Durand", "Marie"),  // new, will be created
                createAgoraStudent("ETU00003", "Martin", "Pierre"),  // new, will be created
                createAgoraStudent("ETU00004", "Dubois", "Anne")  // new, will fail
        );

        // First student exists, others are new
        when(bookingServiceClient.existsByMatricule("ETU00001")).thenReturn(true);
        when(bookingServiceClient.existsByMatricule(matches("ETU0000[234]"))).thenReturn(false);

        // Mock get existing student
        when(bookingServiceClient.getEtudiantByMatricule("ETU00001"))
                .thenReturn(testEtudiantResponse);

        // Mock update
        when(bookingServiceClient.updateEtudiant(any(UUID.class), any(CreateEtudiantRequest.class)))
                .thenReturn(testEtudiantResponse);

        // Mock creates - 3rd succeeds, 4th fails
        EtudiantResponse response2 = createEtudiantResponse("ETU00002", "Durand", "Marie");
        EtudiantResponse response3 = createEtudiantResponse("ETU00003", "Martin", "Pierre");

        when(bookingServiceClient.createEtudiant(any(CreateEtudiantRequest.class)))
                .thenReturn(response2)
                .thenReturn(response3)
                .thenThrow(new RuntimeException("Database error"));

        // Act
        ImportEtudiantsResponse result = agoraImportService.importEtudiants(testRequest);

        // Assert
        assertThat(result)
                .isNotNull()
                .extracting(ImportEtudiantsResponse::getTotalRecuperes,
                           ImportEtudiantsResponse::getEtudiantsCrees,
                           ImportEtudiantsResponse::getEtudiantsMisAJour,
                           ImportEtudiantsResponse::getEtudiantsIgnores,
                           ImportEtudiantsResponse::getEchecs)
                .containsExactly(4, 2, 1, 0, 1);

        assertThat(result.getStatut()).isEqualTo("PARTIAL_SUCCESS");

        // Verify success rate calculation
        assertThat(result.getTauxSucces())
                .isEqualTo(75.0);  // (2 + 1) / 4 * 100

        assertThat(result.getDureeMs())
                .isGreaterThanOrEqualTo(0);

        assertThat(result.getDateImport())
                .isNotNull()
                .isBeforeOrEqualTo(LocalDateTime.now());
    }

    // ===== TEST 6: With Classe Filter - Filters Students =====

    @Test
    @DisplayName("importEtudiants_withClasseFilter_filtersStudents")
    void testImportEtudiantsWithClasseFilterFiltersStudents() {
        // Arrange
        UUID filteredClasseId = UUID.randomUUID();
        testRequest.setClasseId(filteredClasseId);

        List<AgoraEtudiantDto> agoraStudents = Arrays.asList(
                testStudent,
                createAgoraStudent("ETU00002", "Durand", "Marie")
        );

        // All students don't exist
        when(bookingServiceClient.existsByMatricule(anyString())).thenReturn(false);

        // Mock successful creations
        when(bookingServiceClient.createEtudiant(any(CreateEtudiantRequest.class)))
                .thenReturn(createEtudiantResponse("ETU00001", "Dupont", "Jean"))
                .thenReturn(createEtudiantResponse("ETU00002", "Durand", "Marie"));

        // Act
        ImportEtudiantsResponse result = agoraImportService.importEtudiants(testRequest);

        // Assert
        assertThat(result)
                .isNotNull()
                .extracting(ImportEtudiantsResponse::getStatut,
                           ImportEtudiantsResponse::getEtudiantsCrees)
                .containsExactly("SUCCESS", 2);

        // Verify that createEtudiant was called with the filtered classe ID
        ArgumentCaptor<CreateEtudiantRequest> captor = ArgumentCaptor.forClass(CreateEtudiantRequest.class);
        verify(bookingServiceClient, times(2)).createEtudiant(captor.capture());

        List<CreateEtudiantRequest> capturedRequests = captor.getAllValues();
        assertThat(capturedRequests)
                .allMatch(req -> req.getClasseId().equals(filteredClasseId),
                         "All requests should use filtered classe ID");
    }

    // ===== ADDITIONAL EDGE CASE TESTS =====

    @Test
    @DisplayName("importEtudiants_emptyStudentList_returnsEmptySuccess")
    void testImportEtudiantsEmptyStudentListReturnsEmptySuccess() {
        // Arrange
        when(bookingServiceClient.existsByMatricule(anyString())).thenReturn(false);

        // Act
        ImportEtudiantsResponse result = agoraImportService.importEtudiants(testRequest);

        // Assert
        assertThat(result)
                .isNotNull()
                .extracting(ImportEtudiantsResponse::getStatut,
                           ImportEtudiantsResponse::getTotalRecuperes,
                           ImportEtudiantsResponse::getEtudiantsCrees,
                           ImportEtudiantsResponse::getEtudiantsMisAJour,
                           ImportEtudiantsResponse::getEtudiantsIgnores,
                           ImportEtudiantsResponse::getEchecs)
                .containsExactly("SUCCESS", 0, 0, 0, 0, 0);

        assertThat(result.getErreurs()).isEmpty();
    }

    @Test
    @DisplayName("importEtudiants_invalidDateFormat_skipStudentAndContinue")
    void testImportEtudiantsInvalidDateFormatSkipStudentAndContinue() {
        // Arrange
        AgoraEtudiantDto invalidDateStudent = AgoraEtudiantDto.builder()
                .agoraId("AGR-001")
                .matricule("ETU00001")
                .nom("Test")
                .prenom("User")
                .email("test@iusjc.cm")
                .agoraClasseId("CLS-001")
                .nomClasse("Licence 3")
                .anneeAcademique(testAnneeAcademique)
                .dateNaissance("invalid-date")  // Invalid date format
                .genre("M")
                .build();

        AgoraEtudiantDto validStudent = createAgoraStudent("ETU00002", "Durand", "Marie");

        List<AgoraEtudiantDto> agoraStudents = Arrays.asList(invalidDateStudent, validStudent);

        when(bookingServiceClient.existsByMatricule(anyString())).thenReturn(false);
        when(bookingServiceClient.createEtudiant(any(CreateEtudiantRequest.class)))
                .thenReturn(createEtudiantResponse("ETU00001", "Test", "User"))
                .thenReturn(createEtudiantResponse("ETU00002", "Durand", "Marie"));

        // Act
        ImportEtudiantsResponse result = agoraImportService.importEtudiants(testRequest);

        // Assert - Both should be created despite invalid date (date just won't be set)
        assertThat(result)
                .isNotNull()
                .extracting(ImportEtudiantsResponse::getEtudiantsCrees,
                           ImportEtudiantsResponse::getEchecs)
                .containsExactly(2, 0);

        // Verify creation was called twice
        verify(bookingServiceClient, times(2)).createEtudiant(any(CreateEtudiantRequest.class));
    }

    @Test
    @DisplayName("importEtudiants_allFail_returnsFailedStatus")
    void testImportEtudiantsAllFailReturnsFailedStatus() {
        // Arrange
        List<AgoraEtudiantDto> agoraStudents = Arrays.asList(
                testStudent,
                createAgoraStudent("ETU00002", "Durand", "Marie")
        );

        when(bookingServiceClient.existsByMatricule(anyString())).thenReturn(false);
        when(bookingServiceClient.createEtudiant(any(CreateEtudiantRequest.class)))
                .thenThrow(new RuntimeException("Service error"));

        // Act
        ImportEtudiantsResponse result = agoraImportService.importEtudiants(testRequest);

        // Assert
        assertThat(result)
                .isNotNull()
                .extracting(ImportEtudiantsResponse::getStatut,
                           ImportEtudiantsResponse::getEchecs,
                           ImportEtudiantsResponse::getEtudiantsCrees)
                .containsExactly("FAILED", 2, 0);

        assertThat(result.getErreurs())
                .isNotEmpty()
                .hasSize(2);
    }

    @Test
    @DisplayName("importEtudiants_existingStudentNotFoundOnUpdate_ignores")
    void testImportEtudiantsExistingStudentNotFoundOnUpdateIgnores() {
        // Arrange
        testRequest.setModeDoublons("UPDATE");

        List<AgoraEtudiantDto> agoraStudents = Arrays.asList(testStudent);

        when(bookingServiceClient.existsByMatricule("ETU00001")).thenReturn(true);
        // getEtudiantByMatricule throws exception (student not found)
        when(bookingServiceClient.getEtudiantByMatricule("ETU00001"))
                .thenThrow(new RuntimeException("Etudiant not found"));

        // Act
        ImportEtudiantsResponse result = agoraImportService.importEtudiants(testRequest);

        // Assert
        assertThat(result)
                .isNotNull()
                .extracting(ImportEtudiantsResponse::getEchecs)
                .isEqualTo(1);

        assertThat(result.getErreurs())
                .isNotEmpty()
                .anyMatch(msg -> msg.contains("ETU00001"));
    }

    // ===== HELPER METHODS =====

    private AgoraEtudiantDto createAgoraStudent(String matricule, String nom, String prenom) {
        return AgoraEtudiantDto.builder()
                .agoraId("AGR-" + matricule)
                .matricule(matricule)
                .nom(nom)
                .prenom(prenom)
                .email(matricule.toLowerCase() + "@iusjc.cm")
                .agoraClasseId("CLS-001")
                .nomClasse("Licence 3 Informatique")
                .anneeAcademique(testAnneeAcademique)
                .telephone("+237600000001")
                .dateNaissance("2000-01-01")
                .genre("M")
                .build();
    }

    private EtudiantResponse createEtudiantResponse(String matricule, String nom, String prenom) {
        EtudiantResponse response = new EtudiantResponse();
        response.setId(UUID.randomUUID());
        response.setMatricule(matricule);
        response.setNom(nom);
        response.setPrenom(prenom);
        response.setEmail(matricule.toLowerCase() + "@iusjc.cm");
        response.setClasseId(testClasseId);
        response.setCreatedAt(LocalDateTime.now());
        response.setUpdatedAt(LocalDateTime.now());
        return response;
    }
}
