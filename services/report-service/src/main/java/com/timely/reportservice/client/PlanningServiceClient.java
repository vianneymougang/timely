package com.timely.reportservice.client;

import com.timely.reportservice.dto.client.ConflitDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "planning-service")
public interface PlanningServiceClient {

    @GetMapping("/api/planning/plannings")
    List<Object> getPlannings(
            @RequestParam(required = false) UUID ecoleId,
            @RequestParam(required = false) String statut
    );

    @GetMapping("/internal/conflits")
    List<ConflitDTO> getConflits();
}
