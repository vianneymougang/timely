package com.timely.reportservice.integration;

import com.timely.reportservice.AbstractReportIntegrationTest;
import com.timely.reportservice.client.NotificationServiceClient;
import com.timely.reportservice.dto.request.ScheduleReportRequest;
import com.timely.reportservice.dto.response.AuditLogResponse;
import com.timely.reportservice.dto.response.ScheduledReportResponse;
import com.timely.reportservice.entity.AuditLog;
import com.timely.reportservice.entity.ScheduledReport;
import com.timely.reportservice.entity.enums.AuditAction;
import com.timely.reportservice.entity.enums.FormatExport;
import com.timely.reportservice.entity.enums.TypeRapport;
import com.timely.reportservice.mapper.AuditLogMapper;
import com.timely.reportservice.mapper.ScheduledReportMapper;
import com.timely.reportservice.repository.AuditLogRepository;
import com.timely.reportservice.repository.ScheduledReportRepository;
import com.timely.reportservice.service.AuditService;
import com.timely.reportservice.service.ReportSchedulerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

/**
 * Integration tests for Report Service - E2E tests validating F4.1/F5.3 features.
 *
 * Test coverage:
 * - F4.1: Rapport Planifié (Scheduled Reports)
 * - F5.3: Audit Trail
 *
 * Features tested:
 * - Schedule report persistence and retrieval
 * - Toggle report active status
 * - Audit log creation for CREATE operations with JSONB persistence
 * - Audit log creation for UPDATE operations with changements calculation
 * - Entity history retrieval ordered by timestamp
 * - Audit logs filtering by date range
 * - Audit logs filtering by user with pagination
 */
@DisplayName("Report Service Integration Tests (E2E)")
public class ReportIntegrationTest extends AbstractReportIntegrationTest {

    @Autowired
    private ReportSchedulerService reportSchedulerService;

    @Autowired
    private AuditService auditService;

    @Autowired
    private ScheduledReportRepository scheduledReportRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private ScheduledReportMapper scheduledReportMapper;

    @Autowired
    private AuditLogMapper auditLogMapper;

    @MockBean
    private NotificationServiceClient notificationServiceClient;

    private static final String TEST_USER = "test.user@example.com";
    private static final String ADMIN_USER = "admin@example.com";
    private static final String SERVICE_SOURCE = "report-service";
    private static final String VALID_CRON = "0 0 9 * * ?";

    @BeforeEach
    void setUp() {
        auditLogRepository.deleteAll();
        scheduledReportRepository.deleteAll();
    }

    /**
     * Test: Schedule a report and verify persistence in database.
     *
     * Scenario:
     * 1. Create a ScheduleReportRequest with valid data
     * 2. Call scheduleReport() to persist the report
     * 3. Verify the report is saved in the database with all fields
     * 4. Retrieve the report and verify all data is intact
     *
     * Expected Results:
     * - Report is persisted with UUID ID
     * - All fields (titre, cronExpression, destinatairesEmail, etc.) are preserved
     * - Report is active by default
     * - Timestamps (createdAt, updatedAt) are set
     * - Can be retrieved by ID
     */
    @Test
    @DisplayName("F4.1-001: Schedule report persists in DB and retrieves successfully")
    void scheduleReport_persistsInDB_andRetrieves() {
        // Arrange
        ScheduleReportRequest request = new ScheduleReportRequest();
        request.setTypeRapport(TypeRapport.UTILISATION_SALLES);
        request.setTitre("Weekly Room Usage Report");
        request.setDescription("Rapport hebdomadaire d'utilisation des salles");
        request.setCronExpression(VALID_CRON);
        request.setFormat(FormatExport.PDF);
        request.setDestinatairesEmail(List.of("admin@example.com", "director@example.com"));
        request.setActif(true);

        Map<String, Object> params = new HashMap<>();
        params.put("ecole_id", UUID.randomUUID());
        params.put("start_date", "2025-01-01");
        request.setParametresRapport(params);

        // Act
        ScheduledReportResponse response = reportSchedulerService.scheduleReport(request, TEST_USER);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getId()).isNotNull();
        assertThat(response.getTitre()).isEqualTo("Weekly Room Usage Report");
        assertThat(response.getTypeRapport()).isEqualTo(TypeRapport.UTILISATION_SALLES);
        assertThat(response.getCronExpression()).isEqualTo(VALID_CRON);
        assertThat(response.getFormat()).isEqualTo(FormatExport.PDF);
        assertThat(response.getUtilisateurCreateur()).isEqualTo(TEST_USER);
        assertThat(response.getActif()).isTrue();
        assertThat(response.getProchaineExecution()).isNotNull();
        assertThat(response.getNombreExecutions()).isZero();
        assertThat(response.getDestinatairesEmail())
                .containsExactlyInAnyOrder("admin@example.com", "director@example.com");

        // Verify persistence by retrieving from database
        ScheduledReport saved = scheduledReportRepository.findById(response.getId()).orElse(null);
        assertThat(saved).isNotNull();
        assertThat(saved.getTitre()).isEqualTo("Weekly Room Usage Report");
        assertThat(saved.getParametresRapport()).isEqualTo(params);
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUpdatedAt()).isNotNull();
    }

    /**
     * Test: Toggle report active status and verify update in database.
     *
     * Scenario:
     * 1. Create and schedule a report (active=true)
     * 2. Toggle the report to inactive (actif=false)
     * 3. Verify updatedAt timestamp is changed
     * 4. Toggle back to active (actif=true)
     * 5. Verify prochaineExecution is recalculated
     *
     * Expected Results:
     * - Active status changes correctly
     * - updatedAt timestamp is updated
     * - When reactivated, prochaineExecution is recalculated
     * - Database reflects all changes
     */
    @Test
    @DisplayName("F4.1-002: Toggle report updates active status and timestamps")
    void toggleReport_updatesActiveStatus() {
        // Arrange - Create initial report
        ScheduleReportRequest request = new ScheduleReportRequest();
        request.setTypeRapport(TypeRapport.CHARGE_ENSEIGNANTS);
        request.setTitre("Teacher Load Report");
        request.setCronExpression(VALID_CRON);
        request.setFormat(FormatExport.EXCEL);
        request.setDestinatairesEmail(List.of("teachers@example.com"));
        request.setActif(true);

        ScheduledReportResponse created = reportSchedulerService.scheduleReport(request, TEST_USER);
        UUID reportId = created.getId();
        LocalDateTime initialUpdatedAt = created.getUpdatedAt();
        LocalDateTime initialNextExecution = created.getProchaineExecution();

        // Act - Toggle to inactive
        ScheduledReportResponse deactivated = reportSchedulerService.toggleScheduledReport(reportId, false);

        // Assert - Deactivation
        assertThat(deactivated.getActif()).isFalse();
        assertThat(deactivated.getUpdatedAt()).isAfter(initialUpdatedAt);

        // Verify in database
        ScheduledReport dbReport = scheduledReportRepository.findById(reportId).orElse(null);
        assertThat(dbReport).isNotNull();
        assertThat(dbReport.getActif()).isFalse();

        // Act - Toggle back to active
        ScheduledReportResponse reactivated = reportSchedulerService.toggleScheduledReport(reportId, true);

        // Assert - Reactivation
        assertThat(reactivated.getActif()).isTrue();
        assertThat(reactivated.getUpdatedAt()).isAfter(deactivated.getUpdatedAt());
        assertThat(reactivated.getProchaineExecution()).isNotNull();
    }

    /**
     * Test: Audit log creation for CREATE action with JSONB persistence.
     *
     * Scenario:
     * 1. Create an entity (e.g., ScheduledReport)
     * 2. Call auditService.logCreate() with entity data
     * 3. Verify audit log is persisted with:
     *    - ACTION_TYPE = CREATE
     *    - valeur_apres populated with entity data (JSONB)
     *    - valeur_avant is NULL
     *    - changements is NULL
     * 4. Retrieve audit log and verify JSONB fields are correctly stored
     *
     * Expected Results:
     * - Audit log entity is created
     * - valeur_apres contains all entity fields as JSON
     * - JSONB data is properly serialized and stored in PostgreSQL
     * - All metadata (utilisateur, timestamp, source_service) is captured
     */
    @Test
    @DisplayName("F5.3-001: Audit log CREATE action persists with JSONB fields")
    void auditLog_create_persistsWithJsonbFields() {
        // Arrange
        ScheduledReport entity = new ScheduledReport();
        UUID entityId = UUID.randomUUID();
        entity.setId(entityId);
        entity.setTypeRapport(TypeRapport.CONFLITS);
        entity.setTitre("Conflict Detection Report");
        entity.setCronExpression(VALID_CRON);
        entity.setFormat(FormatExport.PDF);
        entity.setDestinatairesEmail("ops@example.com");
        entity.setUtilisateurCreateur(TEST_USER);
        entity.setActif(true);
        entity.setNombreExecutions(0);

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("version", 1);
        metadata.put("source", "web");

        // Act
        auditService.logCreate(entity, "ScheduledReport", entityId, TEST_USER, SERVICE_SOURCE);

        // Assert
        List<AuditLog> logs = auditLogRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(
                "ScheduledReport", entityId);

        assertThat(logs).hasSize(1);
        AuditLog log = logs.get(0);

        assertThat(log.getActionType()).isEqualTo(AuditAction.CREATE);
        assertThat(log.getEntityType()).isEqualTo("ScheduledReport");
        assertThat(log.getEntityId()).isEqualTo(entityId);
        assertThat(log.getUtilisateur()).isEqualTo(TEST_USER);
        assertThat(log.getSourceService()).isEqualTo(SERVICE_SOURCE);
        assertThat(log.getTimestamp()).isNotNull();

        // Verify JSONB fields
        assertThat(log.getValeurApres()).isNotNull();
        assertThat(log.getValeurApres()).containsKeys("typeRapport", "titre", "cronExpression", "format");
        assertThat(log.getValeurApres().get("titre")).isEqualTo("Conflict Detection Report");
        assertThat(log.getValeurApres().get("typeRapport")).isEqualTo("CONFLITS");

        // valeur_avant should be NULL for CREATE
        assertThat(log.getValeurAvant()).isNull();
        // changements should be NULL for CREATE
        assertThat(log.getChangements()).isNull();
    }

    /**
     * Test: Audit log creation for UPDATE action with changements calculation.
     *
     * Scenario:
     * 1. Create an old entity version (with initial values)
     * 2. Create a new entity version (with modified values)
     * 3. Call auditService.logUpdate() with both versions
     * 4. Verify audit log captures:
     *    - valeur_avant (old state as JSONB)
     *    - valeur_apres (new state as JSONB)
     *    - changements (Map of field changes with before/after values)
     * 5. Verify changements correctly identifies all modified fields
     *
     * Expected Results:
     * - Audit log contains both old and new states
     * - changements Map has entries for each modified field
     * - Each changement has "avant" and "apres" keys
     * - Non-modified fields are excluded from changements
     * - JSONB persistence works correctly for all three fields
     */
    @Test
    @DisplayName("F5.3-002: Audit log UPDATE action calculates and stores changements")
    void auditLog_update_calculatesAndStoresChangements() {
        // Arrange - Old entity state
        ScheduledReport oldEntity = new ScheduledReport();
        UUID entityId = UUID.randomUUID();
        oldEntity.setId(entityId);
        oldEntity.setTypeRapport(TypeRapport.REPARTITION_COURS);
        oldEntity.setTitre("Old Title");
        oldEntity.setCronExpression("0 0 9 * * ?");
        oldEntity.setFormat(FormatExport.PDF);
        oldEntity.setDestinatairesEmail("old@example.com");
        oldEntity.setUtilisateurCreateur(TEST_USER);
        oldEntity.setActif(true);
        oldEntity.setNombreExecutions(5);

        // Arrange - New entity state (modified)
        ScheduledReport newEntity = new ScheduledReport();
        newEntity.setId(entityId);
        newEntity.setTypeRapport(TypeRapport.REPARTITION_COURS); // unchanged
        newEntity.setTitre("Updated Title"); // CHANGED
        newEntity.setCronExpression("0 0 10 * * ?"); // CHANGED
        newEntity.setFormat(FormatExport.EXCEL); // CHANGED
        newEntity.setDestinatairesEmail("new@example.com"); // CHANGED
        newEntity.setUtilisateurCreateur(TEST_USER); // unchanged
        newEntity.setActif(false); // CHANGED
        newEntity.setNombreExecutions(5); // unchanged

        // Act
        auditService.logUpdate(oldEntity, newEntity, "ScheduledReport", entityId, ADMIN_USER, SERVICE_SOURCE);

        // Assert
        List<AuditLog> logs = auditLogRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(
                "ScheduledReport", entityId);

        assertThat(logs).hasSize(1);
        AuditLog log = logs.get(0);

        assertThat(log.getActionType()).isEqualTo(AuditAction.UPDATE);
        assertThat(log.getUtilisateur()).isEqualTo(ADMIN_USER);

        // Verify JSONB fields contain both states
        assertThat(log.getValeurAvant()).isNotNull();
        assertThat(log.getValeurAvant().get("titre")).isEqualTo("Old Title");
        assertThat(log.getValeurAvant().get("actif")).isEqualTo(true);

        assertThat(log.getValeurApres()).isNotNull();
        assertThat(log.getValeurApres().get("titre")).isEqualTo("Updated Title");
        assertThat(log.getValeurApres().get("actif")).isEqualTo(false);

        // Verify changements are calculated correctly
        assertThat(log.getChangements()).isNotNull();
        assertThat(log.getChangements()).hasSize(5); // 5 fields changed

        // Verify specific changements
        assertThat(log.getChangements())
                .containsKeys("titre", "cronExpression", "format", "destinatairesEmail", "actif");

        // Verify structure of changements (before/after values)
        Map<String, Object> titreChange = log.getChangements().get("titre");
        assertThat(titreChange).containsKeys("avant", "apres");
        assertThat(titreChange.get("avant")).isEqualTo("Old Title");
        assertThat(titreChange.get("apres")).isEqualTo("Updated Title");

        Map<String, Object> actifChange = log.getChangements().get("actif");
        assertThat(actifChange.get("avant")).isEqualTo(true);
        assertThat(actifChange.get("apres")).isEqualTo(false);

        // Verify unchanged fields are NOT in changements
        assertThat(log.getChangements()).doesNotContainKeys("typeRapport", "utilisateurCreateur", "nombreExecutions");
    }

    /**
     * Test: Get entity history ordered by timestamp (descending).
     *
     * Scenario:
     * 1. Create multiple audit logs for the same entity over time
     * 2. Create log with CREATE action (timestamp T1)
     * 3. Create log with UPDATE action (timestamp T2)
     * 4. Create another UPDATE action (timestamp T3)
     * 5. Call auditService.getEntityHistory() for the entity
     * 6. Verify logs are returned in descending timestamp order (T3, T2, T1)
     *
     * Expected Results:
     * - All audit logs for the entity are retrieved
     * - Logs are ordered by timestamp descending (most recent first)
     * - Each log contains correct action type and data
     */
    @Test
    @DisplayName("F5.3-003: Get entity history ordered by timestamp descending")
    void auditLog_getEntityHistory_orderedByTimestamp() {
        // Arrange
        UUID entityId = UUID.randomUUID();
        ScheduledReport entity = new ScheduledReport();
        entity.setId(entityId);
        entity.setTypeRapport(TypeRapport.EVENEMENTS);
        entity.setTitre("Event Report");
        entity.setCronExpression(VALID_CRON);
        entity.setFormat(FormatExport.PDF);
        entity.setDestinatairesEmail("events@example.com");
        entity.setUtilisateurCreateur(TEST_USER);
        entity.setActif(true);
        entity.setNombreExecutions(0);

        // Act - Create first audit log (CREATE action)
        auditService.logCreate(entity, "ScheduledReport", entityId, TEST_USER, SERVICE_SOURCE);

        // Small delay to ensure different timestamps
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Modify entity
        entity.setTitre("Event Report v2");
        ScheduledReport oldEntity = new ScheduledReport();
        oldEntity.setTitre("Event Report");
        oldEntity.setTypeRapport(TypeRapport.EVENEMENTS);

        // Act - Create second audit log (UPDATE action)
        auditService.logUpdate(oldEntity, entity, "ScheduledReport", entityId, TEST_USER, SERVICE_SOURCE);

        // Small delay to ensure different timestamps
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Modify entity again
        entity.setTitre("Event Report v3");
        ScheduledReport anotherOldEntity = new ScheduledReport();
        anotherOldEntity.setTitre("Event Report v2");
        anotherOldEntity.setTypeRapport(TypeRapport.EVENEMENTS);

        // Act - Create third audit log (UPDATE action)
        auditService.logUpdate(anotherOldEntity, entity, "ScheduledReport", entityId, ADMIN_USER, SERVICE_SOURCE);

        // Act - Retrieve history
        List<AuditLog> history = auditService.getEntityHistory("ScheduledReport", entityId);

        // Assert
        assertThat(history).hasSize(3);

        // Verify descending order (most recent first)
        assertThat(history.get(0).getTimestamp())
                .isAfterOrEqualTo(history.get(1).getTimestamp());
        assertThat(history.get(1).getTimestamp())
                .isAfterOrEqualTo(history.get(2).getTimestamp());

        // Verify action types
        assertThat(history.get(0).getActionType()).isEqualTo(AuditAction.UPDATE);
        assertThat(history.get(1).getActionType()).isEqualTo(AuditAction.UPDATE);
        assertThat(history.get(2).getActionType()).isEqualTo(AuditAction.CREATE);

        // Verify utilisateur
        assertThat(history.get(0).getUtilisateur()).isEqualTo(ADMIN_USER);
        assertThat(history.get(1).getUtilisateur()).isEqualTo(TEST_USER);
        assertThat(history.get(2).getUtilisateur()).isEqualTo(TEST_USER);
    }

    /**
     * Test: Get audit logs by date range with correct filtering.
     *
     * Scenario:
     * 1. Create audit logs with timestamps in different time periods
     * 2. Create log at T1 (before range)
     * 3. Create log at T2 (within range)
     * 4. Create log at T3 (within range)
     * 5. Create log at T4 (after range)
     * 6. Call auditService.getLogsByDateRange(T2, T3)
     * 7. Verify only logs T2 and T3 are returned (T1 and T4 excluded)
     *
     * Expected Results:
     * - Only audit logs within the specified date range are returned
     * - Logs are ordered by timestamp descending
     * - Boundary values (startDate and endDate) are inclusive
     * - Pagination works correctly
     */
    @Test
    @DisplayName("F5.3-004: Get audit logs by date range filters correctly")
    void auditLog_getByDateRange_filtersCorrectly() {
        // Arrange - Create logs with specific timestamps
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime t1 = now.minusDays(3);
        LocalDateTime t2 = now.minusDays(2);
        LocalDateTime t3 = now.minusDays(1);
        LocalDateTime t4 = now;

        UUID entityId1 = UUID.randomUUID();
        UUID entityId2 = UUID.randomUUID();
        UUID entityId3 = UUID.randomUUID();
        UUID entityId4 = UUID.randomUUID();

        ScheduledReport entity = new ScheduledReport();
        entity.setTypeRapport(TypeRapport.AUDIT);
        entity.setTitre("Audit Report");
        entity.setCronExpression(VALID_CRON);
        entity.setFormat(FormatExport.PDF);
        entity.setDestinatairesEmail("audit@example.com");
        entity.setUtilisateurCreateur(TEST_USER);
        entity.setActif(true);
        entity.setNombreExecutions(0);

        // Create logs with manual timestamp (using custom method would be ideal)
        AuditLog log1 = new AuditLog();
        log1.setId(UUID.randomUUID());
        log1.setActionType(AuditAction.CREATE);
        log1.setEntityType("ScheduledReport");
        log1.setEntityId(entityId1);
        log1.setUtilisateur(TEST_USER);
        log1.setSourceService(SERVICE_SOURCE);
        log1.setTimestamp(t1);
        log1.setValeurApres(Map.of("titre", "Test 1"));
        auditLogRepository.save(log1);

        AuditLog log2 = new AuditLog();
        log2.setId(UUID.randomUUID());
        log2.setActionType(AuditAction.CREATE);
        log2.setEntityType("ScheduledReport");
        log2.setEntityId(entityId2);
        log2.setUtilisateur(TEST_USER);
        log2.setSourceService(SERVICE_SOURCE);
        log2.setTimestamp(t2);
        log2.setValeurApres(Map.of("titre", "Test 2"));
        auditLogRepository.save(log2);

        AuditLog log3 = new AuditLog();
        log3.setId(UUID.randomUUID());
        log3.setActionType(AuditAction.CREATE);
        log3.setEntityType("ScheduledReport");
        log3.setEntityId(entityId3);
        log3.setUtilisateur(TEST_USER);
        log3.setSourceService(SERVICE_SOURCE);
        log3.setTimestamp(t3);
        log3.setValeurApres(Map.of("titre", "Test 3"));
        auditLogRepository.save(log3);

        AuditLog log4 = new AuditLog();
        log4.setId(UUID.randomUUID());
        log4.setActionType(AuditAction.CREATE);
        log4.setEntityType("ScheduledReport");
        log4.setEntityId(entityId4);
        log4.setUtilisateur(TEST_USER);
        log4.setSourceService(SERVICE_SOURCE);
        log4.setTimestamp(t4);
        log4.setValeurApres(Map.of("titre", "Test 4"));
        auditLogRepository.save(log4);

        Pageable pageable = PageRequest.of(0, 10);

        // Act - Query date range [t2, t3]
        Page<AuditLog> result = auditService.getLogsByDateRange(t2, t3, pageable);

        // Assert
        assertThat(result.getTotalElements()).isEqualTo(2);
        assertThat(result.getContent())
                .extracting(AuditLog::getTimestamp)
                .containsExactly(t3, t2); // descending order

        // Verify excluded logs
        assertThat(result.getContent())
                .extracting(AuditLog::getEntityId)
                .containsExactlyInAnyOrder(entityId2, entityId3)
                .doesNotContain(entityId1, entityId4);
    }

    /**
     * Test: Get audit logs by user with pagination.
     *
     * Scenario:
     * 1. Create multiple audit logs for different users
     * 2. Create 3 logs for TEST_USER
     * 3. Create 2 logs for ADMIN_USER
     * 4. Call auditService.getLogsByUser(TEST_USER, page1) with pageSize=2
     * 5. Verify first page contains 2 logs for TEST_USER
     * 6. Call with page2 and verify remaining log for TEST_USER
     * 7. Verify logs are ordered by timestamp descending
     *
     * Expected Results:
     * - Logs are correctly filtered by user
     * - Pagination works correctly with page size
     * - Total elements count is accurate
     * - Logs are ordered by timestamp descending
     * - Other users' logs are not included
     */
    @Test
    @DisplayName("F5.3-005: Get audit logs by user with pagination")
    void auditLog_getByUser_paginates() {
        // Arrange - Create audit logs for different users
        LocalDateTime now = LocalDateTime.now();

        // Create 3 logs for TEST_USER
        for (int i = 0; i < 3; i++) {
            AuditLog log = new AuditLog();
            log.setId(UUID.randomUUID());
            log.setActionType(AuditAction.CREATE);
            log.setEntityType("ScheduledReport");
            log.setEntityId(UUID.randomUUID());
            log.setUtilisateur(TEST_USER);
            log.setSourceService(SERVICE_SOURCE);
            log.setTimestamp(now.minusDays(i));
            log.setValeurApres(Map.of("titre", "Test User Log " + i));
            auditLogRepository.save(log);
        }

        // Create 2 logs for ADMIN_USER
        for (int i = 0; i < 2; i++) {
            AuditLog log = new AuditLog();
            log.setId(UUID.randomUUID());
            log.setActionType(AuditAction.UPDATE);
            log.setEntityType("ScheduledReport");
            log.setEntityId(UUID.randomUUID());
            log.setUtilisateur(ADMIN_USER);
            log.setSourceService(SERVICE_SOURCE);
            log.setTimestamp(now.minusHours(i));
            log.setValeurApres(Map.of("titre", "Admin Log " + i));
            auditLogRepository.save(log);
        }

        // Act - Get first page of logs for TEST_USER
        Pageable page1 = PageRequest.of(0, 2); // page 0, size 2
        Page<AuditLog> firstPage = auditService.getLogsByUser(TEST_USER, page1);

        // Assert - First page
        assertThat(firstPage.getTotalElements()).isEqualTo(3);
        assertThat(firstPage.getTotalPages()).isEqualTo(2);
        assertThat(firstPage.getNumber()).isZero();
        assertThat(firstPage.getSize()).isEqualTo(2);
        assertThat(firstPage.getContent()).hasSize(2);

        // Verify all logs are for TEST_USER
        assertThat(firstPage.getContent())
                .extracting(AuditLog::getUtilisateur)
                .containsOnly(TEST_USER);

        // Verify logs are ordered by timestamp descending
        assertThat(firstPage.getContent().get(0).getTimestamp())
                .isAfterOrEqualTo(firstPage.getContent().get(1).getTimestamp());

        // Act - Get second page
        Pageable page2 = PageRequest.of(1, 2); // page 1, size 2
        Page<AuditLog> secondPage = auditService.getLogsByUser(TEST_USER, page2);

        // Assert - Second page
        assertThat(secondPage.getNumber()).isEqualTo(1);
        assertThat(secondPage.getContent()).hasSize(1);
        assertThat(secondPage.getContent().get(0).getUtilisateur()).isEqualTo(TEST_USER);

        // Assert - ADMIN_USER logs are not in TEST_USER query
        List<AuditLog> allTestUserLogs = new java.util.ArrayList<>();
        allTestUserLogs.addAll(firstPage.getContent());
        allTestUserLogs.addAll(secondPage.getContent());

        assertThat(allTestUserLogs)
                .extracting(AuditLog::getUtilisateur)
                .containsOnly(TEST_USER)
                .doesNotContain(ADMIN_USER);
    }
}
