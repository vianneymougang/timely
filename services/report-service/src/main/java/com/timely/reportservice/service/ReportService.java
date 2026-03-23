package com.timely.reportservice.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.reportservice.dto.request.GenerateReportRequest;
import com.timely.reportservice.dto.response.RapportResponse;
import com.timely.reportservice.entity.Rapport;
import com.timely.reportservice.exception.ResourceNotFoundException;
import com.timely.reportservice.mapper.RapportMapper;
import com.timely.reportservice.repository.RapportRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final RapportRepository rapportRepository;
    private final RapportMapper rapportMapper;

    @Transactional
    public RapportResponse generateReport(GenerateReportRequest request, String utilisateurCreateur) {
        log.info("Génération du rapport: type={}, titre={}", request.getTypeRapport(), request.getTitre());

        Rapport rapport = rapportMapper.toEntity(request);
        rapport.setUtilisateurCreateur(utilisateurCreateur);
        rapport.setDateGeneration(LocalDateTime.now());

        // TODO: Implémenter la logique de génération du rapport
        // Pour l'instant, on sauvegarde juste l'entité
        String cheminFichier = generateFilePath(rapport);
        rapport.setCheminFichier(cheminFichier);

        Rapport savedRapport = rapportRepository.save(rapport);
        log.info("Rapport généré avec succès: id={}", savedRapport.getId());

        return rapportMapper.toResponse(savedRapport);
    }

    @Transactional(readOnly = true)
    public RapportResponse getReportById(UUID id) {
        log.debug("Récupération du rapport: id={}", id);
        Rapport rapport = rapportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rapport non trouvé avec l'id: " + id));
        return rapportMapper.toResponse(rapport);
    }

    @Transactional(readOnly = true)
    public List<RapportResponse> getAllReports() {
        log.debug("Récupération de tous les rapports");
        return rapportRepository.findAll().stream()
                .map(rapportMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RapportResponse> getReportsByEcoleId(UUID ecoleId) {
        log.debug("Récupération des rapports pour l'école: id={}", ecoleId);
        return rapportRepository.findByEcoleId(ecoleId).stream()
                .map(rapportMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RapportResponse> getReportsByUtilisateur(String utilisateur) {
        log.debug("Récupération des rapports pour l'utilisateur: {}", utilisateur);
        return rapportRepository.findByUtilisateurCreateur(utilisateur).stream()
                .map(rapportMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteReport(UUID id) {
        log.info("Suppression du rapport: id={}", id);
        if (!rapportRepository.existsById(id)) {
            throw new ResourceNotFoundException("Rapport non trouvé avec l'id: " + id);
        }
        rapportRepository.deleteById(id);
        log.info("Rapport supprimé avec succès: id={}", id);
    }

    private String generateFilePath(Rapport rapport) {
        // Génère un chemin de fichier basé sur le type et l'ID
        String extension = switch (rapport.getFormat()) {
            case PDF -> ".pdf";
            case EXCEL -> ".xlsx";
            case CSV -> ".csv";
        };

        return String.format("/reports/%s/%s_%s%s",
                rapport.getTypeRapport().name().toLowerCase(),
                rapport.getTypeRapport().name().toLowerCase(),
                LocalDateTime.now().toString().replace(":", "-"),
                extension);
    }
}
