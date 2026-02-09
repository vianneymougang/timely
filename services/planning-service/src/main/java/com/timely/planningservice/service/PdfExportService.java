package com.timely.planningservice.service;

import java.io.ByteArrayOutputStream;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.timely.planningservice.entity.Creneau;
import com.timely.planningservice.entity.EmploiDuTemps;
import com.timely.planningservice.entity.enums.StatutCreneau;
import com.timely.planningservice.exception.ResourceNotFoundException;
import com.timely.planningservice.repository.EmploiDuTempsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for exporting EmploiDuTemps to PDF format
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class PdfExportService {

    private final EmploiDuTempsRepository emploiDuTempsRepository;
    private final PlanningDataEnricher dataEnricher;
    private final TemplateEngine templateEngine;

    @Transactional(readOnly = true)
    public byte[] exportToPdf(UUID emploiId) {
        log.info("Starting PDF export for emploi: {}", emploiId);

        // 1. Load emploi du temps with creneaux
        EmploiDuTemps emploi = emploiDuTempsRepository.findById(emploiId)
                .orElseThrow(() -> new ResourceNotFoundException("EmploiDuTemps not found with id: " + emploiId));

        // 2. Enrich data via Feign
        Map<UUID, PlanningDataEnricher.EnrichedCreneau> enrichedData = dataEnricher.enrichEmploiDuTemps(emploi);

        // 3. Organize into grid (time slots x days)
        GridData gridData = organizeIntoGrid(emploi, enrichedData);

        // 4. Render Thymeleaf template
        String html = renderTemplate(emploi, gridData);

        // 5. Convert HTML to PDF
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(html, null);
            builder.toStream(outputStream);
            builder.run();

            log.info("PDF export completed successfully for emploi: {}", emploiId);
            return outputStream.toByteArray();

        } catch (Exception e) {
            log.error("Error exporting to PDF for emploi: {}", emploiId, e);
            throw new RuntimeException("Failed to export to PDF format", e);
        }
    }

    private GridData organizeIntoGrid(EmploiDuTemps emploi, Map<UUID, PlanningDataEnricher.EnrichedCreneau> enrichedData) {
        GridData grid = new GridData();

        // Get all active creneaux
        List<Creneau> activeCreneaux = emploi.getCreneaux().stream()
                .filter(c -> c.getStatutCreneau() == StatutCreneau.ACTIF)
                .collect(Collectors.toList());

        if (activeCreneaux.isEmpty()) {
            log.warn("No active creneaux found for emploi: {}", emploi.getId());
            return grid;
        }

        // Extract unique time slots
        Set<TimeSlotKey> timeSlots = activeCreneaux.stream()
                .map(c -> new TimeSlotKey(c.getHeureDebut(), c.getHeureFin()))
                .collect(Collectors.toCollection(TreeSet::new));

        // Build grid rows
        for (TimeSlotKey timeSlot : timeSlots) {
            TimeSlotRow row = new TimeSlotRow();
            row.time = timeSlot.heureDebut.format(DateTimeFormatter.ofPattern("HH:mm")) +
                    " - " +
                    timeSlot.heureFin.format(DateTimeFormatter.ofPattern("HH:mm"));

            // For each day, find matching creneau
            for (DayOfWeek day : Arrays.asList(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
                    DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY)) {

                Optional<Creneau> matchingCreneau = activeCreneaux.stream()
                        .filter(c -> c.getJourSemaine() == day &&
                                c.getHeureDebut().equals(timeSlot.heureDebut) &&
                                c.getHeureFin().equals(timeSlot.heureFin))
                        .findFirst();

                if (matchingCreneau.isPresent()) {
                    Creneau creneau = matchingCreneau.get();
                    PlanningDataEnricher.EnrichedCreneau enriched = enrichedData.get(creneau.getId());

                    GridCell cell = new GridCell();
                    cell.coursIntitule = enriched != null ? enriched.getCoursIntitule() : "Cours";
                    cell.enseignantNom = enriched != null ? enriched.getEnseignantNom() : null;
                    cell.salleNumero = enriched != null ? enriched.getSalleNumero() : null;
                    cell.typeCours = enriched != null ? enriched.getTypeCours().toLowerCase() : "cours";

                    row.creneauxByDay.put(day, cell);
                } else {
                    row.creneauxByDay.put(day, null);
                }
            }

            grid.rows.add(row);
        }

        return grid;
    }

    private String renderTemplate(EmploiDuTemps emploi, GridData gridData) {
        Context context = new Context();
        context.setVariable("periode", emploi.getPeriode().name());
        context.setVariable("dateDebut", emploi.getDateDebut());
        context.setVariable("dateFin", emploi.getDateFin());
        context.setVariable("ecoleNom", "École - ID: " + emploi.getEcoleId());  // Could be enriched via Feign
        context.setVariable("timeSlots", gridData.rows);
        context.setVariable("days", Arrays.asList("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"));

        return templateEngine.process("planning-pdf", context);
    }

    // Inner classes for grid organization
    public static class GridData {
        List<TimeSlotRow> rows = new ArrayList<>();
    }

    public static class TimeSlotRow {
        String time;
        Map<DayOfWeek, GridCell> creneauxByDay = new HashMap<>();

        public GridCell getCreneauForDay(String dayName) {
            DayOfWeek day = DayOfWeek.valueOf(dayName);
            return creneauxByDay.get(day);
        }
    }

    public static class GridCell {
        String coursIntitule;
        String enseignantNom;
        String salleNumero;
        String typeCours;

        public String getCoursIntitule() {
            return coursIntitule;
        }

        public String getEnseignantNom() {
            return enseignantNom;
        }

        public String getSalleNumero() {
            return salleNumero;
        }

        public String getTypeCours() {
            return typeCours;
        }
    }

    private static class TimeSlotKey implements Comparable<TimeSlotKey> {
        LocalTime heureDebut;
        LocalTime heureFin;

        TimeSlotKey(LocalTime heureDebut, LocalTime heureFin) {
            this.heureDebut = heureDebut;
            this.heureFin = heureFin;
        }

        @Override
        public int compareTo(TimeSlotKey other) {
            return this.heureDebut.compareTo(other.heureDebut);
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof TimeSlotKey)) return false;
            TimeSlotKey that = (TimeSlotKey) o;
            return heureDebut.equals(that.heureDebut) && heureFin.equals(that.heureFin);
        }

        @Override
        public int hashCode() {
            return Objects.hash(heureDebut, heureFin);
        }
    }
}
