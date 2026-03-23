package com.timely.notificationservice.service;

import com.timely.notificationservice.document.HistoriqueEnvoi;
import com.timely.notificationservice.document.Notification;
import com.timely.notificationservice.document.enums.CanalNotification;
import com.timely.notificationservice.document.enums.StatutEnvoi;
import com.timely.notificationservice.document.enums.StatutNotification;
import com.timely.notificationservice.document.enums.TypeNotification;
import com.timely.notificationservice.dto.request.ScheduleNotificationRequest;
import com.timely.notificationservice.dto.request.SendNotificationRequest;
import com.timely.notificationservice.dto.response.NotificationDetailsResponse;
import com.timely.notificationservice.dto.response.NotificationResponse;
import com.timely.notificationservice.exception.ResourceNotFoundException;
import com.timely.notificationservice.mapper.NotificationMapper;
import com.timely.notificationservice.repository.HistoriqueEnvoiRepository;
import com.timely.notificationservice.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("NotificationService - Tests Unitaires")
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private HistoriqueEnvoiRepository historiqueEnvoiRepository;

    @Mock
    private NotificationMapper notificationMapper;

    @Mock
    private EmailService emailService;

    @Mock
    private SMSService smsService;

    @Mock
    private PushNotificationService pushNotificationService;

    @Mock
    private TemplateEngineService templateEngineService;

    @InjectMocks
    private NotificationService notificationService;

    private SendNotificationRequest sendRequest;
    private Notification notification;
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

        notification = new Notification();
        notification.setId("notif-123");
        notification.setDestinataireId(userId);
        notification.setTypeNotification(TypeNotification.RAPPEL_COURS);
        notification.setSujet("Test Subject");
        notification.setContenu("Test Content");
        notification.setCanal(CanalNotification.EMAIL);
        notification.setStatut(StatutNotification.PENDING);
        notification.setTentativesRestantes(3);
        notification.setDateCreation(LocalDateTime.now());

        notificationResponse = new NotificationResponse();
        notificationResponse.setId("notif-123");
        notificationResponse.setDestinataireId(userId);
        notificationResponse.setStatut(StatutNotification.SENT);
    }

    @Test
    @DisplayName("sendNotification - Succès EMAIL")
    void sendNotification_Success_Email() {
        // Given
        when(notificationMapper.toEntity(sendRequest)).thenReturn(notification);
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        when(notificationMapper.toResponse(any(Notification.class))).thenReturn(notificationResponse);
        doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());

        // When
        NotificationResponse result = notificationService.sendNotification(sendRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("notif-123");

        verify(notificationRepository, times(2)).save(any(Notification.class));
        verify(emailService).sendEmail(anyString(), eq("Test Subject"), eq("Test Content"));
        verify(historiqueEnvoiRepository).save(any(HistoriqueEnvoi.class));

        ArgumentCaptor<Notification> notificationCaptor = ArgumentCaptor.forClass(Notification.class);
        verify(notificationRepository, times(2)).save(notificationCaptor.capture());

        List<Notification> savedNotifications = notificationCaptor.getAllValues();
        assertThat(savedNotifications.get(1).getStatut()).isEqualTo(StatutNotification.SENT);
        assertThat(savedNotifications.get(1).getDateEnvoi()).isNotNull();
    }

    @Test
    @DisplayName("sendNotification - Échec EMAIL")
    void sendNotification_Failure_Email() {
        // Given
        when(notificationMapper.toEntity(sendRequest)).thenReturn(notification);
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        when(notificationMapper.toResponse(any(Notification.class))).thenReturn(notificationResponse);
        doThrow(new RuntimeException("Email failed")).when(emailService).sendEmail(anyString(), anyString(), anyString());

        // When
        NotificationResponse result = notificationService.sendNotification(sendRequest);

        // Then
        assertThat(result).isNotNull();

        ArgumentCaptor<Notification> notificationCaptor = ArgumentCaptor.forClass(Notification.class);
        verify(notificationRepository, times(2)).save(notificationCaptor.capture());

        List<Notification> savedNotifications = notificationCaptor.getAllValues();
        assertThat(savedNotifications.get(1).getStatut()).isEqualTo(StatutNotification.FAILED);
        assertThat(savedNotifications.get(1).getTentativesRestantes()).isEqualTo(2);

        verify(historiqueEnvoiRepository).save(any(HistoriqueEnvoi.class));
    }

    @Test
    @DisplayName("sendNotification - Succès SMS")
    void sendNotification_Success_SMS() {
        // Given
        sendRequest.setCanal(CanalNotification.SMS);
        notification.setCanal(CanalNotification.SMS);

        when(notificationMapper.toEntity(sendRequest)).thenReturn(notification);
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        when(notificationMapper.toResponse(any(Notification.class))).thenReturn(notificationResponse);
        when(smsService.isEnabled()).thenReturn(true);
        when(smsService.sendSMS(anyString(), anyString())).thenReturn(true);

        // When
        NotificationResponse result = notificationService.sendNotification(sendRequest);

        // Then
        assertThat(result).isNotNull();

        verify(smsService).isEnabled();
        verify(smsService).sendSMS(anyString(), eq("Test Content"));
        verify(historiqueEnvoiRepository).save(any(HistoriqueEnvoi.class));
    }

    @Test
    @DisplayName("sendNotification - SMS désactivé")
    void sendNotification_SMS_Disabled() {
        // Given
        sendRequest.setCanal(CanalNotification.SMS);
        notification.setCanal(CanalNotification.SMS);

        when(notificationMapper.toEntity(sendRequest)).thenReturn(notification);
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        when(notificationMapper.toResponse(any(Notification.class))).thenReturn(notificationResponse);
        when(smsService.isEnabled()).thenReturn(false);

        // When
        NotificationResponse result = notificationService.sendNotification(sendRequest);

        // Then
        assertThat(result).isNotNull();

        ArgumentCaptor<Notification> notificationCaptor = ArgumentCaptor.forClass(Notification.class);
        verify(notificationRepository, times(2)).save(notificationCaptor.capture());

        List<Notification> savedNotifications = notificationCaptor.getAllValues();
        assertThat(savedNotifications.get(1).getStatut()).isEqualTo(StatutNotification.FAILED);

        verify(smsService).isEnabled();
        verify(smsService, never()).sendSMS(anyString(), anyString());
    }

    @Test
    @DisplayName("sendNotification - Succès PUSH")
    void sendNotification_Success_Push() {
        // Given
        sendRequest.setCanal(CanalNotification.PUSH);
        notification.setCanal(CanalNotification.PUSH);

        when(notificationMapper.toEntity(sendRequest)).thenReturn(notification);
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        when(notificationMapper.toResponse(any(Notification.class))).thenReturn(notificationResponse);
        when(pushNotificationService.isEnabled()).thenReturn(true);
        when(pushNotificationService.sendPushNotification(anyString(), anyString(), anyString())).thenReturn(true);

        // When
        NotificationResponse result = notificationService.sendNotification(sendRequest);

        // Then
        assertThat(result).isNotNull();

        verify(pushNotificationService).isEnabled();
        verify(pushNotificationService).sendPushNotification(anyString(), eq("Test Subject"), eq("Test Content"));
        verify(historiqueEnvoiRepository).save(any(HistoriqueEnvoi.class));
    }

    @Test
    @DisplayName("sendBulkNotifications - Succès")
    void sendBulkNotifications_Success() {
        // Given
        List<SendNotificationRequest> requests = Arrays.asList(sendRequest, sendRequest);

        when(notificationMapper.toEntity(any(SendNotificationRequest.class))).thenReturn(notification);
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        when(notificationMapper.toResponse(any(Notification.class))).thenReturn(notificationResponse);
        doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());

        // When
        List<NotificationResponse> results = notificationService.sendBulkNotifications(requests);

        // Then
        assertThat(results).hasSize(2);
        verify(notificationRepository, times(4)).save(any(Notification.class)); // 2 notifications x 2 saves each
        verify(emailService, times(2)).sendEmail(anyString(), anyString(), anyString());
        verify(historiqueEnvoiRepository, times(2)).save(any(HistoriqueEnvoi.class));
    }

    @Test
    @DisplayName("scheduleNotification - Succès")
    void scheduleNotification_Success() {
        // Given
        ScheduleNotificationRequest scheduleRequest = new ScheduleNotificationRequest();
        scheduleRequest.setDestinataireId(userId);
        scheduleRequest.setTypeNotification(TypeNotification.RAPPEL_COURS);
        scheduleRequest.setSujet("Scheduled Subject");
        scheduleRequest.setContenu("Scheduled Content");
        scheduleRequest.setCanal(CanalNotification.EMAIL);
        scheduleRequest.setDateEnvoiPrevue(LocalDateTime.now().plusHours(1));

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        when(notificationMapper.toResponse(any(Notification.class))).thenReturn(notificationResponse);

        // When
        NotificationResponse result = notificationService.scheduleNotification(scheduleRequest);

        // Then
        assertThat(result).isNotNull();

        ArgumentCaptor<Notification> notificationCaptor = ArgumentCaptor.forClass(Notification.class);
        verify(notificationRepository).save(notificationCaptor.capture());

        Notification savedNotification = notificationCaptor.getValue();
        assertThat(savedNotification.getStatut()).isEqualTo(StatutNotification.PENDING);
        assertThat(savedNotification.getTentativesRestantes()).isEqualTo(3);
    }

    @Test
    @DisplayName("getNotificationStatus - Succès")
    void getNotificationStatus_Success() {
        // Given
        String notificationId = "notif-123";
        when(notificationRepository.findById(notificationId)).thenReturn(Optional.of(notification));
        when(notificationMapper.toResponse(notification)).thenReturn(notificationResponse);

        // When
        NotificationResponse result = notificationService.getNotificationStatus(notificationId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("notif-123");
        verify(notificationRepository).findById(notificationId);
    }

    @Test
    @DisplayName("getNotificationStatus - NotFound")
    void getNotificationStatus_NotFound() {
        // Given
        String notificationId = "invalid-id";
        when(notificationRepository.findById(notificationId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> notificationService.getNotificationStatus(notificationId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Notification non trouvée avec l'id: invalid-id");

        verify(notificationRepository).findById(notificationId);
    }

    @Test
    @DisplayName("getNotificationDetails - Succès")
    void getNotificationDetails_Success() {
        // Given
        String notificationId = "notif-123";
        notification.setDateEnvoi(LocalDateTime.now());

        HistoriqueEnvoi historique = new HistoriqueEnvoi();
        historique.setId("hist-1");
        historique.setNotificationId(notificationId);
        historique.setStatut(StatutEnvoi.ENVOYE);
        historique.setTimestampEnvoi(LocalDateTime.now());

        when(notificationRepository.findById(notificationId)).thenReturn(Optional.of(notification));
        when(historiqueEnvoiRepository.findByNotificationId(notificationId)).thenReturn(Arrays.asList(historique));

        // When
        NotificationDetailsResponse result = notificationService.getNotificationDetails(notificationId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("notif-123");
        assertThat(result.getHistorique()).hasSize(1);
        assertThat(result.getNombreTentatives()).isEqualTo(1);
        verify(notificationRepository).findById(notificationId);
        verify(historiqueEnvoiRepository).findByNotificationId(notificationId);
    }

    @Test
    @DisplayName("getNotificationDetails - Avec message d'erreur")
    void getNotificationDetails_WithErrorMessage() {
        // Given
        String notificationId = "notif-123";

        HistoriqueEnvoi historique = new HistoriqueEnvoi();
        historique.setId("hist-1");
        historique.setNotificationId(notificationId);
        historique.setStatut(StatutEnvoi.ECHOUE);
        historique.setMessageErreur("Connection timeout");
        historique.setTimestampEnvoi(LocalDateTime.now());

        when(notificationRepository.findById(notificationId)).thenReturn(Optional.of(notification));
        when(historiqueEnvoiRepository.findByNotificationId(notificationId)).thenReturn(Arrays.asList(historique));

        // When
        NotificationDetailsResponse result = notificationService.getNotificationDetails(notificationId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getDernierMessageErreur()).isEqualTo("Connection timeout");
    }

    @Test
    @DisplayName("getNotificationsByUser - Succès")
    void getNotificationsByUser_Success() {
        // Given
        Pageable pageable = PageRequest.of(0, 20);
        Page<Notification> notificationPage = new PageImpl<>(Arrays.asList(notification));

        when(notificationRepository.findByDestinataireId(userId, pageable)).thenReturn(notificationPage);
        when(notificationMapper.toResponse(any(Notification.class))).thenReturn(notificationResponse);

        // When
        Page<NotificationResponse> result = notificationService.getNotificationsByUser(userId, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        verify(notificationRepository).findByDestinataireId(userId, pageable);
    }

    @Test
    @DisplayName("retryFailedNotifications - Succès")
    void retryFailedNotifications_Success() {
        // Given
        Notification failedNotification = new Notification();
        failedNotification.setId("failed-notif");
        failedNotification.setDestinataireId(userId);
        failedNotification.setCanal(CanalNotification.EMAIL);
        failedNotification.setSujet("Failed Subject");
        failedNotification.setContenu("Failed Content");
        failedNotification.setStatut(StatutNotification.FAILED);
        failedNotification.setTentativesRestantes(2);

        when(notificationRepository.findByStatut(StatutNotification.FAILED))
                .thenReturn(Arrays.asList(failedNotification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(failedNotification);
        doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());

        // When
        notificationService.retryFailedNotifications();

        // Then
        verify(notificationRepository).findByStatut(StatutNotification.FAILED);
        verify(emailService).sendEmail(anyString(), eq("Failed Subject"), eq("Failed Content"));
        verify(notificationRepository).save(any(Notification.class));
        verify(historiqueEnvoiRepository).save(any(HistoriqueEnvoi.class));
    }

    @Test
    @DisplayName("retryFailedNotifications - Aucune tentative restante")
    void retryFailedNotifications_NoAttemptsLeft() {
        // Given
        Notification failedNotification = new Notification();
        failedNotification.setId("failed-notif");
        failedNotification.setStatut(StatutNotification.FAILED);
        failedNotification.setTentativesRestantes(0);

        when(notificationRepository.findByStatut(StatutNotification.FAILED))
                .thenReturn(Arrays.asList(failedNotification));

        // When
        notificationService.retryFailedNotifications();

        // Then
        verify(notificationRepository).findByStatut(StatutNotification.FAILED);
        verify(emailService, never()).sendEmail(anyString(), anyString(), anyString());
        verify(notificationRepository, never()).save(any(Notification.class));
    }

    @Test
    @DisplayName("sendNotificationAsync - Succès")
    void sendNotificationAsync_Success() throws Exception {
        // Given
        String notificationId = "notif-123";
        when(notificationRepository.findById(notificationId)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());

        // When
        CompletableFuture<Boolean> result = notificationService.sendNotificationAsync(notificationId);

        // Then
        assertThat(result.get()).isTrue();
        verify(notificationRepository).findById(notificationId);
        verify(emailService).sendEmail(anyString(), eq("Test Subject"), eq("Test Content"));
        verify(notificationRepository).save(any(Notification.class));
        verify(historiqueEnvoiRepository).save(any(HistoriqueEnvoi.class));
    }

    @Test
    @DisplayName("sendNotificationAsync - NotFound")
    void sendNotificationAsync_NotFound() throws Exception {
        // Given
        String notificationId = "invalid-id";
        when(notificationRepository.findById(notificationId)).thenReturn(Optional.empty());

        // When
        CompletableFuture<Boolean> result = notificationService.sendNotificationAsync(notificationId);

        // Then
        assertThat(result.get()).isFalse();
        verify(notificationRepository).findById(notificationId);
        verify(emailService, never()).sendEmail(anyString(), anyString(), anyString());
    }
}
