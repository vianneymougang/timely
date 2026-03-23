package com.timely.notificationservice.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("EmailService - Tests Unitaires")
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
    @DisplayName("sendEmail - Succès")
    void sendEmail_Success() {
        // Given
        String to = "user@example.com";
        String subject = "Test Subject";
        String body = "Test Body";

        // When
        emailService.sendEmail(to, subject, body);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("sendEmail - Échec MessagingException")
    void sendEmail_MessagingException() {
        // Given
        String to = "user@example.com";
        String subject = "Test Subject";
        String body = "Test Body";

        when(mailSender.createMimeMessage()).thenThrow(new RuntimeException("Mail server unavailable"));

        // When & Then
        assertThatThrownBy(() -> emailService.sendEmail(to, subject, body))
                .isInstanceOf(RuntimeException.class);

        verify(mailSender).createMimeMessage();
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("sendPasswordResetEmail - Succès")
    void sendPasswordResetEmail_Success() {
        // Given
        String to = "user@example.com";
        String resetLink = "http://example.com/reset?token=abc123";
        String recipientName = "John Doe";

        // When
        emailService.sendPasswordResetEmail(to, resetLink, recipientName);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("sendPasswordResetEmail - Contenu HTML valide")
    void sendPasswordResetEmail_ValidHtmlContent() {
        // Given
        String to = "user@example.com";
        String resetLink = "http://example.com/reset?token=abc123";
        String recipientName = "John Doe";

        // When
        emailService.sendPasswordResetEmail(to, resetLink, recipientName);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("sendPasswordResetEmail - Échec")
    void sendPasswordResetEmail_Failure() {
        // Given
        String to = "user@example.com";
        String resetLink = "http://example.com/reset?token=abc123";
        String recipientName = "John Doe";

        when(mailSender.createMimeMessage()).thenThrow(new RuntimeException("Mail server error"));

        // When & Then
        assertThatThrownBy(() -> emailService.sendPasswordResetEmail(to, resetLink, recipientName))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Mail server error");

        verify(mailSender).createMimeMessage();
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("sendWelcomeEmail - Succès")
    void sendWelcomeEmail_Success() {
        // Given
        String to = "newuser@example.com";
        String name = "John";
        String surname = "Doe";
        String temporaryPassword = "TempPass123!";
        String role = "TEACHER";

        // When
        emailService.sendWelcomeEmail(to, name, surname, temporaryPassword, role);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("sendWelcomeEmail - Role TEACHER")
    void sendWelcomeEmail_TeacherRole() {
        // Given
        String to = "teacher@example.com";
        String name = "Jane";
        String surname = "Smith";
        String temporaryPassword = "TempPass456!";
        String role = "TEACHER";

        // When
        emailService.sendWelcomeEmail(to, name, surname, temporaryPassword, role);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("sendWelcomeEmail - Role ADMIN")
    void sendWelcomeEmail_AdminRole() {
        // Given
        String to = "admin@example.com";
        String name = "Admin";
        String surname = "User";
        String temporaryPassword = "AdminPass789!";
        String role = "ADMIN";

        // When
        emailService.sendWelcomeEmail(to, name, surname, temporaryPassword, role);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("sendWelcomeEmail - Échec")
    void sendWelcomeEmail_Failure() {
        // Given
        String to = "newuser@example.com";
        String name = "John";
        String surname = "Doe";
        String temporaryPassword = "TempPass123!";
        String role = "TEACHER";

        when(mailSender.createMimeMessage()).thenThrow(new RuntimeException("Mail server error"));

        // When & Then
        assertThatThrownBy(() -> emailService.sendWelcomeEmail(to, name, surname, temporaryPassword, role))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Mail server error");

        verify(mailSender).createMimeMessage();
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("sendWelcomeEmail - Paramètres avec caractères spéciaux")
    void sendWelcomeEmail_SpecialCharacters() {
        // Given
        String to = "user@example.com";
        String name = "Jean-François";
        String surname = "O'Brien";
        String temporaryPassword = "P@ssw0rd!#$";
        String role = "TEACHER";

        // When
        emailService.sendWelcomeEmail(to, name, surname, temporaryPassword, role);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("sendEmail - Plusieurs destinataires en séquence")
    void sendEmail_MultipleRecipients() {
        // Given
        String[] recipients = {"user1@example.com", "user2@example.com", "user3@example.com"};
        String subject = "Mass Email";
        String body = "This is a mass email";

        // When
        for (String recipient : recipients) {
            emailService.sendEmail(recipient, subject, body);
        }

        // Then
        verify(mailSender, times(3)).createMimeMessage();
        verify(mailSender, times(3)).send(mimeMessage);
    }
}
