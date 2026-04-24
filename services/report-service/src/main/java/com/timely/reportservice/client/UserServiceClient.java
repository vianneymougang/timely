package com.timely.reportservice.client;

import com.timely.reportservice.dto.client.ChargeHoraireDTO;
import com.timely.reportservice.dto.client.TeacherSummaryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/internal/users/teachers")
    List<TeacherSummaryDTO> getEnseignants();

    @GetMapping("/internal/users/{enseignantId}/charge-horaire")
    ChargeHoraireDTO getChargeHoraire(@PathVariable UUID enseignantId);
}
