package com.timely.planningservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.timely.planningservice.entity.Creneau;
import com.timely.planningservice.entity.EmploiDuTemps;
import com.timely.planningservice.entity.enums.PeriodeEmploi;
import com.timely.planningservice.entity.enums.StatutCreneau;
import com.timely.planningservice.entity.enums.StatutEmploi;
import com.timely.planningservice.entity.enums.TypeRecurrence;
import com.timely.planningservice.exception.ResourceNotFoundException;
import com.timely.planningservice.repository.EmploiDuTempsRepository;

/**
 * Unit tests for PdfExportService.
 *
 * Tests PDF export functionality (F3.2) including:
 * - Valid planning export to PDF bytes
 * - Empty planning handling
 * - Week grid organization
 * - Error handling for non-existent planning
 *
 * Uses AAA (Arrange-Act-Assert) pattern with AssertJ assertions.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("PdfExportService Unit Tests")
class PdfExportServiceTest {

    @Mock
    private EmploiDuTempsRepository emploiDuTempsRepository;

    @Mock
    private PlanningDataEnricher dataEnricher;

    @Mock
    private TemplateEngine templateEngine;

    @InjectMocks
    private PdfExportService pdfExportService;

    @Captor
    private ArgumentCaptor<Context> contextCaptor;

    private UUID emploiId;
    private UUID ecoleId;
    private EmploiDuTemps emploiDuTemps;

    @BeforeEach
    void setUp() {
        emploiId = UUID.randomUUID();
        ecoleId = UUID.randomUUID();

        // Create base EmploiDuTemps entity
        emploiDuTemps = new EmploiDuTemps(
                ecoleId,
                LocalDate.of(2026, 2, 10),
                LocalDate.of(2026, 2, 16),
                PeriodeEmploi.SEMAINE
        );
        emploiDuTemps.setId(emploiId);
        emploiDuTemps.setStatut(StatutEmploi.PUBLISHED);
    }

    @Test
    @DisplayName("export_validPlanning_returnsPdfBytes - Should export valid planning to PDF successfully")
    void export_validPlanning_returnsPdfBytes() {
        // Arrange
        Creneau creneau1 = createCreneau(emploiDuTemps, DayOfWeek.MONDAY,
                LocalTime.of(8, 0), LocalTime.of(10, 0));
        Creneau creneau2 = createCreneau(emploiDuTemps, DayOfWeek.TUESDAY,
                LocalTime.of(10, 0), LocalTime.of(12, 0));

        emploiDuTemps.getCreneaux().add(creneau1);
        emploiDuTemps.getCreneaux().add(creneau2);

        // Create enriched data
        List<PlanningDataEnricher.EnrichedCreneau> enrichedCreneaux = List.of(
                new PlanningDataEnricher.EnrichedCreneau(
                        creneau1.getId(),
                        DayOfWeek.MONDAY,
                        LocalTime.of(8, 0),
                        LocalTime.of(10, 0),
                        "Algorithmique",
                        "CM",
                        "Prof. Martin Dupont",
                        "A101",
                        "Groupe 1"
                ),
                new PlanningDataEnricher.EnrichedCreneau(
                        creneau2.getId(),
                        DayOfWeek.TUESDAY,
                        LocalTime.of(10, 0),
                        LocalTime.of(12, 0),
                        "Base de données",
                        "TP",
                        "Prof. Sophie Bernard",
                        "B202",
                        "Groupe 1"
                )
        );

        PlanningDataEnricher.EnrichedPlanningData enrichedData =
                new PlanningDataEnricher.EnrichedPlanningData(emploiDuTemps, enrichedCreneaux);

        // Mock HTML with valid XHTML structure for OpenHTMLToPDF
        String mockHtml = """
                <!DOCTYPE html>
                <html>
                <head><title>Planning</title></head>
                <body>
                    <h1>Emploi du temps</h1>
                    <p>Période: SEMAINE</p>
                    <p>Du 2026-02-10 au 2026-02-16</p>
                </body>
                </html>
                """;

        when(emploiDuTempsRepository.findById(emploiId)).thenReturn(Optional.of(emploiDuTemps));
        when(dataEnricher.enrichEmploiDuTemps(emploiDuTemps)).thenReturn(enrichedData);
        when(templateEngine.process(eq("planning-pdf"), any(Context.class))).thenReturn(mockHtml);

        // Act
        byte[] pdfBytes = pdfExportService.exportToPdf(emploiId);

        // Assert
        assertThat(pdfBytes)
                .as("PDF bytes should not be null")
                .isNotNull();
        assertThat(pdfBytes)
                .as("PDF bytes should not be empty")
                .isNotEmpty();
        assertThat(pdfBytes)
                .as("PDF should start with PDF header")
                .startsWith("%PDF".getBytes());

        // Verify repository was called
        verify(emploiDuTempsRepository, times(1)).findById(emploiId);

        // Verify enrichment was called
        verify(dataEnricher, times(1)).enrichEmploiDuTemps(emploiDuTemps);

        // Verify template engine was called with correct data
        verify(templateEngine, times(1)).process(eq("planning-pdf"), contextCaptor.capture());

        Context capturedContext = contextCaptor.getValue();
        assertThat(capturedContext.getVariable("periode")).isEqualTo("SEMAINE");
        assertThat(capturedContext.getVariable("dateDebut")).isEqualTo(LocalDate.of(2026, 2, 10));
        assertThat(capturedContext.getVariable("dateFin")).isEqualTo(LocalDate.of(2026, 2, 16));
        assertThat(capturedContext.getVariable("timeSlots")).isNotNull();
        assertThat(capturedContext.getVariable("days")).isNotNull();
    }

    @Test
    @DisplayName("export_emptyPlanning_returnsPdfWithEmptyGrid - Should handle empty planning gracefully")
    void export_emptyPlanning_returnsPdfWithEmptyGrid() {
        // Arrange
        // EmploiDuTemps with no creneaux
        emploiDuTemps.getCreneaux().clear();

        // Create enriched data with empty creneaux list
        List<PlanningDataEnricher.EnrichedCreneau> enrichedCreneaux = new ArrayList<>();
        PlanningDataEnricher.EnrichedPlanningData enrichedData =
                new PlanningDataEnricher.EnrichedPlanningData(emploiDuTemps, enrichedCreneaux);

        String mockHtml = """
                <!DOCTYPE html>
                <html>
                <head><title>Planning</title></head>
                <body>
                    <h1>Emploi du temps vide</h1>
                    <p>Aucun créneau disponible</p>
                </body>
                </html>
                """;

        when(emploiDuTempsRepository.findById(emploiId)).thenReturn(Optional.of(emploiDuTemps));
        when(dataEnricher.enrichEmploiDuTemps(emploiDuTemps)).thenReturn(enrichedData);
        when(templateEngine.process(eq("planning-pdf"), any(Context.class))).thenReturn(mockHtml);

        // Act
        byte[] pdfBytes = pdfExportService.exportToPdf(emploiId);

        // Assert
        assertThat(pdfBytes)
                .as("PDF should be generated even with empty planning")
                .isNotNull()
                .isNotEmpty();
        assertThat(pdfBytes)
                .as("PDF should have valid PDF header")
                .startsWith("%PDF".getBytes());

        // Verify template was called with empty timeSlots
        verify(templateEngine, times(1)).process(eq("planning-pdf"), contextCaptor.capture());

        Context capturedContext = contextCaptor.getValue();
        @SuppressWarnings("unchecked")
        List<PdfExportService.TimeSlotRow> timeSlots =
                (List<PdfExportService.TimeSlotRow>) capturedContext.getVariable("timeSlots");

        assertThat(timeSlots)
                .as("TimeSlots should be empty for empty planning")
                .isEmpty();
    }

    @Test
    @DisplayName("export_organizesIntoWeekGrid - Should correctly organize creneaux into week grid structure")
    void export_organizesIntoWeekGrid() {
        // Arrange
        // Create multiple creneaux across different days and time slots
        Creneau creneau1 = createCreneau(emploiDuTemps, DayOfWeek.MONDAY,
                LocalTime.of(8, 0), LocalTime.of(10, 0));
        Creneau creneau2 = createCreneau(emploiDuTemps, DayOfWeek.MONDAY,
                LocalTime.of(10, 0), LocalTime.of(12, 0));
        Creneau creneau3 = createCreneau(emploiDuTemps, DayOfWeek.WEDNESDAY,
                LocalTime.of(8, 0), LocalTime.of(10, 0));
        Creneau creneau4 = createCreneau(emploiDuTemps, DayOfWeek.FRIDAY,
                LocalTime.of(14, 0), LocalTime.of(16, 0));

        emploiDuTemps.getCreneaux().addAll(List.of(creneau1, creneau2, creneau3, creneau4));

        // Create enriched data
        List<PlanningDataEnricher.EnrichedCreneau> enrichedCreneaux = List.of(
                new PlanningDataEnricher.EnrichedCreneau(
                        creneau1.getId(), DayOfWeek.MONDAY,
                        LocalTime.of(8, 0), LocalTime.of(10, 0),
                        "Algorithmique", "CM", "Prof. Martin", "A101", "Groupe 1"
                ),
                new PlanningDataEnricher.EnrichedCreneau(
                        creneau2.getId(), DayOfWeek.MONDAY,
                        LocalTime.of(10, 0), LocalTime.of(12, 0),
                        "Base de données", "TP", "Prof. Sophie", "B202", "Groupe 1"
                ),
                new PlanningDataEnricher.EnrichedCreneau(
                        creneau3.getId(), DayOfWeek.WEDNESDAY,
                        LocalTime.of(8, 0), LocalTime.of(10, 0),
                        "Réseaux", "TD", "Prof. Jean", "C303", "Groupe 2"
                ),
                new PlanningDataEnricher.EnrichedCreneau(
                        creneau4.getId(), DayOfWeek.FRIDAY,
                        LocalTime.of(14, 0), LocalTime.of(16, 0),
                        "Programmation", "TP", "Prof. Marie", "D404", "Groupe 1"
                )
        );

        PlanningDataEnricher.EnrichedPlanningData enrichedData =
                new PlanningDataEnricher.EnrichedPlanningData(emploiDuTemps, enrichedCreneaux);

        String mockHtml = """
                <!DOCTYPE html>
                <html>
                <head><title>Planning</title></head>
                <body><h1>Planning avec grille</h1></body>
                </html>
                """;

        when(emploiDuTempsRepository.findById(emploiId)).thenReturn(Optional.of(emploiDuTemps));
        when(dataEnricher.enrichEmploiDuTemps(emploiDuTemps)).thenReturn(enrichedData);
        when(templateEngine.process(eq("planning-pdf"), any(Context.class))).thenReturn(mockHtml);

        // Act
        byte[] pdfBytes = pdfExportService.exportToPdf(emploiId);

        // Assert
        assertThat(pdfBytes).isNotNull().isNotEmpty();

        // Verify the grid organization in the template context
        verify(templateEngine, times(1)).process(eq("planning-pdf"), contextCaptor.capture());

        Context capturedContext = contextCaptor.getValue();
        @SuppressWarnings("unchecked")
        List<PdfExportService.TimeSlotRow> timeSlots =
                (List<PdfExportService.TimeSlotRow>) capturedContext.getVariable("timeSlots");

        assertThat(timeSlots)
                .as("Should have 3 unique time slots (8-10, 10-12, 14-16)")
                .hasSize(3);

        // Verify time slots are sorted chronologically
        PdfExportService.TimeSlotRow firstSlot = timeSlots.get(0);
        assertThat(firstSlot.time)
                .as("First time slot should be 08:00 - 10:00")
                .isEqualTo("08:00 - 10:00");

        PdfExportService.TimeSlotRow secondSlot = timeSlots.get(1);
        assertThat(secondSlot.time)
                .as("Second time slot should be 10:00 - 12:00")
                .isEqualTo("10:00 - 12:00");

        PdfExportService.TimeSlotRow thirdSlot = timeSlots.get(2);
        assertThat(thirdSlot.time)
                .as("Third time slot should be 14:00 - 16:00")
                .isEqualTo("14:00 - 16:00");

        // Verify grid cells for 08:00 - 10:00 slot
        PdfExportService.GridCell mondayCell = firstSlot.getCreneauForDay("MONDAY");
        assertThat(mondayCell)
                .as("Monday 8-10 should have a course")
                .isNotNull();
        assertThat(mondayCell.getCoursIntitule())
                .as("Monday 8-10 should be Algorithmique")
                .isEqualTo("Algorithmique");
        assertThat(mondayCell.getEnseignantNom())
                .as("Should have correct professor")
                .isEqualTo("Prof. Martin");
        assertThat(mondayCell.getSalleNumero())
                .as("Should have correct room")
                .isEqualTo("A101");
        assertThat(mondayCell.getTypeCours())
                .as("Should have correct course type (lowercase)")
                .isEqualTo("cm");

        PdfExportService.GridCell wednesdayCell = firstSlot.getCreneauForDay("WEDNESDAY");
        assertThat(wednesdayCell)
                .as("Wednesday 8-10 should have a course")
                .isNotNull();
        assertThat(wednesdayCell.getCoursIntitule())
                .as("Wednesday 8-10 should be Réseaux")
                .isEqualTo("Réseaux");

        PdfExportService.GridCell tuesdayCell = firstSlot.getCreneauForDay("TUESDAY");
        assertThat(tuesdayCell)
                .as("Tuesday 8-10 should be empty")
                .isNull();

        // Verify grid cells for 14:00 - 16:00 slot (only Friday has a course)
        PdfExportService.GridCell fridayCell = thirdSlot.getCreneauForDay("FRIDAY");
        assertThat(fridayCell)
                .as("Friday 14-16 should have a course")
                .isNotNull();
        assertThat(fridayCell.getCoursIntitule())
                .as("Friday 14-16 should be Programmation")
                .isEqualTo("Programmation");

        PdfExportService.GridCell mondayCellAfternoon = thirdSlot.getCreneauForDay("MONDAY");
        assertThat(mondayCellAfternoon)
                .as("Monday 14-16 should be empty")
                .isNull();

        // Verify all days are present in context
        @SuppressWarnings("unchecked")
        List<String> days = (List<String>) capturedContext.getVariable("days");
        assertThat(days)
                .as("Should include all weekdays from Monday to Saturday")
                .containsExactly("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY");
    }

    @Test
    @DisplayName("export_planningNotFound_throwsException - Should throw ResourceNotFoundException for non-existent planning")
    void export_planningNotFound_throwsException() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();

        when(emploiDuTempsRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> pdfExportService.exportToPdf(nonExistentId))
                .as("Should throw ResourceNotFoundException when planning not found")
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("EmploiDuTemps not found with id: " + nonExistentId);

        // Verify repository was called
        verify(emploiDuTempsRepository, times(1)).findById(nonExistentId);

        // Verify enricher and template engine were NOT called
        verify(dataEnricher, times(0)).enrichEmploiDuTemps(any());
        verify(templateEngine, times(0)).process(any(String.class), any(Context.class));
    }

    // Helper method to create Creneau entities
    private Creneau createCreneau(EmploiDuTemps emploi, DayOfWeek day, LocalTime debut, LocalTime fin) {
        Creneau creneau = new Creneau(emploi, day, debut, fin, TypeRecurrence.HEBDOMADAIRE);
        creneau.setId(UUID.randomUUID());
        creneau.setStatutCreneau(StatutCreneau.RESERVE);
        creneau.setCoursId(UUID.randomUUID());
        creneau.setEnseignantId(UUID.randomUUID());
        creneau.setSalleId(UUID.randomUUID());
        creneau.setGroupeId(UUID.randomUUID());
        return creneau;
    }
}
