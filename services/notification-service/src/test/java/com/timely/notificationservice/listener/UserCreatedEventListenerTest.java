package com.timely.notificationservice.listener;

import com.timely.notificationservice.event.UserCreatedEvent;
import com.timely.notificationservice.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserCreatedEventListener - Tests Unitaires")
class UserCreatedEventListenerTest {

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserCreatedEventListener userCreatedEventListener;

    private UserCreatedEvent userCreatedEvent;

    @BeforeEach
    void setUp() {
        userCreatedEvent = new UserCreatedEvent();
        userCreatedEvent.setEmail("newuser@example.com");
        userCreatedEvent.setName("John");
        userCreatedEvent.setSurname("Doe");
        userCreatedEvent.setTemporaryPassword("TempPass123!");
        userCreatedEvent.setRole("TEACHER");
    }

    @Test
    @DisplayName("handleUserCreated - Succès")
    void handleUserCreated_Success() {
        // Given
        doNothing().when(emailService).sendWelcomeEmail(
                anyString(), anyString(), anyString(), anyString(), anyString());

        // When
        userCreatedEventListener.handleUserCreated(userCreatedEvent);

        // Then
        verify(emailService).sendWelcomeEmail(
                eq("newuser@example.com"),
                eq("John"),
                eq("Doe"),
                eq("TempPass123!"),
                eq("TEACHER")
        );
    }

    @Test
    @DisplayName("handleUserCreated - Échec d'envoi d'email")
    void handleUserCreated_EmailFailure() {
        // Given
        doThrow(new RuntimeException("Failed to send email"))
                .when(emailService).sendWelcomeEmail(
                        anyString(), anyString(), anyString(), anyString(), anyString());

        // When - Ne devrait pas lancer d'exception (gestion interne)
        userCreatedEventListener.handleUserCreated(userCreatedEvent);

        // Then
        verify(emailService).sendWelcomeEmail(
                eq("newuser@example.com"),
                eq("John"),
                eq("Doe"),
                eq("TempPass123!"),
                eq("TEACHER")
        );
    }

    @Test
    @DisplayName("handleUserCreated - Avec role ADMIN")
    void handleUserCreated_AdminRole() {
        // Given
        userCreatedEvent.setRole("ADMIN");
        doNothing().when(emailService).sendWelcomeEmail(
                anyString(), anyString(), anyString(), anyString(), anyString());

        // When
        userCreatedEventListener.handleUserCreated(userCreatedEvent);

        // Then
        verify(emailService).sendWelcomeEmail(
                eq("newuser@example.com"),
                eq("John"),
                eq("Doe"),
                eq("TempPass123!"),
                eq("ADMIN")
        );
    }

    @Test
    @DisplayName("handleUserCreated - Avec caractères spéciaux dans le nom")
    void handleUserCreated_SpecialCharactersInName() {
        // Given
        userCreatedEvent.setName("Jean-François");
        userCreatedEvent.setSurname("O'Brien");
        doNothing().when(emailService).sendWelcomeEmail(
                anyString(), anyString(), anyString(), anyString(), anyString());

        // When
        userCreatedEventListener.handleUserCreated(userCreatedEvent);

        // Then
        verify(emailService).sendWelcomeEmail(
                eq("newuser@example.com"),
                eq("Jean-François"),
                eq("O'Brien"),
                eq("TempPass123!"),
                eq("TEACHER")
        );
    }

    @Test
    @DisplayName("handleUserCreated - Plusieurs événements en séquence")
    void handleUserCreated_MultipleEvents() {
        // Given
        UserCreatedEvent event2 = new UserCreatedEvent();
        event2.setEmail("user2@example.com");
        event2.setName("Jane");
        event2.setSurname("Smith");
        event2.setTemporaryPassword("Pass456!");
        event2.setRole("TEACHER");

        doNothing().when(emailService).sendWelcomeEmail(
                anyString(), anyString(), anyString(), anyString(), anyString());

        // When
        userCreatedEventListener.handleUserCreated(userCreatedEvent);
        userCreatedEventListener.handleUserCreated(event2);

        // Then
        verify(emailService).sendWelcomeEmail(
                eq("newuser@example.com"),
                eq("John"),
                eq("Doe"),
                eq("TempPass123!"),
                eq("TEACHER")
        );
        verify(emailService).sendWelcomeEmail(
                eq("user2@example.com"),
                eq("Jane"),
                eq("Smith"),
                eq("Pass456!"),
                eq("TEACHER")
        );
    }

    @Test
    @DisplayName("handleUserCreated - Mot de passe temporaire complexe")
    void handleUserCreated_ComplexTemporaryPassword() {
        // Given
        userCreatedEvent.setTemporaryPassword("C0mpl3x!P@ssw0rd#2024");
        doNothing().when(emailService).sendWelcomeEmail(
                anyString(), anyString(), anyString(), anyString(), anyString());

        // When
        userCreatedEventListener.handleUserCreated(userCreatedEvent);

        // Then
        verify(emailService).sendWelcomeEmail(
                eq("newuser@example.com"),
                eq("John"),
                eq("Doe"),
                eq("C0mpl3x!P@ssw0rd#2024"),
                eq("TEACHER")
        );
    }

    @Test
    @DisplayName("handleUserCreated - Email avec domaine spécifique")
    void handleUserCreated_SpecificEmailDomain() {
        // Given
        userCreatedEvent.setEmail("teacher@iusjc.edu.cm");
        doNothing().when(emailService).sendWelcomeEmail(
                anyString(), anyString(), anyString(), anyString(), anyString());

        // When
        userCreatedEventListener.handleUserCreated(userCreatedEvent);

        // Then
        verify(emailService).sendWelcomeEmail(
                eq("teacher@iusjc.edu.cm"),
                eq("John"),
                eq("Doe"),
                eq("TempPass123!"),
                eq("TEACHER")
        );
    }
}
