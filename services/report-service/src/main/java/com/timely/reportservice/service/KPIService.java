package com.timely.reportservice.service;

import com.timely.reportservice.client.BookingServiceClient;
import com.timely.reportservice.client.PlanningServiceClient;
import com.timely.reportservice.client.UserServiceClient;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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
            // Calcul du taux d'occupation des salles
            BigDecimal tauxOccupation = calculateTauxOccupationSalles(null, dateDebut, dateFin);
            saveKPI("taux_occupation_salles", tauxOccupation, "%", dateDebut, "PERIODE");

            // Calcul du nombre de cours
            List<Object> cours = bookingServiceClient.getCours();
            saveKPI("nombre_cours_total", new BigDecimal(cours.size()), "cours", dateDebut, "PERIODE");

            // Calcul du nombre d'enseignants
            List<Object> enseignants = userServiceClient.getEnseignants();
            saveKPI("nombre_enseignants", new BigDecimal(enseignants.size()), "enseignants", dateDebut, "PERIODE");

            // Calcul du nombre de conflits
            List<Object> conflits = planningServiceClient.getConflits(null);
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
            // Calcul du taux d'occupation des salles
            BigDecimal tauxOccupation = calculateTauxOccupationSalles(ecoleId, null, null);

            // Nombre de cours
            List<Object> cours = bookingServiceClient.getCours();
            int nombreCours = cours.size();

            // Nombre d'enseignants
            List<Object> enseignants = userServiceClient.getEnseignants();
            int nombreEnseignants = enseignants.size();

            // Nombre de conflits
            List<Object> conflits = planningServiceClient.getConflits(null);
            int nombreConflits = conflits.size();

            // KPIs récents (30 derniers jours)
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
            List<Object> salles = bookingServiceClient.getSalles();
            List<Object> reservations = bookingServiceClient.getReservations(ecoleId, null, null);

            int nombreSallesTotal = salles.size();
            int nombreSallesOccupees = (int) reservations.stream()
                    .map(r -> extractField(r, "salleId"))
                    .distinct()
                    .count();

            BigDecimal tauxOccupationMoyen = calculateTauxOccupationSalles(ecoleId, null, null);

            // Occupation par salle (simulée - à adapter selon la structure réelle)
            Map<String, BigDecimal> occupationParSalle = new HashMap<>();
            Map<String, Integer> reservationsParSalle = new HashMap<>();

            for (Object salle : salles) {
                String salleId = extractField(salle, "id").toString();
                long nbReservations = reservations.stream()
                        .filter(r -> salleId.equals(extractField(r, "salleId").toString()))
                        .count();

                reservationsParSalle.put(salleId, (int) nbReservations);
                // Calcul simplifié du taux d'occupation
                BigDecimal taux = BigDecimal.valueOf(nbReservations)
                        .multiply(BigDecimal.valueOf(100))
                        .divide(BigDecimal.valueOf(Math.max(reservations.size(), 1)), 2, RoundingMode.HALF_UP);
                occupationParSalle.put(salleId, taux);
            }

            return StatistiquesSallesResponse.builder()
                    .ecoleId(ecoleId)
                    .nombreSallesTotal(nombreSallesTotal)
                    .nombreSallesOccupees(nombreSallesOccupees)
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
            List<Object> enseignants = userServiceClient.getEnseignants();
            int nombreEnseignants = enseignants.size();

            List<BigDecimal> chargesHoraires = new ArrayList<>();
            Map<String, BigDecimal> chargeParEnseignant = new HashMap<>();

            for (Object enseignant : enseignants) {
                try {
                    UUID enseignantId = UUID.fromString(extractField(enseignant, "id").toString());
                    Object chargeData = userServiceClient.getChargeHoraire(enseignantId);

                    BigDecimal charge = extractBigDecimalField(chargeData, "chargeHoraire", BigDecimal.ZERO);
                    chargesHoraires.add(charge);
                    chargeParEnseignant.put(enseignantId.toString(), charge);
                } catch (Exception e) {
                    log.warn("Impossible de récupérer la charge horaire pour un enseignant: {}", e.getMessage());
                }
            }

            BigDecimal chargeHoraireMoyenne = chargesHoraires.isEmpty() ? BigDecimal.ZERO :
                    chargesHoraires.stream()
                            .reduce(BigDecimal.ZERO, BigDecimal::add)
                            .divide(BigDecimal.valueOf(chargesHoraires.size()), 2, RoundingMode.HALF_UP);

            BigDecimal chargeHoraireMax = chargesHoraires.stream()
                    .max(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);

            BigDecimal chargeHoraireMin = chargesHoraires.stream()
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
            List<Object> cours = bookingServiceClient.getCours();
            List<Object> etudiants = bookingServiceClient.getEtudiants();

            int nombreCoursTotal = cours.size();
            int nombreEtudiantsTotal = etudiants.size();

            // Statistiques par type (à adapter selon la structure réelle)
            Map<String, Integer> coursParType = new HashMap<>();
            Map<String, Integer> coursParDepartement = new HashMap<>();

            for (Object c : cours) {
                String type = extractStringField(c, "type", "INCONNU");
                coursParType.merge(type, 1, Integer::sum);

                String departement = extractStringField(c, "departement", "INCONNU");
                coursParDepartement.merge(departement, 1, Integer::sum);
            }

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
            List<Object> salles = bookingServiceClient.getSalles();
            List<Object> reservations = bookingServiceClient.getReservations(ecoleId, dateDebut, dateFin);

            if (salles.isEmpty()) {
                return BigDecimal.ZERO;
            }

            // Calcul simplifié du taux d'occupation
            int nombreSallesOccupees = (int) reservations.stream()
                    .map(r -> extractField(r, "salleId"))
                    .filter(Objects::nonNull)
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

    private Object extractField(Object obj, String fieldName) {
        try {
            if (obj instanceof Map<?, ?> map) {
                return map.get(fieldName);
            }
            return null;
        } catch (Exception e) {
            log.warn("Impossible d'extraire le champ {}: {}", fieldName, e.getMessage());
            return null;
        }
    }

    private String extractStringField(Object obj, String fieldName, String defaultValue) {
        Object value = extractField(obj, fieldName);
        return value != null ? value.toString() : defaultValue;
    }

    private BigDecimal extractBigDecimalField(Object obj, String fieldName, BigDecimal defaultValue) {
        Object value = extractField(obj, fieldName);
        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }
        return defaultValue;
    }
}
