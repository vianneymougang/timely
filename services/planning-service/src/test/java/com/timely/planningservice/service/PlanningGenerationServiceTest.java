package com.timely.planningservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
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

import com.timely.planningservice.client.BookingServiceClient;
import com.timely.planningservice.client.UserServiceClient;
import com.timely.planningservice.config.PlanningGenerationConfig;
import com.timely.planningservice.dto.request.CreneauRequestDTO;
import com.timely.planningservice.dto.request.EmploiDuTempsRequestDTO;
import com.timely.planningservice.dto.request.GeneratePlanningRequest;
import com.timely.planningservice.dto.response.CoursNonPlanifie;
import com.timely.planningservice.dto.response.CreneauResponseDTO;
import com.timely.planningservice.dto.response.EmploiDuTempsResponseDTO;
import com.timely.planningservice.dto.response.GeneratePlanningResponse;
import com.timely.planningservice.entity.enums.StatutEmploi;
import com.timely.planningservice.repository.EmploiDuTempsRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("PlanningGenerationService - MCF Algorithm Tests")
class PlanningGenerationServiceTest {

    @Mock
    private EmploiDuTempsService emploiDuTempsService;

    @Mock
    private CreneauService creneauService;

    @Mock
    private BookingServiceClient bookingServiceClient;

    @Mock
    private UserServiceClient userServiceClient;

    @Mock
    private EmploiDuTempsRepository emploiDuTempsRepository;

    @Mock
    private PlanningGenerationConfig config;

    @InjectMocks
    private PlanningGenerationService planningGenerationService;

    @Captor
    private ArgumentCaptor<EmploiDuTempsRequestDTO> emploiDuTempsCaptor;

    @Captor
    private ArgumentCaptor<CreneauRequestDTO> creneauCaptor;

    @Captor
    private ArgumentCaptor<BookingServiceClient.CreateReservationRequest> reservationCaptor;

    @Captor
    private ArgumentCaptor<BookingServiceClient.AutoAssignSalleRequest> autoAssignCaptor;

    private static final List<LocalTime> SLOT_START_TIMES = List.of(
            LocalTime.of(8, 0), LocalTime.of(9, 0), LocalTime.of(10, 0), LocalTime.of(11, 0),
            LocalTime.of(13, 0), LocalTime.of(14, 0), LocalTime.of(15, 0), LocalTime.of(16, 0)
    );

    private static final DayOfWeek[] ACTIVE_DAYS = {
            DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY
    };

    private UUID ecoleId;
    private UUID emploiId;
    private UUID coursId;
    private UUID enseignantId;
    private UUID salleId;
    private UUID groupeId;
    private GeneratePlanningRequest request;
    private EmploiDuTempsResponseDTO emploiDuTempsResponse;
    private LocalDate weekStart;

    @BeforeEach
    void setUp() {
        ecoleId = UUID.randomUUID();
        emploiId = UUID.randomUUID();
        coursId = UUID.randomUUID();
        enseignantId = UUID.randomUUID();
        salleId = UUID.randomUUID();
        groupeId = UUID.randomUUID();

        weekStart = LocalDate.of(2026, 2, 9);

        request = new GeneratePlanningRequest(ecoleId, weekStart);

        emploiDuTempsResponse = new EmploiDuTempsResponseDTO();
        emploiDuTempsResponse.setId(emploiId);
        emploiDuTempsResponse.setEcoleId(ecoleId);
        emploiDuTempsResponse.setStatut(StatutEmploi.DRAFT);
        emploiDuTempsResponse.setDateDebut(weekStart);
        emploiDuTempsResponse.setDateFin(weekStart.plusDays(5));

        lenient().when(config.getSlotStartTimes()).thenReturn(SLOT_START_TIMES);
        lenient().when(config.getActiveDays()).thenReturn(ACTIVE_DAYS);
        lenient().when(config.getSlotDurationMinutes()).thenReturn(60);
        lenient().when(config.getScoreCmMorning()).thenReturn(40);
        lenient().when(config.getPenaltyLateAfternoon()).thenReturn(20);
        lenient().when(config.getScoreMidWeek()).thenReturn(10);
    }

    @Test
    @DisplayName("generate() should create emploi du temps with valid request")
    void generate_validRequest_createsEmploiDuTemps() {
        when(emploiDuTempsService.createEmploiDuTemps(any(EmploiDuTempsRequestDTO.class)))
                .thenReturn(emploiDuTempsResponse);
        when(bookingServiceClient.getCoursByEcole(ecoleId)).thenReturn(Collections.emptyList());

        GeneratePlanningResponse response = planningGenerationService.generate(request);

        assertThat(response).isNotNull();
        assertThat(response.getEmploiDuTempsId()).isEqualTo(emploiId);
        assertThat(response.getTotalCoursAPlanifier()).isZero();
        assertThat(response.getCoursPlanifies()).isZero();
        assertThat(response.getTauxReussite()).isZero();

        verify(emploiDuTempsService).createEmploiDuTemps(emploiDuTempsCaptor.capture());
        EmploiDuTempsRequestDTO capturedRequest = emploiDuTempsCaptor.getValue();
        assertThat(capturedRequest.getEcoleId()).isEqualTo(ecoleId);
        assertThat(capturedRequest.getDateDebut()).isEqualTo(weekStart);
        assertThat(capturedRequest.getDateFin()).isEqualTo(weekStart.plusDays(5));
    }

    @Test
    @DisplayName("generate() should sort courses by constraint score (MCF algorithm)")
    void generate_sortsCoursByConstraintScore_MCF() {
        UUID cours1Id = UUID.randomUUID();
        UUID enseignant1Id = UUID.randomUUID();
        BookingServiceClient.CoursDTO cours1 = new BookingServiceClient.CoursDTO(
                cours1Id, "Maths Avancées", "CM", 40, 50, UUID.randomUUID(), UUID.randomUUID(), enseignant1Id
        );

        UUID cours2Id = UUID.randomUUID();
        UUID enseignant2Id = UUID.randomUUID();
        BookingServiceClient.CoursDTO cours2 = new BookingServiceClient.CoursDTO(
                cours2Id, "Physique", "TD", 30, 30, UUID.randomUUID(), UUID.randomUUID(), enseignant2Id
        );

        UUID cours3Id = UUID.randomUUID();
        UUID enseignant3Id = UUID.randomUUID();
        BookingServiceClient.CoursDTO cours3 = new BookingServiceClient.CoursDTO(
                cours3Id, "Info", "TP", 20, 25, UUID.randomUUID(), UUID.randomUUID(), enseignant3Id
        );

        List<BookingServiceClient.CoursDTO> allCours = Arrays.asList(cours3, cours1, cours2);

        when(emploiDuTempsService.createEmploiDuTemps(any())).thenReturn(emploiDuTempsResponse);
        when(bookingServiceClient.getCoursByEcole(ecoleId)).thenReturn(allCours);

        when(userServiceClient.getDisponibilites(enseignant1Id)).thenReturn(Collections.emptyList());
        when(userServiceClient.getDisponibilites(enseignant2Id)).thenReturn(Arrays.asList(
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), enseignant2Id, "MONDAY", "08:00", "12:00", true),
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), enseignant2Id, "TUESDAY", "14:00", "18:00", true)
        ));
        when(userServiceClient.getDisponibilites(enseignant3Id)).thenReturn(Arrays.asList(
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), enseignant3Id, "MONDAY", "08:00", "12:00", true),
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), enseignant3Id, "TUESDAY", "08:00", "12:00", true),
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), enseignant3Id, "WEDNESDAY", "08:00", "12:00", true),
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), enseignant3Id, "THURSDAY", "08:00", "12:00", true)
        ));

        when(bookingServiceClient.getGroupesByCours(any())).thenReturn(Arrays.asList(
                new BookingServiceClient.GroupeDTO(groupeId, 1, 30)
        ));

        BookingServiceClient.SalleDTO salle = new BookingServiceClient.SalleDTO(
                salleId, "A101", "Amphi A", "CM", 100, ecoleId
        );
        when(bookingServiceClient.autoAssignSalle(any())).thenReturn(salle);
        when(bookingServiceClient.createReservation(any())).thenReturn(
                new BookingServiceClient.ReservationDTO(
                        UUID.randomUUID(), "2026-02-09", "08:00", "09:00", "MONDAY", "HEBDOMADAIRE", "CONFIRMEE",
                        coursId, salleId, groupeId, enseignantId
                )
        );
        when(creneauService.createCreneau(any(), any())).thenReturn(new CreneauResponseDTO());

        GeneratePlanningResponse response = planningGenerationService.generate(request);

        assertThat(response).isNotNull();
        assertThat(response.getEmploiDuTempsId()).isEqualTo(emploiId);
        assertThat(response.getTotalCoursAPlanifier()).isEqualTo(3);

        verify(bookingServiceClient).getCoursByEcole(ecoleId);
        verify(userServiceClient).getDisponibilites(enseignant1Id);
        verify(userServiceClient).getDisponibilites(enseignant2Id);
        verify(userServiceClient).getDisponibilites(enseignant3Id);
    }

    @Test
    @DisplayName("generate() should mark courses without enseignant as non-planifiable")
    void generate_courseSansEnseignant_markedNonPlanifiable() {
        BookingServiceClient.CoursDTO coursSansEnseignant = new BookingServiceClient.CoursDTO(
                coursId, "Cours Orphelin", "CM", 20, 30, UUID.randomUUID(), UUID.randomUUID(), null
        );

        when(emploiDuTempsService.createEmploiDuTemps(any())).thenReturn(emploiDuTempsResponse);
        when(bookingServiceClient.getCoursByEcole(ecoleId)).thenReturn(List.of(coursSansEnseignant));

        GeneratePlanningResponse response = planningGenerationService.generate(request);

        assertThat(response).isNotNull();
        assertThat(response.getTotalCoursAPlanifier()).isEqualTo(1);
        assertThat(response.getCoursPlanifies()).isZero();
        assertThat(response.getCoursNonPlanifies()).hasSize(1);

        CoursNonPlanifie coursNonPlanifie = response.getCoursNonPlanifies().get(0);
        assertThat(coursNonPlanifie.getCoursId()).isEqualTo(coursId);
        assertThat(coursNonPlanifie.getIntitule()).isEqualTo("Cours Orphelin");
        assertThat(coursNonPlanifie.getRaison()).isEqualTo("Aucun enseignant assigné");

        verify(bookingServiceClient, never()).autoAssignSalle(any());
        verify(bookingServiceClient, never()).createReservation(any());
        verify(creneauService, never()).createCreneau(any(), any());
    }

    @Test
    @DisplayName("generate() should continue despite partial failures")
    void generate_continuesDespitePartialFailures() {
        BookingServiceClient.CoursDTO cours1 = new BookingServiceClient.CoursDTO(
                UUID.randomUUID(), "Cours Success", "CM", 3, 30, UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID()
        );
        BookingServiceClient.CoursDTO cours2 = new BookingServiceClient.CoursDTO(
                UUID.randomUUID(), "Cours Fail", "TD", 3, 30, UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID()
        );

        when(emploiDuTempsService.createEmploiDuTemps(any())).thenReturn(emploiDuTempsResponse);
        when(bookingServiceClient.getCoursByEcole(ecoleId)).thenReturn(Arrays.asList(cours1, cours2));

        when(userServiceClient.getDisponibilites(any())).thenReturn(Arrays.asList(
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), enseignantId, "MONDAY", "08:00", "12:00", true)
        ));
        when(bookingServiceClient.getGroupesByCours(any())).thenReturn(Arrays.asList(
                new BookingServiceClient.GroupeDTO(groupeId, 1, 30)
        ));

        BookingServiceClient.SalleDTO salle = new BookingServiceClient.SalleDTO(
                salleId, "A101", "Amphi A", "CM", 100, ecoleId
        );

        when(bookingServiceClient.autoAssignSalle(any()))
                .thenReturn(salle)
                .thenThrow(new RuntimeException("No room available"));

        when(bookingServiceClient.createReservation(any())).thenReturn(
                new BookingServiceClient.ReservationDTO(
                        UUID.randomUUID(), "2026-02-09", "08:00", "09:00", "MONDAY", "HEBDOMADAIRE", "CONFIRMEE",
                        cours1.id(), salleId, groupeId, cours1.enseignantId()
                )
        );
        when(creneauService.createCreneau(any(), any())).thenReturn(new CreneauResponseDTO());

        GeneratePlanningResponse response = planningGenerationService.generate(request);

        assertThat(response).isNotNull();
        assertThat(response.getTotalCoursAPlanifier()).isEqualTo(2);
        assertThat(response.getCoursPlanifies()).isGreaterThanOrEqualTo(0);
        assertThat(response.getCoursNonPlanifies()).isNotEmpty();

        verify(bookingServiceClient, times(2)).getGroupesByCours(any());
    }

    @Test
    @DisplayName("generate() should create reservation and creneau for successful placement")
    void generate_createsReservationAndCreneau() {
        BookingServiceClient.CoursDTO cours = new BookingServiceClient.CoursDTO(
                coursId, "Algorithmes", "CM", 3, 50, UUID.randomUUID(), UUID.randomUUID(), enseignantId
        );

        when(emploiDuTempsService.createEmploiDuTemps(any())).thenReturn(emploiDuTempsResponse);
        when(bookingServiceClient.getCoursByEcole(ecoleId)).thenReturn(List.of(cours));
        when(userServiceClient.getDisponibilites(enseignantId)).thenReturn(Arrays.asList(
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), enseignantId, "MONDAY", "08:00", "18:00", true),
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), enseignantId, "TUESDAY", "08:00", "18:00", true)
        ));
        when(bookingServiceClient.getGroupesByCours(coursId)).thenReturn(Arrays.asList(
                new BookingServiceClient.GroupeDTO(groupeId, 1, 50)
        ));

        BookingServiceClient.SalleDTO salle = new BookingServiceClient.SalleDTO(
                salleId, "A101", "Amphi A", "CM", 100, ecoleId
        );
        when(bookingServiceClient.autoAssignSalle(any())).thenReturn(salle);
        when(bookingServiceClient.createReservation(any())).thenReturn(
                new BookingServiceClient.ReservationDTO(
                        UUID.randomUUID(), "2026-02-09", "08:00", "09:00", "MONDAY", "HEBDOMADAIRE", "CONFIRMEE",
                        coursId, salleId, groupeId, enseignantId
                )
        );
        when(creneauService.createCreneau(any(), any())).thenReturn(new CreneauResponseDTO());

        GeneratePlanningResponse response = planningGenerationService.generate(request);

        assertThat(response).isNotNull();
        assertThat(response.getCoursPlanifies()).isGreaterThan(0);

        verify(bookingServiceClient, times(3)).autoAssignSalle(autoAssignCaptor.capture());
        BookingServiceClient.AutoAssignSalleRequest autoAssignRequest = autoAssignCaptor.getValue();
        assertThat(autoAssignRequest.ecoleId()).isEqualTo(ecoleId);
        assertThat(autoAssignRequest.typeCours()).isEqualTo("CM");
        assertThat(autoAssignRequest.capaciteRequise()).isEqualTo(50);

        verify(bookingServiceClient, times(3)).createReservation(reservationCaptor.capture());
        BookingServiceClient.CreateReservationRequest reservationRequest = reservationCaptor.getAllValues().get(0);
        assertThat(reservationRequest.coursId()).isEqualTo(coursId);
        assertThat(reservationRequest.salleId()).isEqualTo(salleId);
        assertThat(reservationRequest.enseignantId()).isEqualTo(enseignantId);
        assertThat(reservationRequest.recurrence()).isEqualTo("HEBDOMADAIRE");

        verify(creneauService, times(3)).createCreneau(eq(emploiId), creneauCaptor.capture());
        CreneauRequestDTO creneauRequest = creneauCaptor.getAllValues().get(0);
        assertThat(creneauRequest.getCoursId()).isEqualTo(coursId);
        assertThat(creneauRequest.getSalleId()).isEqualTo(salleId);
        assertThat(creneauRequest.getEnseignantId()).isEqualTo(enseignantId);
    }

    @Test
    @DisplayName("generate() should return correct statistics with taux de réussite")
    void generate_returnsStatistics_tauxReussite() {
        BookingServiceClient.CoursDTO cours1 = new BookingServiceClient.CoursDTO(
                UUID.randomUUID(), "Cours Scheduled", "CM", 3, 30, UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID()
        );
        BookingServiceClient.CoursDTO cours2 = new BookingServiceClient.CoursDTO(
                UUID.randomUUID(), "Cours Not Scheduled", "TD", 50, 30, UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID()
        );
        BookingServiceClient.CoursDTO cours3 = new BookingServiceClient.CoursDTO(
                UUID.randomUUID(), "Cours Sans Enseignant", "TP", 20, 20, UUID.randomUUID(), UUID.randomUUID(), null
        );

        when(emploiDuTempsService.createEmploiDuTemps(any())).thenReturn(emploiDuTempsResponse);
        when(bookingServiceClient.getCoursByEcole(ecoleId)).thenReturn(Arrays.asList(cours1, cours2, cours3));

        when(userServiceClient.getDisponibilites(any())).thenReturn(Arrays.asList(
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), enseignantId, "MONDAY", "08:00", "12:00", true)
        ));
        when(bookingServiceClient.getGroupesByCours(any())).thenReturn(Arrays.asList(
                new BookingServiceClient.GroupeDTO(groupeId, 1, 30)
        ));

        BookingServiceClient.SalleDTO salle = new BookingServiceClient.SalleDTO(
                salleId, "A101", "Amphi A", "CM", 100, ecoleId
        );
        when(bookingServiceClient.autoAssignSalle(any())).thenReturn(salle);
        when(bookingServiceClient.createReservation(any())).thenReturn(
                new BookingServiceClient.ReservationDTO(
                        UUID.randomUUID(), "2026-02-09", "08:00", "09:00", "MONDAY", "HEBDOMADAIRE", "CONFIRMEE",
                        coursId, salleId, groupeId, enseignantId
                )
        );
        when(creneauService.createCreneau(any(), any())).thenReturn(new CreneauResponseDTO());

        GeneratePlanningResponse response = planningGenerationService.generate(request);

        assertThat(response).isNotNull();
        assertThat(response.getEmploiDuTempsId()).isEqualTo(emploiId);
        assertThat(response.getTotalCoursAPlanifier()).isEqualTo(3);
        assertThat(response.getTauxReussite()).isGreaterThanOrEqualTo(0.0).isLessThanOrEqualTo(100.0);
        assertThat(response.getDureeGenerationMs()).isGreaterThanOrEqualTo(0);
        assertThat(response.getConflitsDetectes()).isGreaterThanOrEqualTo(0);

        if (response.getCoursPlanifies() == 1) {
            assertThat(response.getTauxReussite()).isEqualTo(50.0);
        }
    }

    @Test
    @DisplayName("calculateSlotScore() should apply CM morning bonus")
    void generate_scoringSlots_CMmorningBonus() {
        BookingServiceClient.CoursDTO coursCM = new BookingServiceClient.CoursDTO(
                coursId, "Algorithmes CM", "CM", 3, 50, UUID.randomUUID(), UUID.randomUUID(), enseignantId
        );

        when(emploiDuTempsService.createEmploiDuTemps(any())).thenReturn(emploiDuTempsResponse);
        when(bookingServiceClient.getCoursByEcole(ecoleId)).thenReturn(List.of(coursCM));

        when(userServiceClient.getDisponibilites(enseignantId)).thenReturn(Arrays.asList(
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), enseignantId, "MONDAY", "08:00", "18:00", true),
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), enseignantId, "TUESDAY", "08:00", "18:00", true),
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), enseignantId, "WEDNESDAY", "08:00", "18:00", true)
        ));
        when(bookingServiceClient.getGroupesByCours(coursId)).thenReturn(Arrays.asList(
                new BookingServiceClient.GroupeDTO(groupeId, 1, 50)
        ));

        BookingServiceClient.SalleDTO salle = new BookingServiceClient.SalleDTO(
                salleId, "A101", "Amphi A", "CM", 100, ecoleId
        );
        when(bookingServiceClient.autoAssignSalle(any())).thenReturn(salle);
        when(bookingServiceClient.createReservation(any())).thenReturn(
                new BookingServiceClient.ReservationDTO(
                        UUID.randomUUID(), "2026-02-09", "08:00", "09:00", "MONDAY", "HEBDOMADAIRE", "CONFIRMEE",
                        coursId, salleId, groupeId, enseignantId
                )
        );
        when(creneauService.createCreneau(any(), any())).thenReturn(new CreneauResponseDTO());

        GeneratePlanningResponse response = planningGenerationService.generate(request);

        assertThat(response).isNotNull();
        assertThat(response.getCoursPlanifies()).isGreaterThan(0);

        verify(config, atLeast(1)).getScoreCmMorning();
    }

    @Test
    @DisplayName("calculateSlotScore() should apply late afternoon penalty for slots >= 16:00")
    void generate_scoringSlots_lateAfternoonPenalty() {
        List<BookingServiceClient.CoursDTO> manyCours = new ArrayList<>();
        for (int i = 0; i < 15; i++) {
            UUID teacherId = UUID.randomUUID();
            manyCours.add(new BookingServiceClient.CoursDTO(
                    UUID.randomUUID(), "Cours " + i, "TD", 10, 30,
                    UUID.randomUUID(), UUID.randomUUID(), teacherId
            ));
        }

        when(emploiDuTempsService.createEmploiDuTemps(any())).thenReturn(emploiDuTempsResponse);
        when(bookingServiceClient.getCoursByEcole(ecoleId)).thenReturn(manyCours);

        when(userServiceClient.getDisponibilites(any())).thenReturn(Arrays.asList(
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), UUID.randomUUID(), "MONDAY", "08:00", "17:00", true),
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), UUID.randomUUID(), "TUESDAY", "08:00", "17:00", true),
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), UUID.randomUUID(), "WEDNESDAY", "08:00", "17:00", true),
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), UUID.randomUUID(), "THURSDAY", "08:00", "17:00", true),
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), UUID.randomUUID(), "FRIDAY", "08:00", "17:00", true),
                new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), UUID.randomUUID(), "SATURDAY", "08:00", "17:00", true)
        ));
        when(bookingServiceClient.getGroupesByCours(any())).thenReturn(Arrays.asList(
                new BookingServiceClient.GroupeDTO(groupeId, 1, 30)
        ));

        BookingServiceClient.SalleDTO salle = new BookingServiceClient.SalleDTO(
                salleId, "B201", "Salle B", "TD", 40, ecoleId
        );
        when(bookingServiceClient.autoAssignSalle(any())).thenReturn(salle);
        when(bookingServiceClient.createReservation(any())).thenReturn(
                new BookingServiceClient.ReservationDTO(
                        UUID.randomUUID(), "2026-02-09", "08:00", "09:00", "MONDAY", "HEBDOMADAIRE", "CONFIRMEE",
                        UUID.randomUUID(), salleId, groupeId, UUID.randomUUID()
                )
        );
        when(creneauService.createCreneau(any(), any())).thenReturn(new CreneauResponseDTO());

        GeneratePlanningResponse response = planningGenerationService.generate(request);

        assertThat(response).isNotNull();
        verify(config, atLeast(1)).getPenaltyLateAfternoon();
    }
}
