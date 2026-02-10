package com.timely.authservice.event;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetEvent implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String email;
    private String resetLink;
    private String recipientName;

    // Constructeur avec 3 paramètres
    public PasswordResetEvent(String email, String resetLink, String recipientName) {
        this.email = email;
        this.resetLink = resetLink;
        this.recipientName = recipientName;
    }

    public String getEmail() {
        return email;
    }

    public String getResetLink() {
        return resetLink;
    }

    public String getRecipientName() {
        return recipientName;
    }
}
