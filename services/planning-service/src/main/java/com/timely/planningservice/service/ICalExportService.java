package com.timely.planningservice.service;

import com.timely.planningservice.client.BookingServiceClient;
import com.timely.planningservice.client.UserServiceClient;
import com.timely.planningservice.entity.Creneau;
import com.timely.planningservice.entity.EmploiDuTemps;
import com.timely.planningservice.entity.enums.StatutCreneau;
import com.timely.planningservice.exception.ResourceNotFoundException;
import com.timely.planningservice.repository.EmploiDuTempsRepository;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.fortuna.ical4j.data.CalendarOutputter;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.property.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for exporting EmploiDuTemps to iCalendar (.ics) format
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ICalExportService {

    private final EmploiDuTempsRepository emploiDuTempsRepository;
    private final BookingServiceClient bookingServiceClient;
    private final UserServiceClient userServiceClient;

    @Transactional(readOnly = true)
    public byte[] exportToICal(UUID emploiId) {
        log.info("Starting iCal export for emploi: {}", emploiId);

        // Load emploi du temps with creneaux
        EmploiDuTemps emploi = emploiDuTempsRepository
            .findById(emploiId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "EmploiDuTemps not found with id: " + emploiId
                )
            );

        try {
            // Create calendar
            Calendar calendar = new Calendar();
            calendar.add(new ProdId("-//Timely//IUSJC Schedule//EN"));
            calendar.add(new Version("2.0", "2.0"));
            calendar.add(new CalScale("GREGORIAN"));
            calendar.add(
                new XProperty(
                    "X-WR-CALNAME",
                    "Emploi du temps - " + emploi.getId()
                )
            );
            calendar.add(new XProperty("X-WR-TIMEZONE", "Africa/Douala"));

            // Add events for each active creneau
            for (Creneau creneau : emploi.getCreneaux()) {
                if (creneau.getStatutCreneau() == StatutCreneau.ACTIF) {
                    addEventFromCreneau(calendar, creneau, emploi);
                }
            }

            // Write calendar to byte array
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            CalendarOutputter outputter = new CalendarOutputter();
            outputter.output(calendar, out);

            log.info(
                "iCal export completed successfully for emploi: {}",
                emploiId
            );
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error exporting to iCal for emploi: {}", emploiId, e);
            throw new RuntimeException(
                "Failed to export to iCalendar format",
                e
            );
        }
    }

    private void addEventFromCreneau(
        Calendar calendar,
        Creneau creneau,
        EmploiDuTemps emploi
    ) {
        try {
            // Determine event date
            LocalDate eventDate =
                creneau.getDateCreneau() != null
                    ? creneau.getDateCreneau()
                    : getFirstOccurrenceDate(
                          creneau.getJourSemaine(),
                          emploi.getDateDebut()
                      );

            // Create start and end datetime using java.time API
            var dtStart = eventDate
                .atTime(creneau.getHeureDebut())
                .atZone(ZoneId.of("Africa/Douala"))
                .toInstant();

            var dtEnd = eventDate
                .atTime(creneau.getHeureFin())
                .atZone(ZoneId.of("Africa/Douala"))
                .toInstant();

            // Get course name
            String coursName = "Cours";
            if (creneau.getCoursId() != null) {
                try {
                    coursName = bookingServiceClient
                        .getCours(creneau.getCoursId())
                        .intitule();
                } catch (Exception e) {
                    log.warn(
                        "Could not fetch course name for id: {}",
                        creneau.getCoursId()
                    );
                }
            }

            // Create event using java.time.Instant (supported in ical4j 4.x)
            VEvent event = new VEvent(dtStart, dtEnd, coursName);

            // Add UID (unique identifier)
            event.add(new Uid(creneau.getId().toString() + "@timely"));

            // Add location (room number)
            if (creneau.getSalleId() != null) {
                try {
                    var salle = bookingServiceClient.getSalle(
                        creneau.getSalleId()
                    );
                    event.add(
                        new Location(
                            salle.numero() +
                                " - " +
                                (salle.nom() != null ? salle.nom() : "Salle")
                        )
                    );
                } catch (Exception e) {
                    log.warn(
                        "Could not fetch room info for id: {}",
                        creneau.getSalleId()
                    );
                }
            }

            // Add description
            StringBuilder description = new StringBuilder();
            if (creneau.getEnseignantId() != null) {
                try {
                    var enseignant = userServiceClient.getEnseignant(
                        creneau.getEnseignantId()
                    );
                    description
                        .append("Enseignant: ")
                        .append(enseignant.prenom())
                        .append(" ")
                        .append(enseignant.nom())
                        .append("\n");
                } catch (Exception e) {
                    log.warn(
                        "Could not fetch teacher info for id: {}",
                        creneau.getEnseignantId()
                    );
                }
            }
            if (creneau.getGroupeId() != null) {
                description
                    .append("Groupe ID: ")
                    .append(creneau.getGroupeId())
                    .append("\n");
            }
            if (!description.isEmpty()) {
                event.add(new Description(description.toString()));
            }

            // Add status
            event.add(new Status("CONFIRMED"));

            // Add recurrence rule for weekly events
            switch (creneau.getTypeRecurrence()) {
                case HEBDOMADAIRE:
                    try {
                        // Simple RULE for weekly recurrence until dateFin
                        var untilDate = emploi
                            .getDateFin()
                            .atStartOfDay(ZoneId.of("Africa/Douala"))
                            .toInstant();
                        String rrule =
                            "FREQ=WEEKLY;UNTIL=" +
                            untilDate
                                .toString()
                                .replace(":", "")
                                .replace("-", "");
                        event.add(new RRule(rrule));
                    } catch (Exception e) {
                        log.warn(
                            "Could not add recurrence rule for creneau: {}",
                            creneau.getId(),
                            e
                        );
                    }
                    break;
                case UNIQUE:
                default:
                    // No recurrence
                    break;
            }

            calendar.add(event);
        } catch (Exception e) {
            log.warn("Could not add event for creneau: {}", creneau.getId(), e);
        }
    }

    /**
     * Find the first occurrence of a day of week starting from a given date
     */
    private LocalDate getFirstOccurrenceDate(
        java.time.DayOfWeek dayOfWeek,
        LocalDate startDate
    ) {
        LocalDate date = startDate;
        while (date.getDayOfWeek() != dayOfWeek) {
            date = date.plusDays(1);
        }
        return date;
    }
}
