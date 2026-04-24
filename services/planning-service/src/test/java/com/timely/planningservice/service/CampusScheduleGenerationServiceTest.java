package com.timely.planningservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.timely.planningservice.client.BookingServiceClient;
import com.timely.planningservice.client.UserServiceClient;
import com.timely.planningservice.config.PlanningGenerationConfig;
import com.timely.planningservice.dto.request.GeneratePlanningRequest;
import com.timely.planningservice.dto.response.CampusGenerationResponse;
import com.timely.planningservice.dto.response.CreneauResponseDTO;
import com.timely.planningservice.dto.response.EmploiDuTempsResponseDTO;
import com.timely.planningservice.entity.enums.StatutEmploi;
import com.timely.planningservice.repository.EmploiDuTempsRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("CampusScheduleGenerationService - Ford-Fulkerson Algorithm Tests")
class CampusScheduleGenerationServiceTest {

    @Mock private EmploiDuTempsService emploiDuTempsService;
    @Mock private CreneauService creneauService;
    @Mock private BookingServiceClient bookingServiceClient;
    @Mock private UserServiceClient userServiceClient;
    @Mock private PlanningGenerationConfig config;
    @Mock private EmploiDuTempsRepository emploiDuTempsRepository;

    @InjectMocks
    private CampusScheduleGenerationService service;

    private static final LocalDate WEEK_START = LocalDate.of(2026, 4, 6);

    private static final List<LocalTime> SLOT_START_TIMES = List.of(
            LocalTime.of(8, 0), LocalTime.of(9, 0), LocalTime.of(10, 0), LocalTime.of(11, 0),
            LocalTime.of(13, 0), LocalTime.of(14, 0), LocalTime.of(15, 0), LocalTime.of(16, 0)
    );

    private static final DayOfWeek[] ACTIVE_DAYS = {
            DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY
    };

    @BeforeEach
    void setUp() {
        lenient().when(config.getSlotStartTimes()).thenReturn(SLOT_START_TIMES);
        lenient().when(config.getActiveDays()).thenReturn(ACTIVE_DAYS);
        lenient().when(config.isConsecutive(any(), any())).thenAnswer(inv -> {
            LocalTime f = inv.getArgument(0);
            LocalTime s = inv.getArgument(1);
            return f.plusMinutes(60).equals(s);
        });
        lenient().when(emploiDuTempsRepository.findByEcoleIdAndDateRange(any(), any(), any()))
                .thenReturn(Collections.emptyList());
    }

    @Test
    @DisplayName("generate() doit lever une IllegalStateException si aucune école n'est trouvée")
    void generate_noSchools_throwsIllegalStateException() {
        when(bookingServiceClient.getAllEcoles()).thenReturn(Collections.emptyList());

        assertThatThrownBy(() -> service.generate(new GeneratePlanningRequest(WEEK_START)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("No schools found");
    }

    @Test
    @DisplayName("generate() doit marquer un cours sans enseignant comme non planifiable")
    void generate_courseWithoutTeacher_markedNonPlanifiable() {
        UUID ecoleId = UUID.randomUUID();
        UUID coursId = UUID.randomUUID();

        when(bookingServiceClient.getAllEcoles()).thenReturn(List.of(ecole(ecoleId, "ESIS")));
        when(bookingServiceClient.getCoursByEcole(ecoleId)).thenReturn(List.of(
                cours(coursId, "Analyse I", "CM", 1, null)
        ));
        when(bookingServiceClient.getSallesByEcole(ecoleId)).thenReturn(List.of(room(ecoleId)));
        when(bookingServiceClient.getGroupesByCours(coursId)).thenReturn(Collections.emptyList());
        when(emploiDuTempsService.createEmploiDuTemps(any())).thenReturn(emploiResponse(UUID.randomUUID()));

        CampusGenerationResponse response = service.generate(new GeneratePlanningRequest(WEEK_START));

        assertThat(response.totalCourses()).isEqualTo(1);
        assertThat(response.totalScheduled()).isEqualTo(0);
        assertThat(response.totalUnscheduled()).isEqualTo(1);
        assertThat(response.schoolResults().get(0).unscheduledCourses())
                .hasSize(1)
                .first()
                .extracting(c -> c.getCoursId())
                .isEqualTo(coursId);
    }

    @Test
    @DisplayName("generate() doit marquer un cours dont volumeHoraire > 4 comme non planifiable")
    void generate_volumeHoraireTooHigh_markedNonPlanifiable() {
        UUID ecoleId = UUID.randomUUID();
        UUID coursId = UUID.randomUUID();
        UUID enseignantId = UUID.randomUUID();

        when(bookingServiceClient.getAllEcoles()).thenReturn(List.of(ecole(ecoleId, "ESIS")));
        when(bookingServiceClient.getCoursByEcole(ecoleId)).thenReturn(List.of(
                cours(coursId, "Mega Cours", "CM", 5, enseignantId)
        ));
        when(bookingServiceClient.getSallesByEcole(ecoleId)).thenReturn(List.of(room(ecoleId)));
        when(bookingServiceClient.getGroupesByCours(coursId)).thenReturn(Collections.emptyList());
        when(userServiceClient.getEffectiveDisponibilites(eq(enseignantId), any()))
                .thenReturn(List.of(dispo(enseignantId, "MONDAY", "08:00", "17:00")));
        when(emploiDuTempsService.createEmploiDuTemps(any())).thenReturn(emploiResponse(UUID.randomUUID()));

        CampusGenerationResponse response = service.generate(new GeneratePlanningRequest(WEEK_START));

        assertThat(response.totalUnscheduled()).isEqualTo(1);
        assertThat(response.schoolResults().get(0).unscheduledCourses().get(0).getRaison())
                .contains("4h");
    }

    @Test
    @DisplayName("generate() doit planifier un cours quand enseignant et salle sont disponibles")
    void generate_availableTeacherAndRoom_courseIsScheduled() {
        UUID ecoleId = UUID.randomUUID();
        UUID emploiId = UUID.randomUUID();
        UUID coursId = UUID.randomUUID();
        UUID enseignantId = UUID.randomUUID();
        UUID salleId = UUID.randomUUID();
        UUID groupeId = UUID.randomUUID();

        when(bookingServiceClient.getAllEcoles()).thenReturn(List.of(ecole(ecoleId, "ESIS")));
        when(bookingServiceClient.getCoursByEcole(ecoleId)).thenReturn(List.of(
                cours(coursId, "Algorithmes", "CM", 1, enseignantId)
        ));
        when(bookingServiceClient.getSallesByEcole(ecoleId)).thenReturn(List.of(
                new BookingServiceClient.SalleDTO(salleId, "A101", "Amphi A", "CM", 100, ecoleId)
        ));
        when(userServiceClient.getEffectiveDisponibilites(eq(enseignantId), any()))
                .thenReturn(List.of(dispo(enseignantId, "MONDAY", "08:00", "17:00")));
        when(bookingServiceClient.getGroupesByCours(coursId))
                .thenReturn(List.of(new BookingServiceClient.GroupeDTO(groupeId, 1, 30, "CM")));
        when(emploiDuTempsService.createEmploiDuTemps(any())).thenReturn(emploiResponse(emploiId));
        when(bookingServiceClient.createReservation(any())).thenReturn(reservationDTO(coursId, salleId, enseignantId));
        when(creneauService.createCreneau(any(), any())).thenReturn(new CreneauResponseDTO());

        CampusGenerationResponse response = service.generate(new GeneratePlanningRequest(WEEK_START));

        assertThat(response.totalScheduled()).isEqualTo(1);
        assertThat(response.totalUnscheduled()).isEqualTo(0);
        assertThat(response.overallSuccessRate()).isEqualTo(100.0);
        verify(creneauService, times(1)).createCreneau(eq(emploiId), any());
        verify(bookingServiceClient, times(1)).createReservation(any());
    }

    @Test
    @DisplayName("generate() doit créer un EmploiDuTemps distinct par école")
    void generate_twoSchools_createsOneEmploiPerSchool() {
        UUID ecoleAId = UUID.randomUUID();
        UUID ecoleBId = UUID.randomUUID();
        UUID teacherAId = UUID.randomUUID();
        UUID teacherBId = UUID.randomUUID();

        when(bookingServiceClient.getAllEcoles()).thenReturn(List.of(ecole(ecoleAId, "SJI"), ecole(ecoleBId, "SJM")));
        when(bookingServiceClient.getCoursByEcole(ecoleAId)).thenReturn(List.of(cours(UUID.randomUUID(), "Maths", "CM", 1, teacherAId)));
        when(bookingServiceClient.getCoursByEcole(ecoleBId)).thenReturn(List.of(cours(UUID.randomUUID(), "Gestion", "CM", 1, teacherBId)));
        when(bookingServiceClient.getSallesByEcole(any())).thenReturn(List.of(room(ecoleAId)));
        when(userServiceClient.getEffectiveDisponibilites(eq(teacherAId), any()))
                .thenReturn(List.of(dispo(teacherAId, "MONDAY", "08:00", "17:00")));
        when(userServiceClient.getEffectiveDisponibilites(eq(teacherBId), any()))
                .thenReturn(List.of(dispo(teacherBId, "TUESDAY", "08:00", "17:00")));
        when(bookingServiceClient.getGroupesByCours(any())).thenReturn(Collections.emptyList());
        when(emploiDuTempsService.createEmploiDuTemps(any())).thenAnswer(inv -> emploiResponse(UUID.randomUUID()));
        when(bookingServiceClient.createReservation(any())).thenReturn(reservationDTO(null, null, null));
        when(creneauService.createCreneau(any(), any())).thenReturn(new CreneauResponseDTO());

        CampusGenerationResponse response = service.generate(new GeneratePlanningRequest(WEEK_START));

        assertThat(response.schoolResults()).hasSize(2);
        verify(emploiDuTempsService, times(2)).createEmploiDuTemps(any());
    }

    @Test
    @DisplayName("Ford-Fulkerson doit empêcher le double-booking d'un enseignant sur son seul créneau disponible")
    void generate_sharedTeacherSingleSlot_onlyScheduledOnce() {
        UUID ecoleAId = UUID.randomUUID();
        UUID ecoleBId = UUID.randomUUID();
        UUID sharedTeacherId = UUID.randomUUID();
        UUID coursAId = UUID.randomUUID();
        UUID coursBId = UUID.randomUUID();

        List<UserServiceClient.DisponibiliteDTO> singleSlotAvailability = List.of(
                new UserServiceClient.DisponibiliteDTO(
                        UUID.randomUUID(), sharedTeacherId, "MONDAY", "08:00", "09:00", true
                )
        );

        when(bookingServiceClient.getAllEcoles()).thenReturn(List.of(ecole(ecoleAId, "SJI"), ecole(ecoleBId, "SJM")));
        when(bookingServiceClient.getCoursByEcole(ecoleAId)).thenReturn(List.of(cours(coursAId, "Maths A", "CM", 1, sharedTeacherId)));
        when(bookingServiceClient.getCoursByEcole(ecoleBId)).thenReturn(List.of(cours(coursBId, "Maths B", "CM", 1, sharedTeacherId)));
        when(bookingServiceClient.getSallesByEcole(any())).thenReturn(List.of(room(ecoleAId)));
        when(userServiceClient.getEffectiveDisponibilites(eq(sharedTeacherId), any())).thenReturn(singleSlotAvailability);
        when(bookingServiceClient.getGroupesByCours(any())).thenReturn(Collections.emptyList());
        when(emploiDuTempsService.createEmploiDuTemps(any())).thenAnswer(inv -> emploiResponse(UUID.randomUUID()));
        when(bookingServiceClient.createReservation(any())).thenReturn(reservationDTO(null, null, null));
        when(creneauService.createCreneau(any(), any())).thenReturn(new CreneauResponseDTO());

        CampusGenerationResponse response = service.generate(new GeneratePlanningRequest(WEEK_START));

        assertThat(response.totalScheduled() + response.totalUnscheduled()).isEqualTo(2);
        assertThat(response.totalScheduled()).isEqualTo(1);
        assertThat(response.totalUnscheduled()).isEqualTo(1);
    }

    @Test
    @DisplayName("generate() doit retourner les bonnes statistiques globales")
    void generate_returnsCorrectStatistics() {
        UUID ecoleId = UUID.randomUUID();
        UUID enseignantId = UUID.randomUUID();
        UUID schedulableId = UUID.randomUUID();
        UUID noTeacherId = UUID.randomUUID();

        when(bookingServiceClient.getAllEcoles()).thenReturn(List.of(ecole(ecoleId, "ESIS")));
        when(bookingServiceClient.getCoursByEcole(ecoleId)).thenReturn(List.of(
                cours(schedulableId, "Algo", "CM", 1, enseignantId),
                cours(noTeacherId, "Orphelin", "TD", 1, null)
        ));
        when(bookingServiceClient.getSallesByEcole(ecoleId)).thenReturn(List.of(room(ecoleId)));
        when(userServiceClient.getEffectiveDisponibilites(eq(enseignantId), any()))
                .thenReturn(List.of(dispo(enseignantId, "MONDAY", "08:00", "17:00")));
        when(bookingServiceClient.getGroupesByCours(any())).thenReturn(Collections.emptyList());
        when(emploiDuTempsService.createEmploiDuTemps(any())).thenReturn(emploiResponse(UUID.randomUUID()));
        when(bookingServiceClient.createReservation(any())).thenReturn(reservationDTO(null, null, null));
        when(creneauService.createCreneau(any(), any())).thenReturn(new CreneauResponseDTO());

        CampusGenerationResponse response = service.generate(new GeneratePlanningRequest(WEEK_START));

        assertThat(response.totalCourses()).isEqualTo(2);
        assertThat(response.totalScheduled()).isEqualTo(1);
        assertThat(response.totalUnscheduled()).isEqualTo(1);
        assertThat(response.overallSuccessRate()).isEqualTo(50.0);
        assertThat(response.generationDurationMs()).isGreaterThanOrEqualTo(0);
    }

    private BookingServiceClient.EcoleDTO ecole(UUID id, String nom) {
        return new BookingServiceClient.EcoleDTO(id, nom, nom);
    }

    private BookingServiceClient.CoursDTO cours(UUID id, String intitule, String type, int volumeHoraire, UUID enseignantId) {
        return new BookingServiceClient.CoursDTO(id, intitule, type, volumeHoraire, 30, UUID.randomUUID(), UUID.randomUUID(), enseignantId);
    }

    private BookingServiceClient.SalleDTO room(UUID ecoleId) {
        return new BookingServiceClient.SalleDTO(UUID.randomUUID(), "A101", "Amphi A", "CM", 100, ecoleId);
    }

    private UserServiceClient.DisponibiliteDTO dispo(UUID enseignantId, String jour, String debut, String fin) {
        return new UserServiceClient.DisponibiliteDTO(UUID.randomUUID(), enseignantId, jour, debut, fin, true);
    }

    private EmploiDuTempsResponseDTO emploiResponse(UUID id) {
        EmploiDuTempsResponseDTO r = new EmploiDuTempsResponseDTO();
        r.setId(id);
        r.setDateDebut(WEEK_START);
        r.setDateFin(WEEK_START.plusDays(5));
        r.setStatut(StatutEmploi.DRAFT);
        return r;
    }

    private BookingServiceClient.ReservationDTO reservationDTO(UUID coursId, UUID salleId, UUID enseignantId) {
        return new BookingServiceClient.ReservationDTO(
                UUID.randomUUID(), WEEK_START.toString(), "08:00", "09:00", "MONDAY",
                "UNIQUE", "RESERVE", coursId, salleId, null, enseignantId
        );
    }
}
