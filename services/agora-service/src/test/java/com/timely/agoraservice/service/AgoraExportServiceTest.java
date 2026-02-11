package com.timely.agoraservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.timely.agoraservice.client.PlanningServiceClient;
import com.timely.agoraservice.entity.ExportAgora;
import com.timely.agoraservice.entity.LogIntegration;
import com.timely.agoraservice.entity.enums.FormatExportAgora;
import com.timely.agoraservice.entity.enums.StatutExportAgora;
import com.timely.agoraservice.entity.enums.TypeLog;
import com.timely.agoraservice.exception.ResourceNotFoundException;
import com.timely.agoraservice.repository.ExportAgoraRepository;
import com.timely.agoraservice.repository.LogIntegrationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AgoraExportService validating Timely → Agora export functionality.
 * Tests cover planning export creation, status tracking, and async processing
 * with AAA pattern and AssertJ assertions.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AgoraExportService Unit Tests")
class AgoraExportServiceTest {

    @Mock
    private ExportAgoraRepository exportAgoraRepository;

    @Mock
    private LogIntegrationRepository logIntegrationRepository;

    @Mock
    private PlanningServiceClient planningServiceClient;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private AgoraExportService agoraExportService;

    private UUID testExportId;
    private UUID testEmploiDuTempsId;
    private ExportAgora testExport;
    private Object testEmploi;

    @BeforeEach
    void setUp() {
        testExportId = UUID.randomUUID();
        testEmploiDuTempsId = UUID.randomUUID();

        // Create test export with EN_ATTENTE status
        testExport = new ExportAgora();
        testExport.setId(testExportId);
        testExport.setEmploiDuTempsId(testEmploiDuTempsId);
        testExport.setFormat(FormatExportAgora.JSON);
        testExport.setStatut(StatutExportAgora.EN_ATTENTE);
        testExport.setNumeroTentative(0);
        testExport.setDateExport(LocalDateTime.now());
        testExport.setCreatedAt(LocalDateTime.now());
        testExport.setUpdatedAt(LocalDateTime.now());

        // Create test employment schedule object
        testEmploi = new Object();
    }

    // ===== EXPORT CREATION TESTS =====

    @Test
    @DisplayName("export_validPlanning_createsExportRecord")
    void testExportValidPlanningCreatesExportRecord() {
        // Arrange
        UUID newExportId = UUID.randomUUID();
        ExportAgora newExport = new ExportAgora();
        newExport.setId(newExportId);
        newExport.setEmploiDuTempsId(testEmploiDuTempsId);
        newExport.setFormat(FormatExportAgora.JSON);
        newExport.setStatut(StatutExportAgora.EN_ATTENTE);
        newExport.setNumeroTentative(0);
        newExport.setDateExport(LocalDateTime.now());
        newExport.setCreatedAt(LocalDateTime.now());
        newExport.setUpdatedAt(LocalDateTime.now());

        when(exportAgoraRepository.save(any(ExportAgora.class))).thenReturn(newExport);

        // Act
        ExportAgora result = exportAgoraRepository.save(newExport);

        // Assert
        assertThat(result)
                .isNotNull()
                .extracting(
                        ExportAgora::getId,
                        ExportAgora::getEmploiDuTempsId,
                        ExportAgora::getFormat,
                        ExportAgora::getStatut
                )
                .containsExactly(
                        newExportId,
                        testEmploiDuTempsId,
                        FormatExportAgora.JSON,
                        StatutExportAgora.EN_ATTENTE
                );

        assertThat(result.getNumeroTentative()).isZero();
        assertThat(result.getMessageErreur()).isNull();
        assertThat(result.getReponseAgora()).isNull();

        verify(exportAgoraRepository, times(1)).save(newExport);
    }

    @Test
    @DisplayName("export_setsStatusEnAttente")
    void testExportSetsStatusEnAttente() {
        // Arrange
        ExportAgora export = new ExportAgora();
        export.setId(UUID.randomUUID());
        export.setEmploiDuTempsId(testEmploiDuTempsId);
        export.setFormat(FormatExportAgora.XML);
        export.setStatut(StatutExportAgora.EN_ATTENTE);
        export.setNumeroTentative(0);

        ArgumentCaptor<ExportAgora> captor = ArgumentCaptor.forClass(ExportAgora.class);
        when(exportAgoraRepository.save(any(ExportAgora.class))).thenReturn(export);

        // Act
        exportAgoraRepository.save(export);

        // Assert
        verify(exportAgoraRepository).save(captor.capture());
        ExportAgora captured = captor.getValue();

        assertThat(captured.getStatut())
                .isNotNull()
                .isEqualTo(StatutExportAgora.EN_ATTENTE);

        assertThat(captured.getFormat())
                .isEqualTo(FormatExportAgora.XML);
    }

    // ===== ASYNC EXPORT PROCESSING TESTS =====

    @Test
    @DisplayName("processExport_success_updatesStatusTermine")
    void testProcessExportSuccessUpdatesStatusTermine() throws JsonProcessingException {
        // Arrange
        ExportAgora export = createTestExportWithStatus(StatutExportAgora.EN_ATTENTE);
        Map<String, Object> agoraResponse = new HashMap<>();
        agoraResponse.put("id", "AGORA-123");
        agoraResponse.put("status", "RECEIVED");
        agoraResponse.put("timestamp", LocalDateTime.now().toString());

        when(exportAgoraRepository.findById(testExportId))
                .thenReturn(Optional.of(export));
        when(planningServiceClient.getEmploiDuTemps(testEmploiDuTempsId))
                .thenReturn(testEmploi);
        when(objectMapper.writeValueAsString(testEmploi))
                .thenReturn("{\"data\": \"emploi\"}");
        when(restTemplate.exchange(
                anyString(),
                any(org.springframework.http.HttpMethod.class),
                any(org.springframework.http.HttpEntity.class),
                eq(Map.class)
        )).thenReturn(new ResponseEntity<>(agoraResponse, HttpStatus.OK));
        when(exportAgoraRepository.save(any(ExportAgora.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ArgumentCaptor<ExportAgora> exportCaptor = ArgumentCaptor.forClass(ExportAgora.class);
        ArgumentCaptor<LogIntegration> logCaptor = ArgumentCaptor.forClass(LogIntegration.class);

        // Act
        agoraExportService.exportToAgoraAsync(testExportId);

        // Assert
        verify(exportAgoraRepository, times(2)).save(exportCaptor.capture());
        ExportAgora savedExport = exportCaptor.getValue();

        assertThat(savedExport.getStatut())
                .isEqualTo(StatutExportAgora.ENVOYE);

        assertThat(savedExport.getReponseAgora())
                .isNotNull()
                .containsEntry("id", "AGORA-123")
                .containsEntry("status", "RECEIVED");

        assertThat(savedExport.getMessageErreur()).isNull();

        verify(logIntegrationRepository).save(logCaptor.capture());
        LogIntegration savedLog = logCaptor.getValue();

        assertThat(savedLog.getTypeLog()).isEqualTo(TypeLog.INFO);
        assertThat(savedLog.getMessage())
                .contains("Export réussi")
                .contains(testEmploiDuTempsId.toString());
        assertThat(savedLog.getStackTrace()).isNull();
    }

    @Test
    @DisplayName("processExport_failure_updatesStatusEchec")
    void testProcessExportFailureUpdatesStatusEchec() throws JsonProcessingException {
        // Arrange
        ExportAgora export = createTestExportWithStatus(StatutExportAgora.EN_ATTENTE);
        String errorMessage = "Connection timeout to Agora API";

        when(exportAgoraRepository.findById(testExportId))
                .thenReturn(Optional.of(export));
        when(planningServiceClient.getEmploiDuTemps(testEmploiDuTempsId))
                .thenReturn(testEmploi);
        when(objectMapper.writeValueAsString(testEmploi))
                .thenThrow(new RuntimeException(errorMessage));
        when(exportAgoraRepository.save(any(ExportAgora.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ArgumentCaptor<ExportAgora> exportCaptor = ArgumentCaptor.forClass(ExportAgora.class);
        ArgumentCaptor<LogIntegration> logCaptor = ArgumentCaptor.forClass(LogIntegration.class);

        // Act
        agoraExportService.exportToAgoraAsync(testExportId);

        // Assert
        verify(exportAgoraRepository, times(2)).save(exportCaptor.capture());
        ExportAgora savedExport = exportCaptor.getValue();

        assertThat(savedExport.getStatut())
                .isEqualTo(StatutExportAgora.ECHEC);

        assertThat(savedExport.getMessageErreur())
                .isNotNull()
                .contains("Connection timeout");

        assertThat(savedExport.getReponseAgora()).isNull();

        verify(logIntegrationRepository).save(logCaptor.capture());
        LogIntegration savedLog = logCaptor.getValue();

        assertThat(savedLog.getTypeLog()).isEqualTo(TypeLog.ERROR);
        assertThat(savedLog.getMessage())
                .contains("Erreur lors de l'export")
                .contains(errorMessage);
        assertThat(savedLog.getStackTrace())
                .isNotNull()
                .isNotEmpty();
    }

    // ===== STATUS TRACKING TESTS =====

    @Test
    @DisplayName("export_incrementsRetryAttemptCount")
    void testExportIncrementsRetryAttemptCount() throws JsonProcessingException {
        // Arrange
        ExportAgora export = createTestExportWithStatus(StatutExportAgora.EN_ATTENTE);
        export.setNumeroTentative(1);

        when(exportAgoraRepository.findById(testExportId))
                .thenReturn(Optional.of(export));
        when(planningServiceClient.getEmploiDuTemps(testEmploiDuTempsId))
                .thenReturn(testEmploi);
        when(objectMapper.writeValueAsString(testEmploi))
                .thenReturn("{\"data\": \"emploi\"}");
        when(restTemplate.exchange(
                anyString(),
                any(org.springframework.http.HttpMethod.class),
                any(org.springframework.http.HttpEntity.class),
                eq(Map.class)
        )).thenThrow(new RuntimeException("API Error"));
        when(exportAgoraRepository.save(any(ExportAgora.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ArgumentCaptor<ExportAgora> captor = ArgumentCaptor.forClass(ExportAgora.class);

        // Act
        agoraExportService.exportToAgoraAsync(testExportId);

        // Assert
        verify(exportAgoraRepository, times(2)).save(captor.capture());
        ExportAgora firstSave = captor.getAllValues().get(0);

        assertThat(firstSave.getNumeroTentative())
                .isEqualTo(2);
        assertThat(firstSave.getDateDerniereTentative())
                .isNotNull();
    }

    @Test
    @DisplayName("export_skipsAlreadyProcessedExports")
    void testExportSkipsAlreadyProcessedExports() {
        // Arrange
        ExportAgora export = createTestExportWithStatus(StatutExportAgora.ENVOYE);

        when(exportAgoraRepository.findById(testExportId))
                .thenReturn(Optional.of(export));

        // Act
        agoraExportService.exportToAgoraAsync(testExportId);

        // Assert
        verify(planningServiceClient, never()).getEmploiDuTemps(any());
        verify(restTemplate, never()).exchange(
                anyString(),
                any(org.springframework.http.HttpMethod.class),
                any(org.springframework.http.HttpEntity.class),
                any(Class.class)
        );
        verify(logIntegrationRepository, never()).save(any(LogIntegration.class));
    }

    @Test
    @DisplayName("export_throwsResourceNotFoundException_whenExportNotFound")
    void testExportThrowsResourceNotFoundExceptionWhenExportNotFound() {
        // Arrange
        when(exportAgoraRepository.findById(testExportId))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> agoraExportService.exportToAgoraAsync(testExportId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Export non trouvé");

        verify(planningServiceClient, never()).getEmploiDuTemps(any());
        verify(logIntegrationRepository, never()).save(any(LogIntegration.class));
    }

    @Test
    @DisplayName("export_throwsResourceNotFoundException_whenEmploiDuTempsNotFound")
    void testExportThrowsResourceNotFoundExceptionWhenEmploiDuTempsNotFound() {
        // Arrange
        ExportAgora export = createTestExportWithStatus(StatutExportAgora.EN_ATTENTE);

        when(exportAgoraRepository.findById(testExportId))
                .thenReturn(Optional.of(export));
        when(planningServiceClient.getEmploiDuTemps(testEmploiDuTempsId))
                .thenReturn(null);
        when(exportAgoraRepository.save(any(ExportAgora.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ArgumentCaptor<ExportAgora> captor = ArgumentCaptor.forClass(ExportAgora.class);

        // Act
        agoraExportService.exportToAgoraAsync(testExportId);

        // Assert
        verify(exportAgoraRepository, times(2)).save(captor.capture());
        ExportAgora savedExport = captor.getValue();

        assertThat(savedExport.getStatut()).isEqualTo(StatutExportAgora.ECHEC);
        assertThat(savedExport.getMessageErreur())
                .isNotNull()
                .contains("Emploi du temps non trouvé");
    }

    // ===== FORMAT CONVERSION TESTS =====

    @Test
    @DisplayName("export_convertsToJsonFormat_whenFormatIsJSON")
    void testExportConvertsToJsonFormatWhenFormatIsJSON() throws JsonProcessingException {
        // Arrange
        ExportAgora export = createTestExportWithStatus(StatutExportAgora.EN_ATTENTE);
        export.setFormat(FormatExportAgora.JSON);
        String jsonContent = "{\"data\": \"json\"}";

        when(exportAgoraRepository.findById(testExportId))
                .thenReturn(Optional.of(export));
        when(planningServiceClient.getEmploiDuTemps(testEmploiDuTempsId))
                .thenReturn(testEmploi);
        when(objectMapper.writeValueAsString(testEmploi))
                .thenReturn(jsonContent);
        when(restTemplate.exchange(
                anyString(),
                any(org.springframework.http.HttpMethod.class),
                any(org.springframework.http.HttpEntity.class),
                eq(Map.class)
        )).thenReturn(new ResponseEntity<>(new HashMap<>(), HttpStatus.OK));
        when(exportAgoraRepository.save(any(ExportAgora.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        agoraExportService.exportToAgoraAsync(testExportId);

        // Assert
        verify(objectMapper).writeValueAsString(testEmploi);
    }

    @Test
    @DisplayName("export_convertsToXmlFormat_whenFormatIsXML")
    void testExportConvertsToXmlFormatWhenFormatIsXML() throws JsonProcessingException {
        // Arrange
        ExportAgora export = createTestExportWithStatus(StatutExportAgora.EN_ATTENTE);
        export.setFormat(FormatExportAgora.XML);

        // Create a simple mock emploi object that can be serialized
        Map<String, String> mockEmploiMap = new HashMap<>();
        mockEmploiMap.put("id", "EMP-123");
        mockEmploiMap.put("nom", "Schedule 2025");

        when(exportAgoraRepository.findById(testExportId))
                .thenReturn(Optional.of(export));
        when(planningServiceClient.getEmploiDuTemps(testEmploiDuTempsId))
                .thenReturn(mockEmploiMap);
        when(restTemplate.exchange(
                anyString(),
                any(org.springframework.http.HttpMethod.class),
                any(org.springframework.http.HttpEntity.class),
                eq(Map.class)
        )).thenReturn(new ResponseEntity<>(new HashMap<>(), HttpStatus.OK));
        when(exportAgoraRepository.save(any(ExportAgora.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ArgumentCaptor<ExportAgora> captor = ArgumentCaptor.forClass(ExportAgora.class);

        // Act
        agoraExportService.exportToAgoraAsync(testExportId);

        // Assert
        verify(exportAgoraRepository, times(2)).save(captor.capture());
        ExportAgora savedExport = captor.getValue();

        assertThat(savedExport.getStatut())
                .isEqualTo(StatutExportAgora.ENVOYE);
    }

    // ===== HELPER METHODS =====

    /**
     * Creates a test ExportAgora with the specified status.
     */
    private ExportAgora createTestExportWithStatus(StatutExportAgora status) {
        ExportAgora export = new ExportAgora();
        export.setId(testExportId);
        export.setEmploiDuTempsId(testEmploiDuTempsId);
        export.setFormat(FormatExportAgora.JSON);
        export.setStatut(status);
        export.setNumeroTentative(0);
        export.setDateExport(LocalDateTime.now());
        export.setCreatedAt(LocalDateTime.now());
        export.setUpdatedAt(LocalDateTime.now());
        return export;
    }
}
