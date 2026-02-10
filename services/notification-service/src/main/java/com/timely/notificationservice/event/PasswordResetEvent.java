package com.timely.notificationservice.event;

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setResetLink(String resetLink) {
        this.resetLink = resetLink;
    }

    public String getResetLink() {
        return resetLink;
    }
}
