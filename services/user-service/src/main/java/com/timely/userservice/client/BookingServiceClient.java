package com.timely.userservice.client;

import com.timely.userservice.dto.CoursResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

/**
 * Feign client for booking-service API.
 * Uses Eureka service discovery to locate booking-service.
 */
@FeignClient(name = "booking-service")
public interface BookingServiceClient {

    /**
     * Get all courses assigned to a specific teacher.
     * Note: This assumes booking-service has an endpoint to get courses by teacher ID.
     */
    @GetMapping("/api/cours/enseignant/{enseignantId}")
    List<CoursResponseDto> getCoursByEnseignant(@PathVariable("enseignantId") UUID enseignantId);

    /**
     * Get course details by ID.
     */
    @GetMapping("/api/cours/{id}")
    CoursResponseDto getCoursById(@PathVariable("id") UUID id);
}
