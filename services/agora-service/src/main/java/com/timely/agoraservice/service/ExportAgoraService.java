package com.timely.agoraservice.service;

import com.timely.agoraservice.client.PlanningServiceClient;
import com.timely.agoraservice.dto.request.ExportRequest;
import com.timely.agoraservice.dto.response.ExportAgoraResponse;
import com.timely.agoraservice.entity.ExportAgora;
import com.timely.agoraservice.entity.enums.StatutExportAgora;
import com.timely.agoraservice.exception.ResourceNotFoundException;
import com.timely.agoraservice.mapper.ExportAgoraMapper;
import com.timely.agoraservice.repository.ExportAgoraRepository;
import com.timely.agoraservice.repository.LogIntegrationRepository;
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
public class ExportAgoraService {

    private final ExportAgoraRepository exportAgoraRepository;
    private final LogIntegrationRepository logIntegrationRepository;
    private final ExportAgoraMapper exportAgoraMapper;
    private final PlanningServiceClient planningServiceClient;

    @Transactional
    public ExportAgoraResponse createExport(ExportRequest request) {
        log.info("Creation d'un nouvel export pour l'emploi du temps: {}", request.getEmploiDuTempsId());

        // Verifier que l'emploi du temps existe via le client Feign
        try {
            Object emploiDuTemps = planningServiceClient.getEmploiDuTemps(request.getEmploiDuTempsId());
            if (emploiDuTemps == null) {
                throw new ResourceNotFoundException("Emploi du temps non trouve: " + request.getEmploiDuTempsId());
            }
        } catch (Exception e) {
            log.error("Erreur lors de la verification de l'emploi du temps: {}", e.getMessage());
            throw new ResourceNotFoundException("Impossible de verifier l'emploi du temps: " + request.getEmploiDuTempsId());
        }

        // Creer l'export avec statut EN_ATTENTE
        ExportAgora exportAgora = new ExportAgora();
        exportAgora.setEmploiDuTempsId(request.getEmploiDuTempsId());
        exportAgora.setFormat(request.getFormat());
        exportAgora.setStatut(StatutExportAgora.EN_ATTENTE);
        exportAgora.setDateExport(LocalDateTime.now());
        exportAgora.setNumeroTentative(0);

        ExportAgora saved = exportAgoraRepository.save(exportAgora);
        log.info("Export cree avec succes: {}", saved.getId());

        return exportAgoraMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public ExportAgoraResponse getExportById(UUID id) {
        log.info("Recuperation de l'export: {}", id);
        ExportAgora exportAgora = exportAgoraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Export non trouve: " + id));
        return exportAgoraMapper.toResponse(exportAgora);
    }

    @Transactional(readOnly = true)
    public List<ExportAgoraResponse> getAllExports() {
        log.info("Recuperation de tous les exports");
        List<ExportAgora> exports = exportAgoraRepository.findAll();
        return exportAgoraMapper.toResponseList(exports);
    }

    @Transactional(readOnly = true)
    public List<ExportAgoraResponse> getExportsByStatut(StatutExportAgora statut) {
        log.info("Recuperation des exports avec le statut: {}", statut);
        List<ExportAgora> exports = exportAgoraRepository.findByStatut(statut);
        return exportAgoraMapper.toResponseList(exports);
    }

    @Transactional(readOnly = true)
    public List<ExportAgoraResponse> getExportsByEmploiDuTempsId(UUID emploiDuTempsId) {
        log.info("Recuperation des exports pour l'emploi du temps: {}", emploiDuTempsId);
        List<ExportAgora> exports = exportAgoraRepository.findByEmploiDuTempsId(emploiDuTempsId);
        return exportAgoraMapper.toResponseList(exports);
    }

    @Transactional
    public ExportAgoraResponse updateExportStatut(UUID id, StatutExportAgora statut, String messageErreur) {
        log.info("Mise a jour du statut de l'export {} vers {}", id, statut);
        ExportAgora exportAgora = exportAgoraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Export non trouve: " + id));

        exportAgora.setStatut(statut);
        exportAgora.setMessageErreur(messageErreur);
        exportAgora.setDateDerniereTentative(LocalDateTime.now());

        ExportAgora updated = exportAgoraRepository.save(exportAgora);
        log.info("Statut de l'export mis a jour avec succes");

        return exportAgoraMapper.toResponse(updated);
    }

    @Transactional
    public ExportAgoraResponse incrementTentative(UUID id) {
        log.info("Incrementation du numero de tentative pour l'export: {}", id);
        ExportAgora exportAgora = exportAgoraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Export non trouve: " + id));

        exportAgora.setNumeroTentative(exportAgora.getNumeroTentative() + 1);
        exportAgora.setDateDerniereTentative(LocalDateTime.now());

        ExportAgora updated = exportAgoraRepository.save(exportAgora);
        log.info("Numero de tentative incremente: {}", updated.getNumeroTentative());

        return exportAgoraMapper.toResponse(updated);
    }
}
