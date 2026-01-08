package com.timely.userservice.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Event published when a new user is created
 * Consumed by notification-service to send welcome email with credentials
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCreatedEvent {
    
    private String email;
    private String temporaryPassword;
    private String name;
    private String surname;
    private String role; // TEACHER or ADMIN
}
