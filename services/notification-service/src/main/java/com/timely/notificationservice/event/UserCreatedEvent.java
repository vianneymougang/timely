package com.timely.notificationservice.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Event representing a newly created user
 * Mirrors the event from user-service
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
