package com.timely.reportservice.service;

import com.timely.reportservice.entity.Rapport;
import com.timely.reportservice.entity.enums.FormatExport;
import com.timely.reportservice.exception.ResourceNotFoundException;
import com.timely.reportservice.repository.RapportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileGenerationService {

    private final RapportRepository rapportRepository;
    private final TemplateEngine templateEngine;

    @Value("${report.export.directory:./exports}")
    private String exportDirectory;

    public String generateFile(UUID rapportId) {
        log.info("Génération du fichier pour le rapport: {}", rapportId);

        Rapport rapport = rapportRepository.findById(rapportId)
                .orElseThrow(() -> new ResourceNotFoundException("Rapport non trouvé avec l'id: " + rapportId));

        String filePath;
        switch (rapport.getFormat()) {
            case PDF -> filePath = generatePDF(rapportId);
            case EXCEL -> filePath = generateExcel(rapportId);
            case CSV -> filePath = generateCSV(rapportId);
            default -> throw new IllegalArgumentException("Format non supporté: " + rapport.getFormat());
        }

        // Mettre à jour le chemin du fichier dans le rapport
        rapport.setCheminFichier(filePath);
        rapportRepository.save(rapport);

        log.info("Fichier généré avec succès: {}", filePath);
        return filePath;
    }

    public String generatePDF(UUID rapportId) {
        log.info("Génération PDF pour le rapport: {}", rapportId);

        Rapport rapport = rapportRepository.findById(rapportId)
                .orElseThrow(() -> new ResourceNotFoundException("Rapport non trouvé avec l'id: " + rapportId));

        try {
            // Créer le répertoire d'export s'il n'existe pas
            Path exportPath = Paths.get(exportDirectory);
            if (!Files.exists(exportPath)) {
                Files.createDirectories(exportPath);
            }

            // Générer le nom du fichier
            String filename = String.format("rapport_%s_%s.pdf",
                    rapport.getTypeRapport().name().toLowerCase(),
                    rapport.getDateGeneration().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")));
            String filePath = exportPath.resolve(filename).toString();

            // Préparer les données pour le template
            Context context = new Context();
            context.setVariable("rapport", rapport);
            context.setVariable("titre", rapport.getTitre());
            context.setVariable("description", rapport.getDescription());
            context.setVariable("dateGeneration", rapport.getDateGeneration());
            context.setVariable("typeRapport", rapport.getTypeRapport());
            context.setVariable("dateDebut", rapport.getDateDebut());
            context.setVariable("dateFin", rapport.getDateFin());
            context.setVariable("utilisateurCreateur", rapport.getUtilisateurCreateur());
            context.setVariable("parametres", rapport.getParametresRapport());

            // Générer le HTML depuis le template
            String htmlContent = templateEngine.process("report-template", context);

            // Convertir HTML en PDF
            try (OutputStream outputStream = new FileOutputStream(filePath)) {
                ITextRenderer renderer = new ITextRenderer();
                renderer.setDocumentFromString(htmlContent);
                renderer.layout();
                renderer.createPDF(outputStream);
            }

            log.info("PDF généré avec succès: {}", filePath);
            return filePath;

        } catch (Exception e) {
            log.error("Erreur lors de la génération du PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
    }

    public String generateExcel(UUID rapportId) {
        log.info("Génération Excel pour le rapport: {}", rapportId);

        Rapport rapport = rapportRepository.findById(rapportId)
                .orElseThrow(() -> new ResourceNotFoundException("Rapport non trouvé avec l'id: " + rapportId));

        try {
            // Créer le répertoire d'export s'il n'existe pas
            Path exportPath = Paths.get(exportDirectory);
            if (!Files.exists(exportPath)) {
                Files.createDirectories(exportPath);
            }

            // Générer le nom du fichier
            String filename = String.format("rapport_%s_%s.xlsx",
                    rapport.getTypeRapport().name().toLowerCase(),
                    rapport.getDateGeneration().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")));
            String filePath = exportPath.resolve(filename).toString();

            // Créer le workbook Excel
            try (Workbook workbook = new XSSFWorkbook()) {
                Sheet sheet = workbook.createSheet("Rapport");

                // Style pour l'en-tête
                CellStyle headerStyle = workbook.createCellStyle();
                Font headerFont = workbook.createFont();
                headerFont.setBold(true);
                headerFont.setFontHeightInPoints((short) 12);
                headerStyle.setFont(headerFont);
                headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
                headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

                // Créer l'en-tête
                int rowNum = 0;

                // Titre
                Row titleRow = sheet.createRow(rowNum++);
                Cell titleCell = titleRow.createCell(0);
                titleCell.setCellValue("Rapport: " + rapport.getTitre());
                titleCell.setCellStyle(headerStyle);

                // Informations générales
                createRow(sheet, rowNum++, "Type de rapport:", rapport.getTypeRapport().name());
                createRow(sheet, rowNum++, "Date de génération:",
                        rapport.getDateGeneration().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));
                if (rapport.getDateDebut() != null) {
                    createRow(sheet, rowNum++, "Période du:",
                            rapport.getDateDebut().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                }
                if (rapport.getDateFin() != null) {
                    createRow(sheet, rowNum++, "Au:",
                            rapport.getDateFin().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                }
                createRow(sheet, rowNum++, "Créé par:", rapport.getUtilisateurCreateur());

                // Ligne vide
                rowNum++;

                // Description
                if (rapport.getDescription() != null && !rapport.getDescription().isEmpty()) {
                    Row descRow = sheet.createRow(rowNum++);
                    Cell descLabelCell = descRow.createCell(0);
                    descLabelCell.setCellValue("Description:");
                    descLabelCell.setCellStyle(headerStyle);

                    Row descValueRow = sheet.createRow(rowNum++);
                    descValueRow.createCell(0).setCellValue(rapport.getDescription());
                    rowNum++;
                }

                // Paramètres
                if (rapport.getParametresRapport() != null && !rapport.getParametresRapport().isEmpty()) {
                    Row paramRow = sheet.createRow(rowNum++);
                    Cell paramCell = paramRow.createCell(0);
                    paramCell.setCellValue("Paramètres:");
                    paramCell.setCellStyle(headerStyle);

                    for (Map.Entry<String, Object> entry : rapport.getParametresRapport().entrySet()) {
                        createRow(sheet, rowNum++, entry.getKey(), String.valueOf(entry.getValue()));
                    }
                }

                // Auto-size des colonnes
                sheet.autoSizeColumn(0);
                sheet.autoSizeColumn(1);

                // Écrire dans le fichier
                try (FileOutputStream fileOut = new FileOutputStream(filePath)) {
                    workbook.write(fileOut);
                }
            }

            log.info("Excel généré avec succès: {}", filePath);
            return filePath;

        } catch (Exception e) {
            log.error("Erreur lors de la génération du fichier Excel: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur lors de la génération du fichier Excel", e);
        }
    }

    public String generateCSV(UUID rapportId) {
        log.info("Génération CSV pour le rapport: {}", rapportId);

        Rapport rapport = rapportRepository.findById(rapportId)
                .orElseThrow(() -> new ResourceNotFoundException("Rapport non trouvé avec l'id: " + rapportId));

        try {
            // Créer le répertoire d'export s'il n'existe pas
            Path exportPath = Paths.get(exportDirectory);
            if (!Files.exists(exportPath)) {
                Files.createDirectories(exportPath);
            }

            // Générer le nom du fichier
            String filename = String.format("rapport_%s_%s.csv",
                    rapport.getTypeRapport().name().toLowerCase(),
                    rapport.getDateGeneration().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")));
            String filePath = exportPath.resolve(filename).toString();

            // Écrire le CSV
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
                // En-tête
                writer.write("Champ;Valeur\n");

                // Données
                writer.write(String.format("Titre;%s\n", csvEscape(rapport.getTitre())));
                writer.write(String.format("Type de rapport;%s\n", rapport.getTypeRapport().name()));
                writer.write(String.format("Date de génération;%s\n",
                        rapport.getDateGeneration().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"))));

                if (rapport.getDateDebut() != null) {
                    writer.write(String.format("Date début;%s\n",
                            rapport.getDateDebut().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
                }

                if (rapport.getDateFin() != null) {
                    writer.write(String.format("Date fin;%s\n",
                            rapport.getDateFin().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
                }

                writer.write(String.format("Créé par;%s\n", csvEscape(rapport.getUtilisateurCreateur())));

                if (rapport.getDescription() != null && !rapport.getDescription().isEmpty()) {
                    writer.write(String.format("Description;%s\n", csvEscape(rapport.getDescription())));
                }

                // Paramètres
                if (rapport.getParametresRapport() != null && !rapport.getParametresRapport().isEmpty()) {
                    writer.write("\nParamètres;\n");
                    for (Map.Entry<String, Object> entry : rapport.getParametresRapport().entrySet()) {
                        writer.write(String.format("%s;%s\n",
                                csvEscape(entry.getKey()),
                                csvEscape(String.valueOf(entry.getValue()))));
                    }
                }
            }

            log.info("CSV généré avec succès: {}", filePath);
            return filePath;

        } catch (Exception e) {
            log.error("Erreur lors de la génération du fichier CSV: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur lors de la génération du fichier CSV", e);
        }
    }

    private void createRow(Sheet sheet, int rowNum, String label, String value) {
        Row row = sheet.createRow(rowNum);
        row.createCell(0).setCellValue(label);
        row.createCell(1).setCellValue(value);
    }

    private String csvEscape(String value) {
        if (value == null) {
            return "";
        }
        // Échapper les guillemets et entourer de guillemets si nécessaire
        if (value.contains(";") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
