package com.timely.notificationservice.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

@Service
@Slf4j
public class PushNotificationService {

    @Value("${firebase.credentials-path}")
    private String credentialsPath;

    @Value("${firebase.enabled:false}")
    private boolean firebaseEnabled;

    @PostConstruct
    public void init() {
        if (!firebaseEnabled) {
            log.warn("Firebase push notification service is disabled. Set firebase.enabled=true to enable.");
            return;
        }

        try {
            FileInputStream serviceAccount = new FileInputStream(credentialsPath);

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                log.info("Firebase push notification service initialized successfully");
            }
        } catch (IOException e) {
            log.error("Failed to initialize Firebase: {}", e.getMessage(), e);
            log.warn("Firebase push notifications will not be available");
        }
    }

    public boolean sendPushNotification(String fcmToken, String title, String body) {
        if (!firebaseEnabled) {
            log.warn("Firebase is disabled. Push notification not sent");
            return false;
        }

        if (FirebaseApp.getApps().isEmpty()) {
            log.error("Firebase not initialized. Cannot send push notification");
            return false;
        }

        try {
            Message message = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Push notification sent successfully: {}", response);
            return true;
        } catch (Exception e) {
            log.error("Failed to send push notification", e);
            return false;
        }
    }

    public boolean isEnabled() {
        return firebaseEnabled && !FirebaseApp.getApps().isEmpty();
    }
}
