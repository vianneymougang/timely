package com.timely.reportservice.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.reportservice.client.BookingServiceClient;
import com.timely.reportservice.client.UserServiceClient;
import com.timely.reportservice.dto.client.ChargeHoraireDTO;
import com.timely.reportservice.dto.client.CoursDTO;
import com.timely.reportservice.dto.client.ReservationDTO;
import com.timely.reportservice.dto.client.SalleDTO;
import com.timely.reportservice.dto.client.TeacherSummaryDTO;
import com.timely.reportservice.dto.request.GenerateReportRequest;
import com.timely.reportservice.dto.response.RapportResponse;
import com.timely.reportservice.entity.Rapport;
import com.timely.reportservice.entity.enums.TypeRapport;
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
    private final FileGenerationService fileGenerationService;
    private final UserServiceClient userServiceClient;
    private final BookingServiceClient bookingServiceClient;

    @Transactional
    public RapportResponse generateReport(GenerateReportRequest request, String utilisateurCreateur) {
        log.info("Génération du rapport: type={}, titre={}", request.getTypeRapport(), request.getTitre());

        Rapport rapport = rapportMapper.toEntity(request);
        rapport.setUtilisateurCreateur(utilisateurCreateur);
        rapport.setDateGeneration(LocalDateTime.now());

        Map<String, Object> reportData = buildReportData(request.getTypeRapport(), request);
        if (rapport.getParametresRapport() != null) {
            reportData.putAll(rapport.getParametresRapport());
        }
        rapport.setParametresRapport(reportData);

        Rapport savedRapport = rapportRepository.save(rapport);

        String filePath = fileGenerationService.generateFile(savedRapport.getId());
        savedRapport.setCheminFichier(filePath);
        Rapport finalRapport = rapportRepository.save(savedRapport);

        log.info("Rapport généré avec succès: id={}", finalRapport.getId());
        return rapportMapper.toResponse(finalRapport);
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

    private Map<String, Object> buildReportData(TypeRapport type, GenerateReportRequest request) {
        return switch (type) {
            case CHARGE_ENSEIGNANTS -> buildChargeHoraireData(request);
            case UTILISATION_SALLES -> buildUtilisationSallesData(request);
            case REPARTITION_COURS -> buildStatistiquesCoursData(request);
            case CONFLITS, EVENEMENTS, AUDIT -> buildAuditData(request);
        };
    }

    private Map<String, Object> buildChargeHoraireData(GenerateReportRequest request) {
        try {
            List<TeacherSummaryDTO> teachers = userServiceClient.getEnseignants();
            List<Map<String, Object>> teacherCharges = teachers.stream()
                    .map(t -> {
                        Map<String, Object> row = new HashMap<>();
                        row.put("name", t.name());
                        row.put("surname", t.surname());
                        row.put("email", t.email());
                        try {
                            ChargeHoraireDTO charge = userServiceClient.getChargeHoraire(t.id());
                            row.put("totalHeures", charge.totalHeures() != null ? charge.totalHeures() : 0);
                            row.put("nombreCours", charge.nombreCours() != null ? charge.nombreCours() : 0);
                        } catch (Exception e) {
                            log.warn("Charge indisponible pour {}: {}", t.id(), e.getMessage());
                            row.put("totalHeures", 0);
                            row.put("nombreCours", 0);
                        }
                        return row;
                    })
                    .collect(Collectors.toList());

            Map<String, Object> data = new HashMap<>();
            data.put("teacherCharges", teacherCharges);
            data.put("dateDebut", request.getDateDebut());
            data.put("dateFin", request.getDateFin());
            return data;
        } catch (Exception e) {
            log.warn("Erreur lors de la collecte des données charge horaire: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    private Map<String, Object> buildUtilisationSallesData(GenerateReportRequest request) {
        try {
            List<SalleDTO> salles = bookingServiceClient.getSalles();
            List<ReservationDTO> reservations = bookingServiceClient.getReservations(
                    request.getDateDebut(), request.getDateFin());

            Map<String, Long> reservationsParSalle = reservations.stream()
                    .filter(r -> r.salleId() != null)
                    .collect(Collectors.groupingBy(
                            r -> r.salleId().toString(),
                            Collectors.counting()));

            Map<String, Object> data = new HashMap<>();
            data.put("salles", salles);
            data.put("reservationsParSalle", reservationsParSalle);
            data.put("dateDebut", request.getDateDebut());
            data.put("dateFin", request.getDateFin());
            return data;
        } catch (Exception e) {
            log.warn("Erreur lors de la collecte des données utilisation salles: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    private Map<String, Object> buildStatistiquesCoursData(GenerateReportRequest request) {
        try {
            List<CoursDTO> cours = bookingServiceClient.getCours();
            Map<String, Long> coursParType = cours.stream()
                    .filter(c -> c.typeCours() != null)
                    .collect(Collectors.groupingBy(CoursDTO::typeCours, Collectors.counting()));

            Map<String, Object> data = new HashMap<>();
            data.put("cours", cours);
            data.put("coursParType", coursParType);
            data.put("dateDebut", request.getDateDebut());
            data.put("dateFin", request.getDateFin());
            return data;
        } catch (Exception e) {
            log.warn("Erreur lors de la collecte des données statistiques cours: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    private Map<String, Object> buildAuditData(GenerateReportRequest request) {
        Map<String, Object> data = new HashMap<>();
        data.put("dateDebut", request.getDateDebut());
        data.put("dateFin", request.getDateFin());
        return data;
    }
}
