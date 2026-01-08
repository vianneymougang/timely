package com.timely.notificationservice.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.timely.notificationservice.event.UserCreatedEvent;
import com.timely.notificationservice.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Listener for user creation events
 * Consumes UserCreatedEvent from RabbitMQ and sends welcome email
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class UserCreatedEventListener {
    
    private final EmailService emailService;
    
    @RabbitListener(queues = "user.created.queue")
    public void handleUserCreated(UserCreatedEvent event) {
        log.info("Received UserCreatedEvent for: {}", event.getEmail());
        
        try {
            emailService.sendWelcomeEmail(
                event.getEmail(),
                event.getName(),
                event.getSurname(),
                event.getTemporaryPassword(),
                event.getRole()
            );
            log.info("Welcome email sent successfully to: {}", event.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", event.getEmail(), e);
            // TODO: Implement retry logic or dead letter queue
        }
    }
}
