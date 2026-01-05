package com.timely.notificationservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;
    
    public void sendPasswordResetEmail(String to, String resetLink, String recipientName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("no-reply@timely.com");
            helper.setTo(to);
            helper.setSubject("Réinitialisation de votre mot de passe - Timely");
            
            String htmlContent = buildPasswordResetEmailTemplate(recipientName, resetLink);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Password reset email sent successfully to: {}", to);
            
        } catch (MessagingException e) {
            logger.error("Failed to send password reset email to: {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
    
    private String buildPasswordResetEmailTemplate(String recipientName, String resetLink) {
        return """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0d9488 0%%, #0f766e 100%%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Timely</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Institut Saint Jean du Cameroun</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">Réinitialisation de votre mot de passe</h2>
                            
                            <p style="color: #475569; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                                Bonjour %s,
                            </p>
                            
                            <p style="color: #475569; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                                Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Timely.
                            </p>
                            
                            <p style="color: #475569; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                                Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
                            </p>
                            
                            <!-- Button -->
                            <table width="100%%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="padding: 0 0 30px 0;">
                                        <a href="%s" style="display: inline-block; padding: 16px 40px; background-color: #0d9488; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                                            Réinitialiser mon mot de passe
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #64748b; font-size: 14px; line-height: 20px; margin: 0 0 10px 0;">
                                Ce lien est valable pendant <strong>24 heures</strong>.
                            </p>
                            
                            <p style="color: #64748b; font-size: 14px; line-height: 20px; margin: 0 0 20px 0;">
                                Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
                            </p>
                            
                            <!-- Divider -->
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                            
                            <p style="color: #94a3b8; font-size: 12px; line-height: 18px; margin: 0;">
                                <strong>Remarque :</strong> Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :<br>
                                <span style="color: #0d9488; word-break: break-all;">%s</span>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
                            <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
                                © 2025 Timely - Institut Saint Jean du Cameroun
                            </p>
                            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
                """.formatted(recipientName, resetLink, resetLink);
    }
}
