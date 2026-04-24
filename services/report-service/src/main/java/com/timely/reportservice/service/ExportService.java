package com.timely.reportservice.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.reportservice.dto.response.ExportResponse;
import com.timely.reportservice.entity.Export;
import com.timely.reportservice.entity.Rapport;
import com.timely.reportservice.entity.enums.FormatExport;
import com.timely.reportservice.entity.enums.StatutExport;
import com.timely.reportservice.exception.ResourceNotFoundException;
import com.timely.reportservice.mapper.ExportMapper;
import com.timely.reportservice.repository.ExportRepository;
import com.timely.reportservice.repository.RapportRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExportService {

    private final ExportRepository exportRepository;
    private final RapportRepository rapportRepository;
    private final ExportMapper exportMapper;
    private final FileGenerationService fileGenerationService;

    @Transactional
    public ExportResponse createExport(UUID rapportId, FormatExport format, String utilisateur) {
        log.info("Création d'un export: rapportId={}, format={}, utilisateur={}", rapportId, format, utilisateur);

        Rapport rapport = rapportRepository.findById(rapportId)
                .orElseThrow(() -> new ResourceNotFoundException("Rapport non trouvé avec l'id: " + rapportId));

        Export export = new Export();
        export.setRapport(rapport);
        export.setFormat(format);
        export.setUtilisateur(utilisateur);
        export.setDateExport(LocalDateTime.now());
        export.setStatut(StatutExport.EN_COURS);

        Export savedExport = exportRepository.save(export);

        try {
            String cheminFichier = switch (format) {
                case PDF -> fileGenerationService.generatePDF(rapportId);
                case EXCEL -> fileGenerationService.generateExcel(rapportId);
                case CSV -> fileGenerationService.generateCSV(rapportId);
            };

            savedExport.setCheminFichier(cheminFichier);
            savedExport.setStatut(StatutExport.TERMINE);
            log.info("Export créé avec succès: id={}", savedExport.getId());
        } catch (Exception e) {
            log.error("Erreur lors de la génération du fichier d'export: {}", e.getMessage(), e);
            savedExport.setStatut(StatutExport.ECHOUE);
            savedExport.setMessageErreur(e.getMessage());
        }

        Export finalExport = exportRepository.save(savedExport);
        return exportMapper.toResponse(finalExport);
    }

    @Transactional(readOnly = true)
    public ExportResponse getExportById(UUID id) {
        log.debug("Récupération de l'export: id={}", id);
        Export export = exportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Export non trouvé avec l'id: " + id));
        return exportMapper.toResponse(export);
    }

    @Transactional(readOnly = true)
    public List<ExportResponse> getExportsByRapport(UUID rapportId) {
        log.debug("Récupération des exports pour le rapport: id={}", rapportId);
        return exportRepository.findByRapportId(rapportId).stream()
                .map(exportMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExportResponse> getExportsByUtilisateur(String utilisateur) {
        log.debug("Récupération des exports pour l'utilisateur: {}", utilisateur);
        return exportRepository.findByUtilisateur(utilisateur).stream()
                .map(exportMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExportResponse> getExportsByStatut(StatutExport statut) {
        log.debug("Récupération des exports par statut: {}", statut);
        return exportRepository.findByStatut(statut).stream()
                .map(exportMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateExportStatus(UUID exportId, StatutExport statut, String messageErreur) {
        log.info("Mise à jour du statut de l'export: id={}, statut={}", exportId, statut);

        Export export = exportRepository.findById(exportId)
                .orElseThrow(() -> new ResourceNotFoundException("Export non trouvé avec l'id: " + exportId));

        export.setStatut(statut);
        if (messageErreur != null) {
            export.setMessageErreur(messageErreur);
        }

        exportRepository.save(export);
        log.info("Statut de l'export mis à jour avec succès: id={}", exportId);
    }

    @Transactional
    public void deleteExport(UUID id) {
        log.info("Suppression de l'export: id={}", id);
        if (!exportRepository.existsById(id)) {
            throw new ResourceNotFoundException("Export non trouvé avec l'id: " + id);
        }
        exportRepository.deleteById(id);
        log.info("Export supprimé avec succès: id={}", id);
    }
}
