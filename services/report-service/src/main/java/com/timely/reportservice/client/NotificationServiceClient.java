package com.timely.reportservice.client;

import com.timely.reportservice.dto.notification.SendEmailRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Client Feign pour communiquer avec le notification-service.
 */
@FeignClient(name = "notification-service", path = "/api/notifications")
public interface NotificationServiceClient {

    /**
     * Envoie un email via le notification-service.
     */
    @PostMapping("/send")
    void sendEmail(@RequestBody SendEmailRequest request);

    /**
     * Envoie des emails en masse via le notification-service.
     */
    @PostMapping("/bulk/send")
    void sendBulkEmails(@RequestBody SendEmailRequest request);
}
