package com.timely.agora_service.service;

import com.timely.agora_service.dto.response.LogResponse;
import com.timely.agora_service.entity.ExportAgora;
import com.timely.agora_service.entity.LogIntegration;
import com.timely.agora_service.entity.enums.TypeLog;
import com.timely.agora_service.exception.ResourceNotFoundException;
import com.timely.agora_service.mapper.LogIntegrationMapper;
import com.timely.agora_service.repository.ExportAgoraRepository;
import com.timely.agora_service.repository.LogIntegrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class LogIntegrationService {

    private final LogIntegrationRepository logIntegrationRepository;
    private final ExportAgoraRepository exportAgoraRepository;
    private final LogIntegrationMapper logIntegrationMapper;

    @Transactional
    public LogResponse createLog(UUID exportAgoraId, TypeLog type, String message, String stackTrace) {
        log.info("Creation d'un nouveau log de type {} pour l'export: {}", type, exportAgoraId);

        ExportAgora exportAgora = exportAgoraRepository.findById(exportAgoraId)
                .orElseThrow(() -> new ResourceNotFoundException("Export non trouve: " + exportAgoraId));

        LogIntegration logIntegration = new LogIntegration();
        logIntegration.setExportAgora(exportAgora);
        logIntegration.setTypeLog(type);
        logIntegration.setMessage(message);
        logIntegration.setStackTrace(stackTrace);
        logIntegration.setTimestamp(LocalDateTime.now());

        LogIntegration saved = logIntegrationRepository.save(logIntegration);
        log.info("Log cree avec succes: {}", saved.getId());

        return logIntegrationMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<LogResponse> getLogsByExportId(UUID exportAgoraId) {
        log.info("Recuperation des logs pour l'export: {}", exportAgoraId);

        ExportAgora exportAgora = exportAgoraRepository.findById(exportAgoraId)
                .orElseThrow(() -> new ResourceNotFoundException("Export non trouve: " + exportAgoraId));

        List<LogIntegration> logs = logIntegrationRepository.findByExportAgoraOrderByTimestampDesc(exportAgora);
        return logIntegrationMapper.toResponseList(logs);
    }

    @Transactional(readOnly = true)
    public List<LogResponse> getLogsByType(TypeLog type) {
        log.info("Recuperation des logs de type: {}", type);
        List<LogIntegration> logs = logIntegrationRepository.findByTypeLog(type);
        return logIntegrationMapper.toResponseList(logs);
    }

    @Transactional(readOnly = true)
    public List<LogResponse> getAllLogs() {
        log.info("Recuperation de tous les logs");
        List<LogIntegration> logs = logIntegrationRepository.findAll();
        return logIntegrationMapper.toResponseList(logs);
    }

    @Transactional
    public void deleteLog(UUID id) {
        log.info("Suppression du log: {}", id);
        LogIntegration logIntegration = logIntegrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Log non trouve: " + id));

        logIntegrationRepository.delete(logIntegration);
        log.info("Log supprime avec succes");
    }
}
