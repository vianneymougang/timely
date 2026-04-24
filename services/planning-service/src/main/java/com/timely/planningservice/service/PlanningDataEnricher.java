package com.timely.planningservice.service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.timely.planningservice.client.BookingServiceClient;
import com.timely.planningservice.client.UserServiceClient;
import com.timely.planningservice.entity.Creneau;
import com.timely.planningservice.entity.EmploiDuTemps;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlanningDataEnricher {

    private final BookingServiceClient bookingServiceClient;
    private final UserServiceClient userServiceClient;

    public EnrichedPlanningData enrichEmploiDuTemps(EmploiDuTemps emploi) {
        log.info("Enriching EmploiDuTemps with ID: {}", emploi.getId());

        List<EnrichedCreneau> enrichedCreneaux = emploi.getCreneaux().stream()
                .map(this::enrichCreneau)
                .collect(Collectors.toList());

        return new EnrichedPlanningData(emploi, enrichedCreneaux);
    }

    @CircuitBreaker(name = "planning-service", fallbackMethod = "enrichCreneauFallback")
    private EnrichedCreneau enrichCreneau(Creneau creneau) {
        String nomCours = null;
        String typeCours = null;
        String nomEnseignant = null;
        String numeroSalle = null;
        String nomGroupe = null;

        try {
            if (creneau.getCoursId() != null) {
                BookingServiceClient.CoursDTO cours = bookingServiceClient.getCours(creneau.getCoursId());
                if (cours != null) {
                    nomCours = cours.intitule();
                    typeCours = cours.typeCours();
                }
            }
        } catch (Exception e) {
            log.warn("Failed to fetch cours for creneau {}: {}", creneau.getId(), e.getMessage());
        }

        try {
            if (creneau.getEnseignantId() != null) {
                UserServiceClient.EnseignantDTO enseignant = userServiceClient.getEnseignant(creneau.getEnseignantId());
                if (enseignant != null) {
                    nomEnseignant = enseignant.nom() + " " + enseignant.prenom();
                }
            }
        } catch (Exception e) {
            log.warn("Failed to fetch enseignant for creneau {}: {}", creneau.getId(), e.getMessage());
        }

        try {
            if (creneau.getSalleId() != null) {
                BookingServiceClient.SalleDTO salle = bookingServiceClient.getSalle(creneau.getSalleId());
                if (salle != null) {
                    numeroSalle = salle.numero();
                }
            }
        } catch (Exception e) {
            log.warn("Failed to fetch salle for creneau {}: {}", creneau.getId(), e.getMessage());
        }

        try {
            if (creneau.getGroupeId() != null) {
                BookingServiceClient.GroupeDTO groupe = bookingServiceClient.getGroupe(creneau.getGroupeId());
                if (groupe != null) {
                    nomGroupe = groupe.typeGroupe() + " " + groupe.numeroGroupe();
                }
            }
        } catch (Exception e) {
            log.warn("Failed to fetch groupe for creneau {}: {}", creneau.getId(), e.getMessage());
        }

        return new EnrichedCreneau(
                creneau.getId(),
                creneau.getJourSemaine(),
                creneau.getHeureDebut(),
                creneau.getHeureFin(),
                nomCours != null ? nomCours : "Non défini",
                typeCours != null ? typeCours : "CM",
                nomEnseignant != null ? nomEnseignant : "Non assigné",
                numeroSalle != null ? numeroSalle : "TBD",
                nomGroupe != null ? nomGroupe : "Tous"
        );
    }

    private EnrichedCreneau enrichCreneauFallback(Creneau creneau, Exception e) {
        log.error("Circuit breaker fallback for creneau {}: {}", creneau.getId(), e.getMessage());
        return new EnrichedCreneau(
                creneau.getId(),
                creneau.getJourSemaine(),
                creneau.getHeureDebut(),
                creneau.getHeureFin(),
                "Cours non disponible",
                "CM",
                "Enseignant non disponible",
                "Salle TBD",
                "Groupe TBD"
        );
    }

    public record EnrichedPlanningData(
            EmploiDuTemps emploi,
            List<EnrichedCreneau> creneaux
    ) {
        public Map<DayOfWeek, Map<LocalTime, List<EnrichedCreneau>>> organizeAsGrid() {
            Map<DayOfWeek, Map<LocalTime, List<EnrichedCreneau>>> grid = new TreeMap<>();

            for (EnrichedCreneau creneau : creneaux) {
                grid.computeIfAbsent(creneau.jourSemaine(), k -> new TreeMap<>())
                    .computeIfAbsent(creneau.heureDebut(), k -> new ArrayList<>())
                    .add(creneau);
            }

            return grid;
        }
    }

    public record EnrichedCreneau(
            UUID id,
            DayOfWeek jourSemaine,
            LocalTime heureDebut,
            LocalTime heureFin,
            String nomCours,
            String typeCours,
            String nomEnseignant,
            String numeroSalle,
            String nomGroupe
    ) {}
}
