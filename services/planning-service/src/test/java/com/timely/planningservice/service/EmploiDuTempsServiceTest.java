package com.timely.planningservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.timely.planningservice.config.RabbitMQConfig;
import com.timely.planningservice.dto.request.SearchPlanningRequest;
import com.timely.planningservice.dto.response.EmploiDuTempsResponseDTO;
import com.timely.planningservice.entity.EmploiDuTemps;
import com.timely.planningservice.entity.enums.PeriodeEmploi;
import com.timely.planningservice.entity.enums.StatutEmploi;
import com.timely.planningservice.event.EmploiDuTempsPublieEvent;
import com.timely.planningservice.mapper.EmploiDuTempsMapper;
import com.timely.planningservice.repository.EmploiDuTempsRepository;

/**
 * Unit tests for EmploiDuTempsService
 *
 * Tests cover:
 * - F3.4: Advanced search with Specifications and pagination
 * - F5.1: Publishing with RabbitMQ event
 * - Status validation (only VALIDE can be published)
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("EmploiDuTempsService Unit Tests")
class EmploiDuTempsServiceTest {

    @Mock
    private EmploiDuTempsRepository emploiDuTempsRepository;

    @Mock
    private EmploiDuTempsMapper emploiDuTempsMapper;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private EmploiDuTempsService emploiDuTempsService;

    @Test
    @DisplayName("searchAdvanced with ecoleId filter returns filtered results")
    void searchAdvanced_byEcoleId_returnsFiltered() {
        // Arrange
        UUID ecoleId = UUID.randomUUID();
        SearchPlanningRequest request = new SearchPlanningRequest();
        request.setEcoleId(ecoleId);
        request.setPage(0);
        request.setSize(20);
        request.setSortBy("dateDebut");
        request.setSortDirection("ASC");

        EmploiDuTemps emploi1 = createEmploiDuTemps(ecoleId, StatutEmploi.BROUILLON);
        EmploiDuTemps emploi2 = createEmploiDuTemps(ecoleId, StatutEmploi.VALIDE);

        EmploiDuTempsResponseDTO response1 = createResponseDTO(emploi1);
        EmploiDuTempsResponseDTO response2 = createResponseDTO(emploi2);

        Page<EmploiDuTemps> mockPage = new PageImpl<>(List.of(emploi1, emploi2));

        when(emploiDuTempsRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(mockPage);
        when(emploiDuTempsMapper.toResponseDTO(emploi1)).thenReturn(response1);
        when(emploiDuTempsMapper.toResponseDTO(emploi2)).thenReturn(response2);

        // Act
        Page<EmploiDuTempsResponseDTO> result = emploiDuTempsService.searchAdvanced(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent()).containsExactly(response1, response2);

        verify(emploiDuTempsRepository).findAll(any(Specification.class), any(Pageable.class));
        verify(emploiDuTempsMapper).toResponseDTO(emploi1);
        verify(emploiDuTempsMapper).toResponseDTO(emploi2);
    }

    @Test
    @DisplayName("searchAdvanced with statut filter returns filtered results")
    void searchAdvanced_byStatut_returnsFiltered() {
        // Arrange
        SearchPlanningRequest request = new SearchPlanningRequest();
        request.setStatut(StatutEmploi.PUBLIE);
        request.setPage(0);
        request.setSize(20);
        request.setSortBy("dateDebut");
        request.setSortDirection("ASC");

        EmploiDuTemps emploi = createEmploiDuTemps(UUID.randomUUID(), StatutEmploi.PUBLIE);
        emploi.setDatePublication(LocalDateTime.now());

        EmploiDuTempsResponseDTO responseDTO = createResponseDTO(emploi);

        Page<EmploiDuTemps> mockPage = new PageImpl<>(List.of(emploi));

        when(emploiDuTempsRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(mockPage);
        when(emploiDuTempsMapper.toResponseDTO(emploi)).thenReturn(responseDTO);

        // Act
        Page<EmploiDuTempsResponseDTO> result = emploiDuTempsService.searchAdvanced(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getStatut()).isEqualTo(StatutEmploi.PUBLIE);
        assertThat(result.getContent().get(0).getDatePublication()).isNotNull();

        verify(emploiDuTempsRepository).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    @DisplayName("searchAdvanced with multiple filters combines specifications")
    void searchAdvanced_multipleFilters_combinesSpecs() {
        // Arrange
        UUID ecoleId = UUID.randomUUID();
        UUID enseignantId = UUID.randomUUID();
        UUID salleId = UUID.randomUUID();
        LocalDate semaine = LocalDate.of(2025, 2, 10);

        SearchPlanningRequest request = new SearchPlanningRequest();
        request.setEcoleId(ecoleId);
        request.setEnseignantId(enseignantId);
        request.setSalleId(salleId);
        request.setSemaine(semaine);
        request.setStatut(StatutEmploi.VALIDE);
        request.setPage(0);
        request.setSize(10);
        request.setSortBy("dateDebut");
        request.setSortDirection("DESC");

        EmploiDuTemps emploi = createEmploiDuTemps(ecoleId, StatutEmploi.VALIDE);
        EmploiDuTempsResponseDTO responseDTO = createResponseDTO(emploi);

        Page<EmploiDuTemps> mockPage = new PageImpl<>(List.of(emploi));

        when(emploiDuTempsRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(mockPage);
        when(emploiDuTempsMapper.toResponseDTO(emploi)).thenReturn(responseDTO);

        // Act
        Page<EmploiDuTempsResponseDTO> result = emploiDuTempsService.searchAdvanced(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getEcoleId()).isEqualTo(ecoleId);
        assertThat(result.getContent().get(0).getStatut()).isEqualTo(StatutEmploi.VALIDE);

        // Verify specification was built with all filters
        ArgumentCaptor<Specification<EmploiDuTemps>> specCaptor = ArgumentCaptor.forClass(Specification.class);
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);

        verify(emploiDuTempsRepository).findAll(specCaptor.capture(), pageableCaptor.capture());

        Pageable capturedPageable = pageableCaptor.getValue();
        assertThat(capturedPageable.getPageNumber()).isEqualTo(0);
        assertThat(capturedPageable.getPageSize()).isEqualTo(10);
    }

    @Test
    @DisplayName("searchAdvanced with pagination returns correct page")
    void searchAdvanced_pagination_returnsCorrectPage() {
        // Arrange
        SearchPlanningRequest request = new SearchPlanningRequest();
        request.setPage(1);  // Second page
        request.setSize(5);
        request.setSortBy("dateCreation");
        request.setSortDirection("DESC");

        EmploiDuTemps emploi1 = createEmploiDuTemps(UUID.randomUUID(), StatutEmploi.BROUILLON);
        EmploiDuTemps emploi2 = createEmploiDuTemps(UUID.randomUUID(), StatutEmploi.VALIDE);
        EmploiDuTemps emploi3 = createEmploiDuTemps(UUID.randomUUID(), StatutEmploi.PUBLIE);

        EmploiDuTempsResponseDTO response1 = createResponseDTO(emploi1);
        EmploiDuTempsResponseDTO response2 = createResponseDTO(emploi2);
        EmploiDuTempsResponseDTO response3 = createResponseDTO(emploi3);

        // Simulate total of 15 items, returning page 1 (items 6-10)
        Page<EmploiDuTemps> mockPage = new PageImpl<>(
            List.of(emploi1, emploi2, emploi3),
            PageRequest.of(1, 5),
            15  // Total elements
        );

        when(emploiDuTempsRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(mockPage);
        when(emploiDuTempsMapper.toResponseDTO(emploi1)).thenReturn(response1);
        when(emploiDuTempsMapper.toResponseDTO(emploi2)).thenReturn(response2);
        when(emploiDuTempsMapper.toResponseDTO(emploi3)).thenReturn(response3);

        // Act
        Page<EmploiDuTempsResponseDTO> result = emploiDuTempsService.searchAdvanced(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getNumber()).isEqualTo(1);  // Current page
        assertThat(result.getSize()).isEqualTo(5);    // Page size
        assertThat(result.getTotalElements()).isEqualTo(15);
        assertThat(result.getTotalPages()).isEqualTo(3);
        assertThat(result.getContent()).hasSize(3);
        assertThat(result.hasNext()).isTrue();
        assertThat(result.hasPrevious()).isTrue();

        // Verify correct pageable was used
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(emploiDuTempsRepository).findAll(any(Specification.class), pageableCaptor.capture());

        Pageable capturedPageable = pageableCaptor.getValue();
        assertThat(capturedPageable.getPageNumber()).isEqualTo(1);
        assertThat(capturedPageable.getPageSize()).isEqualTo(5);
    }

    @Test
    @DisplayName("publish with VALIDE status changes to PUBLIE")
    void publish_valideStatus_changestoPublie() {
        // Arrange
        UUID emploiId = UUID.randomUUID();
        String publisherEmail = "admin@iusjc.edu";

        EmploiDuTemps emploi = createEmploiDuTemps(UUID.randomUUID(), StatutEmploi.VALIDE);
        emploi.setId(emploiId);
        emploi.setUtilisateurValidation("validator@iusjc.edu");

        EmploiDuTempsResponseDTO responseDTO = createResponseDTO(emploi);
        responseDTO.setStatut(StatutEmploi.PUBLIE);
        responseDTO.setDatePublication(LocalDateTime.now());

        when(emploiDuTempsRepository.findById(emploiId)).thenReturn(java.util.Optional.of(emploi));
        when(emploiDuTempsRepository.save(any(EmploiDuTemps.class))).thenReturn(emploi);
        when(emploiDuTempsMapper.toResponseDTO(any(EmploiDuTemps.class))).thenReturn(responseDTO);

        // Act
        EmploiDuTempsResponseDTO result = emploiDuTempsService.publishEmploi(emploiId, publisherEmail);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getStatut()).isEqualTo(StatutEmploi.PUBLIE);
        assertThat(result.getDatePublication()).isNotNull();

        // Verify the entity was updated correctly
        ArgumentCaptor<EmploiDuTemps> emploiCaptor = ArgumentCaptor.forClass(EmploiDuTemps.class);
        verify(emploiDuTempsRepository).save(emploiCaptor.capture());

        EmploiDuTemps savedEmploi = emploiCaptor.getValue();
        assertThat(savedEmploi.getStatut()).isEqualTo(StatutEmploi.PUBLIE);
        assertThat(savedEmploi.getDatePublication()).isNotNull();
        assertThat(savedEmploi.getUtilisateurValidation()).isEqualTo("validator@iusjc.edu");
    }

    @Test
    @DisplayName("publish sends RabbitMQ event - F5.1")
    void publish_sendsRabbitMQEvent() {
        // Arrange
        UUID emploiId = UUID.randomUUID();
        UUID ecoleId = UUID.randomUUID();
        String publisherEmail = "publisher@iusjc.edu";
        LocalDate dateDebut = LocalDate.of(2025, 2, 10);
        LocalDate dateFin = LocalDate.of(2025, 2, 16);

        EmploiDuTemps emploi = createEmploiDuTemps(ecoleId, StatutEmploi.VALIDE);
        emploi.setId(emploiId);
        emploi.setDateDebut(dateDebut);
        emploi.setDateFin(dateFin);

        EmploiDuTempsResponseDTO responseDTO = createResponseDTO(emploi);

        when(emploiDuTempsRepository.findById(emploiId)).thenReturn(java.util.Optional.of(emploi));
        when(emploiDuTempsRepository.save(any(EmploiDuTemps.class))).thenReturn(emploi);
        when(emploiDuTempsMapper.toResponseDTO(any(EmploiDuTemps.class))).thenReturn(responseDTO);

        // Act
        emploiDuTempsService.publishEmploi(emploiId, publisherEmail);

        // Assert - Verify RabbitMQ event was sent
        ArgumentCaptor<EmploiDuTempsPublieEvent> eventCaptor = ArgumentCaptor.forClass(EmploiDuTempsPublieEvent.class);
        verify(rabbitTemplate).convertAndSend(
            eq(RabbitMQConfig.PLANNING_EXCHANGE),
            eq(RabbitMQConfig.PLANNING_PUBLISHED_ROUTING_KEY),
            eventCaptor.capture()
        );

        EmploiDuTempsPublieEvent capturedEvent = eventCaptor.getValue();
        assertThat(capturedEvent).isNotNull();
        assertThat(capturedEvent.getEmploiDuTempsId()).isEqualTo(emploiId);
        assertThat(capturedEvent.getEcoleId()).isEqualTo(ecoleId);
        assertThat(capturedEvent.getDateDebut()).isEqualTo(dateDebut);
        assertThat(capturedEvent.getDateFin()).isEqualTo(dateFin);
        assertThat(capturedEvent.getDatePublication()).isNotNull();
    }

    @Test
    @DisplayName("publish with non-VALIDE status throws exception")
    void publish_nonValideStatus_throwsException() {
        // Arrange
        UUID emploiId = UUID.randomUUID();
        String publisherEmail = "admin@iusjc.edu";

        // Test with BROUILLON status
        EmploiDuTemps emploiBrouillon = createEmploiDuTemps(UUID.randomUUID(), StatutEmploi.BROUILLON);
        emploiBrouillon.setId(emploiId);

        when(emploiDuTempsRepository.findById(emploiId))
                .thenReturn(java.util.Optional.of(emploiBrouillon));

        // Act & Assert
        assertThatThrownBy(() -> emploiDuTempsService.publishEmploi(emploiId, publisherEmail))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Only validated EmploisDuTemps can be published");

        // Test with already PUBLIE status
        EmploiDuTemps emploiPublie = createEmploiDuTemps(UUID.randomUUID(), StatutEmploi.PUBLIE);
        emploiPublie.setId(emploiId);
        emploiPublie.setDatePublication(LocalDateTime.now());

        when(emploiDuTempsRepository.findById(emploiId))
                .thenReturn(java.util.Optional.of(emploiPublie));

        assertThatThrownBy(() -> emploiDuTempsService.publishEmploi(emploiId, publisherEmail))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Only validated EmploisDuTemps can be published");
    }

    // Helper methods

    private EmploiDuTemps createEmploiDuTemps(UUID ecoleId, StatutEmploi statut) {
        EmploiDuTemps emploi = new EmploiDuTemps();
        emploi.setId(UUID.randomUUID());
        emploi.setEcoleId(ecoleId);
        emploi.setDateDebut(LocalDate.of(2025, 2, 10));
        emploi.setDateFin(LocalDate.of(2025, 2, 16));
        emploi.setPeriode(PeriodeEmploi.SEMAINE);
        emploi.setStatut(statut);
        emploi.setDateCreation(LocalDateTime.now());
        return emploi;
    }

    private EmploiDuTempsResponseDTO createResponseDTO(EmploiDuTemps emploi) {
        EmploiDuTempsResponseDTO dto = new EmploiDuTempsResponseDTO();
        dto.setId(emploi.getId());
        dto.setEcoleId(emploi.getEcoleId());
        dto.setDateDebut(emploi.getDateDebut());
        dto.setDateFin(emploi.getDateFin());
        dto.setPeriode(emploi.getPeriode());
        dto.setStatut(emploi.getStatut());
        dto.setDateCreation(emploi.getDateCreation());
        dto.setDatePublication(emploi.getDatePublication());
        dto.setUtilisateurValidation(emploi.getUtilisateurValidation());
        dto.setNotes(emploi.getNotes());
        return dto;
    }
}
