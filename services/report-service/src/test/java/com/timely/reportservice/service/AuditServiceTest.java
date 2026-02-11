package com.timely.reportservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.timely.reportservice.entity.AuditLog;
import com.timely.reportservice.entity.enums.AuditAction;
import com.timely.reportservice.repository.AuditLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuditService validating F5.3 requirements.
 * Tests audit trail functionality with JSONB storage using AAA pattern and AssertJ assertions.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuditService Unit Tests")
class AuditServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private AuditService auditService;

    private UUID testEntityId;
    private String testEntityType;
    private String testUtilisateur;
    private String testSourceService;
    private LocalDateTime testTimestamp;

    @BeforeEach
    void setUp() {
        testEntityId = UUID.randomUUID();
        testEntityType = "EmploiDuTemps";
        testUtilisateur = "user@example.com";
        testSourceService = "planning-service";
        testTimestamp = LocalDateTime.now();
    }

    // ===== CREATE ACTION TESTS =====

    @Test
    @DisplayName("logCreate_savesAuditLogWithCreateAction")
    void testLogCreateSavesAuditLogWithCreateAction() {
        // Arrange
        Object entity = createTestEntity();
        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);

        Map<String, Object> expectedValues = new HashMap<>();
        expectedValues.put("id", testEntityId.toString());
        expectedValues.put("nom", "Test");

        when(objectMapper.convertValue(entity, Map.class)).thenReturn(expectedValues);
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(new AuditLog());

        // Act
        auditService.logCreate(entity, testEntityType, testEntityId, testUtilisateur, testSourceService);

        // Assert
        verify(auditLogRepository, times(1)).save(captor.capture());
        AuditLog saved = captor.getValue();

        assertThat(saved)
                .isNotNull()
                .extracting(AuditLog::getActionType, AuditLog::getEntityType, AuditLog::getEntityId)
                .containsExactly(AuditAction.CREATE, testEntityType, testEntityId);
        assertThat(saved.getValeurApres()).isEqualTo(expectedValues);
        assertThat(saved.getValeurAvant()).isNull();
        assertThat(saved.getChangements()).isNull();
    }

    @Test
    @DisplayName("logCreate_storesValeurApresOnly")
    void testLogCreateStoresValeurApresOnly() {
        // Arrange
        Object entity = createTestEntity();
        Map<String, Object> entityValues = new HashMap<>();
        entityValues.put("name", "Test Schedule");
        entityValues.put("status", "ACTIVE");

        when(objectMapper.convertValue(entity, Map.class)).thenReturn(entityValues);
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(new AuditLog());

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);

        // Act
        auditService.logCreate(entity, testEntityType, testEntityId, testUtilisateur, testSourceService);

        // Assert
        verify(auditLogRepository).save(captor.capture());
        AuditLog saved = captor.getValue();

        assertThat(saved.getValeurApres())
                .isNotNull()
                .containsEntry("name", "Test Schedule")
                .containsEntry("status", "ACTIVE");
        assertThat(saved.getValeurAvant()).isNull();
        assertThat(saved.getChangements()).isNull();
    }

    // ===== UPDATE ACTION TESTS =====

    @Test
    @DisplayName("logUpdate_calculatesChangements")
    void testLogUpdateCalculatesChangements() {
        // Arrange
        Object oldEntity = createTestEntity();
        Object newEntity = createTestEntity();

        Map<String, Object> oldValues = new HashMap<>();
        oldValues.put("name", "Old Name");
        oldValues.put("status", "DRAFT");
        oldValues.put("capacity", 30);

        Map<String, Object> newValues = new HashMap<>();
        newValues.put("name", "New Name");
        newValues.put("status", "PUBLISHED");
        newValues.put("capacity", 30);

        when(objectMapper.convertValue(oldEntity, Map.class)).thenReturn(oldValues);
        when(objectMapper.convertValue(newEntity, Map.class)).thenReturn(newValues);
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(new AuditLog());

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);

        // Act
        auditService.logUpdate(oldEntity, newEntity, testEntityType, testEntityId, testUtilisateur, testSourceService);

        // Assert
        verify(auditLogRepository).save(captor.capture());
        AuditLog saved = captor.getValue();

        assertThat(saved.getChangements())
                .isNotNull()
                .hasSize(2)
                .containsKeys("name", "status");
        assertThat(saved.getChangements().get("name"))
                .containsEntry("avant", "Old Name")
                .containsEntry("apres", "New Name");
        assertThat(saved.getChangements().get("capacity")).isNull();
    }

    @Test
    @DisplayName("logUpdate_storesValeurAvantAndApres")
    void testLogUpdateStoresValeurAvantAndApres() {
        // Arrange
        Object oldEntity = createTestEntity();
        Object newEntity = createTestEntity();

        Map<String, Object> oldValues = new HashMap<>();
        oldValues.put("name", "Old Schedule");
        oldValues.put("semester", "S1");

        Map<String, Object> newValues = new HashMap<>();
        newValues.put("name", "Updated Schedule");
        newValues.put("semester", "S2");

        when(objectMapper.convertValue(oldEntity, Map.class)).thenReturn(oldValues);
        when(objectMapper.convertValue(newEntity, Map.class)).thenReturn(newValues);
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(new AuditLog());

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);

        // Act
        auditService.logUpdate(oldEntity, newEntity, testEntityType, testEntityId, testUtilisateur, testSourceService);

        // Assert
        verify(auditLogRepository).save(captor.capture());
        AuditLog saved = captor.getValue();

        assertThat(saved.getValeurAvant())
                .isNotNull()
                .isEqualTo(oldValues);
        assertThat(saved.getValeurApres())
                .isNotNull()
                .isEqualTo(newValues);
        assertThat(saved.getActionType()).isEqualTo(AuditAction.UPDATE);
    }

    // ===== DELETE ACTION TESTS =====

    @Test
    @DisplayName("logDelete_savesAuditLogWithDeleteAction")
    void testLogDeleteSavesAuditLogWithDeleteAction() {
        // Arrange
        Object entity = createTestEntity();
        Map<String, Object> entityValues = new HashMap<>();
        entityValues.put("id", testEntityId.toString());
        entityValues.put("name", "To Delete");

        when(objectMapper.convertValue(entity, Map.class)).thenReturn(entityValues);
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(new AuditLog());

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);

        // Act
        auditService.logDelete(entity, testEntityType, testEntityId, testUtilisateur, testSourceService);

        // Assert
        verify(auditLogRepository).save(captor.capture());
        AuditLog saved = captor.getValue();

        assertThat(saved)
                .isNotNull()
                .extracting(AuditLog::getActionType, AuditLog::getEntityType, AuditLog::getEntityId)
                .containsExactly(AuditAction.DELETE, testEntityType, testEntityId);
    }

    @Test
    @DisplayName("logDelete_storesValeurAvantOnly")
    void testLogDeleteStoresValeurAvantOnly() {
        // Arrange
        Object entity = createTestEntity();
        Map<String, Object> entityValues = new HashMap<>();
        entityValues.put("name", "Deleted Entity");
        entityValues.put("status", "INACTIVE");

        when(objectMapper.convertValue(entity, Map.class)).thenReturn(entityValues);
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(new AuditLog());

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);

        // Act
        auditService.logDelete(entity, testEntityType, testEntityId, testUtilisateur, testSourceService);

        // Assert
        verify(auditLogRepository).save(captor.capture());
        AuditLog saved = captor.getValue();

        assertThat(saved.getValeurAvant())
                .isNotNull()
                .containsEntry("name", "Deleted Entity")
                .containsEntry("status", "INACTIVE");
        assertThat(saved.getValeurApres()).isNull();
        assertThat(saved.getChangements()).isNull();
    }

    // ===== CUSTOM ACTION TESTS =====

    @Test
    @DisplayName("logCustomAction_PUBLISH_savesWithMetadata")
    void testLogCustomActionPublishSavesWithMetadata() {
        // Arrange
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("publishedAt", testTimestamp.toString());
        metadata.put("publishedBy", "admin@timely.com");
        metadata.put("version", "1.0.0");

        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(new AuditLog());
        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);

        // Act
        auditService.logCustomAction(AuditAction.PUBLISH, testEntityType, testEntityId,
                testUtilisateur, testSourceService, metadata);

        // Assert
        verify(auditLogRepository).save(captor.capture());
        AuditLog saved = captor.getValue();

        assertThat(saved)
                .isNotNull()
                .extracting(AuditLog::getActionType, AuditLog::getEntityType)
                .containsExactly(AuditAction.PUBLISH, testEntityType);
        assertThat(saved.getMetadata())
                .isNotNull()
                .isEqualTo(metadata)
                .containsKeys("publishedAt", "publishedBy", "version");
        assertThat(saved.getValeurAvant()).isNull();
        assertThat(saved.getValeurApres()).isNull();
    }

    // ===== RETRIEVAL TESTS =====

    @Test
    @DisplayName("getEntityHistory_returnsOrderedLogs")
    void testGetEntityHistoryReturnsOrderedLogs() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        AuditLog log1 = createAuditLog(AuditAction.UPDATE, now.minusHours(2));
        AuditLog log2 = createAuditLog(AuditAction.UPDATE, now.minusHours(1));
        AuditLog log3 = createAuditLog(AuditAction.CREATE, now);

        when(auditLogRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(testEntityType, testEntityId))
                .thenReturn(List.of(log3, log2, log1));

        // Act
        List<AuditLog> result = auditService.getEntityHistory(testEntityType, testEntityId);

        // Assert
        assertThat(result)
                .isNotNull()
                .hasSize(3)
                .isSortedAccordingTo((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
        assertThat(result)
                .extracting(AuditLog::getActionType)
                .containsExactly(AuditAction.CREATE, AuditAction.UPDATE, AuditAction.UPDATE);
    }

    @Test
    @DisplayName("getLogsByAction_withPagination_returnsPage")
    void testGetLogsByActionWithPaginationReturnsPage() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        AuditLog log1 = createAuditLog(AuditAction.CREATE, LocalDateTime.now());
        AuditLog log2 = createAuditLog(AuditAction.CREATE, LocalDateTime.now().minusHours(1));

        Page<AuditLog> expectedPage = new PageImpl<>(List.of(log1, log2), pageable, 2);

        when(auditLogRepository.findByActionTypeOrderByTimestampDesc(AuditAction.CREATE, pageable))
                .thenReturn(expectedPage);

        // Act
        Page<AuditLog> result = auditService.getLogsByAction(AuditAction.CREATE, pageable);

        // Assert
        assertThat(result)
                .isNotNull()
                .hasSize(2);
        assertThat(result.getTotalElements()).isEqualTo(2);
        assertThat(result.getTotalPages()).isEqualTo(1);
        assertThat(result.getNumber()).isEqualTo(0);
        assertThat(result.getContent())
                .allMatch(log -> log.getActionType() == AuditAction.CREATE);
    }

    @Test
    @DisplayName("getLogsByUser_returnsUserLogs")
    void testGetLogsByUserReturnsUserLogs() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        String targetUser = "admin@timely.com";

        AuditLog log1 = createAuditLog(AuditAction.CREATE, LocalDateTime.now());
        log1.setUtilisateur(targetUser);

        AuditLog log2 = createAuditLog(AuditAction.UPDATE, LocalDateTime.now().minusHours(1));
        log2.setUtilisateur(targetUser);

        Page<AuditLog> expectedPage = new PageImpl<>(List.of(log1, log2), pageable, 2);

        when(auditLogRepository.findByUtilisateurOrderByTimestampDesc(targetUser, pageable))
                .thenReturn(expectedPage);

        // Act
        Page<AuditLog> result = auditService.getLogsByUser(targetUser, pageable);

        // Assert
        assertThat(result)
                .isNotNull()
                .hasSize(2);
        assertThat(result.getContent())
                .allMatch(log -> log.getUtilisateur().equals(targetUser));
    }

    @Test
    @DisplayName("getLogsByDateRange_returnsFilteredLogs")
    void testGetLogsByDateRangeReturnsFilteredLogs() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        LocalDateTime startDate = LocalDateTime.of(2025, 1, 1, 0, 0);
        LocalDateTime endDate = LocalDateTime.of(2025, 1, 31, 23, 59);

        AuditLog log1 = createAuditLog(AuditAction.CREATE, LocalDateTime.of(2025, 1, 15, 10, 0));
        AuditLog log2 = createAuditLog(AuditAction.UPDATE, LocalDateTime.of(2025, 1, 20, 14, 30));

        Page<AuditLog> expectedPage = new PageImpl<>(List.of(log1, log2), pageable, 2);

        when(auditLogRepository.findByTimestampBetween(startDate, endDate, pageable))
                .thenReturn(expectedPage);

        // Act
        Page<AuditLog> result = auditService.getLogsByDateRange(startDate, endDate, pageable);

        // Assert
        assertThat(result)
                .isNotNull()
                .hasSize(2);
        assertThat(result.getContent())
                .allMatch(log -> !log.getTimestamp().isBefore(startDate) && !log.getTimestamp().isAfter(endDate));
    }

    @Test
    @DisplayName("getRecentLogs_returnsTop10")
    void testGetRecentLogsReturnsTop10() {
        // Arrange
        List<AuditLog> recentLogs = new java.util.ArrayList<>();
        for (int i = 0; i < 10; i++) {
            recentLogs.add(createAuditLog(AuditAction.CREATE, LocalDateTime.now().minusHours(i)));
        }

        when(auditLogRepository.findTop10ByOrderByTimestampDesc()).thenReturn(recentLogs);

        // Act
        List<AuditLog> result = auditService.getRecentLogs();

        // Assert
        assertThat(result)
                .isNotNull()
                .hasSize(10)
                .isSortedAccordingTo((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
    }

    // ===== ERROR HANDLING TESTS =====

    @Test
    @DisplayName("logCreate_auditFailure_doesNotBlockOperation")
    void testLogCreateAuditFailureDoesNotBlockOperation() {
        // Arrange
        Object entity = createTestEntity();

        when(objectMapper.convertValue(entity, Map.class))
                .thenThrow(new RuntimeException("Serialization failed"));

        // Act - Should not throw exception even when serialization fails
        assertThatNoException().isThrownBy(() ->
                auditService.logCreate(entity, testEntityType, testEntityId, testUtilisateur, testSourceService)
        );

        // Assert - Verify no save was called since exception occurred during serialization
        verify(auditLogRepository, never()).save(any(AuditLog.class));
    }

    // ===== HELPER METHODS =====

    private Object createTestEntity() {
        return new Object();
    }

    private AuditLog createAuditLog(AuditAction action, LocalDateTime timestamp) {
        AuditLog log = new AuditLog();
        log.setId(UUID.randomUUID());
        log.setActionType(action);
        log.setEntityType(testEntityType);
        log.setEntityId(testEntityId);
        log.setUtilisateur(testUtilisateur);
        log.setSourceService(testSourceService);
        log.setTimestamp(timestamp);
        return log;
    }
}
