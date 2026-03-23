package com.timely.notificationservice.listener;

import com.timely.notificationservice.event.PasswordResetEvent;
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
@DisplayName("PasswordResetEventListener - Tests Unitaires")
class PasswordResetEventListenerTest {

    @Mock
    private EmailService emailService;

    @InjectMocks
    private PasswordResetEventListener passwordResetEventListener;

    private PasswordResetEvent passwordResetEvent;

    @BeforeEach
    void setUp() {
        passwordResetEvent = new PasswordResetEvent();
        passwordResetEvent.setEmail("user@example.com");
        passwordResetEvent.setResetLink("http://localhost:4200/reset-password?token=abc123xyz");
        passwordResetEvent.setRecipientName("John Doe");
    }

    @Test
    @DisplayName("handlePasswordResetEvent - Succès")
    void handlePasswordResetEvent_Success() {
        // Given
        doNothing().when(emailService).sendPasswordResetEmail(
                anyString(), anyString(), anyString());

        // When
        passwordResetEventListener.handlePasswordResetEvent(passwordResetEvent);

        // Then
        verify(emailService).sendPasswordResetEmail(
                eq("user@example.com"),
                eq("http://localhost:4200/reset-password?token=abc123xyz"),
                eq("John Doe")
        );
    }

    @Test
    @DisplayName("handlePasswordResetEvent - Échec d'envoi d'email")
    void handlePasswordResetEvent_EmailFailure() {
        // Given
        doThrow(new RuntimeException("Failed to send password reset email"))
                .when(emailService).sendPasswordResetEmail(
                        anyString(), anyString(), anyString());

        // When - Ne devrait pas lancer d'exception (gestion interne)
        passwordResetEventListener.handlePasswordResetEvent(passwordResetEvent);

        // Then
        verify(emailService).sendPasswordResetEmail(
                eq("user@example.com"),
                eq("http://localhost:4200/reset-password?token=abc123xyz"),
                eq("John Doe")
        );
    }

    @Test
    @DisplayName("handlePasswordResetEvent - Avec caractères spéciaux dans le nom")
    void handlePasswordResetEvent_SpecialCharactersInName() {
        // Given
        passwordResetEvent.setRecipientName("Marie-José O'Connor");
        doNothing().when(emailService).sendPasswordResetEmail(
                anyString(), anyString(), anyString());

        // When
        passwordResetEventListener.handlePasswordResetEvent(passwordResetEvent);

        // Then
        verify(emailService).sendPasswordResetEmail(
                eq("user@example.com"),
                eq("http://localhost:4200/reset-password?token=abc123xyz"),
                eq("Marie-José O'Connor")
        );
    }

    @Test
    @DisplayName("handlePasswordResetEvent - Token de réinitialisation complexe")
    void handlePasswordResetEvent_ComplexToken() {
        // Given
        String complexToken = "http://localhost:4200/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
        passwordResetEvent.setResetLink(complexToken);
        doNothing().when(emailService).sendPasswordResetEmail(
                anyString(), anyString(), anyString());

        // When
        passwordResetEventListener.handlePasswordResetEvent(passwordResetEvent);

        // Then
        verify(emailService).sendPasswordResetEmail(
                eq("user@example.com"),
                eq(complexToken),
                eq("John Doe")
        );
    }

    @Test
    @DisplayName("handlePasswordResetEvent - Plusieurs événements en séquence")
    void handlePasswordResetEvent_MultipleEvents() {
        // Given
        PasswordResetEvent event2 = new PasswordResetEvent();
        event2.setEmail("user2@example.com");
        event2.setResetLink("http://localhost:4200/reset-password?token=def456");
        event2.setRecipientName("Jane Smith");

        doNothing().when(emailService).sendPasswordResetEmail(
                anyString(), anyString(), anyString());

        // When
        passwordResetEventListener.handlePasswordResetEvent(passwordResetEvent);
        passwordResetEventListener.handlePasswordResetEvent(event2);

        // Then
        verify(emailService).sendPasswordResetEmail(
                eq("user@example.com"),
                eq("http://localhost:4200/reset-password?token=abc123xyz"),
                eq("John Doe")
        );
        verify(emailService).sendPasswordResetEmail(
                eq("user2@example.com"),
                eq("http://localhost:4200/reset-password?token=def456"),
                eq("Jane Smith")
        );
    }

    @Test
    @DisplayName("handlePasswordResetEvent - Lien avec domaine de production")
    void handlePasswordResetEvent_ProductionDomain() {
        // Given
        passwordResetEvent.setResetLink("https://timely.iusjc.edu.cm/reset-password?token=abc123xyz");
        doNothing().when(emailService).sendPasswordResetEmail(
                anyString(), anyString(), anyString());

        // When
        passwordResetEventListener.handlePasswordResetEvent(passwordResetEvent);

        // Then
        verify(emailService).sendPasswordResetEmail(
                eq("user@example.com"),
                eq("https://timely.iusjc.edu.cm/reset-password?token=abc123xyz"),
                eq("John Doe")
        );
    }

    @Test
    @DisplayName("handlePasswordResetEvent - Email avec domaine institutionnel")
    void handlePasswordResetEvent_InstitutionalEmail() {
        // Given
        passwordResetEvent.setEmail("teacher@iusjc.edu.cm");
        doNothing().when(emailService).sendPasswordResetEmail(
                anyString(), anyString(), anyString());

        // When
        passwordResetEventListener.handlePasswordResetEvent(passwordResetEvent);

        // Then
        verify(emailService).sendPasswordResetEmail(
                eq("teacher@iusjc.edu.cm"),
                eq("http://localhost:4200/reset-password?token=abc123xyz"),
                eq("John Doe")
        );
    }

    @Test
    @DisplayName("handlePasswordResetEvent - Nom de destinataire vide")
    void handlePasswordResetEvent_EmptyRecipientName() {
        // Given
        passwordResetEvent.setRecipientName("");
        doNothing().when(emailService).sendPasswordResetEmail(
                anyString(), anyString(), anyString());

        // When
        passwordResetEventListener.handlePasswordResetEvent(passwordResetEvent);

        // Then
        verify(emailService).sendPasswordResetEmail(
                eq("user@example.com"),
                eq("http://localhost:4200/reset-password?token=abc123xyz"),
                eq("")
        );
    }
}
