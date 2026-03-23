package com.timely.planningservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.timely.planningservice.client.BookingServiceClient;
import com.timely.planningservice.client.BookingServiceClient.CoursDTO;
import com.timely.planningservice.client.BookingServiceClient.SalleDTO;
import com.timely.planningservice.client.UserServiceClient;
import com.timely.planningservice.client.UserServiceClient.EnseignantDTO;
import com.timely.planningservice.entity.Creneau;
import com.timely.planningservice.entity.EmploiDuTemps;
import com.timely.planningservice.entity.enums.PeriodeEmploi;
import com.timely.planningservice.entity.enums.StatutCreneau;
import com.timely.planningservice.entity.enums.StatutEmploi;
import com.timely.planningservice.entity.enums.TypeRecurrence;
import com.timely.planningservice.exception.ResourceNotFoundException;
import com.timely.planningservice.repository.EmploiDuTempsRepository;
import java.nio.charset.StandardCharsets;
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
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * Unit tests for ICalExportService.
 *
 * Validates F3.3 iCal export functionality with proper RFC 5545 format.
 *
 * Tests cover:
 * - Valid iCalendar format generation
 * - VCALENDAR headers compliance
 * - VEVENT creation for each Creneau
 * - RRULE for weekly recurrence
 * - Africa/Douala timezone handling
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ICalExportService Unit Tests")
class ICalExportServiceTest {

    @Mock
    private EmploiDuTempsRepository emploiDuTempsRepository;

    @Mock
    private BookingServiceClient bookingServiceClient;

    @Mock
    private UserServiceClient userServiceClient;

    @InjectMocks
    private ICalExportService icalExportService;

    private UUID emploiId;
    private EmploiDuTemps emploiDuTemps;
    private Creneau creneauWeekly;
    private Creneau creneauUnique;

    @BeforeEach
    void setUp() {
        // Arrange - Common test data
        emploiId = UUID.randomUUID();
        UUID ecoleId = UUID.randomUUID();
        LocalDate dateDebut = LocalDate.of(2026, 2, 10);
        LocalDate dateFin = LocalDate.of(2026, 6, 30);

        // Create EmploiDuTemps
        emploiDuTemps = new EmploiDuTemps();
        emploiDuTemps.setId(emploiId);
        emploiDuTemps.setEcoleId(ecoleId);
        emploiDuTemps.setDateDebut(dateDebut);
        emploiDuTemps.setDateFin(dateFin);
        emploiDuTemps.setPeriode(PeriodeEmploi.SEMESTRE);
        emploiDuTemps.setStatut(StatutEmploi.PUBLIE);
        emploiDuTemps.setCreneaux(new ArrayList<>());

        // Create weekly recurring Creneau
        creneauWeekly = new Creneau();
        creneauWeekly.setId(UUID.randomUUID());
        creneauWeekly.setEmploiDuTemps(emploiDuTemps);
        creneauWeekly.setJourSemaine(DayOfWeek.MONDAY);
        creneauWeekly.setHeureDebut(LocalTime.of(8, 0));
        creneauWeekly.setHeureFin(LocalTime.of(10, 0));
        creneauWeekly.setTypeRecurrence(TypeRecurrence.HEBDOMADAIRE);
        creneauWeekly.setStatutCreneau(StatutCreneau.ACTIF);
        creneauWeekly.setCoursId(UUID.randomUUID());
        creneauWeekly.setSalleId(UUID.randomUUID());
        creneauWeekly.setEnseignantId(UUID.randomUUID());
        creneauWeekly.setGroupeId(UUID.randomUUID());

        // Create unique Creneau
        creneauUnique = new Creneau();
        creneauUnique.setId(UUID.randomUUID());
        creneauUnique.setEmploiDuTemps(emploiDuTemps);
        creneauUnique.setJourSemaine(DayOfWeek.TUESDAY);
        creneauUnique.setHeureDebut(LocalTime.of(14, 0));
        creneauUnique.setHeureFin(LocalTime.of(16, 0));
        creneauUnique.setDateCreneau(LocalDate.of(2026, 2, 11));
        creneauUnique.setTypeRecurrence(TypeRecurrence.UNIQUE);
        creneauUnique.setStatutCreneau(StatutCreneau.ACTIF);
        creneauUnique.setCoursId(UUID.randomUUID());
    }

    @Test
    @DisplayName("export_validPlanning_returnsIcsFormat")
    void export_validPlanning_returnsIcsFormat() {
        // Arrange
        emploiDuTemps.getCreneaux().add(creneauWeekly);

        when(emploiDuTempsRepository.findById(emploiId))
            .thenReturn(Optional.of(emploiDuTemps));
        when(bookingServiceClient.getCours(any(UUID.class)))
            .thenReturn(
                new CoursDTO(
                    creneauWeekly.getCoursId(),
                    "Programmation Java",
                    "CM",
                    40,
                    30,
                    UUID.randomUUID(),
                    UUID.randomUUID(),
                    creneauWeekly.getEnseignantId()
                )
            );
        when(bookingServiceClient.getSalle(any(UUID.class)))
            .thenReturn(
                new SalleDTO(
                    creneauWeekly.getSalleId(),
                    "A101",
                    "Salle Informatique",
                    "LABO",
                    30,
                    emploiDuTemps.getEcoleId()
                )
            );
        when(userServiceClient.getEnseignant(any(UUID.class)))
            .thenReturn(
                new EnseignantDTO(
                    creneauWeekly.getEnseignantId(),
                    "Dupont",
                    "Jean",
                    "jean.dupont@iusjc.cm",
                    "Informatique",
                    "Professeur"
                )
            );

        // Act
        byte[] result = icalExportService.exportToICal(emploiId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result).isNotEmpty();

        String icsContent = new String(result, StandardCharsets.UTF_8);

        // Verify basic iCalendar structure (RFC 5545)
        assertThat(icsContent)
            .contains("BEGIN:VCALENDAR")
            .contains("END:VCALENDAR")
            .contains("BEGIN:VEVENT")
            .contains("END:VEVENT");

        // Verify repository was called
        verify(emploiDuTempsRepository).findById(emploiId);
    }

    @Test
    @DisplayName("export_containsVCalendarHeaders")
    void export_containsVCalendarHeaders() {
        // Arrange
        emploiDuTemps.getCreneaux().add(creneauWeekly);

        when(emploiDuTempsRepository.findById(emploiId))
            .thenReturn(Optional.of(emploiDuTemps));
        when(bookingServiceClient.getCours(any(UUID.class)))
            .thenReturn(
                new CoursDTO(
                    creneauWeekly.getCoursId(),
                    "Analyse Mathematique",
                    "TD",
                    30,
                    25,
                    UUID.randomUUID(),
                    UUID.randomUUID(),
                    creneauWeekly.getEnseignantId()
                )
            );

        // Act
        byte[] result = icalExportService.exportToICal(emploiId);
        String icsContent = new String(result, StandardCharsets.UTF_8);

        // Assert - Verify VCALENDAR headers (RFC 5545 compliance)
        assertThat(icsContent)
            .as("iCalendar must start with BEGIN:VCALENDAR")
            .startsWith("BEGIN:VCALENDAR");

        assertThat(icsContent)
            .as("iCalendar must include VERSION:2.0")
            .contains("VERSION:2.0");

        assertThat(icsContent)
            .as("iCalendar must include PRODID")
            .contains("PRODID:-//Timely//IUSJC Schedule//EN");

        assertThat(icsContent)
            .as("iCalendar must include CALSCALE:GREGORIAN")
            .contains("CALSCALE:GREGORIAN");

        assertThat(icsContent)
            .as("iCalendar must include calendar name")
            .contains("X-WR-CALNAME:Emploi du temps - " + emploiId);

        assertThat(icsContent)
            .as("iCalendar must end with END:VCALENDAR")
            .endsWith("END:VCALENDAR\r\n");
    }

    @Test
    @DisplayName("export_eachCreneau_createsVEvent")
    void export_eachCreneau_createsVEvent() {
        // Arrange - Add multiple creneaux
        emploiDuTemps.getCreneaux().add(creneauWeekly);
        emploiDuTemps.getCreneaux().add(creneauUnique);

        // Add a cancelled creneau that should NOT appear
        Creneau creneauCancelled = new Creneau();
        creneauCancelled.setId(UUID.randomUUID());
        creneauCancelled.setEmploiDuTemps(emploiDuTemps);
        creneauCancelled.setJourSemaine(DayOfWeek.WEDNESDAY);
        creneauCancelled.setHeureDebut(LocalTime.of(10, 0));
        creneauCancelled.setHeureFin(LocalTime.of(12, 0));
        creneauCancelled.setTypeRecurrence(TypeRecurrence.HEBDOMADAIRE);
        creneauCancelled.setStatutCreneau(StatutCreneau.ANNULE);
        creneauCancelled.setCoursId(UUID.randomUUID());
        emploiDuTemps.getCreneaux().add(creneauCancelled);

        when(emploiDuTempsRepository.findById(emploiId))
            .thenReturn(Optional.of(emploiDuTemps));
        when(bookingServiceClient.getCours(creneauWeekly.getCoursId()))
            .thenReturn(
                new CoursDTO(
                    creneauWeekly.getCoursId(),
                    "Base de Donnees",
                    "CM",
                    40,
                    30,
                    UUID.randomUUID(),
                    UUID.randomUUID(),
                    creneauWeekly.getEnseignantId()
                )
            );
        when(bookingServiceClient.getCours(creneauUnique.getCoursId()))
            .thenReturn(
                new CoursDTO(
                    creneauUnique.getCoursId(),
                    "Examen Final",
                    "EXAMEN",
                    2,
                    30,
                    UUID.randomUUID(),
                    UUID.randomUUID(),
                    null
                )
            );
        when(bookingServiceClient.getSalle(any(UUID.class)))
            .thenReturn(
                new SalleDTO(
                    UUID.randomUUID(),
                    "B205",
                    "Amphi",
                    "AMPHI",
                    100,
                    emploiDuTemps.getEcoleId()
                )
            );
        when(userServiceClient.getEnseignant(any(UUID.class)))
            .thenReturn(
                new EnseignantDTO(
                    creneauWeekly.getEnseignantId(),
                    "Martin",
                    "Sophie",
                    "sophie.martin@iusjc.cm",
                    "Bases de donnees",
                    "Maitre de conferences"
                )
            );

        // Act
        byte[] result = icalExportService.exportToICal(emploiId);
        String icsContent = new String(result, StandardCharsets.UTF_8);

        // Assert - Count VEVENT occurrences
        int veventCount = countOccurrences(icsContent, "BEGIN:VEVENT");

        assertThat(veventCount)
            .as("Only ACTIF creneaux should create VEVENTs (2 active, 1 cancelled)")
            .isEqualTo(2);

        // Verify each VEVENT has required properties
        assertThat(icsContent)
            .as("Each VEVENT must have UID")
            .contains("UID:" + creneauWeekly.getId() + "@timely")
            .contains("UID:" + creneauUnique.getId() + "@timely");

        assertThat(icsContent)
            .as("Each VEVENT must have DTSTART")
            .contains("DTSTART:");

        assertThat(icsContent)
            .as("Each VEVENT must have DTEND")
            .contains("DTEND:");

        assertThat(icsContent)
            .as("Each VEVENT must have SUMMARY with course name")
            .contains("SUMMARY:Base de Donnees")
            .contains("SUMMARY:Examen Final");

        assertThat(icsContent)
            .as("Each VEVENT must have STATUS:CONFIRMED")
            .contains("STATUS:CONFIRMED");

        assertThat(icsContent)
            .as("VEVENT should include LOCATION with room info")
            .contains("LOCATION:B205");

        assertThat(icsContent)
            .as("VEVENT should include DESCRIPTION with teacher info")
            .contains("DESCRIPTION:")
            .contains("Enseignant: Sophie Martin");
    }

    @Test
    @DisplayName("export_weeklyRecurrence_addsRRule")
    void export_weeklyRecurrence_addsRRule() {
        // Arrange
        emploiDuTemps.getCreneaux().add(creneauWeekly);
        emploiDuTemps.getCreneaux().add(creneauUnique);

        when(emploiDuTempsRepository.findById(emploiId))
            .thenReturn(Optional.of(emploiDuTemps));
        when(bookingServiceClient.getCours(any(UUID.class)))
            .thenReturn(
                new CoursDTO(
                    UUID.randomUUID(),
                    "Systemes d'exploitation",
                    "TP",
                    30,
                    15,
                    UUID.randomUUID(),
                    UUID.randomUUID(),
                    UUID.randomUUID()
                )
            );

        // Act
        byte[] result = icalExportService.exportToICal(emploiId);
        String icsContent = new String(result, StandardCharsets.UTF_8);

        // Assert - Check RRULE for weekly recurrence
        assertThat(icsContent)
            .as("Weekly creneau must include RRULE with FREQ=WEEKLY")
            .contains("RRULE:FREQ=WEEKLY");

        assertThat(icsContent)
            .as("RRULE must include UNTIL date matching emploi dateFin")
            .contains("UNTIL=");

        // Verify UNTIL format (RFC 5545: YYYYMMDDTHHMMSSZ format)
        assertThat(icsContent)
            .as("RRULE UNTIL must be in correct iCalendar format")
            .containsPattern("UNTIL=\\d{8}T\\d{6}Z");

        // Count RRULE occurrences - only weekly creneaux should have RRULE
        int rruleCount = countOccurrences(icsContent, "RRULE:");

        assertThat(rruleCount)
            .as("Only weekly creneaux should have RRULE (1 weekly, 1 unique)")
            .isEqualTo(1);
    }

    @Test
    @DisplayName("export_usesAfricaDoualTimezone")
    void export_usesAfricaDoualTimezone() {
        // Arrange
        emploiDuTemps.getCreneaux().add(creneauWeekly);

        when(emploiDuTempsRepository.findById(emploiId))
            .thenReturn(Optional.of(emploiDuTemps));
        when(bookingServiceClient.getCours(any(UUID.class)))
            .thenReturn(
                new CoursDTO(
                    creneauWeekly.getCoursId(),
                    "Reseaux Informatiques",
                    "CM",
                    40,
                    30,
                    UUID.randomUUID(),
                    UUID.randomUUID(),
                    creneauWeekly.getEnseignantId()
                )
            );
        when(bookingServiceClient.getSalle(any(UUID.class)))
            .thenReturn(
                new SalleDTO(
                    creneauWeekly.getSalleId(),
                    "C301",
                    "Salle Reseaux",
                    "LABO",
                    25,
                    emploiDuTemps.getEcoleId()
                )
            );

        // Act
        byte[] result = icalExportService.exportToICal(emploiId);
        String icsContent = new String(result, StandardCharsets.UTF_8);

        // Assert - Verify Africa/Douala timezone
        assertThat(icsContent)
            .as("iCalendar must specify Africa/Douala timezone")
            .contains("X-WR-TIMEZONE:Africa/Douala");

        // Verify DTSTART and DTEND use UTC/Zulu time (converted from Africa/Douala)
        assertThat(icsContent)
            .as("DTSTART must use Zulu time format")
            .containsPattern("DTSTART:\\d{8}T\\d{6}Z");

        assertThat(icsContent)
            .as("DTEND must use Zulu time format")
            .containsPattern("DTEND:\\d{8}T\\d{6}Z");

        // Verify times are correctly converted
        // 08:00 Africa/Douala = 07:00 UTC (WAT is UTC+1)
        assertThat(icsContent)
            .as("Times should be converted to UTC")
            .containsPattern("DTSTART:\\d{8}T0[67]0000Z"); // 07:00 UTC for 08:00 WAT
    }

    @Test
    @DisplayName("export_emploiNotFound_throwsResourceNotFoundException")
    void export_emploiNotFound_throwsResourceNotFoundException() {
        // Arrange
        UUID invalidEmploiId = UUID.randomUUID();

        when(emploiDuTempsRepository.findById(invalidEmploiId))
            .thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> icalExportService.exportToICal(invalidEmploiId))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("EmploiDuTemps not found with id: " + invalidEmploiId);

        verify(emploiDuTempsRepository).findById(invalidEmploiId);
    }

    @Test
    @DisplayName("export_emptyCreneaux_returnsValidIcsWithoutEvents")
    void export_emptyCreneaux_returnsValidIcsWithoutEvents() {
        // Arrange - EmploiDuTemps with no creneaux
        when(emploiDuTempsRepository.findById(emploiId))
            .thenReturn(Optional.of(emploiDuTemps));

        // Act
        byte[] result = icalExportService.exportToICal(emploiId);
        String icsContent = new String(result, StandardCharsets.UTF_8);

        // Assert
        assertThat(icsContent)
            .as("Empty calendar should still have valid structure")
            .contains("BEGIN:VCALENDAR")
            .contains("END:VCALENDAR")
            .contains("VERSION:2.0");

        int veventCount = countOccurrences(icsContent, "BEGIN:VEVENT");

        assertThat(veventCount)
            .as("Empty emploi should have no VEVENTs")
            .isZero();
    }

    @Test
    @DisplayName("export_clientServiceFailure_continuesWithoutOptionalData")
    void export_clientServiceFailure_continuesWithoutOptionalData() {
        // Arrange
        emploiDuTemps.getCreneaux().add(creneauWeekly);

        when(emploiDuTempsRepository.findById(emploiId))
            .thenReturn(Optional.of(emploiDuTemps));

        // Simulate client failures
        when(bookingServiceClient.getCours(any(UUID.class)))
            .thenThrow(new RuntimeException("Booking service unavailable"));
        when(bookingServiceClient.getSalle(any(UUID.class)))
            .thenThrow(new RuntimeException("Booking service unavailable"));
        when(userServiceClient.getEnseignant(any(UUID.class)))
            .thenThrow(new RuntimeException("User service unavailable"));

        // Act
        byte[] result = icalExportService.exportToICal(emploiId);
        String icsContent = new String(result, StandardCharsets.UTF_8);

        // Assert - Export should still succeed with fallback data
        assertThat(result).isNotNull();
        assertThat(result).isNotEmpty();

        assertThat(icsContent)
            .as("Export should continue with generic course name on service failure")
            .contains("SUMMARY:Cours");

        int veventCount = countOccurrences(icsContent, "BEGIN:VEVENT");

        assertThat(veventCount)
            .as("VEVENT should still be created despite client failures")
            .isEqualTo(1);
    }

    /**
     * Utility method to count occurrences of a substring
     */
    private int countOccurrences(String content, String substring) {
        int count = 0;
        int index = 0;
        while ((index = content.indexOf(substring, index)) != -1) {
            count++;
            index += substring.length();
        }
        return count;
    }
}
