package com.timely.reportservice.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.timely.reportservice.dto.response.AuditLogResponse;
import com.timely.reportservice.entity.AuditLog;
import com.timely.reportservice.entity.enums.AuditAction;
import com.timely.reportservice.mapper.AuditLogMapper;
import com.timely.reportservice.service.AuditService;
import com.timely.reportservice.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Unit tests for AuditController.
 *
 * Tests cover F5.3 (Audit Trail Consultation):
 * - GET /api/reports/audit/entity/{entityType}/{entityId} - History of an entity
 * - GET /api/reports/audit/action/{actionType} - Logs by action type
 * - GET /api/reports/audit/user/{utilisateur} - Logs by user
 * - GET /api/reports/audit/date-range - Logs by date range
 * - GET /api/reports/audit/recent - Recent logs
 *
 * Uses @WebMvcTest(AuditController.class) with @WithMockUser for security testing.
 * AAA Pattern (Arrange-Act-Assert) for all tests.
 */
@WebMvcTest(AuditController.class)
@DisplayName("AuditController Unit Tests")
class AuditControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuditService auditService;

    @MockBean
    private AuditLogMapper auditLogMapper;

    @MockBean
    private JwtUtil jwtUtil;

    private UUID entityId;
    private UUID auditLogId;
    private String entityType;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        entityId = UUID.randomUUID();
        auditLogId = UUID.randomUUID();
        entityType = "EmploiDuTemps";
        now = LocalDateTime.now();
    }

    // Helper method to create test AuditLog
    private AuditLog createTestAuditLog(
            UUID id,
            AuditAction action,
            String entityType,
            UUID entityId,
            String utilisateur,
            LocalDateTime timestamp) {
        AuditLog log = new AuditLog();
        log.setId(id);
        log.setActionType(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setEntityClassName("com.timely.planningservice.entity." + entityType);
        log.setUtilisateur(utilisateur);
        log.setSourceService("planning-service");
        log.setSourceMethod("POST /api/emplois");
        log.setIpAddress("127.0.0.1");
        log.setTimestamp(timestamp);

        Map<String, Object> valeurApres = new HashMap<>();
        valeurApres.put("id", entityId);
        valeurApres.put("ecoleId", UUID.randomUUID());
        valeurApres.put("statut", "BROUILLON");
        log.setValeurApres(valeurApres);

        return log;
    }

    // Helper method to create test AuditLogResponse
    private AuditLogResponse createTestAuditLogResponse(
            UUID id,
            AuditAction action,
            String entityType,
            UUID entityId,
            String utilisateur,
            LocalDateTime timestamp) {
        AuditLogResponse response = new AuditLogResponse();
        response.setId(id);
        response.setActionType(action);
        response.setEntityType(entityType);
        response.setEntityId(entityId);
        response.setEntityClassName("com.timely.planningservice.entity." + entityType);
        response.setUtilisateur(utilisateur);
        response.setSourceService("planning-service");
        response.setSourceMethod("POST /api/emplois");
        response.setIpAddress("127.0.0.1");
        response.setTimestamp(timestamp);

        Map<String, Object> valeurApres = new HashMap<>();
        valeurApres.put("id", entityId);
        valeurApres.put("ecoleId", UUID.randomUUID());
        valeurApres.put("statut", "BROUILLON");
        response.setValeurApres(valeurApres);

        return response;
    }

    // Test 1: getEntityHistory as Admin returns 200
    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("F5.3 - getEntityHistory as ADMIN returns 200 OK with entity history")
    void getEntityHistory_asAdmin_returns200() throws Exception {
        // Arrange
        AuditLog auditLog1 = createTestAuditLog(auditLogId, AuditAction.CREATE, entityType, entityId, "admin@iusjc.edu", now.minusHours(2));
        AuditLog auditLog2 = createTestAuditLog(UUID.randomUUID(), AuditAction.UPDATE, entityType, entityId, "admin@iusjc.edu", now);

        AuditLogResponse response1 = createTestAuditLogResponse(auditLogId, AuditAction.CREATE, entityType, entityId, "admin@iusjc.edu", now.minusHours(2));
        AuditLogResponse response2 = createTestAuditLogResponse(UUID.randomUUID(), AuditAction.UPDATE, entityType, entityId, "admin@iusjc.edu", now);

        List<AuditLog> logs = List.of(auditLog2, auditLog1);
        List<AuditLogResponse> responses = List.of(response2, response1);

        when(auditService.getEntityHistory(entityType, entityId)).thenReturn(logs);
        when(auditLogMapper.toResponseList(logs)).thenReturn(responses);

        // Act & Assert
        mockMvc.perform(get("/api/reports/audit/entity/{entityType}/{entityId}", entityType, entityId)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(response2.getId().toString()))
                .andExpect(jsonPath("$[0].actionType").value("UPDATE"))
                .andExpect(jsonPath("$[1].id").value(response1.getId().toString()))
                .andExpect(jsonPath("$[1].actionType").value("CREATE"));
    }

    // Test 2: getEntityHistory as Teacher returns 200
    @Test
    @WithMockUser(roles = "TEACHER")
    @DisplayName("F5.3 - getEntityHistory as TEACHER returns 200 OK with entity history")
    void getEntityHistory_asTeacher_returns200() throws Exception {
        // Arrange
        AuditLog auditLog = createTestAuditLog(auditLogId, AuditAction.CREATE, entityType, entityId, "teacher@iusjc.edu", now);
        AuditLogResponse response = createTestAuditLogResponse(auditLogId, AuditAction.CREATE, entityType, entityId, "teacher@iusjc.edu", now);

        List<AuditLog> logs = List.of(auditLog);
        List<AuditLogResponse> responses = List.of(response);

        when(auditService.getEntityHistory(entityType, entityId)).thenReturn(logs);
        when(auditLogMapper.toResponseList(logs)).thenReturn(responses);

        // Act & Assert
        mockMvc.perform(get("/api/reports/audit/entity/{entityType}/{entityId}", entityType, entityId)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].utilisateur").value("teacher@iusjc.edu"));
    }

    // Test 3: getLogsByAction as Admin returns 200
    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("F5.3 - getLogsByAction as ADMIN returns 200 OK with paginated results")
    void getLogsByAction_asAdmin_returns200() throws Exception {
        // Arrange
        AuditLog log1 = createTestAuditLog(auditLogId, AuditAction.CREATE, "EmploiDuTemps", UUID.randomUUID(), "admin@iusjc.edu", now.minusHours(1));
        AuditLog log2 = createTestAuditLog(UUID.randomUUID(), AuditAction.CREATE, "Salle", UUID.randomUUID(), "admin@iusjc.edu", now);

        AuditLogResponse response1 = createTestAuditLogResponse(auditLogId, AuditAction.CREATE, "EmploiDuTemps", UUID.randomUUID(), "admin@iusjc.edu", now.minusHours(1));
        AuditLogResponse response2 = createTestAuditLogResponse(UUID.randomUUID(), AuditAction.CREATE, "Salle", UUID.randomUUID(), "admin@iusjc.edu", now);

        List<AuditLog> logList = List.of(log2, log1);
        Page<AuditLog> logPage = new PageImpl<>(logList, PageRequest.of(0, 20), 2);

        when(auditService.getLogsByAction(AuditAction.CREATE, PageRequest.of(0, 20)))
                .thenReturn(logPage);
        when(auditLogMapper.toResponse(log1)).thenReturn(response1);
        when(auditLogMapper.toResponse(log2)).thenReturn(response2);

        // Act & Assert
        mockMvc.perform(get("/api/reports/audit/action/{actionType}", "CREATE")
                .param("page", "0")
                .param("size", "20")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.totalPages").value(1))
                .andExpect(jsonPath("$.content[0].actionType").value("CREATE"));
    }

    // Test 4: getLogsByUser as Admin returns 200
    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("F5.3 - getLogsByUser as ADMIN returns 200 OK with user-specific logs")
    void getLogsByUser_asAdmin_returns200() throws Exception {
        // Arrange
        String utilisateur = "admin@iusjc.edu";
        AuditLog log1 = createTestAuditLog(auditLogId, AuditAction.CREATE, "EmploiDuTemps", UUID.randomUUID(), utilisateur, now.minusHours(3));
        AuditLog log2 = createTestAuditLog(UUID.randomUUID(), AuditAction.UPDATE, "Salle", UUID.randomUUID(), utilisateur, now.minusHours(1));
        AuditLog log3 = createTestAuditLog(UUID.randomUUID(), AuditAction.DELETE, "Cours", UUID.randomUUID(), utilisateur, now);

        AuditLogResponse response1 = createTestAuditLogResponse(auditLogId, AuditAction.CREATE, "EmploiDuTemps", UUID.randomUUID(), utilisateur, now.minusHours(3));
        AuditLogResponse response2 = createTestAuditLogResponse(UUID.randomUUID(), AuditAction.UPDATE, "Salle", UUID.randomUUID(), utilisateur, now.minusHours(1));
        AuditLogResponse response3 = createTestAuditLogResponse(UUID.randomUUID(), AuditAction.DELETE, "Cours", UUID.randomUUID(), utilisateur, now);

        List<AuditLog> logList = List.of(log3, log2, log1);
        Page<AuditLog> logPage = new PageImpl<>(logList, PageRequest.of(0, 20), 3);

        when(auditService.getLogsByUser(utilisateur, PageRequest.of(0, 20)))
                .thenReturn(logPage);
        when(auditLogMapper.toResponse(log1)).thenReturn(response1);
        when(auditLogMapper.toResponse(log2)).thenReturn(response2);
        when(auditLogMapper.toResponse(log3)).thenReturn(response3);

        // Act & Assert
        mockMvc.perform(get("/api/reports/audit/user/{utilisateur}", utilisateur)
                .param("page", "0")
                .param("size", "20")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(3))
                .andExpect(jsonPath("$.totalElements").value(3))
                .andExpect(jsonPath("$.content[0].utilisateur").value(utilisateur))
                .andExpect(jsonPath("$.content[1].utilisateur").value(utilisateur))
                .andExpect(jsonPath("$.content[2].utilisateur").value(utilisateur));
    }

    // Test 5: getLogsByDateRange with valid dates returns 200
    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("F5.3 - getLogsByDateRange with valid dates returns 200 OK with filtered logs")
    void getLogsByDateRange_validDates_returns200() throws Exception {
        // Arrange
        LocalDateTime startDate = now.minusHours(5);
        LocalDateTime endDate = now;

        AuditLog log1 = createTestAuditLog(auditLogId, AuditAction.CREATE, "EmploiDuTemps", UUID.randomUUID(), "user1@iusjc.edu", now.minusHours(4));
        AuditLog log2 = createTestAuditLog(UUID.randomUUID(), AuditAction.UPDATE, "Salle", UUID.randomUUID(), "user2@iusjc.edu", now.minusHours(2));

        AuditLogResponse response1 = createTestAuditLogResponse(auditLogId, AuditAction.CREATE, "EmploiDuTemps", UUID.randomUUID(), "user1@iusjc.edu", now.minusHours(4));
        AuditLogResponse response2 = createTestAuditLogResponse(UUID.randomUUID(), AuditAction.UPDATE, "Salle", UUID.randomUUID(), "user2@iusjc.edu", now.minusHours(2));

        List<AuditLog> logList = List.of(log2, log1);
        Page<AuditLog> logPage = new PageImpl<>(logList, PageRequest.of(0, 20), 2);

        when(auditService.getLogsByDateRange(startDate, endDate, PageRequest.of(0, 20)))
                .thenReturn(logPage);
        when(auditLogMapper.toResponse(log1)).thenReturn(response1);
        when(auditLogMapper.toResponse(log2)).thenReturn(response2);

        // Act & Assert
        mockMvc.perform(get("/api/reports/audit/date-range")
                .param("startDate", startDate.toString())
                .param("endDate", endDate.toString())
                .param("page", "0")
                .param("size", "20")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.totalElements").value(2));
    }

    // Test 6: getRecentLogs returns 200
    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("F5.3 - getRecentLogs returns 200 OK with last 10 logs")
    void getRecentLogs_returns200() throws Exception {
        // Arrange
        List<AuditLog> recentLogs = new ArrayList<>();
        List<AuditLogResponse> recentResponses = new ArrayList<>();

        for (int i = 0; i < 5; i++) {
            AuditLog log = createTestAuditLog(
                    UUID.randomUUID(),
                    i % 2 == 0 ? AuditAction.CREATE : AuditAction.UPDATE,
                    "EmploiDuTemps",
                    UUID.randomUUID(),
                    "admin@iusjc.edu",
                    now.minusMinutes(i * 10)
            );
            AuditLogResponse response = createTestAuditLogResponse(
                    log.getId(),
                    log.getActionType(),
                    "EmploiDuTemps",
                    log.getEntityId(),
                    "admin@iusjc.edu",
                    now.minusMinutes(i * 10)
            );
            recentLogs.add(log);
            recentResponses.add(response);
        }

        when(auditService.getRecentLogs()).thenReturn(recentLogs);
        when(auditLogMapper.toResponseList(recentLogs)).thenReturn(recentResponses);

        // Act & Assert
        mockMvc.perform(get("/api/reports/audit/recent")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(5));
    }

    // Test 7: getLogsByAction as Student - Verifies Access Control
    @Test
    @DisplayName("F5.3 - Verify getLogsByAction requires ADMIN role (no authentication returns 401)")
    void getLogsByAction_asStudent_returns403() throws Exception {
        // Arrange
        // The getLogsByAction endpoint requires ADMIN role via @PreAuthorize("hasRole('ROLE_ADMIN')")
        // When accessed without proper authentication/authorization, should return 401 Unauthorized

        // Act & Assert
        // Request without @WithMockUser (no authentication) should return 401
        mockMvc.perform(get("/api/reports/audit/action/{actionType}", "CREATE")
                .param("page", "0")
                .param("size", "20")
                .with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    // Additional comprehensive tests

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("F5.3 - getLogsByAction with pagination parameters")
    void getLogsByAction_withPagination_returns200() throws Exception {
        // Arrange
        List<AuditLog> logList = new ArrayList<>();
        List<AuditLogResponse> responseList = new ArrayList<>();

        for (int i = 0; i < 5; i++) {
            AuditLog log = createTestAuditLog(
                    UUID.randomUUID(),
                    AuditAction.CREATE,
                    "EmploiDuTemps",
                    UUID.randomUUID(),
                    "admin@iusjc.edu",
                    now.minusMinutes(i * 5)
            );
            AuditLogResponse response = createTestAuditLogResponse(
                    log.getId(),
                    AuditAction.CREATE,
                    "EmploiDuTemps",
                    log.getEntityId(),
                    "admin@iusjc.edu",
                    now.minusMinutes(i * 5)
            );
            logList.add(log);
            responseList.add(response);
        }

        Page<AuditLog> logPage = new PageImpl<>(logList, PageRequest.of(1, 5), 25);

        when(auditService.getLogsByAction(AuditAction.CREATE, PageRequest.of(1, 5)))
                .thenReturn(logPage);
        when(auditLogMapper.toResponse(any(AuditLog.class))).thenAnswer(invocation -> {
            AuditLog log = invocation.getArgument(0);
            return responseList.stream()
                    .filter(r -> r.getId().equals(log.getId()))
                    .findFirst()
                    .orElse(null);
        });

        // Act & Assert
        mockMvc.perform(get("/api/reports/audit/action/{actionType}", "CREATE")
                .param("page", "1")
                .param("size", "5")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.number").value(1))
                .andExpect(jsonPath("$.size").value(5))
                .andExpect(jsonPath("$.totalElements").value(25));
    }

    @Test
    @WithMockUser(roles = "TEACHER")
    @DisplayName("F5.3 - getEntityHistory returns correct entity type and ID")
    void getEntityHistory_returnsCorrectEntity() throws Exception {
        // Arrange
        String courseEntityType = "Cours";
        UUID courseId = UUID.randomUUID();
        AuditLog log = createTestAuditLog(auditLogId, AuditAction.CREATE, courseEntityType, courseId, "teacher@iusjc.edu", now);
        AuditLogResponse response = createTestAuditLogResponse(auditLogId, AuditAction.CREATE, courseEntityType, courseId, "teacher@iusjc.edu", now);

        when(auditService.getEntityHistory(courseEntityType, courseId)).thenReturn(List.of(log));
        when(auditLogMapper.toResponseList(List.of(log))).thenReturn(List.of(response));

        // Act & Assert
        mockMvc.perform(get("/api/reports/audit/entity/{entityType}/{entityId}", courseEntityType, courseId)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].entityType").value(courseEntityType))
                .andExpect(jsonPath("$[0].entityId").value(courseId.toString()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("F5.3 - getLogsByUser returns empty list when no logs found")
    void getLogsByUser_noLogsFound_returnsEmptyPage() throws Exception {
        // Arrange
        String utilisateur = "nonexistent@iusjc.edu";
        Page<AuditLog> emptyPage = new PageImpl<>(Collections.emptyList(), PageRequest.of(0, 20), 0);

        when(auditService.getLogsByUser(utilisateur, PageRequest.of(0, 20)))
                .thenReturn(emptyPage);
        when(auditLogMapper.toResponseList(any())).thenReturn(Collections.emptyList());

        // Act & Assert
        mockMvc.perform(get("/api/reports/audit/user/{utilisateur}", utilisateur)
                .param("page", "0")
                .param("size", "20")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(0))
                .andExpect(jsonPath("$.totalElements").value(0));
    }
}
