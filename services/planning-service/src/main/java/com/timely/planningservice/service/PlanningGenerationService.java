package com.timely.planningservice.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.planningservice.client.BookingServiceClient;
import com.timely.planningservice.client.UserServiceClient;
import com.timely.planningservice.config.PlanningGenerationConfig;
import com.timely.planningservice.dto.request.CreneauRequestDTO;
import com.timely.planningservice.dto.request.EmploiDuTempsRequestDTO;
import com.timely.planningservice.dto.request.GeneratePlanningRequest;
import com.timely.planningservice.dto.response.CoursNonPlanifie;
import com.timely.planningservice.dto.response.GeneratePlanningResponse;
import com.timely.planningservice.entity.EmploiDuTemps;
import com.timely.planningservice.entity.enums.TypeRecurrence;
import com.timely.planningservice.repository.EmploiDuTempsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for automatic planning generation using MCF (Most Constrained First) algorithm
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class PlanningGenerationService {

    private final EmploiDuTempsService emploiDuTempsService;
    private final CreneauService creneauService;
    private final BookingServiceClient bookingServiceClient;
    private final UserServiceClient userServiceClient;
    private final PlanningGenerationConfig config;
    private final EmploiDuTempsRepository emploiDuTempsRepository;

    @Transactional
    @CacheEvict(value = "planning:emploi", allEntries = true)
    public GeneratePlanningResponse generate(GeneratePlanningRequest request) {
        long startTime = System.currentTimeMillis();
        log.info("Starting planning generation for school {} from {} to {}",
                request.getEcoleId(), request.getDateDebut(), request.getDateFin());

        // 1. Create EmploiDuTemps in BROUILLON status
        EmploiDuTempsRequestDTO emploiRequest = new EmploiDuTempsRequestDTO();
        emploiRequest.setEcoleId(request.getEcoleId());
        emploiRequest.setDateDebut(request.getDateDebut());
        emploiRequest.setDateFin(request.getDateFin());
        emploiRequest.setPeriode(request.getPeriode());
        emploiRequest.setNotes("Généré automatiquement par algorithme MCF");

        var emploiResponse = emploiDuTempsService.createEmploiDuTemps(emploiRequest);
        UUID emploiId = emploiResponse.getId();

        // 2. Fetch all courses for the school
        List<BookingServiceClient.CoursDTO> allCours = bookingServiceClient.getCoursByEcole(request.getEcoleId());
        log.info("Found {} courses to schedule", allCours.size());

        // 3. Pre-process courses and calculate constraints
        List<CoursInfo> coursInfos = preprocessCourses(allCours, request);

        // 4. Generate time slot grid
        List<TimeSlot> availableSlots = generateTimeSlotGrid(request);
        log.info("Generated {} available time slots", availableSlots.size());

        // 5. Smart sorting: Most Constrained First
        coursInfos.sort(Comparator
                .comparingDouble(CoursInfo::getConstraintScore)  // Most constrained first
                .thenComparing(c -> getTypePriority(c.cours.typeCours()))  // Then by type
                .thenComparingInt(c -> -c.cours.volumeHoraire()));  // Then by volume desc

        // 6. Place courses using MCF algorithm
        List<CoursNonPlanifie> coursNonPlanifies = new ArrayList<>();
        int coursPlanifies = 0;
        int conflitsDetectes = 0;

        for (CoursInfo coursInfo : coursInfos) {
            if (!coursInfo.isSchedulable) {
                coursNonPlanifies.add(new CoursNonPlanifie(
                        coursInfo.cours.id(),
                        coursInfo.cours.intitule(),
                        coursInfo.nonSchedulableReason
                ));
                continue;
            }

            int creneauxPlaces = 0;
            for (int i = 0; i < coursInfo.requiredSlots; i++) {
                TimeSlot bestSlot = findBestSlot(availableSlots, coursInfo, emploiId);

                if (bestSlot != null) {
                    // Try to auto-assign room
                    BookingServiceClient.SalleDTO salle = null;
                    try {
                        var autoAssignRequest = new BookingServiceClient.AutoAssignSalleRequest(
                                request.getEcoleId(),
                                coursInfo.cours.typeCours(),
                                coursInfo.cours.effectifGroupe() != null ? coursInfo.cours.effectifGroupe() : 30,
                                bestSlot.date,
                                bestSlot.heureDebut,
                                bestSlot.heureFin,
                                null  // No specific equipment required
                        );
                        salle = bookingServiceClient.autoAssignSalle(autoAssignRequest);
                    } catch (Exception e) {
                        log.warn("Could not auto-assign room for course {}: {}", coursInfo.cours.intitule(), e.getMessage());
                        // Break - can't place this course without a room
                        break;
                    }

                    if (salle != null) {
                        // Create reservation
                        try {
                            var reservationRequest = new BookingServiceClient.CreateReservationRequest(
                                    bestSlot.date,
                                    bestSlot.heureDebut,
                                    bestSlot.heureFin,
                                    bestSlot.jourSemaine,
                                    "HEBDOMADAIRE",
                                    coursInfo.cours.id(),
                                    salle.id(),
                                    coursInfo.groupeId,
                                    coursInfo.cours.enseignantId()
                            );
                            bookingServiceClient.createReservation(reservationRequest);

                            // Create creneau in planning
                            CreneauRequestDTO creneauRequest = new CreneauRequestDTO();
                            creneauRequest.setJourSemaine(bestSlot.jourSemaine);
                            creneauRequest.setHeureDebut(bestSlot.heureDebut);
                            creneauRequest.setHeureFin(bestSlot.heureFin);
                            creneauRequest.setDateCreneau(bestSlot.date);
                            creneauRequest.setTypeRecurrence(TypeRecurrence.HEBDOMADAIRE);
                            creneauRequest.setCoursId(coursInfo.cours.id());
                            creneauRequest.setEnseignantId(coursInfo.cours.enseignantId());
                            creneauRequest.setSalleId(salle.id());
                            creneauRequest.setGroupeId(coursInfo.groupeId);

                            creneauService.createCreneau(emploiId, creneauRequest);

                            // Mark slot as used
                            bestSlot.used = true;
                            creneauxPlaces++;

                        } catch (Exception e) {
                            log.error("Error creating reservation/creneau: {}", e.getMessage());
                            break;
                        }
                    } else {
                        break;  // No room available
                    }
                } else {
                    // No slot available for this course
                    break;
                }
            }

            if (creneauxPlaces == coursInfo.requiredSlots) {
                coursPlanifies++;
            } else {
                String raison = creneauxPlaces == 0
                        ? "Aucun créneau disponible"
                        : "Seulement " + creneauxPlaces + "/" + coursInfo.requiredSlots + " créneaux placés";
                coursNonPlanifies.add(new CoursNonPlanifie(
                        coursInfo.cours.id(),
                        coursInfo.cours.intitule(),
                        raison
                ));
            }
        }

        long duration = System.currentTimeMillis() - startTime;
        double tauxReussite = coursInfos.isEmpty() ? 0.0
                : (coursPlanifies * 100.0) / coursInfos.stream().filter(c -> c.isSchedulable).count();

        log.info("Planning generation completed: {}/{} courses scheduled ({}%) in {}ms",
                coursPlanifies, allCours.size(), String.format("%.1f", tauxReussite), duration);

        return new GeneratePlanningResponse(
                emploiId,
                allCours.size(),
                coursPlanifies,
                coursNonPlanifies,
                tauxReussite,
                conflitsDetectes,
                duration
        );
    }

    private List<CoursInfo> preprocessCourses(List<BookingServiceClient.CoursDTO> allCours, GeneratePlanningRequest request) {
        return allCours.stream().map(cours -> {
            CoursInfo info = new CoursInfo();
            info.cours = cours;

            // Q1.1=B: If no teacher, mark as non-schedulable
            if (cours.enseignantId() == null) {
                info.isSchedulable = false;
                info.nonSchedulableReason = "Aucun enseignant assigné";
                return info;
            }

            // Calculate required slots
            int dureeMinutes = request.getDureeCreneauMinutes() != null
                    ? request.getDureeCreneauMinutes()
                    : config.getDureeCreneauDefaut();
            info.requiredSlots = (int) Math.ceil(cours.volumeHoraire() * 60.0 / dureeMinutes);

            // Fetch teacher availabilities
            try {
                info.disponibilites = userServiceClient.getDisponibilites(cours.enseignantId());
            } catch (Exception e) {
                log.warn("Could not fetch availabilities for teacher {}: {}", cours.enseignantId(), e.getMessage());
                info.disponibilites = new ArrayList<>();
            }

            // Fetch groups for the course
            try {
                List<BookingServiceClient.GroupeDTO> groupes = bookingServiceClient.getGroupesByCours(cours.id());
                info.groupeId = groupes.isEmpty() ? null : groupes.get(0).id();
            } catch (Exception e) {
                log.warn("Could not fetch groups for course {}: {}", cours.id(), e.getMessage());
            }

            // Calculate constraint score (lower = more constrained)
            int availableSlotCount = info.disponibilites.size() * 5;  // Rough estimate
            info.constraintScore = availableSlotCount > 0
                    ? (double) availableSlotCount / info.requiredSlots
                    : 0.0;

            info.isSchedulable = true;
            return info;
        }).collect(Collectors.toList());
    }

    private List<TimeSlot> generateTimeSlotGrid(GeneratePlanningRequest request) {
        List<TimeSlot> slots = new ArrayList<>();

        LocalTime heureDebut = request.getHeureDebutJournee() != null
                ? request.getHeureDebutJournee()
                : config.getHeureDebutDefaut();

        LocalTime heureFin = request.getHeureFinJournee() != null
                ? request.getHeureFinJournee()
                : config.getHeureFinDefaut();

        int dureeMinutes = request.getDureeCreneauMinutes() != null
                ? request.getDureeCreneauMinutes()
                : config.getDureeCreneauDefaut();

        int pauseMinutes = request.getPauseEntreCreneauxMinutes() != null
                ? request.getPauseEntreCreneauxMinutes()
                : config.getPauseDefaut();

        // For each day Monday-Saturday
        for (DayOfWeek day : new DayOfWeek[]{
                DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
                DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY}) {

            LocalTime currentTime = heureDebut;
            LocalDate firstOccurrence = getFirstOccurrence(request.getDateDebut(), day);

            while (currentTime.plusMinutes(dureeMinutes).isBefore(heureFin) ||
                    currentTime.plusMinutes(dureeMinutes).equals(heureFin)) {

                TimeSlot slot = new TimeSlot();
                slot.jourSemaine = day;
                slot.heureDebut = currentTime;
                slot.heureFin = currentTime.plusMinutes(dureeMinutes);
                slot.date = firstOccurrence;
                slot.used = false;

                slots.add(slot);

                currentTime = currentTime.plusMinutes(dureeMinutes + pauseMinutes);
            }
        }

        return slots;
    }

    private TimeSlot findBestSlot(List<TimeSlot> availableSlots, CoursInfo coursInfo, UUID emploiId) {
        TimeSlot bestSlot = null;
        double bestScore = Double.NEGATIVE_INFINITY;

        for (TimeSlot slot : availableSlots) {
            if (slot.used) continue;

            // Check teacher availability
            if (!isTeacherAvailable(slot, coursInfo)) {
                continue;
            }

            // Calculate score
            double score = calculateSlotScore(slot, coursInfo);

            if (score > bestScore) {
                bestSlot = slot;
                bestScore = score;
            }
        }

        return bestSlot;
    }

    private boolean isTeacherAvailable(TimeSlot slot, CoursInfo coursInfo) {
        if (coursInfo.disponibilites.isEmpty()) {
            return true;
        }

        boolean hasValidDispo = coursInfo.disponibilites.stream()
                .anyMatch(dispo -> dispo.jourSemaine() != null && dispo.heureDebut() != null && dispo.heureFin() != null);

        if (!hasValidDispo) {
            return true;
        }

        return coursInfo.disponibilites.stream()
                .filter(dispo -> dispo.jourSemaine() != null && dispo.heureDebut() != null && dispo.heureFin() != null)
                .anyMatch(dispo ->
                        dispo.jourSemaine().equalsIgnoreCase(slot.jourSemaine.name()) &&
                                LocalTime.parse(dispo.heureDebut()).isBefore(slot.heureFin) &&
                                LocalTime.parse(dispo.heureFin()).isAfter(slot.heureDebut)
                );
    }

    private double calculateSlotScore(TimeSlot slot, CoursInfo coursInfo) {
        double score = 100.0;

        // Prefer morning for CM (Q2.1 config)
        if ("CM".equals(coursInfo.cours.typeCours()) && slot.heureDebut.getHour() < 12) {
            score += config.getScoreCmMatin();
        }

        // Penalize late afternoon (Q2.1 config)
        if (slot.heureDebut.getHour() >= 16) {
            score -= config.getPenaliteCreneauTardif();
        }

        // Prefer mid-week days (Q2.1 config)
        if (slot.jourSemaine == DayOfWeek.TUESDAY ||
                slot.jourSemaine == DayOfWeek.WEDNESDAY ||
                slot.jourSemaine == DayOfWeek.THURSDAY) {
            score += config.getScoreMilieuSemaine();
        }

        return score;
    }

    private LocalDate getFirstOccurrence(LocalDate startDate, DayOfWeek targetDay) {
        LocalDate date = startDate;
        while (date.getDayOfWeek() != targetDay) {
            date = date.plusDays(1);
        }
        return date;
    }

    private int getTypePriority(String typeCours) {
        return switch (typeCours) {
            case "CM" -> 1;
            case "TD" -> 2;
            case "TP" -> 3;
            default -> 4;
        };
    }

    // Inner classes
    private static class CoursInfo {
        BookingServiceClient.CoursDTO cours;
        int requiredSlots;
        List<UserServiceClient.DisponibiliteDTO> disponibilites = new ArrayList<>();
        UUID groupeId;
        double constraintScore;
        boolean isSchedulable = true;
        String nonSchedulableReason;

        public double getConstraintScore() {
            return constraintScore;
        }
    }

    private static class TimeSlot {
        DayOfWeek jourSemaine;
        LocalTime heureDebut;
        LocalTime heureFin;
        LocalDate date;
        boolean used;
    }
}
