package com.timely.bookingservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.timely.bookingservice.dto.request.SalleRequest;
import com.timely.bookingservice.dto.response.SalleResponse;
import com.timely.bookingservice.entity.Ecole;
import com.timely.bookingservice.entity.Equipement;
import com.timely.bookingservice.entity.Salle;
import com.timely.bookingservice.entity.enums.StatutSalle;
import com.timely.bookingservice.entity.enums.TypeSalle;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.SalleMapper;
import com.timely.bookingservice.repository.EcoleRepository;
import com.timely.bookingservice.repository.EquipementRepository;
import com.timely.bookingservice.repository.SalleRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("SalleService Unit Tests")
class SalleServiceTest {

    @Mock
    private SalleRepository salleRepository;

    @Mock
    private EcoleRepository ecoleRepository;

    @Mock
    private EquipementRepository equipementRepository;

    @Mock
    private SalleMapper salleMapper;

    @InjectMocks
    private SalleService salleService;

    private UUID salleId;
    private UUID ecoleId;
    private UUID equipementId1;
    private UUID equipementId2;
    private Salle salle;
    private Ecole ecole;
    private Equipement equipement1;
    private Equipement equipement2;
    private SalleRequest salleRequest;
    private SalleResponse salleResponse;

    @BeforeEach
    void setUp() {
        // Initialize IDs
        salleId = UUID.randomUUID();
        ecoleId = UUID.randomUUID();
        equipementId1 = UUID.randomUUID();
        equipementId2 = UUID.randomUUID();

        // Setup Ecole
        ecole = new Ecole();
        ecole.setId(ecoleId);
        ecole.setNom("École de Technologie");
        ecole.setCode("TECH");
        ecole.setDateCreation(LocalDateTime.now());

        // Setup Equipements
        equipement1 = new Equipement();
        equipement1.setId(equipementId1);
        equipement1.setNom("Projecteur");
        equipement1.setCode("PROJ-001");
        equipement1.setQuantiteDisponible(10);

        equipement2 = new Equipement();
        equipement2.setId(equipementId2);
        equipement2.setNom("Tableau interactif");
        equipement2.setCode("TBI-001");
        equipement2.setQuantiteDisponible(5);

        // Setup Salle entity
        salle = new Salle();
        salle.setId(salleId);
        salle.setEcole(ecole);
        salle.setNumero("A101");
        salle.setNom("Amphithéâtre Principal");
        salle.setTypeSalle(TypeSalle.AMPHITHEATRE);
        salle.setCapacite(150);
        salle.setSuperficieM2(200.0);
        salle.setBatiment("Bâtiment A");
        salle.setEtage("1er étage");
        salle.setStatut(StatutSalle.ACTIVE);
        salle.setDateCreation(LocalDateTime.now());

        Set<Equipement> equipements = new HashSet<>();
        equipements.add(equipement1);
        equipements.add(equipement2);
        salle.setEquipements(equipements);

        // Setup SalleRequest
        salleRequest = new SalleRequest();
        salleRequest.setEcoleId(ecoleId);
        salleRequest.setNumero("A101");
        salleRequest.setNom("Amphithéâtre Principal");
        salleRequest.setTypeSalle(TypeSalle.AMPHITHEATRE);
        salleRequest.setCapacite(150);
        salleRequest.setSuperficieM2(200.0);
        salleRequest.setBatiment("Bâtiment A");
        salleRequest.setEtage("1er étage");
        salleRequest.setStatut(StatutSalle.ACTIVE);
        salleRequest.setEquipementIds(Set.of(equipementId1, equipementId2));

        // Setup SalleResponse
        salleResponse = new SalleResponse();
        salleResponse.setId(salleId);
        salleResponse.setEcoleId(ecoleId);
        salleResponse.setEcoleNom("École de Technologie");
        salleResponse.setNumero("A101");
        salleResponse.setNom("Amphithéâtre Principal");
        salleResponse.setTypeSalle(TypeSalle.AMPHITHEATRE);
        salleResponse.setCapacite(150);
        salleResponse.setSuperficieM2(200.0);
        salleResponse.setBatiment("Bâtiment A");
        salleResponse.setEtage("1er étage");
        salleResponse.setStatut(StatutSalle.ACTIVE);
        salleResponse.setDateCreation(LocalDateTime.now());
    }

    @Test
    @DisplayName("getById - Existing ID - Returns Salle")
    void getById_existingId_returnsSalle() {
        // Arrange
        when(salleRepository.findById(salleId)).thenReturn(Optional.of(salle));
        when(salleMapper.toResponse(salle)).thenReturn(salleResponse);

        // Act
        SalleResponse result = salleService.getById(salleId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(salleId);
        assertThat(result.getNumero()).isEqualTo("A101");
        assertThat(result.getNom()).isEqualTo("Amphithéâtre Principal");
        assertThat(result.getTypeSalle()).isEqualTo(TypeSalle.AMPHITHEATRE);
        assertThat(result.getCapacite()).isEqualTo(150);
        assertThat(result.getEcoleId()).isEqualTo(ecoleId);
        assertThat(result.getEcoleNom()).isEqualTo("École de Technologie");

        verify(salleRepository).findById(salleId);
        verify(salleMapper).toResponse(salle);
    }

    @Test
    @DisplayName("getById - Not Found - Throws ResourceNotFoundException")
    void getById_notFound_throwsException() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(salleRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> salleService.getById(nonExistentId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Salle non trouvée avec l'id: " + nonExistentId);

        verify(salleRepository).findById(nonExistentId);
        verify(salleMapper, never()).toResponse(any());
    }

    @Test
    @DisplayName("getByEcoleId - Existing Ecole - Returns Salles")
    void getByEcoleId_existingEcole_returnsSalles() {
        // Arrange
        Salle salle2 = new Salle();
        salle2.setId(UUID.randomUUID());
        salle2.setEcole(ecole);
        salle2.setNumero("A102");
        salle2.setNom("Salle de TP");
        salle2.setTypeSalle(TypeSalle.LABORATOIRE);
        salle2.setCapacite(30);
        salle2.setStatut(StatutSalle.ACTIVE);

        SalleResponse salleResponse2 = new SalleResponse();
        salleResponse2.setId(salle2.getId());
        salleResponse2.setEcoleId(ecoleId);
        salleResponse2.setEcoleNom("École de Technologie");
        salleResponse2.setNumero("A102");
        salleResponse2.setNom("Salle de TP");
        salleResponse2.setTypeSalle(TypeSalle.LABORATOIRE);
        salleResponse2.setCapacite(30);

        List<Salle> salles = List.of(salle, salle2);
        when(salleRepository.findByEcoleId(ecoleId)).thenReturn(salles);
        when(salleMapper.toResponse(salle)).thenReturn(salleResponse);
        when(salleMapper.toResponse(salle2)).thenReturn(salleResponse2);

        // Act
        List<SalleResponse> result = salleService.getByEcoleId(ecoleId);

        // Assert
        assertThat(result)
                .isNotNull()
                .hasSize(2);
        assertThat(result.get(0).getEcoleId()).isEqualTo(ecoleId);
        assertThat(result.get(1).getEcoleId()).isEqualTo(ecoleId);
        assertThat(result.get(0).getNumero()).isEqualTo("A101");
        assertThat(result.get(1).getNumero()).isEqualTo("A102");

        verify(salleRepository).findByEcoleId(ecoleId);
        verify(salleMapper).toResponse(salle);
        verify(salleMapper).toResponse(salle2);
    }

    @Test
    @DisplayName("getDisponibles - With Filters - Returns Filtered Salles")
    void getDisponibles_withFilters_returnsFiltered() {
        // Arrange
        Integer capaciteMin = 100;
        TypeSalle typeSalle = TypeSalle.AMPHITHEATRE;

        Salle salle2 = new Salle();
        salle2.setId(UUID.randomUUID());
        salle2.setEcole(ecole);
        salle2.setNumero("B201");
        salle2.setNom("Grand Amphithéâtre");
        salle2.setTypeSalle(TypeSalle.AMPHITHEATRE);
        salle2.setCapacite(200);
        salle2.setStatut(StatutSalle.ACTIVE);

        SalleResponse salleResponse2 = new SalleResponse();
        salleResponse2.setId(salle2.getId());
        salleResponse2.setNumero("B201");
        salleResponse2.setNom("Grand Amphithéâtre");
        salleResponse2.setTypeSalle(TypeSalle.AMPHITHEATRE);
        salleResponse2.setCapacite(200);

        List<Salle> sallesDisponibles = List.of(salle, salle2);
        when(salleRepository.findSallesDisponibles(capaciteMin, typeSalle))
                .thenReturn(sallesDisponibles);
        when(salleMapper.toResponse(salle)).thenReturn(salleResponse);
        when(salleMapper.toResponse(salle2)).thenReturn(salleResponse2);

        // Act
        List<SalleResponse> result = salleService.getDisponibles(capaciteMin, typeSalle);

        // Assert
        assertThat(result)
                .isNotNull()
                .hasSize(2);
        assertThat(result.get(0).getCapacite()).isGreaterThanOrEqualTo(capaciteMin);
        assertThat(result.get(1).getCapacite()).isGreaterThanOrEqualTo(capaciteMin);
        assertThat(result.get(0).getTypeSalle()).isEqualTo(typeSalle);
        assertThat(result.get(1).getTypeSalle()).isEqualTo(typeSalle);

        verify(salleRepository).findSallesDisponibles(capaciteMin, typeSalle);
        verify(salleMapper).toResponse(salle);
        verify(salleMapper).toResponse(salle2);
    }

    @Test
    @DisplayName("create - Valid Request - Creates Salle")
    void create_validRequest_createsSalle() {
        // Arrange
        Salle newSalle = new Salle();
        newSalle.setNumero("A101");
        newSalle.setNom("Amphithéâtre Principal");
        newSalle.setTypeSalle(TypeSalle.AMPHITHEATRE);
        newSalle.setCapacite(150);
        newSalle.setSuperficieM2(200.0);
        newSalle.setBatiment("Bâtiment A");
        newSalle.setEtage("1er étage");
        newSalle.setStatut(StatutSalle.ACTIVE);

        Salle savedSalle = new Salle();
        savedSalle.setId(salleId);
        savedSalle.setEcole(ecole);
        savedSalle.setNumero("A101");
        savedSalle.setNom("Amphithéâtre Principal");
        savedSalle.setTypeSalle(TypeSalle.AMPHITHEATRE);
        savedSalle.setCapacite(150);
        savedSalle.setSuperficieM2(200.0);
        savedSalle.setBatiment("Bâtiment A");
        savedSalle.setEtage("1er étage");
        savedSalle.setStatut(StatutSalle.ACTIVE);
        savedSalle.setEquipements(Set.of(equipement1, equipement2));
        savedSalle.setDateCreation(LocalDateTime.now());

        when(ecoleRepository.findById(ecoleId)).thenReturn(Optional.of(ecole));
        when(salleMapper.toEntity(salleRequest)).thenReturn(newSalle);
        when(equipementRepository.findAllById(salleRequest.getEquipementIds()))
                .thenReturn(List.of(equipement1, equipement2));
        when(salleRepository.save(any(Salle.class))).thenReturn(savedSalle);
        when(salleMapper.toResponse(savedSalle)).thenReturn(salleResponse);

        // Act
        SalleResponse result = salleService.create(salleRequest);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(salleId);
        assertThat(result.getNumero()).isEqualTo("A101");
        assertThat(result.getNom()).isEqualTo("Amphithéâtre Principal");
        assertThat(result.getTypeSalle()).isEqualTo(TypeSalle.AMPHITHEATRE);
        assertThat(result.getCapacite()).isEqualTo(150);
        assertThat(result.getEcoleId()).isEqualTo(ecoleId);

        verify(ecoleRepository).findById(ecoleId);
        verify(salleMapper).toEntity(salleRequest);
        verify(equipementRepository).findAllById(salleRequest.getEquipementIds());
        verify(salleRepository).save(any(Salle.class));
        verify(salleMapper).toResponse(savedSalle);
    }

    @Test
    @DisplayName("update - Existing ID - Updates Salle")
    void update_existingId_updatesSalle() {
        // Arrange
        SalleRequest updateRequest = new SalleRequest();
        updateRequest.setEcoleId(ecoleId);
        updateRequest.setNumero("A101-UPDATED");
        updateRequest.setNom("Amphithéâtre Rénové");
        updateRequest.setTypeSalle(TypeSalle.AMPHITHEATRE);
        updateRequest.setCapacite(180);
        updateRequest.setSuperficieM2(220.0);
        updateRequest.setBatiment("Bâtiment A");
        updateRequest.setEtage("1er étage");
        updateRequest.setStatut(StatutSalle.ACTIVE);
        updateRequest.setEquipementIds(Set.of(equipementId1));

        Salle updatedSalle = new Salle();
        updatedSalle.setId(salleId);
        updatedSalle.setEcole(ecole);
        updatedSalle.setNumero("A101-UPDATED");
        updatedSalle.setNom("Amphithéâtre Rénové");
        updatedSalle.setTypeSalle(TypeSalle.AMPHITHEATRE);
        updatedSalle.setCapacite(180);
        updatedSalle.setSuperficieM2(220.0);
        updatedSalle.setBatiment("Bâtiment A");
        updatedSalle.setEtage("1er étage");
        updatedSalle.setStatut(StatutSalle.ACTIVE);
        updatedSalle.setEquipements(Set.of(equipement1));
        updatedSalle.setDateCreation(LocalDateTime.now().minusDays(30));
        updatedSalle.setDateModification(LocalDateTime.now());

        SalleResponse updatedResponse = new SalleResponse();
        updatedResponse.setId(salleId);
        updatedResponse.setEcoleId(ecoleId);
        updatedResponse.setEcoleNom("École de Technologie");
        updatedResponse.setNumero("A101-UPDATED");
        updatedResponse.setNom("Amphithéâtre Rénové");
        updatedResponse.setTypeSalle(TypeSalle.AMPHITHEATRE);
        updatedResponse.setCapacite(180);
        updatedResponse.setSuperficieM2(220.0);

        when(salleRepository.findById(salleId)).thenReturn(Optional.of(salle));
        when(equipementRepository.findAllById(updateRequest.getEquipementIds()))
                .thenReturn(List.of(equipement1));
        when(salleRepository.save(any(Salle.class))).thenReturn(updatedSalle);
        when(salleMapper.toResponse(updatedSalle)).thenReturn(updatedResponse);

        // Act
        SalleResponse result = salleService.update(salleId, updateRequest);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(salleId);
        assertThat(result.getNumero()).isEqualTo("A101-UPDATED");
        assertThat(result.getNom()).isEqualTo("Amphithéâtre Rénové");
        assertThat(result.getCapacite()).isEqualTo(180);
        assertThat(result.getSuperficieM2()).isEqualTo(220.0);

        verify(salleRepository).findById(salleId);
        verify(equipementRepository).findAllById(updateRequest.getEquipementIds());
        verify(salleMapper).updateEntity(eq(updateRequest), any(Salle.class));
        verify(salleRepository).save(any(Salle.class));
        verify(salleMapper).toResponse(updatedSalle);
    }

    @Test
    @DisplayName("delete - Existing ID - Deletes Salle")
    void delete_existingId_deletesSalle() {
        // Arrange
        when(salleRepository.existsById(salleId)).thenReturn(true);

        // Act
        salleService.delete(salleId);

        // Assert
        verify(salleRepository).existsById(salleId);
        verify(salleRepository).deleteById(salleId);
    }

    @Test
    @DisplayName("delete - Non-Existing ID - Throws ResourceNotFoundException")
    void delete_nonExistingId_throwsException() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(salleRepository.existsById(nonExistentId)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> salleService.delete(nonExistentId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Salle non trouvée avec l'id: " + nonExistentId);

        verify(salleRepository).existsById(nonExistentId);
        verify(salleRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("create - Ecole Not Found - Throws ResourceNotFoundException")
    void create_ecoleNotFound_throwsException() {
        // Arrange
        when(ecoleRepository.findById(ecoleId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> salleService.create(salleRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("École non trouvée avec l'id: " + ecoleId);

        verify(ecoleRepository).findById(ecoleId);
        verify(salleMapper, never()).toEntity(any());
        verify(salleRepository, never()).save(any());
    }

    @Test
    @DisplayName("create - Without Equipements - Creates Salle Successfully")
    void create_withoutEquipements_createsSalle() {
        // Arrange
        SalleRequest requestWithoutEquipements = new SalleRequest();
        requestWithoutEquipements.setEcoleId(ecoleId);
        requestWithoutEquipements.setNumero("B202");
        requestWithoutEquipements.setNom("Salle Simple");
        requestWithoutEquipements.setTypeSalle(TypeSalle.SALLE_COURS);
        requestWithoutEquipements.setCapacite(30);
        requestWithoutEquipements.setStatut(StatutSalle.ACTIVE);
        requestWithoutEquipements.setEquipementIds(null);

        Salle newSalle = new Salle();
        newSalle.setNumero("B202");
        newSalle.setNom("Salle Simple");
        newSalle.setTypeSalle(TypeSalle.SALLE_COURS);
        newSalle.setCapacite(30);
        newSalle.setStatut(StatutSalle.ACTIVE);

        Salle savedSalle = new Salle();
        savedSalle.setId(UUID.randomUUID());
        savedSalle.setEcole(ecole);
        savedSalle.setNumero("B202");
        savedSalle.setNom("Salle Simple");
        savedSalle.setTypeSalle(TypeSalle.SALLE_COURS);
        savedSalle.setCapacite(30);
        savedSalle.setStatut(StatutSalle.ACTIVE);

        SalleResponse response = new SalleResponse();
        response.setId(savedSalle.getId());
        response.setNumero("B202");
        response.setNom("Salle Simple");
        response.setEcoleId(ecoleId);

        when(ecoleRepository.findById(ecoleId)).thenReturn(Optional.of(ecole));
        when(salleMapper.toEntity(requestWithoutEquipements)).thenReturn(newSalle);
        when(salleRepository.save(any(Salle.class))).thenReturn(savedSalle);
        when(salleMapper.toResponse(savedSalle)).thenReturn(response);

        // Act
        SalleResponse result = salleService.create(requestWithoutEquipements);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getNumero()).isEqualTo("B202");
        assertThat(result.getNom()).isEqualTo("Salle Simple");

        verify(ecoleRepository).findById(ecoleId);
        verify(salleMapper).toEntity(requestWithoutEquipements);
        verify(equipementRepository, never()).findAllById(anyList());
        verify(salleRepository).save(any(Salle.class));
        verify(salleMapper).toResponse(savedSalle);
    }

    @Test
    @DisplayName("update - With Ecole Change - Updates Ecole")
    void update_withEcoleChange_updatesEcole() {
        // Arrange
        UUID newEcoleId = UUID.randomUUID();
        Ecole newEcole = new Ecole();
        newEcole.setId(newEcoleId);
        newEcole.setNom("Nouvelle École");
        newEcole.setCode("NEW");

        SalleRequest updateRequest = new SalleRequest();
        updateRequest.setEcoleId(newEcoleId);
        updateRequest.setNumero("A101");
        updateRequest.setNom("Amphithéâtre Principal");
        updateRequest.setTypeSalle(TypeSalle.AMPHITHEATRE);
        updateRequest.setCapacite(150);
        updateRequest.setStatut(StatutSalle.ACTIVE);

        Salle updatedSalle = new Salle();
        updatedSalle.setId(salleId);
        updatedSalle.setEcole(newEcole);
        updatedSalle.setNumero("A101");
        updatedSalle.setNom("Amphithéâtre Principal");

        SalleResponse response = new SalleResponse();
        response.setId(salleId);
        response.setEcoleId(newEcoleId);
        response.setEcoleNom("Nouvelle École");
        response.setNumero("A101");

        when(salleRepository.findById(salleId)).thenReturn(Optional.of(salle));
        when(ecoleRepository.findById(newEcoleId)).thenReturn(Optional.of(newEcole));
        when(salleRepository.save(any(Salle.class))).thenReturn(updatedSalle);
        when(salleMapper.toResponse(updatedSalle)).thenReturn(response);

        // Act
        SalleResponse result = salleService.update(salleId, updateRequest);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getEcoleId()).isEqualTo(newEcoleId);
        assertThat(result.getEcoleNom()).isEqualTo("Nouvelle École");

        verify(salleRepository).findById(salleId);
        verify(ecoleRepository).findById(newEcoleId);
        verify(salleMapper).updateEntity(eq(updateRequest), any(Salle.class));
        verify(salleRepository).save(any(Salle.class));
        verify(salleMapper).toResponse(updatedSalle);
    }

    @Test
    @DisplayName("update - Ecole Not Found - Throws ResourceNotFoundException")
    void update_ecoleNotFound_throwsException() {
        // Arrange
        UUID newEcoleId = UUID.randomUUID();
        SalleRequest updateRequest = new SalleRequest();
        updateRequest.setEcoleId(newEcoleId);
        updateRequest.setNumero("A101");
        updateRequest.setTypeSalle(TypeSalle.AMPHITHEATRE);
        updateRequest.setCapacite(150);

        when(salleRepository.findById(salleId)).thenReturn(Optional.of(salle));
        when(ecoleRepository.findById(newEcoleId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> salleService.update(salleId, updateRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("École non trouvée avec l'id: " + newEcoleId);

        verify(salleRepository).findById(salleId);
        verify(ecoleRepository).findById(newEcoleId);
        verify(salleRepository, never()).save(any());
    }

    @Test
    @DisplayName("update - Salle Not Found - Throws ResourceNotFoundException")
    void update_salleNotFound_throwsException() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(salleRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> salleService.update(nonExistentId, salleRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Salle non trouvée avec l'id: " + nonExistentId);

        verify(salleRepository).findById(nonExistentId);
        verify(salleRepository, never()).save(any());
    }
}
