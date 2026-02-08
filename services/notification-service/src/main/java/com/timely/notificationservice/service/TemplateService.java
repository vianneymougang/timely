package com.timely.notificationservice.service;

import com.timely.notificationservice.document.Template;
import com.timely.notificationservice.document.enums.TypeNotification;
import com.timely.notificationservice.dto.request.TemplateRequest;
import com.timely.notificationservice.dto.response.TemplateResponse;
import com.timely.notificationservice.exception.ResourceNotFoundException;
import com.timely.notificationservice.mapper.TemplateMapper;
import com.timely.notificationservice.repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemplateService {

    private final TemplateRepository templateRepository;
    private final TemplateMapper templateMapper;

    @Transactional
    public TemplateResponse createTemplate(TemplateRequest request) {
        log.info("Creating template with name: {}", request.getNom());

        if (templateRepository.existsByNom(request.getNom())) {
            throw new IllegalArgumentException("Un template avec ce nom existe déjà");
        }

        Template template = templateMapper.toEntity(request);
        template.setDateCreation(LocalDateTime.now());
        template.setDateModification(LocalDateTime.now());

        Template savedTemplate = templateRepository.save(template);
        log.info("Template created successfully with id: {}", savedTemplate.getId());

        return templateMapper.toResponse(savedTemplate);
    }

    @Transactional(readOnly = true)
    public TemplateResponse getTemplateById(String id) {
        log.debug("Fetching template with id: {}", id);
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template non trouvé avec l'id: " + id));
        return templateMapper.toResponse(template);
    }

    @Transactional(readOnly = true)
    public List<TemplateResponse> getAllTemplates() {
        log.debug("Fetching all templates");
        return templateRepository.findAll().stream()
                .map(templateMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TemplateResponse> getActiveTemplates() {
        log.debug("Fetching active templates");
        return templateRepository.findByActifTrue().stream()
                .map(templateMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TemplateResponse getActiveTemplateByType(TypeNotification typeNotification) {
        log.debug("Fetching active template for type: {}", typeNotification);
        Template template = templateRepository.findByTypeNotificationAndActifTrue(typeNotification)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Aucun template actif trouvé pour le type: " + typeNotification));
        return templateMapper.toResponse(template);
    }

    @Transactional
    public TemplateResponse updateTemplate(String id, TemplateRequest request) {
        log.info("Updating template with id: {}", id);

        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template non trouvé avec l'id: " + id));

        // Vérifier si le nouveau nom existe déjà (sauf pour le template actuel)
        if (!template.getNom().equals(request.getNom()) && templateRepository.existsByNom(request.getNom())) {
            throw new IllegalArgumentException("Un template avec ce nom existe déjà");
        }

        templateMapper.updateEntity(request, template);
        template.setDateModification(LocalDateTime.now());

        Template updatedTemplate = templateRepository.save(template);
        log.info("Template updated successfully with id: {}", updatedTemplate.getId());

        return templateMapper.toResponse(updatedTemplate);
    }

    @Transactional
    public void deleteTemplate(String id) {
        log.info("Deleting template with id: {}", id);

        if (!templateRepository.existsById(id)) {
            throw new ResourceNotFoundException("Template non trouvé avec l'id: " + id);
        }

        templateRepository.deleteById(id);
        log.info("Template deleted successfully with id: {}", id);
    }
}
