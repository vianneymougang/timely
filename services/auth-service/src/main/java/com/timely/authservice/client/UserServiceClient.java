package com.timely.authservice.client;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.timely.authservice.dto.InternalUserDto;

@FeignClient(name = "user-service", path = "/internal/users")
public interface UserServiceClient {
    
    @GetMapping("/email/{email}")
    InternalUserDto findByEmail(@PathVariable("email") String email);
    
    @GetMapping("/{id}")
    InternalUserDto findById(@PathVariable("id") UUID id);
    
    @GetMapping("/exists-by-email")
    Boolean existsByEmail(@RequestParam("email") String email);
}
