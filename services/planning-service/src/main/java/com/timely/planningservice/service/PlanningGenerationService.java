package com.timely.planningservice.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
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
import com.timely.planningservice.entity.enums.PeriodeEmploi;
import com.timely.planningservice.entity.enums.TypeRecurrence;
import com.timely.planningservice.repository.EmploiDuTempsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
        request.validate();
        long startTime = System.currentTimeMillis();
        log.info("Starting planning generation for school {} week starting {}", request.getEcoleId(), request.getWeekStart());

        LocalDate weekEnd = request.getWeekStart().plusDays(5);

        List<EmploiDuTemps> existing =
                emploiDuTempsRepository.findByEcoleIdAndDateRange(request.getEcoleId(), request.getWeekStart(), weekEnd);
        if (!existing.isEmpty()) {
            emploiDuTempsRepository.deleteAll(existing);
            log.info("Deleted {} existing schedule(s) for school {} week {}", existing.size(), request.getEcoleId(), request.getWeekStart());
        }

        EmploiDuTempsRequestDTO emploiRequest = new EmploiDuTempsRequestDTO();
        emploiRequest.setEcoleId(request.getEcoleId());
        emploiRequest.setDateDebut(request.getWeekStart());
        emploiRequest.setDateFin(weekEnd);
        emploiRequest.setPeriode(PeriodeEmploi.SEMAINE);
        emploiRequest.setNotes("Généré automatiquement");

        var emploiResponse = emploiDuTempsService.createEmploiDuTemps(emploiRequest);
        UUID emploiId = emploiResponse.getId();

        List<BookingServiceClient.CoursDTO> allCours = bookingServiceClient.getCoursByEcole(request.getEcoleId());
        log.info("Found {} courses to schedule", allCours.size());

        List<CoursInfo> coursInfos = preprocessCourses(allCours, request.getWeekStart());

        List<TimeSlot> availableSlots = generateTimeSlotGrid(request.getWeekStart());
        log.info("Generated {} available time slots", availableSlots.size());

        coursInfos.sort(Comparator
                .comparingDouble(CoursInfo::getConstraintScore)
                .thenComparing(c -> getTypePriority(c.cours.typeCours()))
                .thenComparingInt(c -> -c.cours.volumeHoraire()));

        List<CoursNonPlanifie> coursNonPlanifies = new ArrayList<>();
        int coursPlanifies = 0;

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
                TimeSlot bestSlot = findBestSlot(availableSlots, coursInfo);

                if (bestSlot == null) break;

                BookingServiceClient.SalleDTO salle = null;
                try {
                    var autoAssignRequest = new BookingServiceClient.AutoAssignSalleRequest(
                            request.getEcoleId(),
                            coursInfo.cours.typeCours(),
                            coursInfo.cours.effectifGroupe() != null ? coursInfo.cours.effectifGroupe() : 30,
                            bestSlot.date,
                            bestSlot.heureDebut,
                            bestSlot.heureFin,
                            null
                    );
                    salle = bookingServiceClient.autoAssignSalle(autoAssignRequest);
                } catch (Exception e) {
                    log.warn("Could not auto-assign room for course {}: {}", coursInfo.cours.intitule(), e.getMessage());
                    break;
                }

                if (salle == null) break;

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

                    bestSlot.markUsedBy(coursInfo.cours.classeId(), coursInfo.cours.enseignantId(), salle.id());
                    creneauxPlaces++;

                } catch (Exception e) {
                    log.error("Error creating reservation/creneau: {}", e.getMessage());
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
        long schedulable = coursInfos.stream().filter(c -> c.isSchedulable).count();
        double tauxReussite = schedulable == 0 ? 0.0 : (coursPlanifies * 100.0) / schedulable;

        log.info("Planning generation completed: {}/{} courses scheduled ({}%) in {}ms",
                coursPlanifies, allCours.size(), String.format("%.1f", tauxReussite), duration);

        return new GeneratePlanningResponse(
                emploiId,
                allCours.size(),
                coursPlanifies,
                coursNonPlanifies,
                tauxReussite,
                0,
                duration
        );
    }

    private List<CoursInfo> preprocessCourses(List<BookingServiceClient.CoursDTO> allCours, LocalDate weekStart) {
        return allCours.stream().map(cours -> {
            CoursInfo info = new CoursInfo();
            info.cours = cours;

            if (cours.enseignantId() == null) {
                info.isSchedulable = false;
                info.nonSchedulableReason = "Aucun enseignant assigné";
                return info;
            }

            info.requiredSlots = (int) Math.ceil(cours.volumeHoraire() * 60.0 / config.getSlotDurationMinutes());

            try {
                info.disponibilites = userServiceClient.getEffectiveDisponibilites(cours.enseignantId(), weekStart.toString());
            } catch (Exception e) {
                log.warn("Could not fetch availabilities for teacher {}: {}", cours.enseignantId(), e.getMessage());
                info.disponibilites = new ArrayList<>();
            }

            try {
                List<BookingServiceClient.GroupeDTO> groupes = bookingServiceClient.getGroupesByCours(cours.id());
                info.groupeId = groupes.isEmpty() ? null : groupes.get(0).id();
            } catch (Exception e) {
                log.warn("Could not fetch groups for course {}: {}", cours.id(), e.getMessage());
            }

            int availableSlotCount = info.disponibilites.size() * 5;
            info.constraintScore = availableSlotCount > 0
                    ? (double) availableSlotCount / info.requiredSlots
                    : 0.0;

            info.isSchedulable = true;
            return info;
        }).collect(Collectors.toList());
    }

    private List<TimeSlot> generateTimeSlotGrid(LocalDate weekStart) {
        List<TimeSlot> slots = new ArrayList<>();
        List<LocalTime> slotStarts = config.getSlotStartTimes();

        for (DayOfWeek day : config.getActiveDays()) {
            LocalDate date = weekStart;
            while (date.getDayOfWeek() != day) {
                date = date.plusDays(1);
            }
            for (LocalTime start : slotStarts) {
                TimeSlot slot = new TimeSlot();
                slot.jourSemaine = day;
                slot.heureDebut = start;
                slot.heureFin = start.plusMinutes(config.getSlotDurationMinutes());
                slot.date = date;
                slots.add(slot);
            }
        }

        return slots;
    }

    private TimeSlot findBestSlot(List<TimeSlot> availableSlots, CoursInfo coursInfo) {
        TimeSlot bestSlot = null;
        double bestScore = Double.NEGATIVE_INFINITY;

        for (TimeSlot slot : availableSlots) {
            if (slot.isUsedByClass(coursInfo.cours.classeId())) continue;
            if (slot.isUsedByTeacher(coursInfo.cours.enseignantId())) continue;
            if (!isTeacherAvailable(slot, coursInfo)) continue;

            double score = calculateSlotScore(slot, coursInfo);
            if (score > bestScore) {
                bestSlot = slot;
                bestScore = score;
            }
        }

        return bestSlot;
    }

    private boolean isTeacherAvailable(TimeSlot slot, CoursInfo coursInfo) {
        if (coursInfo.disponibilites.isEmpty()) return true;

        boolean hasValidDispo = coursInfo.disponibilites.stream()
                .anyMatch(d -> d.jourSemaine() != null && d.heureDebut() != null && d.heureFin() != null);

        if (!hasValidDispo) return true;

        return coursInfo.disponibilites.stream()
                .filter(d -> d.jourSemaine() != null && d.heureDebut() != null && d.heureFin() != null)
                .anyMatch(d ->
                        d.jourSemaine().equalsIgnoreCase(slot.jourSemaine.name()) &&
                        LocalTime.parse(d.heureDebut()).isBefore(slot.heureFin) &&
                        LocalTime.parse(d.heureFin()).isAfter(slot.heureDebut)
                );
    }

    private double calculateSlotScore(TimeSlot slot, CoursInfo coursInfo) {
        double score = 100.0;

        if ("CM".equals(coursInfo.cours.typeCours()) && slot.heureDebut.getHour() < 12) {
            score += config.getScoreCmMorning();
        }

        if (slot.heureDebut.getHour() >= 16) {
            score -= config.getPenaltyLateAfternoon();
        }

        if (slot.jourSemaine == DayOfWeek.TUESDAY ||
                slot.jourSemaine == DayOfWeek.WEDNESDAY ||
                slot.jourSemaine == DayOfWeek.THURSDAY) {
            score += config.getScoreMidWeek();
        }

        return score;
    }

    private int getTypePriority(String typeCours) {
        return switch (typeCours) {
            case "CM" -> 1;
            case "TD" -> 2;
            case "TP" -> 3;
            default -> 4;
        };
    }

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
        private final List<UUID> usedByClasses = new ArrayList<>();
        private final List<UUID> usedByTeachers = new ArrayList<>();
        private final List<UUID> usedByRooms = new ArrayList<>();

        void markUsedBy(UUID classeId, UUID enseignantId, UUID salleId) {
            if (classeId != null) usedByClasses.add(classeId);
            if (enseignantId != null) usedByTeachers.add(enseignantId);
            if (salleId != null) usedByRooms.add(salleId);
        }

        boolean isUsedByClass(UUID classeId) {
            return classeId != null && usedByClasses.contains(classeId);
        }

        boolean isUsedByTeacher(UUID enseignantId) {
            return enseignantId != null && usedByTeachers.contains(enseignantId);
        }

        boolean isUsedByRoom(UUID salleId) {
            return salleId != null && usedByRooms.contains(salleId);
        }
    }
}
