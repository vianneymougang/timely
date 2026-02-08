package com.timely.notificationservice.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
@Slf4j
public class SMSService {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.phone-number}")
    private String fromPhoneNumber;

    @Value("${twilio.enabled:false}")
    private boolean twilioEnabled;

    @PostConstruct
    public void init() {
        if (twilioEnabled) {
            Twilio.init(accountSid, authToken);
            log.info("Twilio SMS service initialized successfully");
        } else {
            log.warn("Twilio SMS service is disabled. Set twilio.enabled=true to enable.");
        }
    }

    public boolean sendSMS(String toPhoneNumber, String message) {
        if (!twilioEnabled) {
            log.warn("Twilio is disabled. SMS not sent to: {}", toPhoneNumber);
            return false;
        }

        try {
            Message twilioMessage = Message.creator(
                    new PhoneNumber(toPhoneNumber),
                    new PhoneNumber(fromPhoneNumber),
                    message
            ).create();

            log.info("SMS sent successfully to: {} with SID: {}", toPhoneNumber, twilioMessage.getSid());
            return true;
        } catch (Exception e) {
            log.error("Failed to send SMS to: {}", toPhoneNumber, e);
            return false;
        }
    }

    public boolean isEnabled() {
        return twilioEnabled;
    }
}
