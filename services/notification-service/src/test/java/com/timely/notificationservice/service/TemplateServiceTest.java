package com.timely.notificationservice.service;

import com.timely.notificationservice.document.Template;
import com.timely.notificationservice.document.enums.TypeNotification;
import com.timely.notificationservice.dto.request.TemplateRequest;
import com.timely.notificationservice.dto.response.TemplateResponse;
import com.timely.notificationservice.exception.ResourceNotFoundException;
import com.timely.notificationservice.mapper.TemplateMapper;
import com.timely.notificationservice.repository.TemplateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TemplateService - Tests Unitaires")
class TemplateServiceTest {

    @Mock
    private TemplateRepository templateRepository;

    @Mock
    private TemplateMapper templateMapper;

    @Mock
    private TemplateEngineService templateEngineService;

    @InjectMocks
    private TemplateService templateService;

    private TemplateRequest templateRequest;
    private Template template;
    private TemplateResponse templateResponse;

    @BeforeEach
    void setUp() {
        templateRequest = new TemplateRequest();
        templateRequest.setNom("welcome-template");
        templateRequest.setTypeNotification(TypeNotification.RAPPEL_COURS);
        templateRequest.setContenuTemplate("<h1>Welcome ${name}</h1>");
        templateRequest.setActif(true);

        template = new Template();
        template.setId("template-123");
        template.setNom("welcome-template");
        template.setTypeNotification(TypeNotification.RAPPEL_COURS);
        template.setContenuTemplate("<h1>Welcome ${name}</h1>");
        template.setActif(true);
        template.setDateCreation(LocalDateTime.now());
        template.setDateModification(LocalDateTime.now());

        templateResponse = new TemplateResponse();
        templateResponse.setId("template-123");
        templateResponse.setNom("welcome-template");
        templateResponse.setTypeNotification(TypeNotification.RAPPEL_COURS);
        templateResponse.setActif(true);
    }

    @Test
    @DisplayName("createTemplate - Succès")
    void createTemplate_Success() {
        // Given
        when(templateRepository.existsByNom("welcome-template")).thenReturn(false);
        when(templateMapper.toEntity(templateRequest)).thenReturn(template);
        when(templateRepository.save(any(Template.class))).thenReturn(template);
        when(templateMapper.toResponse(template)).thenReturn(templateResponse);

        // When
        TemplateResponse result = templateService.createTemplate(templateRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("template-123");
        assertThat(result.getNom()).isEqualTo("welcome-template");

        verify(templateRepository).existsByNom("welcome-template");
        verify(templateRepository).save(any(Template.class));

        ArgumentCaptor<Template> templateCaptor = ArgumentCaptor.forClass(Template.class);
        verify(templateRepository).save(templateCaptor.capture());

        Template savedTemplate = templateCaptor.getValue();
        assertThat(savedTemplate.getDateCreation()).isNotNull();
        assertThat(savedTemplate.getDateModification()).isNotNull();
    }

    @Test
    @DisplayName("createTemplate - Nom déjà existant")
    void createTemplate_DuplicateName() {
        // Given
        when(templateRepository.existsByNom("welcome-template")).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> templateService.createTemplate(templateRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Un template avec ce nom existe déjà");

        verify(templateRepository).existsByNom("welcome-template");
        verify(templateRepository, never()).save(any(Template.class));
    }

    @Test
    @DisplayName("getTemplateById - Succès")
    void getTemplateById_Success() {
        // Given
        String templateId = "template-123";
        when(templateRepository.findById(templateId)).thenReturn(Optional.of(template));
        when(templateMapper.toResponse(template)).thenReturn(templateResponse);

        // When
        TemplateResponse result = templateService.getTemplateById(templateId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("template-123");
        verify(templateRepository).findById(templateId);
    }

    @Test
    @DisplayName("getTemplateById - NotFound")
    void getTemplateById_NotFound() {
        // Given
        String templateId = "invalid-id";
        when(templateRepository.findById(templateId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> templateService.getTemplateById(templateId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Template non trouvé avec l'id: invalid-id");

        verify(templateRepository).findById(templateId);
    }

    @Test
    @DisplayName("getAllTemplates - Succès")
    void getAllTemplates_Success() {
        // Given
        Template template2 = new Template();
        template2.setId("template-456");
        template2.setNom("password-reset-template");

        TemplateResponse response2 = new TemplateResponse();
        response2.setId("template-456");
        response2.setNom("password-reset-template");

        when(templateRepository.findAll()).thenReturn(Arrays.asList(template, template2));
        when(templateMapper.toResponse(template)).thenReturn(templateResponse);
        when(templateMapper.toResponse(template2)).thenReturn(response2);

        // When
        List<TemplateResponse> results = templateService.getAllTemplates();

        // Then
        assertThat(results).hasSize(2);
        assertThat(results.get(0).getId()).isEqualTo("template-123");
        assertThat(results.get(1).getId()).isEqualTo("template-456");
        verify(templateRepository).findAll();
    }

    @Test
    @DisplayName("getActiveTemplates - Succès")
    void getActiveTemplates_Success() {
        // Given
        when(templateRepository.findByActifTrue()).thenReturn(Arrays.asList(template));
        when(templateMapper.toResponse(template)).thenReturn(templateResponse);

        // When
        List<TemplateResponse> results = templateService.getActiveTemplates();

        // Then
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getId()).isEqualTo("template-123");
        verify(templateRepository).findByActifTrue();
    }

    @Test
    @DisplayName("getActiveTemplateByType - Succès")
    void getActiveTemplateByType_Success() {
        // Given
        TypeNotification type = TypeNotification.RAPPEL_COURS;
        when(templateRepository.findByTypeNotificationAndActifTrue(type)).thenReturn(Optional.of(template));
        when(templateMapper.toResponse(template)).thenReturn(templateResponse);

        // When
        TemplateResponse result = templateService.getActiveTemplateByType(type);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTypeNotification()).isEqualTo(TypeNotification.RAPPEL_COURS);
        verify(templateRepository).findByTypeNotificationAndActifTrue(type);
    }

    @Test
    @DisplayName("getActiveTemplateByType - NotFound")
    void getActiveTemplateByType_NotFound() {
        // Given
        TypeNotification type = TypeNotification.CONFLIT_HORAIRE;
        when(templateRepository.findByTypeNotificationAndActifTrue(type)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> templateService.getActiveTemplateByType(type))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Aucun template actif trouvé pour le type: " + type);

        verify(templateRepository).findByTypeNotificationAndActifTrue(type);
    }

    @Test
    @DisplayName("updateTemplate - Succès")
    void updateTemplate_Success() {
        // Given
        String templateId = "template-123";
        TemplateRequest updateRequest = new TemplateRequest();
        updateRequest.setNom("welcome-template-updated");
        updateRequest.setTypeNotification(TypeNotification.RAPPEL_COURS);
        updateRequest.setContenuTemplate("<h1>Updated Welcome ${name}</h1>");
        updateRequest.setActif(true);

        when(templateRepository.findById(templateId)).thenReturn(Optional.of(template));
        when(templateRepository.existsByNom("welcome-template-updated")).thenReturn(false);
        when(templateRepository.save(any(Template.class))).thenReturn(template);
        when(templateMapper.toResponse(template)).thenReturn(templateResponse);
        doNothing().when(templateMapper).updateEntity(eq(updateRequest), eq(template));

        // When
        TemplateResponse result = templateService.updateTemplate(templateId, updateRequest);

        // Then
        assertThat(result).isNotNull();
        verify(templateRepository).findById(templateId);
        verify(templateMapper).updateEntity(updateRequest, template);
        verify(templateRepository).save(any(Template.class));

        ArgumentCaptor<Template> templateCaptor = ArgumentCaptor.forClass(Template.class);
        verify(templateRepository).save(templateCaptor.capture());

        Template updatedTemplate = templateCaptor.getValue();
        assertThat(updatedTemplate.getDateModification()).isNotNull();
    }

    @Test
    @DisplayName("updateTemplate - Nom déjà existant")
    void updateTemplate_DuplicateName() {
        // Given
        String templateId = "template-123";
        TemplateRequest updateRequest = new TemplateRequest();
        updateRequest.setNom("existing-template");

        template.setNom("original-template");

        when(templateRepository.findById(templateId)).thenReturn(Optional.of(template));
        when(templateRepository.existsByNom("existing-template")).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> templateService.updateTemplate(templateId, updateRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Un template avec ce nom existe déjà");

        verify(templateRepository).findById(templateId);
        verify(templateRepository).existsByNom("existing-template");
        verify(templateRepository, never()).save(any(Template.class));
    }

    @Test
    @DisplayName("updateTemplate - Même nom (pas de duplication)")
    void updateTemplate_SameName() {
        // Given
        String templateId = "template-123";
        TemplateRequest updateRequest = new TemplateRequest();
        updateRequest.setNom("welcome-template");
        updateRequest.setTypeNotification(TypeNotification.RAPPEL_COURS);
        updateRequest.setContenuTemplate("<h1>Updated content</h1>");

        when(templateRepository.findById(templateId)).thenReturn(Optional.of(template));
        when(templateRepository.save(any(Template.class))).thenReturn(template);
        when(templateMapper.toResponse(template)).thenReturn(templateResponse);
        doNothing().when(templateMapper).updateEntity(eq(updateRequest), eq(template));

        // When
        TemplateResponse result = templateService.updateTemplate(templateId, updateRequest);

        // Then
        assertThat(result).isNotNull();
        verify(templateRepository).findById(templateId);
        verify(templateRepository, never()).existsByNom(anyString());
        verify(templateRepository).save(any(Template.class));
    }

    @Test
    @DisplayName("deleteTemplate - Succès")
    void deleteTemplate_Success() {
        // Given
        String templateId = "template-123";
        when(templateRepository.existsById(templateId)).thenReturn(true);
        doNothing().when(templateRepository).deleteById(templateId);

        // When
        templateService.deleteTemplate(templateId);

        // Then
        verify(templateRepository).existsById(templateId);
        verify(templateRepository).deleteById(templateId);
    }

    @Test
    @DisplayName("deleteTemplate - NotFound")
    void deleteTemplate_NotFound() {
        // Given
        String templateId = "invalid-id";
        when(templateRepository.existsById(templateId)).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> templateService.deleteTemplate(templateId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Template non trouvé avec l'id: invalid-id");

        verify(templateRepository).existsById(templateId);
        verify(templateRepository, never()).deleteById(anyString());
    }

    @Test
    @DisplayName("renderTemplate - Succès")
    void renderTemplate_Success() {
        // Given
        String templateId = "template-123";
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", "John Doe");

        when(templateRepository.findById(templateId)).thenReturn(Optional.of(template));
        when(templateEngineService.processTemplate(template.getContenuTemplate(), variables))
                .thenReturn("<h1>Welcome John Doe</h1>");

        // When
        String result = templateService.renderTemplate(templateId, variables);

        // Then
        assertThat(result).isEqualTo("<h1>Welcome John Doe</h1>");
        verify(templateRepository).findById(templateId);
        verify(templateEngineService).processTemplate(template.getContenuTemplate(), variables);
    }

    @Test
    @DisplayName("renderTemplate - Template inactif")
    void renderTemplate_InactiveTemplate() {
        // Given
        String templateId = "template-123";
        template.setActif(false);
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", "John Doe");

        when(templateRepository.findById(templateId)).thenReturn(Optional.of(template));

        // When & Then
        assertThatThrownBy(() -> templateService.renderTemplate(templateId, variables))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Le template n'est pas actif");

        verify(templateRepository).findById(templateId);
        verify(templateEngineService, never()).processTemplate(anyString(), any());
    }

    @Test
    @DisplayName("previewTemplate - Succès")
    void previewTemplate_Success() {
        // Given
        String templateId = "template-123";
        Map<String, Object> sampleVariables = new HashMap<>();
        sampleVariables.put("name", "Sample User");

        when(templateRepository.findById(templateId)).thenReturn(Optional.of(template));
        when(templateEngineService.processTemplate(template.getContenuTemplate(), sampleVariables))
                .thenReturn("<h1>Welcome Sample User</h1>");

        // When
        String result = templateService.previewTemplate(templateId, sampleVariables);

        // Then
        assertThat(result).isEqualTo("<h1>Welcome Sample User</h1>");
        verify(templateRepository).findById(templateId);
        verify(templateEngineService).processTemplate(template.getContenuTemplate(), sampleVariables);
    }
}
