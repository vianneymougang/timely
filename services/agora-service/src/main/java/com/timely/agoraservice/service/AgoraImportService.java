package com.timely.agoraservice.service;

import com.timely.agoraservice.client.BookingServiceClient;
import com.timely.agoraservice.dto.agora.AgoraEtudiantDto;
import com.timely.agoraservice.dto.booking.CreateEtudiantRequest;
import com.timely.agoraservice.dto.booking.EtudiantResponse;
import com.timely.agoraservice.dto.request.ImportEtudiantsRequest;
import com.timely.agoraservice.dto.response.ImportEtudiantsResponse;
import com.timely.agoraservice.entity.LogIntegration;
import com.timely.agoraservice.entity.enums.TypeLog;
import com.timely.agoraservice.repository.LogIntegrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

/**
 * Service gérant l'import des étudiants depuis la plateforme Agora externe.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AgoraImportService {

    private final BookingServiceClient bookingServiceClient;
    private final LogIntegrationRepository logIntegrationRepository;
    private final RestTemplate restTemplate;

    @Value("${agora.api.url:https://api.agora-iusjc.cm}")
    private String agoraApiUrl;

    @Value("${agora.api.username:admin}")
    private String agoraUsername;

    @Value("${agora.api.password:password}")
    private String agoraPassword;

    /**
     * Importe les étudiants depuis Agora.
     */
    @Transactional
    public ImportEtudiantsResponse importEtudiants(ImportEtudiantsRequest request) {
        log.info("Début de l'import des étudiants depuis Agora: ecoleId={}, classeId={}, anneeAcademique={}",
                request.getEcoleId(), request.getClasseId(), request.getAnneeAcademique());

        long startTime = System.currentTimeMillis();
        List<String> erreurs = new ArrayList<>();
        ImportEtudiantsResponse.ImportEtudiantsResponseBuilder responseBuilder = ImportEtudiantsResponse.builder()
                .importId(UUID.randomUUID())
                .dateImport(LocalDateTime.now());

        int totalRecuperes = 0;
        int etudiantsCrees = 0;
        int etudiantsMisAJour = 0;
        int etudiantsIgnores = 0;
        int echecs = 0;

        try {
            // 1. Récupérer les étudiants depuis l'API Agora
            List<AgoraEtudiantDto> agoraEtudiants = fetchEtudiantsFromAgora(
                    request.getEcoleId(),
                    request.getClasseId(),
                    request.getAnneeAcademique()
            );

            totalRecuperes = agoraEtudiants.size();
            log.info("Récupéré {} étudiant(s) depuis Agora", totalRecuperes);

            if (agoraEtudiants.isEmpty()) {
                responseBuilder.statut("SUCCESS")
                        .totalRecuperes(0)
                        .etudiantsCrees(0)
                        .etudiantsMisAJour(0)
                        .etudiantsIgnores(0)
                        .echecs(0);

                createImportLog(null, TypeLog.INFO,
                        String.format("Import terminé: aucun étudiant trouvé pour ecoleId=%s", request.getEcoleId()));

                long duration = System.currentTimeMillis() - startTime;
                return responseBuilder.dureeMs(duration).build();
            }

            // 2. Traiter chaque étudiant
            for (AgoraEtudiantDto agoraEtudiant : agoraEtudiants) {
                try {
                    String matricule = agoraEtudiant.getMatricule();

                    // Vérifier si l'étudiant existe déjà
                    boolean exists = checkEtudiantExists(matricule);

                    if (exists) {
                        if ("SKIP".equalsIgnoreCase(request.getModeDoublons())) {
                            log.debug("Étudiant {} déjà existant, ignoré (mode SKIP)", matricule);
                            etudiantsIgnores++;
                            continue;
                        } else {
                            // Mode UPDATE : mettre à jour l'étudiant existant
                            updateEtudiant(agoraEtudiant, request.getClasseId());
                            etudiantsMisAJour++;
                            log.debug("Étudiant {} mis à jour", matricule);
                        }
                    } else {
                        // Créer un nouvel étudiant
                        createEtudiant(agoraEtudiant, request.getClasseId());
                        etudiantsCrees++;
                        log.debug("Étudiant {} créé", matricule);
                    }

                } catch (Exception e) {
                    echecs++;
                    String errorMsg = String.format("Erreur pour l'étudiant %s: %s",
                            agoraEtudiant.getMatricule(), e.getMessage());
                    erreurs.add(errorMsg);
                    log.error(errorMsg, e);
                }
            }

            // 3. Déterminer le statut final
            String statut;
            if (echecs == 0) {
                statut = "SUCCESS";
            } else if (echecs == totalRecuperes) {
                statut = "FAILED";
            } else {
                statut = "PARTIAL_SUCCESS";
            }

            // 4. Logger dans LogIntegration
            TypeLog logType = switch (statut) {
                case "SUCCESS" -> TypeLog.INFO;
                case "PARTIAL_SUCCESS" -> TypeLog.WARN;
                case "FAILED" -> TypeLog.ERROR;
                default -> TypeLog.INFO;
            };

            String logMessage = String.format(
                    "Import étudiants terminé: %d récupérés, %d créés, %d mis à jour, %d ignorés, %d échecs",
                    totalRecuperes, etudiantsCrees, etudiantsMisAJour, etudiantsIgnores, echecs
            );

            createImportLog(null, logType, logMessage);

            log.info(logMessage);

            long duration = System.currentTimeMillis() - startTime;

            return responseBuilder
                    .statut(statut)
                    .totalRecuperes(totalRecuperes)
                    .etudiantsCrees(etudiantsCrees)
                    .etudiantsMisAJour(etudiantsMisAJour)
                    .etudiantsIgnores(etudiantsIgnores)
                    .echecs(echecs)
                    .erreurs(erreurs)
                    .dureeMs(duration)
                    .build();

        } catch (Exception e) {
            log.error("Erreur critique lors de l'import des étudiants", e);

            createImportLog(null, TypeLog.ERROR,
                    "Erreur critique lors de l'import: " + e.getMessage());

            long duration = System.currentTimeMillis() - startTime;

            return responseBuilder
                    .statut("FAILED")
                    .totalRecuperes(totalRecuperes)
                    .etudiantsCrees(etudiantsCrees)
                    .etudiantsMisAJour(etudiantsMisAJour)
                    .etudiantsIgnores(etudiantsIgnores)
                    .echecs(echecs + 1)
                    .erreurs(List.of("Erreur critique: " + e.getMessage()))
                    .dureeMs(duration)
                    .build();
        }
    }

    /**
     * Récupère les étudiants depuis l'API Agora externe.
     * Pour la démo, retourne des données simulées.
     */
    private List<AgoraEtudiantDto> fetchEtudiantsFromAgora(UUID ecoleId, UUID classeId, String anneeAcademique) {
        log.info("Récupération des étudiants depuis Agora: ecoleId={}, classeId={}", ecoleId, classeId);

        // TODO: Implémenter l'appel réel à l'API Agora
        // Pour l'instant, on retourne des données simulées pour la démonstration

        // En production, cela ressemblerait à :
        /*
        try {
            String url = String.format("%s/api/etudiants?ecoleId=%s&anneeAcademique=%s",
                    agoraApiUrl, ecoleId, anneeAcademique != null ? anneeAcademique : getCurrentAnneeAcademique());

            if (classeId != null) {
                url += "&classeId=" + classeId;
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBasicAuth(agoraUsername, agoraPassword);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<AgoraEtudiantDto[]> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    AgoraEtudiantDto[].class
            );

            if (response.getBody() != null) {
                return Arrays.asList(response.getBody());
            }

            return new ArrayList<>();

        } catch (Exception e) {
            log.error("Erreur lors de l'appel à l'API Agora: {}", e.getMessage(), e);
            throw new RuntimeException("Impossible de récupérer les étudiants depuis Agora: " + e.getMessage(), e);
        }
        */

        // Données simulées pour la démo
        log.warn("Utilisation de données simulées pour la démonstration (l'API Agora réelle n'est pas configurée)");

        List<AgoraEtudiantDto> mockData = new ArrayList<>();

        // Générer 5 étudiants fictifs
        for (int i = 1; i <= 5; i++) {
            mockData.add(AgoraEtudiantDto.builder()
                    .agoraId("AGR-" + UUID.randomUUID().toString().substring(0, 8))
                    .matricule("ETU" + String.format("%05d", i))
                    .nom("Nom" + i)
                    .prenom("Prenom" + i)
                    .email(String.format("etudiant%d@iusjc.cm", i))
                    .agoraClasseId("CLS-001")
                    .nomClasse("Licence 3 Informatique")
                    .anneeAcademique(anneeAcademique != null ? anneeAcademique : "2025-2026")
                    .telephone("+237 6" + String.format("%08d", i))
                    .dateNaissance("2000-01-0" + i)
                    .genre(i % 2 == 0 ? "M" : "F")
                    .build());
        }

        return mockData;
    }

    /**
     * Vérifie si un étudiant existe déjà par son matricule.
     */
    private boolean checkEtudiantExists(String matricule) {
        try {
            Boolean exists = bookingServiceClient.existsByMatricule(matricule);
            return exists != null && exists;
        } catch (Exception e) {
            // Si l'endpoint n'existe pas ou erreur, on considère que l'étudiant n'existe pas
            log.warn("Impossible de vérifier l'existence de l'étudiant {}: {}", matricule, e.getMessage());

            // Tentative de récupération directe
            try {
                bookingServiceClient.getEtudiantByMatricule(matricule);
                return true;
            } catch (Exception ex) {
                return false;
            }
        }
    }

    /**
     * Crée un nouvel étudiant dans booking-service.
     */
    private void createEtudiant(AgoraEtudiantDto agoraEtudiant, UUID classeIdOverride) {
        CreateEtudiantRequest request = buildCreateEtudiantRequest(agoraEtudiant, classeIdOverride);
        bookingServiceClient.createEtudiant(request);
        log.debug("Étudiant créé: matricule={}", agoraEtudiant.getMatricule());
    }

    /**
     * Met à jour un étudiant existant dans booking-service.
     */
    private void updateEtudiant(AgoraEtudiantDto agoraEtudiant, UUID classeIdOverride) {
        try {
            // Récupérer l'étudiant existant pour obtenir son ID
            EtudiantResponse existing = bookingServiceClient.getEtudiantByMatricule(agoraEtudiant.getMatricule());

            if (existing != null && existing.getId() != null) {
                CreateEtudiantRequest request = buildCreateEtudiantRequest(agoraEtudiant, classeIdOverride);
                bookingServiceClient.updateEtudiant(existing.getId(), request);
                log.debug("Étudiant mis à jour: matricule={}", agoraEtudiant.getMatricule());
            } else {
                log.warn("Impossible de trouver l'étudiant {} pour mise à jour", agoraEtudiant.getMatricule());
            }
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour de l'étudiant {}: {}", agoraEtudiant.getMatricule(), e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Construit une CreateEtudiantRequest à partir d'un AgoraEtudiantDto.
     */
    private CreateEtudiantRequest buildCreateEtudiantRequest(AgoraEtudiantDto agoraEtudiant, UUID classeIdOverride) {
        LocalDate dateNaissance = null;
        if (agoraEtudiant.getDateNaissance() != null) {
            try {
                dateNaissance = LocalDate.parse(agoraEtudiant.getDateNaissance());
            } catch (Exception e) {
                log.warn("Format de date de naissance invalide pour {}: {}", agoraEtudiant.getMatricule(), agoraEtudiant.getDateNaissance());
            }
        }

        return CreateEtudiantRequest.builder()
                .matricule(agoraEtudiant.getMatricule())
                .nom(agoraEtudiant.getNom())
                .prenom(agoraEtudiant.getPrenom())
                .email(agoraEtudiant.getEmail())
                .classeId(classeIdOverride) // Utiliser la classe de la requête, pas celle d'Agora
                .telephone(agoraEtudiant.getTelephone())
                .dateNaissance(dateNaissance)
                .genre(agoraEtudiant.getGenre())
                .build();
    }

    /**
     * Crée un log d'intégration.
     * Note: comme les logs sont liés à un ExportAgora, on ne peut pas les créer directement ici.
     * Pour une vraie implémentation, il faudrait créer une entité ImportLog séparée.
     */
    private void createImportLog(UUID exportId, TypeLog typeLog, String message) {
        // Pour l'instant, on log seulement dans les logs applicatifs
        // Dans une vraie implémentation, on créerait une entité ImportLog ou LogIntegration
        // sans dépendance à ExportAgora

        log.info("[ImportLog] type={}, message={}", typeLog, message);

        // TODO: Créer une table dédiée pour les logs d'import si nécessaire
    }

    /**
     * Retourne l'année académique en cours.
     */
    private String getCurrentAnneeAcademique() {
        int currentYear = LocalDate.now().getYear();
        int currentMonth = LocalDate.now().getMonthValue();

        // L'année académique commence généralement en septembre
        if (currentMonth >= 9) {
            return currentYear + "-" + (currentYear + 1);
        } else {
            return (currentYear - 1) + "-" + currentYear;
        }
    }
}
