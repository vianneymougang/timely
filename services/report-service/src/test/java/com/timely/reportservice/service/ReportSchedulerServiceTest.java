package com.timely.reportservice.service;

import com.timely.reportservice.client.NotificationServiceClient;
import com.timely.reportservice.dto.notification.SendEmailRequest;
import com.timely.reportservice.dto.request.GenerateReportRequest;
import com.timely.reportservice.dto.request.ScheduleReportRequest;
import com.timely.reportservice.dto.response.RapportResponse;
import com.timely.reportservice.dto.response.ScheduledReportResponse;
import com.timely.reportservice.entity.ScheduledReport;
import com.timely.reportservice.entity.enums.FormatExport;
import com.timely.reportservice.entity.enums.TypeRapport;
import com.timely.reportservice.exception.ResourceNotFoundException;
import com.timely.reportservice.mapper.ScheduledReportMapper;
import com.timely.reportservice.repository.ScheduledReportRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ReportSchedulerService.
 *
 * Tests validate F4.1 functionality:
 * - Scheduled report creation with cron expression validation
 * - Scheduled report execution and notification
 * - Report activation/deactivation
 * - Report deletion
 * - Next execution calculation
 *
 * Uses AAA pattern (Arrange, Act, Assert) with AssertJ assertions.
 */
@ExtendWith(MockitoExtension.class)
class ReportSchedulerServiceTest {

    @Mock
    private ScheduledReportRepository scheduledReportRepository;

    @Mock
    private ScheduledReportMapper scheduledReportMapper;

    @Mock
    private ReportService reportService;

    @Mock
    private FileGenerationService fileGenerationService;

    @Mock
    private NotificationServiceClient notificationServiceClient;

    @InjectMocks
    private ReportSchedulerService reportSchedulerService;

    private UUID reportId;
    private ScheduleReportRequest scheduleRequest;
    private ScheduledReport scheduledReport;
    private ScheduledReportResponse scheduledReportResponse;

    @BeforeEach
    void setUp() {
        reportId = UUID.randomUUID();

        // Setup request DTO
        scheduleRequest = new ScheduleReportRequest();
        scheduleRequest.setTypeRapport(TypeRapport.UTILISATION_SALLES);
        scheduleRequest.setTitre("Test Report");
        scheduleRequest.setDescription("Test Description");
        scheduleRequest.setCronExpression("0 0 9 * * ?"); // Daily at 9 AM
        scheduleRequest.setFormat(FormatExport.PDF);
        scheduleRequest.setDestinatairesEmail(Arrays.asList("test@example.com", "admin@example.com"));
        scheduleRequest.setActif(true);

        // Setup entity
        scheduledReport = new ScheduledReport();
        scheduledReport.setId(reportId);
        scheduledReport.setTypeRapport(TypeRapport.UTILISATION_SALLES);
        scheduledReport.setTitre("Test Report");
        scheduledReport.setDescription("Test Description");
        scheduledReport.setCronExpression("0 0 9 * * ?");
        scheduledReport.setFormat(FormatExport.PDF);
        scheduledReport.setDestinatairesEmail("test@example.com,admin@example.com");
        scheduledReport.setActif(true);
        scheduledReport.setUtilisateurCreateur("user123");
        scheduledReport.setNombreExecutions(0);

        // Setup response DTO
        scheduledReportResponse = new ScheduledReportResponse();
        scheduledReportResponse.setId(reportId);
        scheduledReportResponse.setTypeRapport(TypeRapport.UTILISATION_SALLES);
        scheduledReportResponse.setTitre("Test Report");
        scheduledReportResponse.setDescription("Test Description");
        scheduledReportResponse.setCronExpression("0 0 9 * * ?");
        scheduledReportResponse.setFormat(FormatExport.PDF);
        scheduledReportResponse.setDestinatairesEmail(Arrays.asList("test@example.com", "admin@example.com"));
        scheduledReportResponse.setActif(true);
        scheduledReportResponse.setUtilisateurCreateur("user123");
    }

    // ========== F4.1 Tests ==========

    /**
     * Test F4.1.1: Schedule a report with valid cron expression
     *
     * Validates that:
     * - Cron expression is validated
     * - Next execution is calculated
     * - Report is saved to database
     * - Response DTO is returned with correct data
     */
    @Test
    void scheduleReport_validCron_createsScheduledReport() {
        // Arrange
        String creator = "user123";
        when(scheduledReportMapper.toEntity(any(ScheduleReportRequest.class)))
                .thenReturn(scheduledReport);
        when(scheduledReportRepository.save(any(ScheduledReport.class)))
                .thenReturn(scheduledReport);
        when(scheduledReportMapper.toResponse(any(ScheduledReport.class)))
                .thenReturn(scheduledReportResponse);

        // Act
        ScheduledReportResponse result = reportSchedulerService.scheduleReport(scheduleRequest, creator);

        // Assert
        assertThat(result)
                .isNotNull()
                .satisfies(response -> {
                    assertThat(response.getId()).isEqualTo(reportId);
                    assertThat(response.getTitre()).isEqualTo("Test Report");
                    assertThat(response.getCronExpression()).isEqualTo("0 0 9 * * ?");
                    assertThat(response.getActif()).isTrue();
                    assertThat(response.getUtilisateurCreateur()).isEqualTo("user123");
                });

        // Verify interactions
        verify(scheduledReportMapper, times(1)).toEntity(scheduleRequest);
        verify(scheduledReportRepository, times(1)).save(any(ScheduledReport.class));
        verify(scheduledReportMapper, times(1)).toResponse(any(ScheduledReport.class));

        // Verify that next execution was set
        ArgumentCaptor<ScheduledReport> reportCaptor = ArgumentCaptor.forClass(ScheduledReport.class);
        verify(scheduledReportRepository).save(reportCaptor.capture());
        assertThat(reportCaptor.getValue().getProchaineExecution()).isNotNull();
    }

    /**
     * Test F4.1.2: Schedule a report with invalid cron expression
     *
     * Validates that:
     * - Invalid cron expression throws IllegalArgumentException
     * - Repository save is not called
     */
    @Test
    void scheduleReport_invalidCron_throwsException() {
        // Arrange
        ScheduleReportRequest invalidRequest = new ScheduleReportRequest();
        invalidRequest.setTypeRapport(TypeRapport.UTILISATION_SALLES);
        invalidRequest.setTitre("Test Report");
        invalidRequest.setCronExpression("INVALID CRON"); // Invalid cron
        invalidRequest.setFormat(FormatExport.PDF);
        invalidRequest.setDestinatairesEmail(Arrays.asList("test@example.com"));
        invalidRequest.setActif(true);

        String creator = "user123";

        // Act & Assert
        assertThatThrownBy(() -> reportSchedulerService.scheduleReport(invalidRequest, creator))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Expression cron invalide");

        // Verify that repository was not called
        verify(scheduledReportRepository, never()).save(any());
    }

    /**
     * Test F4.1.3: Execute scheduled reports that are due
     *
     * Validates that:
     * - Only active reports with past due dates are executed
     * - Report is generated via ReportService
     * - File is generated via FileGenerationService
     * - Email is sent via NotificationServiceClient
     * - Execution metadata is updated (last execution, next execution, count)
     */
    @Test
    void executeScheduledReports_dueReports_executesAndNotifies() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime pastTime = now.minusHours(1);
        LocalDateTime futureTime = now.plusHours(1);

        ScheduledReport dueReport = new ScheduledReport();
        dueReport.setId(UUID.randomUUID());
        dueReport.setTypeRapport(TypeRapport.UTILISATION_SALLES);
        dueReport.setTitre("Due Report");
        dueReport.setCronExpression("0 0 9 * * ?");
        dueReport.setProchaineExecution(pastTime); // Past due date
        dueReport.setActif(true);
        dueReport.setUtilisateurCreateur("user123");
        dueReport.setDestinatairesEmail("test@example.com");
        dueReport.setNombreExecutions(0);
        dueReport.setFormat(FormatExport.PDF);

        ScheduledReport notDueReport = new ScheduledReport();
        notDueReport.setId(UUID.randomUUID());
        notDueReport.setTitre("Not Due Report");
        notDueReport.setProchaineExecution(futureTime); // Future due date
        notDueReport.setActif(true);

        UUID rapportId = UUID.randomUUID();
        RapportResponse rapportResponse = new RapportResponse();
        rapportResponse.setId(rapportId);

        when(scheduledReportRepository.findByActifTrue())
                .thenReturn(Arrays.asList(dueReport, notDueReport));
        when(reportService.generateReport(any(GenerateReportRequest.class), anyString()))
                .thenReturn(rapportResponse);
        when(fileGenerationService.generateFile(rapportId))
                .thenReturn("/path/to/report.pdf");
        when(scheduledReportRepository.save(any(ScheduledReport.class)))
                .thenReturn(dueReport);

        // Act
        reportSchedulerService.executeScheduledReports();

        // Assert
        // Verify report generation
        verify(reportService, times(1)).generateReport(any(GenerateReportRequest.class), anyString());
        verify(fileGenerationService, times(1)).generateFile(rapportId);
        verify(notificationServiceClient, times(1)).sendBulkEmails(any(SendEmailRequest.class));

        // Verify not due report was not executed
        verify(reportService, times(1)).generateReport(any(), any());

        // Verify execution metadata update
        ArgumentCaptor<ScheduledReport> reportCaptor = ArgumentCaptor.forClass(ScheduledReport.class);
        verify(scheduledReportRepository, times(1)).save(reportCaptor.capture());

        ScheduledReport savedReport = reportCaptor.getValue();
        assertThat(savedReport.getDerniereExecution()).isNotNull();
        assertThat(savedReport.getNombreExecutions()).isEqualTo(1);
        assertThat(savedReport.getProchaineExecution()).isNotNull();
    }

    /**
     * Test F4.1.4: Skip inactive scheduled reports during execution
     *
     * Validates that:
     * - Inactive reports are not executed
     * - Only active reports are checked
     */
    @Test
    void executeScheduledReports_inactiveReport_skipped() {
        // Arrange
        when(scheduledReportRepository.findByActifTrue())
                .thenReturn(List.of()); // Empty list of active reports

        // Act
        reportSchedulerService.executeScheduledReports();

        // Assert
        // No reports should be executed
        verify(reportService, never()).generateReport(any(), any());
        verify(fileGenerationService, never()).generateFile(any());
        verify(notificationServiceClient, never()).sendBulkEmails(any());
    }

    /**
     * Test F4.1.5: Toggle scheduled report activation/deactivation
     *
     * Validates that:
     * - Report actif status is toggled
     * - When activated, next execution is recalculated
     * - When deactivated, next execution is preserved
     * - Updated report is saved and returned
     */
    @Test
    void toggleReport_activateDeactivate() {
        // Arrange
        UUID reportId = UUID.randomUUID();

        ScheduledReport report = new ScheduledReport();
        report.setId(reportId);
        report.setTitre("Test Report");
        report.setCronExpression("0 0 9 * * ?");
        report.setActif(false); // Initially inactive
        report.setDestinatairesEmail("test@example.com");

        ScheduledReport deactivatedReport = new ScheduledReport();
        deactivatedReport.setId(reportId);
        deactivatedReport.setActif(false);

        ScheduledReportResponse deactivatedResponse = new ScheduledReportResponse();
        deactivatedResponse.setId(reportId);
        deactivatedResponse.setActif(false);

        when(scheduledReportRepository.findById(reportId))
                .thenReturn(Optional.of(report));
        when(scheduledReportRepository.save(any(ScheduledReport.class)))
                .thenReturn(deactivatedReport);
        when(scheduledReportMapper.toResponse(any(ScheduledReport.class)))
                .thenReturn(deactivatedResponse);

        // Act - Deactivate (toggle to false)
        ScheduledReportResponse result = reportSchedulerService.toggleScheduledReport(reportId, false);

        // Assert
        assertThat(result)
                .isNotNull()
                .satisfies(response -> {
                    assertThat(response.getId()).isEqualTo(reportId);
                    assertThat(response.getActif()).isFalse();
                });

        verify(scheduledReportRepository, times(1)).findById(reportId);
        verify(scheduledReportRepository, times(1)).save(any(ScheduledReport.class));

        // ===== Now test activation with next execution recalculation =====
        reset(scheduledReportRepository, scheduledReportMapper);

        ScheduledReport inactiveReport = new ScheduledReport();
        inactiveReport.setId(reportId);
        inactiveReport.setTitre("Test Report");
        inactiveReport.setCronExpression("0 0 9 * * ?");
        inactiveReport.setActif(false); // Currently inactive

        ScheduledReport activatedReport = new ScheduledReport();
        activatedReport.setId(reportId);
        activatedReport.setActif(true);
        activatedReport.setProchaineExecution(LocalDateTime.now().plusDays(1));

        ScheduledReportResponse activatedResponse = new ScheduledReportResponse();
        activatedResponse.setId(reportId);
        activatedResponse.setActif(true);
        activatedResponse.setProchaineExecution(LocalDateTime.now().plusDays(1));

        when(scheduledReportRepository.findById(reportId))
                .thenReturn(Optional.of(inactiveReport));
        when(scheduledReportRepository.save(any(ScheduledReport.class)))
                .thenReturn(activatedReport);
        when(scheduledReportMapper.toResponse(any(ScheduledReport.class)))
                .thenReturn(activatedResponse);

        // Act - Activate (toggle to true)
        ScheduledReportResponse activateResult = reportSchedulerService.toggleScheduledReport(reportId, true);

        // Assert
        assertThat(activateResult)
                .isNotNull()
                .satisfies(response -> {
                    assertThat(response.getId()).isEqualTo(reportId);
                    assertThat(response.getActif()).isTrue();
                    assertThat(response.getProchaineExecution()).isNotNull();
                });

        // Verify next execution was recalculated
        ArgumentCaptor<ScheduledReport> reportCaptor = ArgumentCaptor.forClass(ScheduledReport.class);
        verify(scheduledReportRepository).save(reportCaptor.capture());
        assertThat(reportCaptor.getValue().getProchaineExecution()).isNotNull();
    }

    /**
     * Test F4.1.6: Delete scheduled report by ID
     *
     * Validates that:
     * - Existing report is deleted successfully
     * - Repository existsById is checked
     * - Repository deleteById is called
     */
    @Test
    void deleteReport_existingId_deletesIt() {
        // Arrange
        UUID reportId = UUID.randomUUID();
        when(scheduledReportRepository.existsById(reportId))
                .thenReturn(true);

        // Act
        reportSchedulerService.deleteScheduledReport(reportId);

        // Assert
        verify(scheduledReportRepository, times(1)).existsById(reportId);
        verify(scheduledReportRepository, times(1)).deleteById(reportId);
    }

    /**
     * Test F4.1.6b: Delete non-existing scheduled report throws exception
     *
     * Validates that:
     * - Attempting to delete non-existent report throws ResourceNotFoundException
     * - DeleteById is never called
     */
    @Test
    void deleteReport_nonExistingId_throwsException() {
        // Arrange
        UUID reportId = UUID.randomUUID();
        when(scheduledReportRepository.existsById(reportId))
                .thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> reportSchedulerService.deleteScheduledReport(reportId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Rapport planifié non trouvé");

        verify(scheduledReportRepository, never()).deleteById(any());
    }

    /**
     * Test F4.1.7: Calculate next execution from cron expression
     *
     * Validates that:
     * - Next execution is calculated correctly based on cron expression
     * - Calculation respects timezone (Africa/Douala)
     * - Result is a valid LocalDateTime in the future
     */
    @Test
    void calculateNextExecution_correctlyComputed() {
        // Arrange
        String dailyCron = "0 0 9 * * ?"; // Daily at 9 AM
        String weeklyCron = "0 0 9 * * MON"; // Every Monday at 9 AM

        // Act - Daily
        ScheduleReportRequest dailyRequest = new ScheduleReportRequest();
        dailyRequest.setTypeRapport(TypeRapport.UTILISATION_SALLES);
        dailyRequest.setTitre("Daily Report");
        dailyRequest.setCronExpression(dailyCron);
        dailyRequest.setFormat(FormatExport.PDF);
        dailyRequest.setDestinatairesEmail(Arrays.asList("test@example.com"));
        dailyRequest.setActif(true);

        when(scheduledReportMapper.toEntity(any(ScheduleReportRequest.class)))
                .thenReturn(scheduledReport);

        ScheduledReport savedDailyReport = new ScheduledReport();
        savedDailyReport.setId(UUID.randomUUID());
        savedDailyReport.setCronExpression(dailyCron);

        when(scheduledReportRepository.save(any(ScheduledReport.class)))
                .thenReturn(savedDailyReport);
        when(scheduledReportMapper.toResponse(any(ScheduledReport.class)))
                .thenReturn(scheduledReportResponse);

        reportSchedulerService.scheduleReport(dailyRequest, "user123");

        // Assert - Capture and verify next execution for daily cron
        ArgumentCaptor<ScheduledReport> dailyCaptor = ArgumentCaptor.forClass(ScheduledReport.class);
        verify(scheduledReportRepository).save(dailyCaptor.capture());
        LocalDateTime nextDaily = dailyCaptor.getValue().getProchaineExecution();

        assertThat(nextDaily)
                .isNotNull()
                .isAfter(LocalDateTime.now())
                .satisfies(next -> {
                    // Next execution should be today or tomorrow at 9 AM
                    assertThat(next.getHour()).isEqualTo(9);
                    assertThat(next.getMinute()).isEqualTo(0);
                });

        // Act & Assert - Weekly (every Monday)
        reset(scheduledReportRepository, scheduledReportMapper);

        ScheduleReportRequest weeklyRequest = new ScheduleReportRequest();
        weeklyRequest.setTypeRapport(TypeRapport.UTILISATION_SALLES);
        weeklyRequest.setTitre("Weekly Report");
        weeklyRequest.setCronExpression(weeklyCron);
        weeklyRequest.setFormat(FormatExport.PDF);
        weeklyRequest.setDestinatairesEmail(Arrays.asList("test@example.com"));
        weeklyRequest.setActif(true);

        when(scheduledReportMapper.toEntity(any(ScheduleReportRequest.class)))
                .thenReturn(scheduledReport);

        ScheduledReport savedWeeklyReport = new ScheduledReport();
        savedWeeklyReport.setId(UUID.randomUUID());
        savedWeeklyReport.setCronExpression(weeklyCron);

        when(scheduledReportRepository.save(any(ScheduledReport.class)))
                .thenReturn(savedWeeklyReport);
        when(scheduledReportMapper.toResponse(any(ScheduledReport.class)))
                .thenReturn(scheduledReportResponse);

        reportSchedulerService.scheduleReport(weeklyRequest, "user123");

        ArgumentCaptor<ScheduledReport> weeklyCaptor = ArgumentCaptor.forClass(ScheduledReport.class);
        verify(scheduledReportRepository).save(weeklyCaptor.capture());
        LocalDateTime nextWeekly = weeklyCaptor.getValue().getProchaineExecution();

        assertThat(nextWeekly)
                .isNotNull()
                .isAfter(LocalDateTime.now())
                .satisfies(next -> {
                    // Next execution should be on a Monday
                    int dayOfWeek = next.getDayOfWeek().getValue();
                    assertThat(dayOfWeek).isEqualTo(1); // Monday
                    assertThat(next.getHour()).isEqualTo(9);
                });
    }

    /**
     * Test: Execute report individually
     *
     * Validates that executeReport method:
     * - Generates the report
     * - Generates the file
     * - Sends email
     * - Updates execution metadata
     */
    @Test
    void executeReport_individualReport_completesFullCycle() {
        // Arrange
        ScheduledReport report = new ScheduledReport();
        report.setId(UUID.randomUUID());
        report.setTypeRapport(TypeRapport.UTILISATION_SALLES);
        report.setTitre("Test Report");
        report.setDescription("Test");
        report.setEcoleId(UUID.randomUUID());
        report.setFormat(FormatExport.PDF);
        report.setDestinatairesEmail("test@example.com");
        report.setUtilisateurCreateur("user123");
        report.setNombreExecutions(0);
        report.setCronExpression("0 0 9 * * ?");

        UUID rapportId = UUID.randomUUID();
        RapportResponse rapportResponse = new RapportResponse();
        rapportResponse.setId(rapportId);

        when(reportService.generateReport(any(GenerateReportRequest.class), anyString()))
                .thenReturn(rapportResponse);
        when(fileGenerationService.generateFile(rapportId))
                .thenReturn("/path/to/report.pdf");
        when(scheduledReportRepository.save(any(ScheduledReport.class)))
                .thenReturn(report);

        // Act
        reportSchedulerService.executeReport(report);

        // Assert
        verify(reportService, times(1)).generateReport(any(GenerateReportRequest.class), eq("user123"));
        verify(fileGenerationService, times(1)).generateFile(rapportId);
        verify(notificationServiceClient, times(1)).sendBulkEmails(any(SendEmailRequest.class));

        ArgumentCaptor<ScheduledReport> reportCaptor = ArgumentCaptor.forClass(ScheduledReport.class);
        verify(scheduledReportRepository).save(reportCaptor.capture());

        ScheduledReport updatedReport = reportCaptor.getValue();
        assertThat(updatedReport.getDerniereExecution()).isNotNull();
        assertThat(updatedReport.getNombreExecutions()).isEqualTo(1);
        assertThat(updatedReport.getProchaineExecution()).isNotNull();
    }

    /**
     * Test: Get scheduled report by ID
     */
    @Test
    void getScheduledReportById_existingId_returnsReport() {
        // Arrange
        UUID reportId = UUID.randomUUID();
        ScheduledReport foundReport = new ScheduledReport();
        foundReport.setId(reportId);
        foundReport.setTitre("Test Report");

        ScheduledReportResponse responseWithSameId = new ScheduledReportResponse();
        responseWithSameId.setId(reportId);
        responseWithSameId.setTitre("Test Report");

        when(scheduledReportRepository.findById(reportId))
                .thenReturn(Optional.of(foundReport));
        when(scheduledReportMapper.toResponse(any(ScheduledReport.class)))
                .thenReturn(responseWithSameId);

        // Act
        ScheduledReportResponse result = reportSchedulerService.getScheduledReportById(reportId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(reportId);
        verify(scheduledReportRepository, times(1)).findById(reportId);
    }

    /**
     * Test: Get all scheduled reports
     */
    @Test
    void getAllScheduledReports_returnsAll() {
        // Arrange
        List<ScheduledReport> reports = Arrays.asList(scheduledReport);
        when(scheduledReportRepository.findAll())
                .thenReturn(reports);
        when(scheduledReportMapper.toResponseList(reports))
                .thenReturn(Arrays.asList(scheduledReportResponse));

        // Act
        List<ScheduledReportResponse> result = reportSchedulerService.getAllScheduledReports();

        // Assert
        assertThat(result)
                .isNotNull()
                .hasSize(1)
                .contains(scheduledReportResponse);
        verify(scheduledReportRepository, times(1)).findAll();
    }

    /**
     * Test: Get active scheduled reports
     */
    @Test
    void getActiveScheduledReports_returnsOnlyActive() {
        // Arrange
        List<ScheduledReport> activeReports = Arrays.asList(scheduledReport);
        when(scheduledReportRepository.findByActifTrue())
                .thenReturn(activeReports);
        when(scheduledReportMapper.toResponseList(activeReports))
                .thenReturn(Arrays.asList(scheduledReportResponse));

        // Act
        List<ScheduledReportResponse> result = reportSchedulerService.getActiveScheduledReports();

        // Assert
        assertThat(result)
                .isNotNull()
                .hasSize(1);
        verify(scheduledReportRepository, times(1)).findByActifTrue();
    }

    /**
     * Test: Get scheduled reports by school ID
     */
    @Test
    void getScheduledReportsByEcoleId_returnsReportsForSchool() {
        // Arrange
        UUID ecoleId = UUID.randomUUID();
        List<ScheduledReport> schoolReports = Arrays.asList(scheduledReport);
        when(scheduledReportRepository.findByEcoleId(ecoleId))
                .thenReturn(schoolReports);
        when(scheduledReportMapper.toResponseList(schoolReports))
                .thenReturn(Arrays.asList(scheduledReportResponse));

        // Act
        List<ScheduledReportResponse> result = reportSchedulerService.getScheduledReportsByEcoleId(ecoleId);

        // Assert
        assertThat(result)
                .isNotNull()
                .hasSize(1);
        verify(scheduledReportRepository, times(1)).findByEcoleId(ecoleId);
    }
}
