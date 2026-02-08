package com.timely.notificationservice.controller;

import com.timely.notificationservice.document.enums.TypeNotification;
import com.timely.notificationservice.dto.request.TemplateRequest;
import com.timely.notificationservice.dto.response.TemplateResponse;
import com.timely.notificationservice.service.TemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications/templates")
@RequiredArgsConstructor
public class TemplateController {

    private final TemplateService templateService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<TemplateResponse> createTemplate(@Valid @RequestBody TemplateRequest request) {
        TemplateResponse response = templateService.createTemplate(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<TemplateResponse> getTemplateById(@PathVariable String id) {
        TemplateResponse response = templateService.getTemplateById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<TemplateResponse>> getAllTemplates() {
        List<TemplateResponse> responses = templateService.getAllTemplates();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/active")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<TemplateResponse>> getActiveTemplates() {
        List<TemplateResponse> responses = templateService.getActiveTemplates();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/type/{typeNotification}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<TemplateResponse> getActiveTemplateByType(
            @PathVariable TypeNotification typeNotification) {
        TemplateResponse response = templateService.getActiveTemplateByType(typeNotification);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<TemplateResponse> updateTemplate(
            @PathVariable String id,
            @Valid @RequestBody TemplateRequest request) {
        TemplateResponse response = templateService.updateTemplate(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }
}
