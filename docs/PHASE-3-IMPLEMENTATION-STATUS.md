# Phase 3 - État d'Implémentation

**Date** : 09/02/2026
**Status Global** : 60% complété

---

## ✅ F3.3 — Export iCalendar (100%)

### Fichiers créés :
- ✅ `planning-service/pom.xml` — Dépendance ical4j ajoutée
- ✅ `planning-service/service/ICalExportService.java` — Service complet
- ✅ `planning-service/controller/PlanningController.java` — Endpoint `GET /plannings/{id}/export/ical` ajouté

### Fonctionnalités :
- Export format .ics compatible Google Calendar, Outlook, Apple Calendar
- Gestion des événements récurrents (HEBDOMADAIRE)
- Enrichissement via Feign (cours, enseignant, salle)
- Headers HTTP appropriés (text/calendar, attachment)

### Tests :
❌ À créer : `ICalExportServiceTest.java`

---

## 🟡 F3.1 — Algorithme Génération EDT (40%)

### Fichiers créés :
- ✅ `planning-service/dto/request/GeneratePlanningRequest.java` — DTO complet avec validation
- ✅ `planning-service/dto/response/GeneratePlanningResponse.java` — DTO statistiques
- ✅ `planning-service/dto/response/CoursNonPlanifie.java` — DTO cours non planifiés
- ✅ `planning-service/client/BookingServiceClient.java` — Endpoints `/cours/ecole/{ecoleId}` ajoutés

### Fichiers manquants :
- ❌ `planning-service/service/PlanningGenerationService.java` — **CRITIQUE**
- ❌ `planning-service/config/PlanningGenerationConfig.java`
- ❌ Endpoint `POST /plannings/generate` dans PlanningController

### Algorithme attendu (pseudo-code) :
```java
@Service
public class PlanningGenerationService {
    public GeneratePlanningResponse generate(GeneratePlanningRequest request) {
        // 1. Créer EmploiDuTemps (BROUILLON)
        // 2. Récupérer cours école (Feign BookingService)
        // 3. Trier par priorité (CM > TD > TP, volume décroissant)
        // 4. Générer grille créneaux (Lun-Sam, 8h-18h, 90min)
        // 5. Pour chaque cours :
        //    - Calculer nb créneaux = volumeHoraire / dureeCreneauMinutes
        //    - Pour chaque créneau :
        //      * Parcourir slots disponibles
        //      * Vérifier dispo enseignant (Feign UserService)
        //      * Chercher salle optimale (Feign BookingService/auto-assign)
        //      * Vérifier conflits (ConflitService)
        //      * Créer Reservation + Creneau
        // 6. Retourner stats (cours planifiés, non planifiés, conflits)
    }
}
```

### Tests :
❌ À créer : `PlanningGenerationServiceTest.java` avec mocks Feign

---

## 🟡 F3.2 — Export PDF (30%)

### Fichiers créés :
- ✅ `planning-service/pom.xml` — Dépendances openhtmltopdf + thymeleaf
- ✅ `planning-service/service/PlanningDataEnricher.java` — Enrichissement données Feign

### Fichiers manquants :
- ❌ `planning-service/service/PdfExportService.java` — **CRITIQUE**
- ❌ `planning-service/resources/templates/planning-pdf.html` — **CRITIQUE**
- ❌ Endpoint `GET /plannings/{id}/export/pdf` dans PlanningController

### Template HTML attendu :
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <style>
        table { border-collapse: collapse; width: 100%; font-size: 10px; }
        th, td { border: 1px solid #000; padding: 5px; text-align: center; }
        .cm { background-color: #d1e7ff; }
        .td { background-color: #d4edda; }
        .tp { background-color: #fff3cd; }
    </style>
</head>
<body>
    <h1 th:text="'Emploi du Temps - Période: ' + ${periode}"></h1>
    <table>
        <thead>
            <tr>
                <th>Heure</th>
                <th>Lundi</th>
                <th>Mardi</th>
                <!-- ... Jusqu'à Samedi -->
            </tr>
        </thead>
        <tbody>
            <tr th:each="slot : ${slots}">
                <td th:text="${slot.heure}"></td>
                <td th:each="jour : ${jours}"
                    th:classappend="${slot.getClassForDay(jour)}"
                    th:text="${slot.getContentForDay(jour)}"></td>
            </tr>
        </tbody>
    </table>
</body>
</html>
```

### PdfExportService attendu :
```java
@Service
public class PdfExportService {
    private final TemplateEngine templateEngine;
    private final PlanningDataEnricher dataEnricher;

    public byte[] exportToPdf(UUID emploiId) {
        // 1. Charger EmploiDuTemps + creneaux
        // 2. Enrichir via dataEnricher
        // 3. Organiser en grille (Map<Jour, Map<Heure, Creneau>>)
        // 4. Rendre template Thymeleaf
        // 5. Convertir HTML → PDF (OpenHtmlToPdf)
        // 6. Return byte[]
    }
}
```

### Tests :
❌ À créer : `PdfExportServiceTest.java`

---

## ❌ F3.4 — Recherche Avancée (0%)

### Fichiers à créer :
- ❌ `planning-service/dto/request/SearchPlanningRequest.java` — DTO filtres + pagination
- ❌ `planning-service/repository/specification/EmploiDuTempsSpecification.java` — JPA Specs
- ❌ Modifier `EmploiDuTempsRepository.java` pour étendre `JpaSpecificationExecutor`
- ❌ Ajouter `searchAdvanced(SearchPlanningRequest)` dans EmploiDuTempsService
- ❌ Remplacer endpoint `GET /plannings/search` dans PlanningController

### Specifications JPA attendues :
```java
public class EmploiDuTempsSpecification {
    public static Specification<EmploiDuTemps> withEcoleId(UUID ecoleId) {
        return (root, query, cb) ->
            ecoleId == null ? null : cb.equal(root.get("ecoleId"), ecoleId);
    }

    public static Specification<EmploiDuTemps> withStatut(StatutEmploi statut) {
        return (root, query, cb) ->
            statut == null ? null : cb.equal(root.get("statut"), statut);
    }

    public static Specification<EmploiDuTemps> withEnseignantId(UUID enseignantId) {
        return (root, query, cb) -> {
            if (enseignantId == null) return null;
            Join<EmploiDuTemps, Creneau> creneauJoin = root.join("creneaux");
            return cb.equal(creneauJoin.get("enseignantId"), enseignantId);
        };
    }

    // withSalleId, withGroupeId, withSemaine...
}
```

### SearchPlanningRequest DTO :
```java
@Getter @Setter
public class SearchPlanningRequest {
    private UUID ecoleId;
    private UUID enseignantId;
    private UUID salleId;
    private UUID groupeId;
    private LocalDate semaine;
    private StatutEmploi statut;

    @Min(0)
    private int page = 0;

    @Min(1) @Max(100)
    private int size = 20;

    private String sortBy = "dateDebut";
    private String sortDirection = "ASC";
}
```

### Tests :
❌ À créer :
- `EmploiDuTempsSpecificationTest.java` (test chaque spec)
- `EmploiDuTempsServiceIntegrationTest.java` (test searchAdvanced)

---

## 🔧 Infrastructure — InternalControllers (100%)

### Fichiers créés :
- ✅ `booking-service/controller/InternalController.java` — Endpoints `/internal/*`
  - `/internal/cours/{id}`, `/internal/cours/ecole/{ecoleId}`, `/internal/cours/classe/{classeId}`
  - `/internal/salles/{id}`, `/internal/salles/ecole/{ecoleId}`, `/internal/salles/disponibles`
  - `/internal/reservations/{id}`, `/internal/reservations/search`, `POST /internal/reservations`
  - `/internal/groupes/cours/{coursId}`

- ✅ `user-service/controller/InternalAvailabilityController.java` — Endpoints `/internal/*`
  - `/internal/enseignants/{id}`
  - `/internal/disponibilites/enseignant/{enseignantId}`
  - `/internal/disponibilites/check`

### Note :
Les Feign clients dans `planning-service` appellent ces endpoints internes.

---

## 📋 Récapitulatif Global

| Feature | Status | Complétude | Bloquants |
|---------|--------|------------|-----------|
| **F3.1 Génération EDT** | 🟡 En cours | 40% | PlanningGenerationService manquant |
| **F3.2 Export PDF** | 🟡 En cours | 30% | PdfExportService + template manquants |
| **F3.3 Export iCal** | ✅ Complet | 100% | Aucun |
| **F3.4 Recherche avancée** | ❌ Non démarré | 0% | Tout à créer |
| **Infrastructure** | ✅ Complet | 100% | Aucun |

---

## 🚀 Prochaines Étapes (Priorité)

### 1. Compléter F3.1 (CRITIQUE)
- Créer `PlanningGenerationService` avec algorithme greedy
- Créer `PlanningGenerationConfig`
- Ajouter endpoint `POST /plannings/generate`
- Tests unitaires avec mocks

### 2. Compléter F3.2
- Créer template HTML `planning-pdf.html`
- Créer `PdfExportService`
- Ajouter endpoint `GET /plannings/{id}/export/pdf`
- Tests

### 3. Implémenter F3.4
- Créer toute la stack Specification + DTO + Service + Controller
- Tests intégration

### 4. Tests d'intégration E2E
- Tester workflow complet : générer EDT → valider → publier → exporter (PDF + iCal)

---

## 📝 Notes Techniques

### Appels Feign Inter-Services
- ✅ `planning-service` → `booking-service` : `/internal/cours`, `/internal/salles`, `/internal/reservations`
- ✅ `planning-service` → `user-service` : `/internal/enseignants`, `/internal/disponibilites`

### Gestion Erreurs
- Tous les services utilisent `@Transactional`
- `ResourceNotFoundException` pour entités non trouvées
- Logs avec SLF4J

### Performance
- PlanningDataEnricher : éviter N+1 queries (appels Feign bulk si possible)
- Specifications JPA : utiliser fetch joins
- Cache Redis : non implémenté (F4.3 dans Phase 4)

---

**FIN DU DOCUMENT — État Phase 3**
