package com.timely.reportservice.service;

import com.timely.reportservice.client.BookingServiceClient;
import com.timely.reportservice.client.PlanningServiceClient;
import com.timely.reportservice.client.UserServiceClient;
import com.timely.reportservice.dto.client.ChargeHoraireDTO;
import com.timely.reportservice.dto.client.ConflitDTO;
import com.timely.reportservice.dto.client.CoursDTO;
import com.timely.reportservice.dto.client.ReservationDTO;
import com.timely.reportservice.dto.client.SalleDTO;
import com.timely.reportservice.dto.client.TeacherSummaryDTO;
import com.timely.reportservice.dto.response.DashboardResponse;
import com.timely.reportservice.dto.response.KPIResponse;
import com.timely.reportservice.dto.response.StatistiquesCoursResponse;
import com.timely.reportservice.dto.response.StatistiquesEnseignantsResponse;
import com.timely.reportservice.dto.response.StatistiquesSallesResponse;
import com.timely.reportservice.entity.KPIHistorique;
import com.timely.reportservice.repository.KPIHistoriqueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class KPIService {

    private final KPIHistoriqueRepository kpiHistoriqueRepository;
    private final BookingServiceClient bookingServiceClient;
    private final UserServiceClient userServiceClient;
    private final PlanningServiceClient planningServiceClient;

    @Transactional
    public void calculateKPIs(LocalDate dateDebut, LocalDate dateFin) {
        log.info("Calcul des KPIs pour la période du {} au {}", dateDebut, dateFin);

        try {
            BigDecimal tauxOccupation = calculateTauxOccupationSalles(null, dateDebut, dateFin);
            saveKPI("taux_occupation_salles", tauxOccupation, "%", dateDebut, "PERIODE");

            List<CoursDTO> cours = bookingServiceClient.getCours();
            saveKPI("nombre_cours_total", new BigDecimal(cours.size()), "cours", dateDebut, "PERIODE");

            List<TeacherSummaryDTO> enseignants = userServiceClient.getEnseignants();
            saveKPI("nombre_enseignants", new BigDecimal(enseignants.size()), "enseignants", dateDebut, "PERIODE");

            List<ConflitDTO> conflits = planningServiceClient.getConflits();
            saveKPI("nombre_conflits", new BigDecimal(conflits.size()), "conflits", dateDebut, "PERIODE");

            log.info("Calcul des KPIs terminé avec succès");
        } catch (Exception e) {
            log.error("Erreur lors du calcul des KPIs: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur lors du calcul des KPIs", e);
        }
    }

    private void saveKPI(String nomKpi, BigDecimal valeur, String unite, LocalDate date, String periode) {
        KPIHistorique kpi = new KPIHistorique();
        kpi.setNomKpi(nomKpi);
        kpi.setValeur(valeur);
        kpi.setUnite(unite);
        kpi.setDate(date);
        kpi.setPeriode(periode);
        kpiHistoriqueRepository.save(kpi);
    }

    public List<KPIResponse> getKPIsByName(String nomKpi, LocalDate dateDebut, LocalDate dateFin) {
        log.debug("Récupération des KPIs: nomKpi={}, période={} à {}", nomKpi, dateDebut, dateFin);

        List<KPIHistorique> kpis;
        if (dateDebut != null && dateFin != null) {
            kpis = kpiHistoriqueRepository.findByNomKpiAndDateBetween(nomKpi, dateDebut, dateFin);
        } else {
            kpis = kpiHistoriqueRepository.findByNomKpi(nomKpi);
        }

        return kpis.stream()
                .map(this::toKPIResponse)
                .collect(Collectors.toList());
    }

    public DashboardResponse getDashboard(UUID ecoleId) {
        log.info("Génération du dashboard pour l'école: {}", ecoleId);

        try {
            BigDecimal tauxOccupation = calculateTauxOccupationSalles(ecoleId, null, null);

            List<CoursDTO> cours = bookingServiceClient.getCours();
            int nombreCours = cours.size();

            List<TeacherSummaryDTO> enseignants = userServiceClient.getEnseignants();
            int nombreEnseignants = enseignants.size();

            List<ConflitDTO> conflits = planningServiceClient.getConflits();
            int nombreConflits = conflits.size();

            LocalDate dateFin = LocalDate.now();
            LocalDate dateDebut = dateFin.minusDays(30);
            List<KPIHistorique> kpisRecents = kpiHistoriqueRepository.findByDateBetween(dateDebut, dateFin);

            List<KPIResponse> kpisResponse = kpisRecents.stream()
                    .map(this::toKPIResponse)
                    .collect(Collectors.toList());

            return DashboardResponse.builder()
                    .tauxOccupationSalles(tauxOccupation)
                    .nombreCoursTotal(nombreCours)
                    .nombreEnseignants(nombreEnseignants)
                    .nombreConflits(nombreConflits)
                    .kpisRecents(kpisResponse)
                    .build();

        } catch (Exception e) {
            log.error("Erreur lors de la génération du dashboard: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur lors de la génération du dashboard", e);
        }
    }

    public StatistiquesSallesResponse getStatistiquesSalles(UUID ecoleId) {
        log.info("Calcul des statistiques des salles pour l'école: {}", ecoleId);

        try {
            List<SalleDTO> salles = bookingServiceClient.getSalles();
            List<ReservationDTO> reservations = bookingServiceClient.getReservations(null, null);

            int nombreSallesTotal = salles.size();
            long nombreSallesOccupees = reservations.stream()
                    .map(ReservationDTO::salleId)
                    .distinct()
                    .count();

            BigDecimal tauxOccupationMoyen = calculateTauxOccupationSalles(ecoleId, null, null);

            Map<String, BigDecimal> occupationParSalle = new HashMap<>();
            Map<String, Integer> reservationsParSalle = new HashMap<>();

            for (SalleDTO salle : salles) {
                String salleIdStr = salle.id().toString();
                long nbReservations = reservations.stream()
                        .filter(r -> salle.id().equals(r.salleId()))
                        .count();

                reservationsParSalle.put(salleIdStr, (int) nbReservations);
                BigDecimal taux = BigDecimal.valueOf(nbReservations)
                        .multiply(BigDecimal.valueOf(100))
                        .divide(BigDecimal.valueOf(Math.max(reservations.size(), 1)), 2, RoundingMode.HALF_UP);
                occupationParSalle.put(salleIdStr, taux);
            }

            return StatistiquesSallesResponse.builder()
                    .ecoleId(ecoleId)
                    .nombreSallesTotal(nombreSallesTotal)
                    .nombreSallesOccupees((int) nombreSallesOccupees)
                    .tauxOccupationMoyen(tauxOccupationMoyen)
                    .occupationParSalle(occupationParSalle)
                    .reservationsParSalle(reservationsParSalle)
                    .build();

        } catch (Exception e) {
            log.error("Erreur lors du calcul des statistiques des salles: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur lors du calcul des statistiques des salles", e);
        }
    }

    public StatistiquesEnseignantsResponse getStatistiquesEnseignants() {
        log.info("Calcul des statistiques des enseignants");

        try {
            List<TeacherSummaryDTO> enseignants = userServiceClient.getEnseignants();
            int nombreEnseignants = enseignants.size();

            Map<String, BigDecimal> chargeParEnseignant = new HashMap<>();

            for (TeacherSummaryDTO enseignant : enseignants) {
                try {
                    ChargeHoraireDTO charge = userServiceClient.getChargeHoraire(enseignant.id());
                    BigDecimal heures = charge.totalHeures() != null
                            ? BigDecimal.valueOf(charge.totalHeures())
                            : BigDecimal.ZERO;
                    chargeParEnseignant.put(enseignant.id().toString(), heures);
                } catch (Exception e) {
                    log.warn("Impossible de récupérer la charge horaire pour {}: {}", enseignant.id(), e.getMessage());
                    chargeParEnseignant.put(enseignant.id().toString(), BigDecimal.ZERO);
                }
            }

            List<BigDecimal> charges = List.copyOf(chargeParEnseignant.values());

            BigDecimal chargeHoraireMoyenne = charges.isEmpty() ? BigDecimal.ZERO :
                    charges.stream()
                            .reduce(BigDecimal.ZERO, BigDecimal::add)
                            .divide(BigDecimal.valueOf(charges.size()), 2, RoundingMode.HALF_UP);

            BigDecimal chargeHoraireMax = charges.stream()
                    .max(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);

            BigDecimal chargeHoraireMin = charges.stream()
                    .min(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);

            return StatistiquesEnseignantsResponse.builder()
                    .nombreEnseignantsTotal(nombreEnseignants)
                    .chargeHoraireMoyenne(chargeHoraireMoyenne)
                    .chargeHoraireMax(chargeHoraireMax)
                    .chargeHoraireMin(chargeHoraireMin)
                    .chargeParEnseignant(chargeParEnseignant)
                    .build();

        } catch (Exception e) {
            log.error("Erreur lors du calcul des statistiques des enseignants: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur lors du calcul des statistiques des enseignants", e);
        }
    }

    public StatistiquesCoursResponse getStatistiquesCours() {
        log.info("Calcul des statistiques des cours");

        try {
            List<CoursDTO> cours = bookingServiceClient.getCours();
            int nombreCoursTotal = cours.size();

            int nombreEtudiantsTotal = bookingServiceClient.getEtudiants().size();

            Map<String, Integer> coursParType = cours.stream()
                    .filter(c -> c.typeCours() != null)
                    .collect(Collectors.toMap(
                            CoursDTO::typeCours,
                            c -> 1,
                            Integer::sum));

            Map<String, Integer> coursParDepartement = cours.stream()
                    .filter(c -> c.ecoleId() != null)
                    .collect(Collectors.toMap(
                            c -> c.ecoleId().toString(),
                            c -> 1,
                            Integer::sum));

            return StatistiquesCoursResponse.builder()
                    .nombreCoursTotal(nombreCoursTotal)
                    .coursParType(coursParType)
                    .coursParDepartement(coursParDepartement)
                    .nombreEtudiantsTotal(nombreEtudiantsTotal)
                    .build();

        } catch (Exception e) {
            log.error("Erreur lors du calcul des statistiques des cours: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur lors du calcul des statistiques des cours", e);
        }
    }

    private BigDecimal calculateTauxOccupationSalles(UUID ecoleId, LocalDate dateDebut, LocalDate dateFin) {
        try {
            List<SalleDTO> salles = bookingServiceClient.getSalles();
            List<ReservationDTO> reservations = bookingServiceClient.getReservations(dateDebut, dateFin);

            if (salles.isEmpty()) {
                return BigDecimal.ZERO;
            }

            long nombreSallesOccupees = reservations.stream()
                    .map(ReservationDTO::salleId)
                    .filter(id -> id != null)
                    .distinct()
                    .count();

            return BigDecimal.valueOf(nombreSallesOccupees)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(salles.size()), 2, RoundingMode.HALF_UP);

        } catch (Exception e) {
            log.warn("Erreur lors du calcul du taux d'occupation: {}", e.getMessage());
            return BigDecimal.ZERO;
        }
    }

    private KPIResponse toKPIResponse(KPIHistorique kpi) {
        return KPIResponse.builder()
                .nomKpi(kpi.getNomKpi())
                .valeur(kpi.getValeur())
                .unite(kpi.getUnite())
                .date(kpi.getDate())
                .periode(kpi.getPeriode())
                .build();
    }
}
