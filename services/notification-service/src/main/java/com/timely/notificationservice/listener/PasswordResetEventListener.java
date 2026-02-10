package com.timely.notificationservice.listener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.timely.notificationservice.config.RabbitMQConfig;
import com.timely.notificationservice.event.PasswordResetEvent;
import com.timely.notificationservice.service.EmailService;

@Component
public class PasswordResetEventListener {
    
    private static final Logger logger = LoggerFactory.getLogger(PasswordResetEventListener.class);
    
    @Autowired
    private EmailService emailService;
    
    @RabbitListener(queues = RabbitMQConfig.PASSWORD_RESET_QUEUE)
    public void handlePasswordResetEvent(PasswordResetEvent event) {
        logger.info("Received password reset event for email: {}", event.getEmail());
        
        try {
            emailService.sendPasswordResetEmail(
                    event.getEmail(),
                    event.getResetLink(),
                    event.getRecipientName()
            );
            logger.info("Password reset email sent successfully to: {}", event.getEmail());
        } catch (Exception e) {
            logger.error("Failed to process password reset event for: {}", event.getEmail(), e);
            // TODO: Implement retry logic or dead letter queue
        }
    }
}
