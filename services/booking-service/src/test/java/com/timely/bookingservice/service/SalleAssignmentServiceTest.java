package com.timely.bookingservice.service;

import com.timely.bookingservice.dto.request.AutoAssignSalleRequest;
import com.timely.bookingservice.dto.response.SalleResponse;
import com.timely.bookingservice.entity.Equipement;
import com.timely.bookingservice.entity.Reservation;
import com.timely.bookingservice.entity.Salle;
import com.timely.bookingservice.entity.enums.StatutSalle;
import com.timely.bookingservice.entity.enums.TypeCours;
import com.timely.bookingservice.entity.enums.TypeSalle;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.SalleMapper;
import com.timely.bookingservice.repository.ReservationRepository;
import com.timely.bookingservice.repository.SalleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for SalleAssignmentService.
 * Validates the 6-step progressive filtering algorithm (F2.4):
 * 1. Get active rooms
 * 2. Filter by availability (no time conflicts)
 * 3. Filter by compatible room type
 * 4. Filter by sufficient capacity
 * 5. Filter by required equipment (optional)
 * 6. Select room with closest capacity (minimize waste)
 */
@ExtendWith(MockitoExtension.class)
class SalleAssignmentServiceTest {

    @Mock
    private SalleRepository salleRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private SalleMapper salleMapper;

    @InjectMocks
    private SalleAssignmentService salleAssignmentService;

    @Test
    void autoAssign_availableSlot_returnsOptimalRoom() {
        // Arrange
        UUID ecoleId = UUID.randomUUID();
        AutoAssignSalleRequest request = AutoAssignSalleRequest.builder()
                .ecoleId(ecoleId)
                .typeCours(TypeCours.TD)
                .capaciteRequise(30)
                .dateReservation(LocalDate.of(2026, 2, 15))
                .heureDebut(LocalTime.of(9, 0))
                .heureFin(LocalTime.of(11, 0))
                .build();

        Salle salle1 = createSalle(UUID.randomUUID(), "A101", TypeSalle.SALLE_COURS, 35);
        Salle salle2 = createSalle(UUID.randomUUID(), "A102", TypeSalle.SALLE_COURS, 50);

        List<Salle> activeSalles = Arrays.asList(salle1, salle2);
        SalleResponse expectedResponse = new SalleResponse();
        expectedResponse.setNumero("A101");
        expectedResponse.setCapacite(35);

        when(salleRepository.findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE))
                .thenReturn(activeSalles);
        when(reservationRepository.findChevauchements(
                any(UUID.class),
                eq(request.getDateReservation()),
                eq(request.getHeureDebut()),
                eq(request.getHeureFin())
        )).thenReturn(Collections.emptyList());
        when(salleMapper.toResponse(salle1)).thenReturn(expectedResponse);

        // Act
        SalleResponse result = salleAssignmentService.findOptimalSalle(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getNumero()).isEqualTo("A101");
        assertThat(result.getCapacite()).isEqualTo(35);
        verify(salleRepository).findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE);
        verify(salleMapper).toResponse(salle1);
    }

    @Test
    void autoAssign_allRoomsOccupied_throws404() {
        // Arrange
        UUID ecoleId = UUID.randomUUID();
        AutoAssignSalleRequest request = AutoAssignSalleRequest.builder()
                .ecoleId(ecoleId)
                .typeCours(TypeCours.CM)
                .capaciteRequise(100)
                .dateReservation(LocalDate.of(2026, 2, 15))
                .heureDebut(LocalTime.of(14, 0))
                .heureFin(LocalTime.of(16, 0))
                .build();

        Salle salle1 = createSalle(UUID.randomUUID(), "AMPHI-A", TypeSalle.AMPHITHEATRE, 150);
        List<Salle> activeSalles = List.of(salle1);
        List<Reservation> conflicts = List.of(new Reservation());

        when(salleRepository.findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE))
                .thenReturn(activeSalles);
        when(reservationRepository.findChevauchements(
                eq(salle1.getId()),
                eq(request.getDateReservation()),
                eq(request.getHeureDebut()),
                eq(request.getHeureFin())
        )).thenReturn(conflicts);

        // Act & Assert
        assertThatThrownBy(() -> salleAssignmentService.findOptimalSalle(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("No available rooms found for the requested time slot");

        verify(salleRepository).findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE);
        verify(reservationRepository).findChevauchements(
                eq(salle1.getId()),
                eq(request.getDateReservation()),
                eq(request.getHeureDebut()),
                eq(request.getHeureFin())
        );
    }

    @Test
    void autoAssign_filtersByCompatibleType_CM_Amphi() {
        // Arrange
        UUID ecoleId = UUID.randomUUID();
        AutoAssignSalleRequest request = AutoAssignSalleRequest.builder()
                .ecoleId(ecoleId)
                .typeCours(TypeCours.CM)
                .capaciteRequise(80)
                .dateReservation(LocalDate.of(2026, 2, 15))
                .heureDebut(LocalTime.of(10, 0))
                .heureFin(LocalTime.of(12, 0))
                .build();

        // CM can use AMPHITHEATRE or SALLE_COURS, but not LABORATOIRE
        Salle amphitheatre = createSalle(UUID.randomUUID(), "AMPHI-B", TypeSalle.AMPHITHEATRE, 120);
        Salle salleCours = createSalle(UUID.randomUUID(), "B101", TypeSalle.SALLE_COURS, 90);
        Salle laboratoire = createSalle(UUID.randomUUID(), "LAB-01", TypeSalle.LABORATOIRE, 100);

        List<Salle> activeSalles = Arrays.asList(amphitheatre, salleCours, laboratoire);
        SalleResponse expectedResponse = new SalleResponse();
        expectedResponse.setNumero("B101");

        when(salleRepository.findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE))
                .thenReturn(activeSalles);
        when(reservationRepository.findChevauchements(
                any(UUID.class),
                eq(request.getDateReservation()),
                eq(request.getHeureDebut()),
                eq(request.getHeureFin())
        )).thenReturn(Collections.emptyList());
        when(salleMapper.toResponse(salleCours)).thenReturn(expectedResponse);

        // Act
        SalleResponse result = salleAssignmentService.findOptimalSalle(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getNumero()).isEqualTo("B101");
        verify(salleRepository).findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE);
    }

    @Test
    void autoAssign_filtersByCompatibleType_TP_Labo() {
        // Arrange
        UUID ecoleId = UUID.randomUUID();
        AutoAssignSalleRequest request = AutoAssignSalleRequest.builder()
                .ecoleId(ecoleId)
                .typeCours(TypeCours.TP)
                .capaciteRequise(25)
                .dateReservation(LocalDate.of(2026, 2, 16))
                .heureDebut(LocalTime.of(8, 0))
                .heureFin(LocalTime.of(10, 0))
                .build();

        // TP requires LABORATOIRE only
        Salle laboratoire = createSalle(UUID.randomUUID(), "LAB-02", TypeSalle.LABORATOIRE, 30);
        Salle salleCours = createSalle(UUID.randomUUID(), "C201", TypeSalle.SALLE_COURS, 40);

        List<Salle> activeSalles = Arrays.asList(laboratoire, salleCours);
        SalleResponse expectedResponse = new SalleResponse();
        expectedResponse.setNumero("LAB-02");
        expectedResponse.setTypeSalle(TypeSalle.LABORATOIRE);

        when(salleRepository.findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE))
                .thenReturn(activeSalles);
        when(reservationRepository.findChevauchements(
                any(UUID.class),
                eq(request.getDateReservation()),
                eq(request.getHeureDebut()),
                eq(request.getHeureFin())
        )).thenReturn(Collections.emptyList());
        when(salleMapper.toResponse(laboratoire)).thenReturn(expectedResponse);

        // Act
        SalleResponse result = salleAssignmentService.findOptimalSalle(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getNumero()).isEqualTo("LAB-02");
        assertThat(result.getTypeSalle()).isEqualTo(TypeSalle.LABORATOIRE);
        verify(salleRepository).findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE);
    }

    @Test
    void autoAssign_filtersBySufficientCapacity() {
        // Arrange
        UUID ecoleId = UUID.randomUUID();
        AutoAssignSalleRequest request = AutoAssignSalleRequest.builder()
                .ecoleId(ecoleId)
                .typeCours(TypeCours.TD)
                .capaciteRequise(40)
                .dateReservation(LocalDate.of(2026, 2, 17))
                .heureDebut(LocalTime.of(13, 0))
                .heureFin(LocalTime.of(15, 0))
                .build();

        // Only salle2 has sufficient capacity (>= 40)
        Salle salle1 = createSalle(UUID.randomUUID(), "D101", TypeSalle.SALLE_COURS, 25);
        Salle salle2 = createSalle(UUID.randomUUID(), "D102", TypeSalle.SALLE_COURS, 45);
        Salle salle3 = createSalle(UUID.randomUUID(), "D103", TypeSalle.SALLE_COURS, 35);

        List<Salle> activeSalles = Arrays.asList(salle1, salle2, salle3);
        SalleResponse expectedResponse = new SalleResponse();
        expectedResponse.setNumero("D102");
        expectedResponse.setCapacite(45);

        when(salleRepository.findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE))
                .thenReturn(activeSalles);
        when(reservationRepository.findChevauchements(
                any(UUID.class),
                eq(request.getDateReservation()),
                eq(request.getHeureDebut()),
                eq(request.getHeureFin())
        )).thenReturn(Collections.emptyList());
        when(salleMapper.toResponse(salle2)).thenReturn(expectedResponse);

        // Act
        SalleResponse result = salleAssignmentService.findOptimalSalle(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getNumero()).isEqualTo("D102");
        assertThat(result.getCapacite()).isEqualTo(45);
        verify(salleRepository).findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE);
    }

    @Test
    void autoAssign_filtersByRequiredEquipment() {
        // Arrange
        UUID ecoleId = UUID.randomUUID();
        UUID projecteurId = UUID.randomUUID();
        UUID microId = UUID.randomUUID();

        AutoAssignSalleRequest request = AutoAssignSalleRequest.builder()
                .ecoleId(ecoleId)
                .typeCours(TypeCours.CM)
                .capaciteRequise(60)
                .dateReservation(LocalDate.of(2026, 2, 18))
                .heureDebut(LocalTime.of(9, 0))
                .heureFin(LocalTime.of(11, 0))
                .equipementIds(Arrays.asList(projecteurId, microId))
                .build();

        // salle1 has both required equipment, salle2 only has projecteur
        Equipement projecteur = createEquipement(projecteurId, "PROJECTEUR");
        Equipement micro = createEquipement(microId, "MICRO");

        Salle salle1 = createSalle(UUID.randomUUID(), "AMPHI-C", TypeSalle.AMPHITHEATRE, 80);
        salle1.setEquipements(new HashSet<>(Arrays.asList(projecteur, micro)));

        Salle salle2 = createSalle(UUID.randomUUID(), "AMPHI-D", TypeSalle.AMPHITHEATRE, 70);
        salle2.setEquipements(new HashSet<>(List.of(projecteur)));

        List<Salle> activeSalles = Arrays.asList(salle1, salle2);
        SalleResponse expectedResponse = new SalleResponse();
        expectedResponse.setNumero("AMPHI-C");

        when(salleRepository.findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE))
                .thenReturn(activeSalles);
        when(reservationRepository.findChevauchements(
                any(UUID.class),
                eq(request.getDateReservation()),
                eq(request.getHeureDebut()),
                eq(request.getHeureFin())
        )).thenReturn(Collections.emptyList());
        when(salleMapper.toResponse(salle1)).thenReturn(expectedResponse);

        // Act
        SalleResponse result = salleAssignmentService.findOptimalSalle(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getNumero()).isEqualTo("AMPHI-C");
        verify(salleRepository).findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE);
    }

    @Test
    void autoAssign_selectsClosestCapacity_minimizesWaste() {
        // Arrange
        UUID ecoleId = UUID.randomUUID();
        AutoAssignSalleRequest request = AutoAssignSalleRequest.builder()
                .ecoleId(ecoleId)
                .typeCours(TypeCours.TD)
                .capaciteRequise(30)
                .dateReservation(LocalDate.of(2026, 2, 19))
                .heureDebut(LocalTime.of(10, 0))
                .heureFin(LocalTime.of(12, 0))
                .build();

        // All rooms are compatible and available, but closest to 30 is 32 (waste: 2)
        Salle salle1 = createSalle(UUID.randomUUID(), "E101", TypeSalle.SALLE_COURS, 50); // waste: 20
        Salle salle2 = createSalle(UUID.randomUUID(), "E102", TypeSalle.SALLE_COURS, 32); // waste: 2 (optimal)
        Salle salle3 = createSalle(UUID.randomUUID(), "E103", TypeSalle.SALLE_COURS, 40); // waste: 10

        List<Salle> activeSalles = Arrays.asList(salle1, salle2, salle3);
        SalleResponse expectedResponse = new SalleResponse();
        expectedResponse.setNumero("E102");
        expectedResponse.setCapacite(32);

        when(salleRepository.findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE))
                .thenReturn(activeSalles);
        when(reservationRepository.findChevauchements(
                any(UUID.class),
                eq(request.getDateReservation()),
                eq(request.getHeureDebut()),
                eq(request.getHeureFin())
        )).thenReturn(Collections.emptyList());
        when(salleMapper.toResponse(salle2)).thenReturn(expectedResponse);

        // Act
        SalleResponse result = salleAssignmentService.findOptimalSalle(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getNumero()).isEqualTo("E102");
        assertThat(result.getCapacite()).isEqualTo(32);
        // Verify waste minimization: capacity - required = 32 - 30 = 2 (smallest)
        assertThat(result.getCapacite() - request.getCapaciteRequise()).isEqualTo(2);
        verify(salleRepository).findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE);
    }

    @Test
    void autoAssign_noEquipmentRequired_skipsEquipmentFilter() {
        // Arrange
        UUID ecoleId = UUID.randomUUID();
        AutoAssignSalleRequest request = AutoAssignSalleRequest.builder()
                .ecoleId(ecoleId)
                .typeCours(TypeCours.TD)
                .capaciteRequise(25)
                .dateReservation(LocalDate.of(2026, 2, 20))
                .heureDebut(LocalTime.of(14, 0))
                .heureFin(LocalTime.of(16, 0))
                .equipementIds(null) // No equipment required
                .build();

        // Both rooms are valid, but salle1 is closest (28 vs 35)
        Salle salle1 = createSalle(UUID.randomUUID(), "F101", TypeSalle.SALLE_COURS, 28);
        salle1.setEquipements(new HashSet<>()); // No equipment

        Salle salle2 = createSalle(UUID.randomUUID(), "F102", TypeSalle.SALLE_COURS, 35);
        Equipement projecteur = createEquipement(UUID.randomUUID(), "PROJECTEUR");
        salle2.setEquipements(new HashSet<>(List.of(projecteur)));

        List<Salle> activeSalles = Arrays.asList(salle1, salle2);
        SalleResponse expectedResponse = new SalleResponse();
        expectedResponse.setNumero("F101");
        expectedResponse.setCapacite(28);

        when(salleRepository.findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE))
                .thenReturn(activeSalles);
        when(reservationRepository.findChevauchements(
                any(UUID.class),
                eq(request.getDateReservation()),
                eq(request.getHeureDebut()),
                eq(request.getHeureFin())
        )).thenReturn(Collections.emptyList());
        when(salleMapper.toResponse(salle1)).thenReturn(expectedResponse);

        // Act
        SalleResponse result = salleAssignmentService.findOptimalSalle(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getNumero()).isEqualTo("F101");
        assertThat(result.getCapacite()).isEqualTo(28);
        verify(salleRepository).findByEcoleIdAndStatut(ecoleId, StatutSalle.ACTIVE);
    }

    // Helper methods for test data creation

    private Salle createSalle(UUID id, String numero, TypeSalle typeSalle, Integer capacite) {
        Salle salle = new Salle();
        salle.setId(id);
        salle.setNumero(numero);
        salle.setTypeSalle(typeSalle);
        salle.setCapacite(capacite);
        salle.setStatut(StatutSalle.ACTIVE);
        salle.setEquipements(new HashSet<>());
        return salle;
    }

    private Equipement createEquipement(UUID id, String nom) {
        Equipement equipement = new Equipement();
        equipement.setId(id);
        equipement.setNom(nom);
        equipement.setCode(nom);
        return equipement;
    }
}
