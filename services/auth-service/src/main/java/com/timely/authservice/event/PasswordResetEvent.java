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
}
