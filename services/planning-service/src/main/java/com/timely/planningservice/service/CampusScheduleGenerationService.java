package com.timely.planningservice.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import com.timely.planningservice.algorithm.FlowNetwork;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.planningservice.client.BookingServiceClient;
import com.timely.planningservice.client.UserServiceClient;
import com.timely.planningservice.config.PlanningGenerationConfig;
import com.timely.planningservice.dto.request.CreneauRequestDTO;
import com.timely.planningservice.dto.request.EmploiDuTempsRequestDTO;
import com.timely.planningservice.dto.request.GeneratePlanningRequest;
import com.timely.planningservice.dto.response.CampusGenerationResponse;
import com.timely.planningservice.dto.response.CoursNonPlanifie;
import com.timely.planningservice.dto.response.SchoolResult;
import com.timely.planningservice.entity.EmploiDuTemps;
import com.timely.planningservice.entity.enums.PeriodeEmploi;
import com.timely.planningservice.entity.enums.TypeRecurrence;
import com.timely.planningservice.repository.EmploiDuTempsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class CampusScheduleGenerationService {

    private final EmploiDuTempsService emploiDuTempsService;
    private final CreneauService creneauService;
    private final BookingServiceClient bookingServiceClient;
    private final UserServiceClient userServiceClient;
    private final PlanningGenerationConfig config;
    private final EmploiDuTempsRepository emploiDuTempsRepository;

    @Transactional
    @CacheEvict(value = "planning:emploi", allEntries = true)
    public CampusGenerationResponse generate(GeneratePlanningRequest request) {
        request.validate();
        long startTime = System.currentTimeMillis();
        LocalDate weekStart = request.getWeekStart();
        LocalDate weekEnd = weekStart.plusDays(5);

        log.info("Starting campus-wide generation for week starting {}", weekStart);

        List<BookingServiceClient.EcoleDTO> ecoles = bookingServiceClient.getAllEcoles();
        if (ecoles.isEmpty()) {
            throw new IllegalStateException("No schools found — cannot generate campus schedule");
        }
        log.info("Found {} schools", ecoles.size());

        Map<UUID, BookingServiceClient.EcoleDTO> ecoleById = ecoles.stream()
                .collect(Collectors.toMap(BookingServiceClient.EcoleDTO::id, e -> e));

        Map<UUID, List<BookingServiceClient.CoursDTO>> coursesBySchool = new LinkedHashMap<>();
        Map<UUID, List<BookingServiceClient.SalleDTO>> roomsBySchool = new HashMap<>();
        Set<UUID> allTeacherIds = new HashSet<>();

        for (BookingServiceClient.EcoleDTO ecole : ecoles) {
            List<BookingServiceClient.CoursDTO> cours = bookingServiceClient.getCoursByEcole(ecole.id());
            coursesBySchool.put(ecole.id(), cours);
            cours.stream().map(BookingServiceClient.CoursDTO::enseignantId)
                    .filter(Objects::nonNull).forEach(allTeacherIds::add);

            List<BookingServiceClient.SalleDTO> salles = bookingServiceClient.getSallesByEcole(ecole.id());
            roomsBySchool.put(ecole.id(), salles);
            log.info("School {}: {} courses, {} rooms", ecole.nom(), cours.size(), salles.size());
        }

        for (UUID ecoleId : coursesBySchool.keySet()) {
            List<EmploiDuTemps> existing = emploiDuTempsRepository.findByEcoleIdAndDateRange(ecoleId, weekStart, weekEnd);
            if (!existing.isEmpty()) {
                emploiDuTempsRepository.deleteAll(existing);
                log.info("Deleted {} existing schedule(s) for school {}", existing.size(), ecoleId);
            }
        }

        Map<UUID, List<UserServiceClient.DisponibiliteDTO>> availabilities = new HashMap<>();
        Map<UUID, String> teacherNames = new HashMap<>();
        for (UUID teacherId : allTeacherIds) {
            try {
                availabilities.put(teacherId,
                        userServiceClient.getEffectiveDisponibilites(teacherId, weekStart.toString()));
            } catch (Exception e) {
                log.warn("Could not fetch availability for teacher {}: {}", teacherId, e.getMessage());
                availabilities.put(teacherId, Collections.emptyList());
            }
            try {
                UserServiceClient.EnseignantDTO teacher = userServiceClient.getEnseignant(teacherId);
                teacherNames.put(teacherId, teacher.prenom() + " " + teacher.nom());
            } catch (Exception e) {
                log.warn("Could not fetch teacher name for {}: {}", teacherId, e.getMessage());
            }
        }

        Map<UUID, UUID> groupeByCoursId = new HashMap<>();
        Map<UUID, String> groupeNomByCoursId = new HashMap<>();
        for (List<BookingServiceClient.CoursDTO> cours : coursesBySchool.values()) {
            for (BookingServiceClient.CoursDTO c : cours) {
                try {
                    List<BookingServiceClient.GroupeDTO> groupes = bookingServiceClient.getGroupesByCours(c.id());
                    if (!groupes.isEmpty()) {
                        BookingServiceClient.GroupeDTO g = groupes.get(0);
                        groupeByCoursId.put(c.id(), g.id());
                        String nom = (g.typeGroupe() != null ? g.typeGroupe() : "Groupe") + " " + g.numeroGroupe();
                        groupeNomByCoursId.put(c.id(), nom);
                    }
                } catch (Exception e) {
                    log.warn("Could not fetch groups for course {}: {}", c.id(), e.getMessage());
                }
            }
        }

        List<CourseContext> allContexts = new ArrayList<>();
        for (Map.Entry<UUID, List<BookingServiceClient.CoursDTO>> entry : coursesBySchool.entrySet()) {
            UUID ecoleId = entry.getKey();
            for (BookingServiceClient.CoursDTO cours : entry.getValue()) {
                allContexts.add(buildContext(cours, ecoleId, availabilities, groupeByCoursId));
            }
        }

        Set<String> consumedTeacherHours = new HashSet<>();
        Map<UUID, PlacementOption> placementByCoursId = new LinkedHashMap<>();
        Map<UUID, List<CoursNonPlanifie>> unscheduledBySchool = new HashMap<>();
        coursesBySchool.keySet().forEach(id -> unscheduledBySchool.put(id, new ArrayList<>()));

        for (String typeFilter : List.of("CM", "TD", "TP")) {
            runFlowPass(typeFilter, allContexts, consumedTeacherHours, placementByCoursId, unscheduledBySchool);
        }

        Set<String> usedRoomSlots = new HashSet<>();
        Map<UUID, BookingServiceClient.SalleDTO> roomByCoursId = new HashMap<>();
        Map<UUID, CourseContext> contextByCoursId = allContexts.stream()
                .collect(Collectors.toMap(ctx -> ctx.cours().id(), ctx -> ctx));

        for (UUID ecoleId : coursesBySchool.keySet()) {
            List<BookingServiceClient.SalleDTO> schoolRooms = roomsBySchool.getOrDefault(ecoleId, Collections.emptyList());

            placementByCoursId.entrySet().stream()
                    .filter(e -> {
                        CourseContext ctx = contextByCoursId.get(e.getKey());
                        return ctx != null && ecoleId.equals(ctx.ecoleId());
                    })
                    .sorted(Comparator.comparingInt(e -> {
                        Integer eff = contextByCoursId.get(e.getKey()).cours().effectifGroupe();
                        return eff != null ? -eff : -30;
                    }))
                    .forEach(e -> {
                        UUID coursId = e.getKey();
                        PlacementOption placement = e.getValue();
                        CourseContext ctx = contextByCoursId.get(coursId);
                        BookingServiceClient.SalleDTO room = findRoom(ctx, placement, schoolRooms, usedRoomSlots);
                        if (room != null) {
                            roomByCoursId.put(coursId, room);
                            for (int hour : placement.hours()) {
                                usedRoomSlots.add(roomSlotKey(room.id(), placement.day(), hour));
                            }
                        } else {
                            log.warn("No compatible room for course {} at {}/{}", ctx.cours().intitule(), placement.day(), placement.hours());
                        }
                    });
        }

        List<SchoolResult> schoolResults = new ArrayList<>();
        int totalCourses = 0;
        int totalScheduled = 0;
        int totalUnscheduled = 0;

        for (UUID ecoleId : coursesBySchool.keySet()) {
            BookingServiceClient.EcoleDTO ecole = ecoleById.get(ecoleId);
            List<BookingServiceClient.CoursDTO> schoolCourses = coursesBySchool.get(ecoleId);
            totalCourses += schoolCourses.size();

            EmploiDuTempsRequestDTO emploiRequest = new EmploiDuTempsRequestDTO();
            emploiRequest.setEcoleId(ecoleId);
            emploiRequest.setDateDebut(weekStart);
            emploiRequest.setDateFin(weekEnd);
            emploiRequest.setPeriode(PeriodeEmploi.SEMAINE);
            emploiRequest.setNotes("Generated campus-wide");

            var emploiResponse = emploiDuTempsService.createEmploiDuTemps(emploiRequest);
            UUID emploiId = emploiResponse.getId();

            int schoolScheduled = 0;
            for (Map.Entry<UUID, PlacementOption> entry : placementByCoursId.entrySet()) {
                UUID coursId = entry.getKey();
                CourseContext ctx = contextByCoursId.get(coursId);
                if (!ecoleId.equals(ctx.ecoleId())) continue;

                PlacementOption placement = entry.getValue();
                BookingServiceClient.SalleDTO room = roomByCoursId.get(coursId);
                createCreneauxAndReservations(emploiId, ctx, placement, room, weekStart, teacherNames, groupeNomByCoursId);
                schoolScheduled++;
            }

            List<CoursNonPlanifie> schoolUnscheduled = unscheduledBySchool.getOrDefault(ecoleId, Collections.emptyList());
            totalScheduled += schoolScheduled;
            totalUnscheduled += schoolUnscheduled.size();

            double rate = schoolCourses.isEmpty() ? 0.0 : schoolScheduled * 100.0 / schoolCourses.size();
            schoolResults.add(new SchoolResult(ecoleId, ecole.nom(), emploiId, schoolScheduled, schoolUnscheduled.size(), schoolUnscheduled, rate));

            log.info("School {}: {}/{} courses scheduled ({}%)", ecole.nom(), schoolScheduled, schoolCourses.size(), String.format("%.1f", rate));
        }

        long duration = System.currentTimeMillis() - startTime;
        double overallRate = totalCourses == 0 ? 0.0 : totalScheduled * 100.0 / totalCourses;

        log.info("Campus generation done: {}/{} scheduled in {}ms", totalScheduled, totalCourses, duration);
        return new CampusGenerationResponse(schoolResults, totalCourses, totalScheduled, totalUnscheduled, overallRate, duration);
    }

    private CourseContext buildContext(
            BookingServiceClient.CoursDTO cours,
            UUID ecoleId,
            Map<UUID, List<UserServiceClient.DisponibiliteDTO>> availabilities,
            Map<UUID, UUID> groupeByCoursId) {

        if (cours.enseignantId() == null) {
            return new CourseContext(cours, ecoleId, 0, Collections.emptyList(), null, false, "Aucun enseignant assigne", 0);
        }

        Integer vol = cours.volumeHoraire();
        if (vol == null || vol <= 0) {
            return new CourseContext(cours, ecoleId, 0, Collections.emptyList(), null, false, "Volume horaire invalide", 0);
        }

        if (vol > 4) {
            return new CourseContext(cours, ecoleId, vol, Collections.emptyList(), null, false,
                    "Volume horaire " + vol + "h depasse le maximum planifiable par bloc (4h)", 0);
        }

        List<UserServiceClient.DisponibiliteDTO> dispos = availabilities.getOrDefault(cours.enseignantId(), Collections.emptyList());
        UUID groupeId = groupeByCoursId.get(cours.id());

        int staticCount = countStaticValidPlacements(vol, cours.enseignantId(), dispos);
        if (staticCount == 0) {
            return new CourseContext(cours, ecoleId, vol, dispos, groupeId, false,
                    "Aucun bloc consecutif de " + vol + "h compatible avec les disponibilites de l'enseignant", 0);
        }

        return new CourseContext(cours, ecoleId, vol, dispos, groupeId, true, null, staticCount);
    }

    private int countStaticValidPlacements(int requiredHours, UUID teacherId,
            List<UserServiceClient.DisponibiliteDTO> dispos) {
        int count = 0;
        List<LocalTime> slotStarts = config.getSlotStartTimes();
        for (DayOfWeek day : config.getActiveDays()) {
            for (List<Integer> block : consecutiveBlocks(requiredHours, slotStarts)) {
                boolean allAvailable = block.stream()
                        .allMatch(hour -> isTeacherAvailable(day, hour, dispos));
                if (allAvailable) count++;
            }
        }
        return count;
    }

    private void runFlowPass(
            String typeFilter,
            List<CourseContext> allContexts,
            Set<String> consumedTeacherHours,
            Map<UUID, PlacementOption> placementByCoursId,
            Map<UUID, List<CoursNonPlanifie>> unscheduledBySchool) {

        List<CourseContext> pass = allContexts.stream()
                .filter(ctx -> typeFilter.equals(ctx.cours().typeCours()))
                .toList();

        log.info("Pass {}: {} courses", typeFilter, pass.size());
        if (pass.isEmpty()) return;

        FlowNetwork network = new FlowNetwork();
        Set<String> addedTeacherHourSinks = new HashSet<>();
        List<LocalTime> slotStarts = config.getSlotStartTimes();

        for (CourseContext ctx : pass) {
            if (!ctx.schedulable()) continue;

            String courseNode = "C_" + ctx.cours().id();
            network.addEdge("S", courseNode, 1);

            for (DayOfWeek day : config.getActiveDays()) {
                for (List<Integer> block : consecutiveBlocks(ctx.requiredHours(), slotStarts)) {
                    boolean valid = block.stream().allMatch(hour ->
                            isTeacherAvailable(day, hour, ctx.disponibilites()) &&
                            !consumedTeacherHours.contains(teacherHourKey(ctx.cours().enseignantId(), day, hour)));
                    if (!valid) continue;

                    String placementNode = "P_" + ctx.cours().id() + "_" + day.name() + "_" + block.get(0);
                    network.addEdge(courseNode, placementNode, 1);

                    for (int hour : block) {
                        String teacherHourNode = "H_" + ctx.cours().enseignantId() + "_" + day.name() + "_" + hour;
                        network.addEdge(placementNode, teacherHourNode, 1);
                        if (addedTeacherHourSinks.add(teacherHourNode)) {
                            network.addEdge(teacherHourNode, "T", 1);
                        }
                    }
                }
            }
        }

        int placed = network.maxFlow("S", "T");
        log.info("Pass {}: Ford-Fulkerson scheduled {}/{} courses", typeFilter, placed,
                pass.stream().filter(CourseContext::schedulable).count());

        Map<String, String> assignments = network.getAssignments();

        for (CourseContext ctx : pass) {
            if (!ctx.schedulable()) {
                unscheduledBySchool.get(ctx.ecoleId())
                        .add(new CoursNonPlanifie(ctx.cours().id(), ctx.cours().intitule(), ctx.unschedulableReason()));
                continue;
            }

            String placement = assignments.get(ctx.cours().id().toString());
            if (placement == null) {
                unscheduledBySchool.get(ctx.ecoleId()).add(new CoursNonPlanifie(
                        ctx.cours().id(),
                        ctx.cours().intitule(),
                        "Aucun bloc de " + ctx.requiredHours() + "h disponible compatible avec les disponibilites de l'enseignant"
                ));
                continue;
            }

            int sep = placement.lastIndexOf('_');
            DayOfWeek day = DayOfWeek.valueOf(placement.substring(0, sep));
            int startHour = Integer.parseInt(placement.substring(sep + 1));
            List<Integer> block = rebuildBlock(ctx.requiredHours(), startHour, slotStarts);

            for (int hour : block) {
                consumedTeacherHours.add(teacherHourKey(ctx.cours().enseignantId(), day, hour));
            }
            placementByCoursId.put(ctx.cours().id(), new PlacementOption(day, block, startHour));
            log.debug("Placed course {} ({}) at {}/{}", ctx.cours().intitule(), typeFilter, day, startHour);
        }
    }

    private List<Integer> rebuildBlock(int requiredHours, int startHour, List<LocalTime> slotStarts) {
        int startIdx = -1;
        for (int i = 0; i < slotStarts.size(); i++) {
            if (slotStarts.get(i).getHour() == startHour) {
                startIdx = i;
                break;
            }
        }
        List<Integer> block = new ArrayList<>();
        for (int j = 0; j < requiredHours && startIdx + j < slotStarts.size(); j++) {
            block.add(slotStarts.get(startIdx + j).getHour());
        }
        return block;
    }

    private BookingServiceClient.SalleDTO findRoom(
            CourseContext ctx,
            PlacementOption placement,
            List<BookingServiceClient.SalleDTO> schoolRooms,
            Set<String> usedRoomSlots) {

        int required = ctx.cours().effectifGroupe() != null ? ctx.cours().effectifGroupe() : 30;

        return schoolRooms.stream()
                .filter(salle -> salle.capacite() != null && salle.capacite() >= required)
                .filter(salle -> isRoomTypeCompatible(salle, ctx.cours().typeCours()))
                .filter(salle -> placement.hours().stream()
                        .noneMatch(hour -> usedRoomSlots.contains(roomSlotKey(salle.id(), placement.day(), hour))))
                .min(Comparator.comparingInt(BookingServiceClient.SalleDTO::capacite))
                .orElse(null);
    }

    private boolean isRoomTypeCompatible(BookingServiceClient.SalleDTO salle, String typeCours) {
        if (!"TP".equals(typeCours)) return true;
        return "LABORATOIRE".equals(salle.typeSalle()) || "SALLE_INFO".equals(salle.typeSalle());
    }

    private boolean isTeacherAvailable(DayOfWeek day, int hour,
            List<UserServiceClient.DisponibiliteDTO> dispos) {
        if (dispos.isEmpty()) return true;
        boolean hasValidDispo = dispos.stream()
                .anyMatch(d -> d.jourSemaine() != null && d.heureDebut() != null && d.heureFin() != null);
        if (!hasValidDispo) return true;

        LocalTime slotStart = LocalTime.of(hour, 0);
        LocalTime slotEnd = LocalTime.of(hour + 1, 0);

        return dispos.stream()
                .filter(d -> d.jourSemaine() != null && d.heureDebut() != null && d.heureFin() != null)
                .anyMatch(d ->
                        d.jourSemaine().equalsIgnoreCase(day.name()) &&
                        LocalTime.parse(d.heureDebut()).isBefore(slotEnd) &&
                        LocalTime.parse(d.heureFin()).isAfter(slotStart)
                );
    }

    private List<List<Integer>> consecutiveBlocks(int requiredHours, List<LocalTime> slotStarts) {
        List<List<Integer>> blocks = new ArrayList<>();
        int n = slotStarts.size();
        for (int i = 0; i <= n - requiredHours; i++) {
            boolean valid = true;
            for (int j = 0; j < requiredHours - 1; j++) {
                if (!config.isConsecutive(slotStarts.get(i + j), slotStarts.get(i + j + 1))) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                List<Integer> block = new ArrayList<>();
                for (int j = 0; j < requiredHours; j++) {
                    block.add(slotStarts.get(i + j).getHour());
                }
                blocks.add(block);
            }
        }
        return blocks;
    }

    private void createCreneauxAndReservations(
            UUID emploiId,
            CourseContext ctx,
            PlacementOption placement,
            BookingServiceClient.SalleDTO room,
            LocalDate weekStart,
            Map<UUID, String> teacherNames,
            Map<UUID, String> groupeNomByCoursId) {

        DayOfWeek day = placement.day();
        LocalDate date = weekStart.plusDays(day.getValue() - DayOfWeek.MONDAY.getValue());

        for (int hour : placement.hours()) {
            LocalTime start = LocalTime.of(hour, 0);
            LocalTime end = LocalTime.of(hour + 1, 0);

            try {
                bookingServiceClient.createReservation(new BookingServiceClient.CreateReservationRequest(
                        date, start, end, day, "UNIQUE",
                        ctx.cours().id(),
                        room != null ? room.id() : null,
                        ctx.groupeId(),
                        ctx.cours().enseignantId()
                ));
            } catch (Exception e) {
                log.warn("Could not create reservation for course {} at {}h: {}", ctx.cours().intitule(), hour, e.getMessage());
            }

            CreneauRequestDTO creneauReq = new CreneauRequestDTO();
            creneauReq.setJourSemaine(day);
            creneauReq.setHeureDebut(start);
            creneauReq.setHeureFin(end);
            creneauReq.setDateCreneau(date);
            creneauReq.setTypeRecurrence(TypeRecurrence.UNIQUE);
            creneauReq.setCoursId(ctx.cours().id());
            creneauReq.setEnseignantId(ctx.cours().enseignantId());
            creneauReq.setSalleId(room != null ? room.id() : null);
            creneauReq.setGroupeId(ctx.groupeId());
            creneauReq.setCoursIntitule(ctx.cours().intitule());
            creneauReq.setCoursType(ctx.cours().typeCours());
            creneauReq.setEnseignantNom(teacherNames.get(ctx.cours().enseignantId()));
            creneauReq.setSalleNom(room != null ? room.nom() : null);
            creneauReq.setGroupeNom(groupeNomByCoursId.get(ctx.cours().id()));

            try {
                creneauService.createCreneau(emploiId, creneauReq);
            } catch (Exception e) {
                log.error("Could not create creneau for course {} at {}h: {}", ctx.cours().intitule(), hour, e.getMessage());
            }
        }
    }

    private String teacherHourKey(UUID teacherId, DayOfWeek day, int hour) {
        return teacherId + "_" + day.name() + "_" + hour;
    }

    private String roomSlotKey(UUID roomId, DayOfWeek day, int hour) {
        return roomId + "_" + day.name() + "_" + hour;
    }

    private record CourseContext(
            BookingServiceClient.CoursDTO cours,
            UUID ecoleId,
            int requiredHours,
            List<UserServiceClient.DisponibiliteDTO> disponibilites,
            UUID groupeId,
            boolean schedulable,
            String unschedulableReason,
            int staticValidPlacementCount) {}

    private record PlacementOption(
            DayOfWeek day,
            List<Integer> hours,
            int startHour) {}
}
