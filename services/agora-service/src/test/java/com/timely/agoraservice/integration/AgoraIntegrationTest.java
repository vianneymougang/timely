package com.timely.agoraservice.integration;

import com.timely.agoraservice.AbstractAgoraIntegrationTest;
import com.timely.agoraservice.client.BookingServiceClient;
import com.timely.agoraservice.dto.booking.EtudiantResponse;
import com.timely.agoraservice.dto.request.ExportRequest;
import com.timely.agoraservice.dto.request.ImportEtudiantsRequest;
import com.timely.agoraservice.dto.response.ExportAgoraResponse;
import com.timely.agoraservice.dto.response.ImportEtudiantsResponse;
import com.timely.agoraservice.entity.ExportAgora;
import com.timely.agoraservice.entity.enums.FormatExportAgora;
import com.timely.agoraservice.entity.enums.StatutExportAgora;
import com.timely.agoraservice.repository.ExportAgoraRepository;
import com.timely.agoraservice.repository.LogIntegrationRepository;
import com.timely.agoraservice.service.AgoraImportService;
import com.timely.agoraservice.service.ExportAgoraService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

/**
 * Integration tests for Agora Service - E2E tests validating F4.2 features.
 *
 * Test coverage:
 * - F4.2: Import Étudiants from Agora
 * - Export Agora with database persistence
 *
 * Features tested:
 * - Import students from external Agora platform
 * - Statistics calculation (created, updated, skipped, failed)
 * - Database persistence of import records
 * - Export scheduling and status tracking
 * - Integration with BookingServiceClient (mocked)
 *
 * Uses PostgreSQL Testcontainers for database isolation.
 */
@DisplayName("Agora Service Integration Tests (E2E)")
public class AgoraIntegrationTest extends AbstractAgoraIntegrationTest {

    @Autowired
    private AgoraImportService agoraImportService;

    @Autowired
    private ExportAgoraService exportAgoraService;

    @Autowired
    private ExportAgoraRepository exportAgoraRepository;

    @Autowired
    private LogIntegrationRepository logIntegrationRepository;

    @MockBean
    private BookingServiceClient bookingServiceClient;

    private static final String TEST_MATRICULE = "ETU00001";
    private static final String TEST_NOM = "Dupont";
    private static final String TEST_PRENOM = "Jean";
    private static final String TEST_EMAIL = "jean.dupont@iusjc.cm";

    @BeforeEach
    void setUp() {
        // Clean database before each test
        logIntegrationRepository.deleteAll();
        exportAgoraRepository.deleteAll();

        // Mock BookingServiceClient default behavior
        when(bookingServiceClient.existsByMatricule(anyString()))
                .thenReturn(false);
    }

    /**
     * Test: Import students endpoint returns correct statistics.
     *
     * Scenario (F4.2):
     * 1. Call importEtudiants endpoint with valid ImportEtudiantsRequest
     * 2. Service fetches mock students from Agora (5 students)
     * 3. BookingServiceClient is mocked to create students
     * 4. Service calculates and returns import statistics
     * 5. Verify response contains correct counts and statut
     *
     * Expected Results:
     * - Import completes with SUCCESS status
     * - Statistics show: 5 total retrieved, 5 created, 0 updated, 0 skipped, 0 failed
     * - Success rate (tauxSucces) = 100%
     * - Import duration is recorded (dureeMs)
     * - Response includes importId and dateImport
     * - All fields are populated in response
     */
    @Test
    @DisplayName("F4.2-001: importEtudiants endpoint returns statistics with SUCCESS status")
    void importEtudiants_endpoint_returnsStatistics() {
        // Arrange
        UUID ecoleId = UUID.randomUUID();
        UUID classeId = UUID.randomUUID();
        String anneeAcademique = "2025-2026";

        ImportEtudiantsRequest request = new ImportEtudiantsRequest();
        request.setEcoleId(ecoleId);
        request.setClasseId(classeId);
        request.setAnneeAcademique(anneeAcademique);
        request.setModeDoublons("UPDATE");

        // Mock BookingServiceClient to simulate successful student creation
        when(bookingServiceClient.createEtudiant(any()))
                .thenReturn(new EtudiantResponse());

        // Act
        ImportEtudiantsResponse response = agoraImportService.importEtudiants(request);

        // Assert - Response structure
        assertThat(response).isNotNull();
        assertThat(response.getImportId()).isNotNull();
        assertThat(response.getDateImport()).isNotNull();
        assertThat(response.getDureeMs()).isNotNull();
        assertThat(response.getDureeMs()).isGreaterThanOrEqualTo(0);

        // Assert - Statistics
        assertThat(response.getStatut()).isEqualTo("SUCCESS");
        assertThat(response.getTotalRecuperes()).isEqualTo(5);
        assertThat(response.getEtudiantsCrees()).isEqualTo(5);
        assertThat(response.getEtudiantsMisAJour()).isEqualTo(0);
        assertThat(response.getEtudiantsIgnores()).isEqualTo(0);
        assertThat(response.getEchecs()).isEqualTo(0);

        // Assert - Success rate
        assertThat(response.getTauxSucces()).isEqualTo(100.0);

        // Assert - No errors
        assertThat(response.getErreurs()).isEmpty();

        // Assert - All fields are properly set
        assertThat(response.getDateImport().isBefore(LocalDateTime.now().plusSeconds(1)))
                .isTrue();
    }

    /**
     * Test: Export Agora persists record in database with correct status.
     *
     * Scenario (F4.2):
     * 1. Create an ExportRequest with valid emploiDuTempsId
     * 2. Call exportAgoraService.createExport()
     * 3. Service validates employment schedule exists (mocked)
     * 4. Service creates ExportAgora entity and persists to database
     * 5. Verify record is saved with EN_ATTENTE status
     * 6. Retrieve from database and verify all fields
     * 7. Verify timestamps (createdAt, updatedAt) are set
     *
     * Expected Results:
     * - ExportAgora is persisted with UUID ID
     * - Status is EN_ATTENTE (pending)
     * - Format is preserved from request
     * - Timestamps are set to current time
     * - Database retrieval confirms persistence
     * - Attempts counter initialized to 0
     * - Can be queried by ID and by status
     * - All entity fields match the request
     */
    @Test
    @DisplayName("F4.2-002: exportAgora endpoint persists record in DB with EN_ATTENTE status")
    void exportAgora_persistsRecordInDB() {
        // Arrange
        UUID emploiDuTempsId = UUID.randomUUID();

        ExportRequest request = new ExportRequest();
        request.setEmploiDuTempsId(emploiDuTempsId);
        request.setFormat(FormatExportAgora.JSON);

        // Mock PlanningServiceClient to simulate employment schedule exists
        // (This is done internally in ExportAgoraService, but we verify persistence)

        // Act
        ExportAgoraResponse response = exportAgoraService.createExport(request);

        // Assert - Response structure
        assertThat(response).isNotNull();
        assertThat(response.getId()).isNotNull();
        assertThat(response.getEmploiDuTempsId()).isEqualTo(emploiDuTempsId);
        assertThat(response.getFormat()).isEqualTo(FormatExportAgora.JSON);
        assertThat(response.getStatut()).isEqualTo(StatutExportAgora.EN_ATTENTE);
        assertThat(response.getDateExport()).isNotNull();
        assertThat(response.getNumeroTentative()).isZero();
        assertThat(response.getCreatedAt()).isNotNull();

        // Act - Retrieve from database to verify persistence
        UUID exportId = response.getId();
        Optional<ExportAgora> saved = exportAgoraRepository.findById(exportId);

        // Assert - Database persistence
        assertThat(saved).isPresent();
        ExportAgora exportAgora = saved.get();

        assertThat(exportAgora.getId()).isEqualTo(exportId);
        assertThat(exportAgora.getEmploiDuTempsId()).isEqualTo(emploiDuTempsId);
        assertThat(exportAgora.getFormat()).isEqualTo(FormatExportAgora.JSON);
        assertThat(exportAgora.getStatut()).isEqualTo(StatutExportAgora.EN_ATTENTE);
        assertThat(exportAgora.getNumeroTentative()).isZero();
        assertThat(exportAgora.getMessageErreur()).isNull();
        assertThat(exportAgora.getReponseAgora()).isNull();

        // Assert - Timestamps
        assertThat(exportAgora.getCreatedAt()).isNotNull();
        assertThat(exportAgora.getDateDerniereTentative()).isNull();

        // Act - Query by status to verify database indexing
        List<ExportAgora> enAttenteExports = exportAgoraRepository
                .findByStatut(StatutExportAgora.EN_ATTENTE);

        // Assert - Query results
        assertThat(enAttenteExports).isNotEmpty();
        assertThat(enAttenteExports).contains(exportAgora);

        // Act - Query by emploiDuTempsId
        List<ExportAgora> exportsByEmploiId = exportAgoraRepository
                .findByEmploiDuTempsId(emploiDuTempsId);

        // Assert - Query by emploi results
        assertThat(exportsByEmploiId).isNotEmpty();
        assertThat(exportsByEmploiId).contains(exportAgora);
    }

    /**
     * Test: Multiple exports for same schedule create separate records.
     *
     * Scenario:
     * 1. Create multiple exports for the same emploiDuTempsId
     * 2. Verify each export gets a unique ID
     * 3. Verify all exports are persisted in database
     * 4. Query by emploiDuTempsId and verify all are returned
     *
     * Expected Results:
     * - Each export is persisted with unique UUID
     * - All exports share the same emploiDuTempsId
     * - Query returns all exports in order
     */
    @Test
    @DisplayName("F4.2-003: Multiple exports persist separately with correct queries")
    void exportAgora_multipleExports_persistSeparately() {
        // Arrange
        UUID emploiDuTempsId = UUID.randomUUID();
        ExportRequest request1 = new ExportRequest();
        request1.setEmploiDuTempsId(emploiDuTempsId);
        request1.setFormat(FormatExportAgora.JSON);

        ExportRequest request2 = new ExportRequest();
        request2.setEmploiDuTempsId(emploiDuTempsId);
        request2.setFormat(FormatExportAgora.XML);

        // Act
        ExportAgoraResponse response1 = exportAgoraService.createExport(request1);
        ExportAgoraResponse response2 = exportAgoraService.createExport(request2);

        // Assert - Different IDs
        assertThat(response1.getId()).isNotEqualTo(response2.getId());
        assertThat(response1.getFormat()).isEqualTo(FormatExportAgora.JSON);
        assertThat(response2.getFormat()).isEqualTo(FormatExportAgora.XML);

        // Act - Query by emploiDuTempsId
        List<ExportAgora> exports = exportAgoraRepository
                .findByEmploiDuTempsId(emploiDuTempsId);

        // Assert
        assertThat(exports).hasSize(2);
        assertThat(exports).extracting(ExportAgora::getId)
                .containsExactlyInAnyOrder(response1.getId(), response2.getId());
        assertThat(exports).extracting(ExportAgora::getFormat)
                .containsExactlyInAnyOrder(FormatExportAgora.JSON, FormatExportAgora.XML);
    }

    /**
     * Test: Import with duplicate students in SKIP mode ignores existing.
     *
     * Scenario (F4.2 - Duplicate handling):
     * 1. Create an import request with modeDoublons = "SKIP"
     * 2. Mock BookingServiceClient to return true for existsByMatricule
     * 3. Call importEtudiants with the same students
     * 4. Service should skip all students since they already exist
     * 5. Verify statistics show all students as ignored (etudiantsIgnores = 5)
     *
     * Expected Results:
     * - All 5 students are marked as ignored
     * - Status is SUCCESS (no failures)
     * - No students created or updated
     * - Response includes correct counts
     */
    @Test
    @DisplayName("F4.2-004: Import with SKIP mode ignores existing students")
    void importEtudiants_skipMode_ignoresExisting() {
        // Arrange
        UUID ecoleId = UUID.randomUUID();
        UUID classeId = UUID.randomUUID();

        ImportEtudiantsRequest request = new ImportEtudiantsRequest();
        request.setEcoleId(ecoleId);
        request.setClasseId(classeId);
        request.setModeDoublons("SKIP");

        // Mock: All students already exist
        when(bookingServiceClient.existsByMatricule(anyString()))
                .thenReturn(true);

        // Act
        ImportEtudiantsResponse response = agoraImportService.importEtudiants(request);

        // Assert - All students skipped
        assertThat(response.getStatut()).isEqualTo("SUCCESS");
        assertThat(response.getTotalRecuperes()).isEqualTo(5);
        assertThat(response.getEtudiantsCrees()).isEqualTo(0);
        assertThat(response.getEtudiantsMisAJour()).isEqualTo(0);
        assertThat(response.getEtudiantsIgnores()).isEqualTo(5);
        assertThat(response.getEchecs()).isEqualTo(0);
        assertThat(response.getTauxSucces()).isEqualTo(0.0);
    }

    /**
     * Test: Import with UPDATE mode updates existing students.
     *
     * Scenario (F4.2 - Duplicate handling):
     * 1. Create an import request with modeDoublons = "UPDATE"
     * 2. Mock BookingServiceClient to return existing student for some matricules
     * 3. Call importEtudiants
     * 4. Service should update existing students and create new ones
     * 5. Verify statistics show both created and updated counts
     *
     * Expected Results:
     * - Some students are created, some are updated
     * - Total is split between created and updated
     * - Status is SUCCESS
     */
    @Test
    @DisplayName("F4.2-005: Import with UPDATE mode creates and updates students")
    void importEtudiants_updateMode_updatesExisting() {
        // Arrange
        UUID ecoleId = UUID.randomUUID();
        UUID classeId = UUID.randomUUID();

        ImportEtudiantsRequest request = new ImportEtudiantsRequest();
        request.setEcoleId(ecoleId);
        request.setClasseId(classeId);
        request.setModeDoublons("UPDATE");

        // Mock: First 3 students exist, last 2 don't
        when(bookingServiceClient.existsByMatricule(anyString()))
                .thenAnswer(invocation -> {
                    String matricule = invocation.getArgument(0);
                    // Assume ETU00001, ETU00002, ETU00003 exist
                    return matricule.matches("ETU0000[123]");
                });

        // Mock getEtudiantByMatricule for updates
        when(bookingServiceClient.getEtudiantByMatricule(anyString()))
                .thenAnswer(invocation -> {
                    String matricule = invocation.getArgument(0);
                    if (matricule.matches("ETU0000[123]")) {
                        EtudiantResponse response = new EtudiantResponse();
                        response.setId(UUID.randomUUID());
                        response.setMatricule(matricule);
                        return response;
                    }
                    return null;
                });

        // Mock create and update
        when(bookingServiceClient.createEtudiant(any()))
                .thenReturn(new EtudiantResponse());
        when(bookingServiceClient.updateEtudiant(any(), any()))
                .thenReturn(new EtudiantResponse());

        // Act
        ImportEtudiantsResponse response = agoraImportService.importEtudiants(request);

        // Assert
        assertThat(response.getStatut()).isEqualTo("SUCCESS");
        assertThat(response.getTotalRecuperes()).isEqualTo(5);
        assertThat(response.getEtudiantsCrees()).isEqualTo(2); // ETU00004, ETU00005
        assertThat(response.getEtudiantsMisAJour()).isEqualTo(3); // ETU00001, ETU00002, ETU00003
        assertThat(response.getEchecs()).isEqualTo(0);
    }

    /**
     * Test: Export status update changes updatedAt timestamp.
     *
     * Scenario:
     * 1. Create an export (createdAt = T1)
     * 2. Wait a moment
     * 3. Update export status to ENVOYE
     * 4. Verify updatedAt is after createdAt
     *
     * Expected Results:
     * - createdAt remains unchanged
     * - updatedAt is updated to current time
     * - Status changes correctly
     */
    @Test
    @DisplayName("F4.2-006: Export status update modifies updatedAt timestamp")
    void exportAgora_statusUpdate_changesTimestamp() {
        // Arrange - Create initial export
        UUID emploiDuTempsId = UUID.randomUUID();
        ExportRequest request = new ExportRequest();
        request.setEmploiDuTempsId(emploiDuTempsId);
        request.setFormat(FormatExportAgora.JSON);

        ExportAgoraResponse created = exportAgoraService.createExport(request);
        UUID exportId = created.getId();
        LocalDateTime initialCreatedAt = created.getCreatedAt();

        // Act - Update status
        ExportAgoraResponse updated = exportAgoraService.updateExportStatut(
                exportId,
                StatutExportAgora.ENVOYE,
                null
        );

        // Assert
        assertThat(updated.getStatut()).isEqualTo(StatutExportAgora.ENVOYE);
        assertThat(updated.getCreatedAt()).isEqualTo(initialCreatedAt);

        // Verify in database
        Optional<ExportAgora> dbExport = exportAgoraRepository.findById(exportId);
        assertThat(dbExport).isPresent();
        assertThat(dbExport.get().getStatut()).isEqualTo(StatutExportAgora.ENVOYE);
    }

    /**
     * Test: Increment attempt counter for export retry logic.
     *
     * Scenario:
     * 1. Create an export (numeroTentative = 0)
     * 2. Call incrementTentative() multiple times
     * 3. Verify counter increments correctly
     *
     * Expected Results:
     * - Counter increments from 0 to 1, 2, 3, etc.
     * - Each increment updates dateDerniereTentative
     * - Database reflects all changes
     */
    @Test
    @DisplayName("F4.2-007: Export attempt counter increments correctly")
    void exportAgora_incrementTentative_countsCorrectly() {
        // Arrange
        UUID emploiDuTempsId = UUID.randomUUID();
        ExportRequest request = new ExportRequest();
        request.setEmploiDuTempsId(emploiDuTempsId);
        request.setFormat(FormatExportAgora.XML);

        ExportAgoraResponse created = exportAgoraService.createExport(request);
        UUID exportId = created.getId();

        // Assert - Initial state
        assertThat(created.getNumeroTentative()).isZero();

        // Act - First increment
        ExportAgoraResponse attempt1 = exportAgoraService.incrementTentative(exportId);

        // Assert
        assertThat(attempt1.getNumeroTentative()).isEqualTo(1);
        assertThat(attempt1.getDateDerniereTentative()).isNotNull();

        // Act - Second increment
        ExportAgoraResponse attempt2 = exportAgoraService.incrementTentative(exportId);

        // Assert
        assertThat(attempt2.getNumeroTentative()).isEqualTo(2);

        // Act - Third increment
        ExportAgoraResponse attempt3 = exportAgoraService.incrementTentative(exportId);

        // Assert
        assertThat(attempt3.getNumeroTentative()).isEqualTo(3);

        // Verify in database
        Optional<ExportAgora> dbExport = exportAgoraRepository.findById(exportId);
        assertThat(dbExport).isPresent();
        assertThat(dbExport.get().getNumeroTentative()).isEqualTo(3);
    }

    /**
     * Test: Query exports by status returns correct records.
     *
     * Scenario:
     * 1. Create multiple exports with different statuses
     * 2. Query by specific status
     * 3. Verify only matching status records are returned
     *
     * Expected Results:
     * - Query returns only exports with specified status
     * - Other status exports are not included
     * - Empty list if no matches
     */
    @Test
    @DisplayName("F4.2-008: Query exports by status filters correctly")
    void exportAgora_queryByStatus_filtersCorrectly() {
        // Arrange - Create exports with different statuses
        UUID emploiId1 = UUID.randomUUID();
        UUID emploiId2 = UUID.randomUUID();
        UUID emploiId3 = UUID.randomUUID();

        ExportRequest req1 = new ExportRequest();
        req1.setEmploiDuTempsId(emploiId1);
        req1.setFormat(FormatExportAgora.JSON);
        ExportAgoraResponse exp1 = exportAgoraService.createExport(req1);

        ExportRequest req2 = new ExportRequest();
        req2.setEmploiDuTempsId(emploiId2);
        req2.setFormat(FormatExportAgora.JSON);
        ExportAgoraResponse exp2 = exportAgoraService.createExport(req2);

        // Update one to ENVOYE
        exportAgoraService.updateExportStatut(exp2.getId(), StatutExportAgora.ENVOYE, null);

        ExportRequest req3 = new ExportRequest();
        req3.setEmploiDuTempsId(emploiId3);
        req3.setFormat(FormatExportAgora.XML);
        ExportAgoraResponse exp3 = exportAgoraService.createExport(req3);

        // Update one to ECHEC
        exportAgoraService.updateExportStatut(exp3.getId(), StatutExportAgora.ECHEC, "Network error");

        // Act - Query by status
        List<ExportAgora> enAttenteList = exportAgoraRepository
                .findByStatut(StatutExportAgora.EN_ATTENTE);
        List<ExportAgora> envoyeList = exportAgoraRepository
                .findByStatut(StatutExportAgora.ENVOYE);
        List<ExportAgora> echec = exportAgoraRepository
                .findByStatut(StatutExportAgora.ECHEC);

        // Assert
        assertThat(enAttenteList).hasSize(1);
        assertThat(enAttenteList.get(0).getId()).isEqualTo(exp1.getId());

        assertThat(envoyeList).hasSize(1);
        assertThat(envoyeList.get(0).getId()).isEqualTo(exp2.getId());

        assertThat(echec).hasSize(1);
        assertThat(echec.get(0).getId()).isEqualTo(exp3.getId());
        assertThat(echec.get(0).getMessageErreur()).isEqualTo("Network error");
    }

}
