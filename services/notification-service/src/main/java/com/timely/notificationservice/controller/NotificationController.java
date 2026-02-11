package com.timely.notificationservice.controller;

import com.timely.notificationservice.dto.request.ScheduleNotificationRequest;
import com.timely.notificationservice.dto.request.SendNotificationRequest;
import com.timely.notificationservice.dto.response.HistoriqueResponse;
import com.timely.notificationservice.dto.response.NotificationDetailsResponse;
import com.timely.notificationservice.dto.response.NotificationResponse;
import com.timely.notificationservice.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<NotificationResponse> sendNotification(
            @Valid @RequestBody SendNotificationRequest request) {
        NotificationResponse response = notificationService.sendNotification(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/send-bulk")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<NotificationResponse>> sendBulkNotifications(
            @Valid @RequestBody List<SendNotificationRequest> requests) {
        List<NotificationResponse> responses = notificationService.sendBulkNotifications(requests);
        return new ResponseEntity<>(responses, HttpStatus.CREATED);
    }

    @PostMapping("/schedule")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<NotificationResponse> scheduleNotification(
            @Valid @RequestBody ScheduleNotificationRequest request) {
        NotificationResponse response = notificationService.scheduleNotification(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<NotificationResponse> getNotificationStatus(@PathVariable String id) {
        NotificationResponse response = notificationService.getNotificationStatus(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/details")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<NotificationDetailsResponse> getNotificationDetails(@PathVariable String id) {
        NotificationDetailsResponse response = notificationService.getNotificationDetails(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByUser(@PathVariable UUID userId) {
        List<NotificationResponse> responses = notificationService.getNotificationsByUser(userId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/historique")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<HistoriqueResponse>> getHistorique(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {
        List<HistoriqueResponse> responses = notificationService.getHistorique(dateDebut, dateFin);
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/retry-failed")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> retryFailedNotifications() {
        notificationService.retryFailedNotifications();
        return ResponseEntity.ok().build();
    }
}
