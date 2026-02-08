package com.timely.reportservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/api/users/teachers")
    List<Object> getEnseignants();

    @GetMapping("/api/users/{enseignantId}/charge-horaire")
    Object getChargeHoraire(@PathVariable UUID enseignantId);
}
