package com.timely.notificationservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.timely.notificationservice.document.enums.TypeNotification;
import com.timely.notificationservice.dto.request.TemplateRequest;
import com.timely.notificationservice.dto.response.TemplateResponse;
import com.timely.notificationservice.exception.ResourceNotFoundException;
import com.timely.notificationservice.service.TemplateService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TemplateController.class)
@DisplayName("TemplateController - Tests Unitaires")
class TemplateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TemplateService templateService;

    private TemplateRequest templateRequest;
    private TemplateResponse templateResponse;

    @BeforeEach
    void setUp() {
        templateRequest = new TemplateRequest();
        templateRequest.setNom("welcome-template");
        templateRequest.setTypeNotification(TypeNotification.RAPPEL_COURS);
        templateRequest.setContenuTemplate("<h1>Welcome ${name}</h1>");
        templateRequest.setVariablesDisponibles(Arrays.asList("name", "email"));
        templateRequest.setActif(true);

        templateResponse = new TemplateResponse();
        templateResponse.setId("template-123");
        templateResponse.setNom("welcome-template");
        templateResponse.setTypeNotification(TypeNotification.RAPPEL_COURS);
        templateResponse.setContenuTemplate("<h1>Welcome ${name}</h1>");
        templateResponse.setActif(true);
    }

    @Test
    @DisplayName("createTemplate - Succès avec ADMIN")
    @WithMockUser(authorities = "ADMIN")
    void createTemplate_Success_WithAdmin() throws Exception {
        // Given
        when(templateService.createTemplate(any(TemplateRequest.class)))
                .thenReturn(templateResponse);

        // When & Then
        mockMvc.perform(post("/api/notifications/templates")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(templateRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("template-123"))
                .andExpect(jsonPath("$.nom").value("welcome-template"))
                .andExpect(jsonPath("$.actif").value(true));

        verify(templateService).createTemplate(any(TemplateRequest.class));
    }

    @Test
    @DisplayName("createTemplate - Forbidden sans ADMIN")
    @WithMockUser(authorities = "USER")
    void createTemplate_Forbidden_WithoutAdmin() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/notifications/templates")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(templateRequest)))
                .andExpect(status().isForbidden());

        verify(templateService, never()).createTemplate(any(TemplateRequest.class));
    }

    @Test
    @DisplayName("createTemplate - Validation échoue")
    @WithMockUser(authorities = "ADMIN")
    void createTemplate_ValidationFails() throws Exception {
        // Given - Request invalide (nom vide)
        templateRequest.setNom("");

        // When & Then
        mockMvc.perform(post("/api/notifications/templates")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(templateRequest)))
                .andExpect(status().isBadRequest());

        verify(templateService, never()).createTemplate(any(TemplateRequest.class));
    }

    @Test
    @DisplayName("getTemplateById - Succès")
    @WithMockUser(authorities = "ADMIN")
    void getTemplateById_Success() throws Exception {
        // Given
        String templateId = "template-123";
        when(templateService.getTemplateById(templateId))
                .thenReturn(templateResponse);

        // When & Then
        mockMvc.perform(get("/api/notifications/templates/{id}", templateId)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("template-123"))
                .andExpect(jsonPath("$.nom").value("welcome-template"));

        verify(templateService).getTemplateById(templateId);
    }

    @Test
    @DisplayName("getTemplateById - NotFound")
    @WithMockUser(authorities = "ADMIN")
    void getTemplateById_NotFound() throws Exception {
        // Given
        String templateId = "invalid-id";
        when(templateService.getTemplateById(templateId))
                .thenThrow(new ResourceNotFoundException("Template non trouvé"));

        // When & Then
        mockMvc.perform(get("/api/notifications/templates/{id}", templateId)
                        .with(csrf()))
                .andExpect(status().isNotFound());

        verify(templateService).getTemplateById(templateId);
    }

    @Test
    @DisplayName("getAllTemplates - Succès")
    @WithMockUser(authorities = "ADMIN")
    void getAllTemplates_Success() throws Exception {
        // Given
        TemplateResponse template2 = new TemplateResponse();
        template2.setId("template-456");
        template2.setNom("password-reset-template");

        List<TemplateResponse> templates = Arrays.asList(templateResponse, template2);
        when(templateService.getAllTemplates()).thenReturn(templates);

        // When & Then
        mockMvc.perform(get("/api/notifications/templates")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value("template-123"))
                .andExpect(jsonPath("$[1].id").value("template-456"));

        verify(templateService).getAllTemplates();
    }

    @Test
    @DisplayName("getActiveTemplates - Succès")
    @WithMockUser(authorities = "ADMIN")
    void getActiveTemplates_Success() throws Exception {
        // Given
        List<TemplateResponse> activeTemplates = Arrays.asList(templateResponse);
        when(templateService.getActiveTemplates()).thenReturn(activeTemplates);

        // When & Then
        mockMvc.perform(get("/api/notifications/templates/active")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].actif").value(true));

        verify(templateService).getActiveTemplates();
    }

    @Test
    @DisplayName("getActiveTemplateByType - Succès")
    @WithMockUser(authorities = "ADMIN")
    void getActiveTemplateByType_Success() throws Exception {
        // Given
        TypeNotification type = TypeNotification.RAPPEL_COURS;
        when(templateService.getActiveTemplateByType(type))
                .thenReturn(templateResponse);

        // When & Then
        mockMvc.perform(get("/api/notifications/templates/type/{typeNotification}", type)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("template-123"))
                .andExpect(jsonPath("$.typeNotification").value("RAPPEL_COURS"));

        verify(templateService).getActiveTemplateByType(type);
    }

    @Test
    @DisplayName("getActiveTemplateByType - NotFound")
    @WithMockUser(authorities = "ADMIN")
    void getActiveTemplateByType_NotFound() throws Exception {
        // Given
        TypeNotification type = TypeNotification.CONFLIT_HORAIRE;
        when(templateService.getActiveTemplateByType(type))
                .thenThrow(new ResourceNotFoundException("Aucun template actif trouvé"));

        // When & Then
        mockMvc.perform(get("/api/notifications/templates/type/{typeNotification}", type)
                        .with(csrf()))
                .andExpect(status().isNotFound());

        verify(templateService).getActiveTemplateByType(type);
    }

    @Test
    @DisplayName("updateTemplate - Succès")
    @WithMockUser(authorities = "ADMIN")
    void updateTemplate_Success() throws Exception {
        // Given
        String templateId = "template-123";
        TemplateRequest updateRequest = new TemplateRequest();
        updateRequest.setNom("updated-template");
        updateRequest.setTypeNotification(TypeNotification.RAPPEL_COURS);
        updateRequest.setContenuTemplate("<h1>Updated content</h1>");
        updateRequest.setActif(true);

        TemplateResponse updatedResponse = new TemplateResponse();
        updatedResponse.setId(templateId);
        updatedResponse.setNom("updated-template");

        when(templateService.updateTemplate(eq(templateId), any(TemplateRequest.class)))
                .thenReturn(updatedResponse);

        // When & Then
        mockMvc.perform(put("/api/notifications/templates/{id}", templateId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(templateId))
                .andExpect(jsonPath("$.nom").value("updated-template"));

        verify(templateService).updateTemplate(eq(templateId), any(TemplateRequest.class));
    }

    @Test
    @DisplayName("updateTemplate - Validation échoue")
    @WithMockUser(authorities = "ADMIN")
    void updateTemplate_ValidationFails() throws Exception {
        // Given
        String templateId = "template-123";
        templateRequest.setContenuTemplate(""); // Invalid

        // When & Then
        mockMvc.perform(put("/api/notifications/templates/{id}", templateId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(templateRequest)))
                .andExpect(status().isBadRequest());

        verify(templateService, never()).updateTemplate(anyString(), any(TemplateRequest.class));
    }

    @Test
    @DisplayName("deleteTemplate - Succès")
    @WithMockUser(authorities = "ADMIN")
    void deleteTemplate_Success() throws Exception {
        // Given
        String templateId = "template-123";
        doNothing().when(templateService).deleteTemplate(templateId);

        // When & Then
        mockMvc.perform(delete("/api/notifications/templates/{id}", templateId)
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(templateService).deleteTemplate(templateId);
    }

    @Test
    @DisplayName("deleteTemplate - NotFound")
    @WithMockUser(authorities = "ADMIN")
    void deleteTemplate_NotFound() throws Exception {
        // Given
        String templateId = "invalid-id";
        doThrow(new ResourceNotFoundException("Template non trouvé"))
                .when(templateService).deleteTemplate(templateId);

        // When & Then
        mockMvc.perform(delete("/api/notifications/templates/{id}", templateId)
                        .with(csrf()))
                .andExpect(status().isNotFound());

        verify(templateService).deleteTemplate(templateId);
    }

    @Test
    @DisplayName("deleteTemplate - Forbidden sans ADMIN")
    @WithMockUser(authorities = "USER")
    void deleteTemplate_Forbidden() throws Exception {
        // Given
        String templateId = "template-123";

        // When & Then
        mockMvc.perform(delete("/api/notifications/templates/{id}", templateId)
                        .with(csrf()))
                .andExpect(status().isForbidden());

        verify(templateService, never()).deleteTemplate(anyString());
    }

    @Test
    @DisplayName("previewTemplate - Succès")
    @WithMockUser(authorities = "ADMIN")
    void previewTemplate_Success() throws Exception {
        // Given
        String templateId = "template-123";
        Map<String, Object> sampleVariables = new HashMap<>();
        sampleVariables.put("name", "John Doe");

        String renderedContent = "<h1>Welcome John Doe</h1>";

        when(templateService.previewTemplate(eq(templateId), anyMap()))
                .thenReturn(renderedContent);

        // When & Then
        mockMvc.perform(post("/api/notifications/templates/{id}/preview", templateId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleVariables)))
                .andExpect(status().isOk())
                .andExpect(content().string(renderedContent));

        verify(templateService).previewTemplate(eq(templateId), anyMap());
    }

    @Test
    @DisplayName("previewTemplate - Template NotFound")
    @WithMockUser(authorities = "ADMIN")
    void previewTemplate_NotFound() throws Exception {
        // Given
        String templateId = "invalid-id";
        Map<String, Object> sampleVariables = new HashMap<>();
        sampleVariables.put("name", "John Doe");

        when(templateService.previewTemplate(eq(templateId), anyMap()))
                .thenThrow(new ResourceNotFoundException("Template non trouvé"));

        // When & Then
        mockMvc.perform(post("/api/notifications/templates/{id}/preview", templateId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleVariables)))
                .andExpect(status().isNotFound());

        verify(templateService).previewTemplate(eq(templateId), anyMap());
    }
}
