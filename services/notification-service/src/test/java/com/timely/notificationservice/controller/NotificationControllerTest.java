package com.timely.notificationservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.timely.notificationservice.document.enums.CanalNotification;
import com.timely.notificationservice.document.enums.StatutNotification;
import com.timely.notificationservice.document.enums.TypeNotification;
import com.timely.notificationservice.dto.request.ScheduleNotificationRequest;
import com.timely.notificationservice.dto.request.SendNotificationRequest;
import com.timely.notificationservice.dto.response.HistoriqueResponse;
import com.timely.notificationservice.dto.response.NotificationDetailsResponse;
import com.timely.notificationservice.dto.response.NotificationResponse;
import com.timely.notificationservice.exception.ResourceNotFoundException;
import com.timely.notificationservice.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NotificationController.class)
@DisplayName("NotificationController - Tests Unitaires")
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private NotificationService notificationService;

    private SendNotificationRequest sendRequest;
    private NotificationResponse notificationResponse;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();

        sendRequest = new SendNotificationRequest();
        sendRequest.setDestinataireId(userId);
        sendRequest.setTypeNotification(TypeNotification.RAPPEL_COURS);
        sendRequest.setSujet("Test Subject");
        sendRequest.setContenu("Test Content");
        sendRequest.setCanal(CanalNotification.EMAIL);

        notificationResponse = new NotificationResponse();
        notificationResponse.setId("notif-123");
        notificationResponse.setDestinataireId(userId);
        notificationResponse.setTypeNotification(TypeNotification.RAPPEL_COURS);
        notificationResponse.setSujet("Test Subject");
        notificationResponse.setStatut(StatutNotification.SENT);
    }

    @Test
    @DisplayName("sendNotification - Succès avec ADMIN")
    @WithMockUser(authorities = "ADMIN")
    void sendNotification_Success_WithAdmin() throws Exception {
        // Given
        when(notificationService.sendNotification(any(SendNotificationRequest.class)))
                .thenReturn(notificationResponse);

        // When & Then
        mockMvc.perform(post("/api/notifications/send")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sendRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("notif-123"))
                .andExpect(jsonPath("$.sujet").value("Test Subject"))
                .andExpect(jsonPath("$.statut").value("SENT"));

        verify(notificationService).sendNotification(any(SendNotificationRequest.class));
    }

    @Test
    @DisplayName("sendNotification - Forbidden sans ADMIN")
    @WithMockUser(authorities = "USER")
    void sendNotification_Forbidden_WithoutAdmin() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/notifications/send")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sendRequest)))
                .andExpect(status().isForbidden());

        verify(notificationService, never()).sendNotification(any(SendNotificationRequest.class));
    }

    @Test
    @DisplayName("sendNotification - Validation échoue")
    @WithMockUser(authorities = "ADMIN")
    void sendNotification_ValidationFails() throws Exception {
        // Given - Request invalide (sujet vide)
        sendRequest.setSujet("");

        // When & Then
        mockMvc.perform(post("/api/notifications/send")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sendRequest)))
                .andExpect(status().isBadRequest());

        verify(notificationService, never()).sendNotification(any(SendNotificationRequest.class));
    }

    @Test
    @DisplayName("sendBulkNotifications - Succès")
    @WithMockUser(authorities = "ADMIN")
    void sendBulkNotifications_Success() throws Exception {
        // Given
        List<SendNotificationRequest> requests = Arrays.asList(sendRequest, sendRequest);
        List<NotificationResponse> responses = Arrays.asList(notificationResponse, notificationResponse);

        when(notificationService.sendBulkNotifications(anyList())).thenReturn(responses);

        // When & Then
        mockMvc.perform(post("/api/notifications/send-bulk")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requests)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));

        verify(notificationService).sendBulkNotifications(anyList());
    }

    @Test
    @DisplayName("scheduleNotification - Succès")
    @WithMockUser(authorities = "ADMIN")
    void scheduleNotification_Success() throws Exception {
        // Given
        ScheduleNotificationRequest scheduleRequest = new ScheduleNotificationRequest();
        scheduleRequest.setDestinataireId(userId);
        scheduleRequest.setTypeNotification(TypeNotification.RAPPEL_COURS);
        scheduleRequest.setSujet("Scheduled Subject");
        scheduleRequest.setContenu("Scheduled Content");
        scheduleRequest.setCanal(CanalNotification.EMAIL);
        scheduleRequest.setDateEnvoiPrevue(LocalDateTime.now().plusHours(1));

        when(notificationService.scheduleNotification(any(ScheduleNotificationRequest.class)))
                .thenReturn(notificationResponse);

        // When & Then
        mockMvc.perform(post("/api/notifications/schedule")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(scheduleRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("notif-123"));

        verify(notificationService).scheduleNotification(any(ScheduleNotificationRequest.class));
    }

    @Test
    @DisplayName("getNotificationStatus - Succès")
    @WithMockUser(authorities = "ADMIN")
    void getNotificationStatus_Success() throws Exception {
        // Given
        String notificationId = "notif-123";
        when(notificationService.getNotificationStatus(notificationId))
                .thenReturn(notificationResponse);

        // When & Then
        mockMvc.perform(get("/api/notifications/{id}/status", notificationId)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("notif-123"))
                .andExpect(jsonPath("$.statut").value("SENT"));

        verify(notificationService).getNotificationStatus(notificationId);
    }

    @Test
    @DisplayName("getNotificationStatus - NotFound")
    @WithMockUser(authorities = "ADMIN")
    void getNotificationStatus_NotFound() throws Exception {
        // Given
        String notificationId = "invalid-id";
        when(notificationService.getNotificationStatus(notificationId))
                .thenThrow(new ResourceNotFoundException("Notification non trouvée"));

        // When & Then
        mockMvc.perform(get("/api/notifications/{id}/status", notificationId)
                        .with(csrf()))
                .andExpect(status().isNotFound());

        verify(notificationService).getNotificationStatus(notificationId);
    }

    @Test
    @DisplayName("getNotificationDetails - Succès")
    @WithMockUser(authorities = "ADMIN")
    void getNotificationDetails_Success() throws Exception {
        // Given
        String notificationId = "notif-123";
        NotificationDetailsResponse detailsResponse = new NotificationDetailsResponse();
        detailsResponse.setId(notificationId);
        detailsResponse.setSujet("Test Subject");
        detailsResponse.setNombreTentatives(1);

        when(notificationService.getNotificationDetails(notificationId))
                .thenReturn(detailsResponse);

        // When & Then
        mockMvc.perform(get("/api/notifications/{id}/details", notificationId)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("notif-123"))
                .andExpect(jsonPath("$.nombreTentatives").value(1));

        verify(notificationService).getNotificationDetails(notificationId);
    }

    @Test
    @DisplayName("getNotificationsByUser - Succès")
    @WithMockUser(authorities = "ADMIN")
    void getNotificationsByUser_Success() throws Exception {
        // Given
        Page<NotificationResponse> page = new PageImpl<>(Arrays.asList(notificationResponse));
        when(notificationService.getNotificationsByUser(eq(userId), any(PageRequest.class)))
                .thenReturn(page);

        // When & Then
        mockMvc.perform(get("/api/notifications/user/{userId}", userId)
                        .with(csrf())
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(1));

        verify(notificationService).getNotificationsByUser(eq(userId), any(PageRequest.class));
    }

    @Test
    @DisplayName("getHistorique - Succès")
    @WithMockUser(authorities = "ADMIN")
    void getHistorique_Success() throws Exception {
        // Given
        HistoriqueResponse historiqueResponse = new HistoriqueResponse();
        historiqueResponse.setId("hist-1");

        Page<HistoriqueResponse> page = new PageImpl<>(Arrays.asList(historiqueResponse));

        LocalDateTime dateDebut = LocalDateTime.now().minusDays(7);
        LocalDateTime dateFin = LocalDateTime.now();

        when(notificationService.getHistorique(any(LocalDateTime.class), any(LocalDateTime.class), any(PageRequest.class)))
                .thenReturn(page);

        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

        // When & Then
        mockMvc.perform(get("/api/notifications/historique")
                        .with(csrf())
                        .param("dateDebut", dateDebut.format(formatter))
                        .param("dateFin", dateFin.format(formatter))
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(1));

        verify(notificationService).getHistorique(any(LocalDateTime.class), any(LocalDateTime.class), any(PageRequest.class));
    }

    @Test
    @DisplayName("retryFailedNotifications - Succès")
    @WithMockUser(authorities = "ADMIN")
    void retryFailedNotifications_Success() throws Exception {
        // Given
        doNothing().when(notificationService).retryFailedNotifications();

        // When & Then
        mockMvc.perform(post("/api/notifications/retry-failed")
                        .with(csrf()))
                .andExpect(status().isOk());

        verify(notificationService).retryFailedNotifications();
    }

    @Test
    @DisplayName("retryFailedNotifications - Forbidden sans ADMIN")
    @WithMockUser(authorities = "USER")
    void retryFailedNotifications_Forbidden() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/notifications/retry-failed")
                        .with(csrf()))
                .andExpect(status().isForbidden());

        verify(notificationService, never()).retryFailedNotifications();
    }
}
