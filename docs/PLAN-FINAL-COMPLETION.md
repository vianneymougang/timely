# Plan Final — Timely vers Version Finalisée et Polished
> **Contexte** : Présentation live vendredi. Développeur seul. Hébergement VPS (Contabo).
> **Méthode** : Phases ordonnées par impact. Chaque phase = livrable testable.

---

## Table des matières

1. [État des lieux confirmé](#1-état-des-lieux-confirmé)
2. [Scénario de démo live](#2-scénario-de-démo-live)
3. [Phase A — Report Service : câblage FileGenerationService](#3-phase-a--report-service--câblage-fileGenerationService)
4. [Phase B — Vérification et finalisation Phase 3 (overrides hebdo)](#4-phase-b--vérification-et-finalisation-phase-3-overrides-hebdo)
5. [Phase C — Frontend : combler les stubs](#5-phase-c--frontend--combler-les-stubs)
6. [Phase D — Sécurité et performance baseline](#6-phase-d--sécurité-et-performance-baseline)
7. [Phase E — Déploiement VPS](#7-phase-e--déploiement-vps)
8. [Phase F — Seed data et répétition démo](#8-phase-f--seed-data-et-répétition-démo)
9. [Phase G (Optionnel) — UI/UX Premium](#9-phase-g-optionnel--uiux-premium)
10. [Tableau de bord des priorités](#10-tableau-de-bord-des-priorités)

---

## 1. État des lieux confirmé

### ✅ Entièrement implémenté

| Élément | Preuve |
|---------|--------|
| Alignement enums (Phase 0 du plan-refonte) | `StatutEmploi`, `StatutCreneau`, `TypeConflit`, `Severite` alignés Java/TS/SQL |
| CycleType + yearIndex (Phase 1) | `Filiere.cycleType`, `Classe.yearIndex`, V2 migration booking |
| Grille temporelle 60min / 6 jours / pause 12-13h (Phase 2) | `PlanningGenerationConfig.java` : constantes fixes, 8 slots |
| Entité `TeacherWeeklyOverride` + migration V5 (Phase 3 partielle) | Modèle + repo + migration SQL |
| Algorithme campus-wide Ford-Fulkerson (Phase 4) | `CampusScheduleGenerationService.java` + `FlowNetwork.java` |
| Frontend schedule generator simplifié | `weekStart` seul, campus-wide |
| Frontend grille 6 jours | CSS `/6`, SATURDAY inclus |
| Seed data SQL | `V3__seed_booking_data.sql`, `V6__seed_user_data.sql`, `docs/seed/` |
| `FileGenerationService` (PDF/Excel/CSV) | iText/OpenHTML + Apache POI — implémentation réelle |

### ⚠️ Partiellement implémenté

| Élément | Ce qui manque |
|---------|--------------|
| Phase 3 — overrides frontend | Onglet "Exceptions de semaine" dans `teacher-availability` à vérifier |
| Phase 3 — endpoint disponibilités effectives | `getEffectiveAvailability()` + endpoint `/semaine` à vérifier |
| Report Service | `ReportService.generateReport()` = TODO, `ExportService` = stub — `FileGenerationService` jamais appelé |
| Admin Dashboard | `updateChartData()` vide → graphique mocké |
| KPIService | Calculs présents mais Feign clients retournent `List<Object>` → typage fragile |

### 🔴 Non implémenté

| Élément | Notes |
|---------|-------|
| `StatisticsComponent` Angular | Stub vide — zéro implémentation |
| Secrets externalisés | Passwords BD, JWT en clair dans YAML commités |
| Déploiement VPS | VPS non provisionné, aucun docker-compose prod |
| Scripts Linux | Scripts de démarrage Windows uniquement |
| Agora API réelle | Décision : hors scope pour cette version |
| Notifications SMS/Push | Décision : hors scope pour cette version |

---

## 2. Scénario de démo live

> Ce scénario est le fil conducteur de toute la préparation. Chaque phase doit contribuer à rendre ce parcours fluide et sans bug.

### Acte 1 — Administrateur (10 min)

```
1. Connexion admin → dashboard avec KPIs vivants
   (nb enseignants, cours planifiés, taux occupation salles, conflits actifs)

2. Navigation → Gestion Enseignants
   → Voir la liste des enseignants avec leur charge horaire
   → Cliquer sur un enseignant → voir ses disponibilités hebdomadaires et ses cours assignés

3. Navigation → Emplois du temps → Générer
   → Saisir la date de lundi (ex: 2026-04-27)
   → Cliquer Générer → voir la progression en temps réel
   → Résultat : tableau par école (taux de succès, cours planifiés/non planifiés)

4. Navigation → Visualiser l'EDT généré
   → Grille campus : lundi-samedi, 8h-17h
   → Filtrer par enseignant → voir son planning de semaine
   → Voir un conflit signalé → cliquer → détail du conflit
   → Résoudre le conflit manuellement

5. Valider puis Publier l'EDT
   → Notification émise vers les enseignants

6. Navigation → Rapports
   → Générer un rapport PDF : charge horaire par enseignant
   → Télécharger le PDF → le montrer
   → Voir les statistiques d'occupation des salles
```

### Acte 2 — Enseignant (5 min)

```
7. Logout admin → connexion en tant qu'enseignant

8. Dashboard enseignant → voir son planning de la semaine courante

9. Navigation → Mes Disponibilités
   → Template de disponibilité (grille récurrente)
   → Onglet "Exceptions" → sélectionner la semaine du 2026-04-27
   → Marquer lundi matin 8h-10h comme indisponible (raison : "Réunion département")
   → Sauvegarder

10. Navigation → Mon Emploi du Temps
    → Voir la grille filtrée à son propre planning
    → Exporter en iCal
```

---

## 3. Phase A — Report Service : câblage FileGenerationService

> **Priorité** : 🔴 CRITIQUE — sans ça, la démo du rapport PDF échoue
> **Effort** : ~3h
> **Prérequis** : Aucun

### A.1 Typer les Feign clients du report-service

**Problème** : Tous les Feign clients retournent `List<Object>` → parsing par réflexion fragile.

**Action** : Créer des DTOs internes dans report-service et les utiliser dans les Feign clients.

Fichiers à modifier :
- `services/report-service/src/main/java/com/timely/reportservice/client/UserServiceClient.java`
- `services/report-service/src/main/java/com/timely/reportservice/client/BookingServiceClient.java`
- `services/report-service/src/main/java/com/timely/reportservice/client/PlanningServiceClient.java`

Créer les records suivants dans report-service (package `dto.client`) :
```java
public record TeacherSummaryDTO(UUID id, String nom, String prenom, String email) {}
public record CoursDTO(UUID id, String intitule, String type, int volumeHoraire, UUID enseignantId) {}
public record SalleDTO(UUID id, String nom, int capacite, String type) {}
public record ReservationDTO(UUID id, UUID salleId, LocalDate dateReservation, LocalTime heureDebut, LocalTime heureFin) {}
public record CreneauDTO(UUID id, String jourSemaine, LocalTime heureDebut, LocalTime heureFin, String enseignantNom, String salleNom, String coursIntitule) {}
public record ChargeHoraireDTO(UUID enseignantId, String nom, int totalHeures) {}
```

Mettre à jour les Feign clients pour utiliser ces types :
```java
// Exemple UserServiceClient
@GetMapping("/internal/users/teachers")
List<TeacherSummaryDTO> getAllTeachers();

@GetMapping("/internal/users/{id}/charge-horaire")
ChargeHoraireDTO getChargeHoraire(@PathVariable UUID id);
```

### A.2 Connecter ReportService → FileGenerationService

**Fichier** : `services/report-service/src/main/java/com/timely/reportservice/service/ReportService.java`

Remplacer le TODO ligne 37 par un appel réel :

```java
public RapportResponse generateReport(GenerateReportRequest request, String utilisateurCreateur) {
    Rapport rapport = rapportMapper.toEntity(request);
    rapport.setDateGeneration(LocalDateTime.now());
    rapport.setUtilisateurCreateur(utilisateurCreateur);

    // Construire les données selon le type de rapport
    Map<String, Object> reportData = buildReportData(rapport.getTypeRapport(), request);
    rapport.setDonnees(reportData); // si le champ existe, sinon sérialiser en JSON

    // Générer le fichier selon le format demandé
    String filePath = fileGenerationService.generatePdf(rapport, reportData);
    rapport.setCheminFichier(filePath);
    rapport.setStatut(StatutExport.COMPLETE);

    Rapport saved = rapportRepository.save(rapport);
    return rapportMapper.toResponse(saved);
}

private Map<String, Object> buildReportData(TypeRapport type, GenerateReportRequest request) {
    return switch (type) {
        case CHARGE_HORAIRE -> buildChargeHoraireData(request);
        case UTILISATION_SALLES -> buildUtilisationSallesData(request);
        case STATISTIQUES_COURS -> buildStatistiquesCoursData(request);
        case AUDIT -> buildAuditData(request);
    };
}
```

### A.3 Implémenter les méthodes de collecte de données

Ces méthodes appellent les Feign clients typés pour construire les données du rapport :

```java
private Map<String, Object> buildChargeHoraireData(GenerateReportRequest request) {
    List<TeacherSummaryDTO> teachers = userServiceClient.getAllTeachers();
    List<ChargeHoraireDTO> charges = teachers.stream()
        .map(t -> userServiceClient.getChargeHoraire(t.id()))
        .toList();
    return Map.of(
        "teachers", teachers,
        "charges", charges,
        "periode", request.getPeriode(),
        "dateGeneration", LocalDateTime.now()
    );
}

private Map<String, Object> buildUtilisationSallesData(GenerateReportRequest request) {
    List<SalleDTO> salles = bookingServiceClient.getAllSalles();
    List<ReservationDTO> reservations = bookingServiceClient.getReservations();
    // Calcul taux occupation par salle
    Map<UUID, Long> reservationsParSalle = reservations.stream()
        .collect(Collectors.groupingBy(ReservationDTO::salleId, Collectors.counting()));
    return Map.of("salles", salles, "reservations", reservationsParSalle);
}
```

### A.4 Connecter ExportService → FileGenerationService

**Fichier** : `services/report-service/src/main/java/com/timely/reportservice/service/ExportService.java`

Remplacer le stub par un appel réel :
```java
public ExportResponse createExport(UUID rapportId, FormatExport format, String utilisateur) {
    Rapport rapport = rapportRepository.findById(rapportId)
        .orElseThrow(() -> new ResourceNotFoundException("Rapport not found: " + rapportId));

    String filePath = switch (format) {
        case PDF   -> fileGenerationService.generatePdf(rapport, rapport.getDonnees());
        case EXCEL -> fileGenerationService.generateExcel(rapport, rapport.getDonnees());
        case CSV   -> fileGenerationService.generateCsv(rapport, rapport.getDonnees());
    };

    Export export = new Export();
    export.setRapportId(rapportId);
    export.setFormat(format);
    export.setCheminFichier(filePath);
    export.setStatut(StatutExport.COMPLETE);
    export.setUtilisateur(utilisateur);
    Export saved = exportRepository.save(export);
    return exportMapper.toResponse(saved);
}
```

### A.5 Endpoint de téléchargement

Vérifier que `ReportController` a un endpoint `GET /{id}/download` qui :
1. Trouve le rapport par id
2. Lit le fichier depuis `cheminFichier`
3. Retourne un `ResponseEntity<Resource>` avec `Content-Disposition: attachment`

---

## 4. Phase B — Vérification et finalisation Phase 3 (overrides hebdo)

> **Priorité** : 🔴 CRITIQUE — nécessaire pour la démo enseignant (step 9)
> **Effort** : ~2h (vérification + complétion si manquant)
> **Prérequis** : Aucun

### B.1 Vérifier l'implémentation backend

Vérifier si ces éléments existent déjà dans user-service :

**a) `AvailabilityServiceImpl.getEffectiveAvailability()`**
Chercher dans `AvailabilityServiceImpl.java` la méthode `getEffectiveAvailability`.
Si absente, implémenter :
```java
public List<AvailabilitySlotDto> getEffectiveAvailability(UUID teacherId, LocalDate weekStart) {
    List<AvailabilitySlotDto> template = getAvailabilityByTeacherId(teacherId);
    List<TeacherWeeklyOverride> overrides =
        overrideRepository.findByTeacherIdAndWeekStart(teacherId, weekStart);

    // Construire un Set des slots template
    Set<String> templateKeys = template.stream()
        .map(s -> s.getDayOfWeek() + "_" + s.getHourStart())
        .collect(Collectors.toSet());

    // Appliquer les overrides
    for (TeacherWeeklyOverride override : overrides) {
        String key = override.getDayOfWeek() + "_" + override.getHourStart();
        if (override.getAvailable()) {
            templateKeys.add(key);
        } else {
            templateKeys.remove(key);
        }
    }
    // Reconvertir en AvailabilitySlotDto
    return buildSlotsFromKeys(templateKeys);
}
```

**b) Endpoint `/internal/disponibilites/enseignant/{id}/semaine`**
Vérifier dans `InternalAvailabilityController.java`. Si absent, ajouter :
```java
@GetMapping("/disponibilites/enseignant/{enseignantId}/semaine")
public ResponseEntity<List<AvailabilitySlotDto>> getDisponibilitesSemaine(
        @PathVariable UUID enseignantId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
    return ResponseEntity.ok(availabilityService.getEffectiveAvailability(enseignantId, weekStart));
}
```

**c) Endpoint PUT `/api/users/teachers/me/availability/overrides`**
Vérifier dans `AvailabilityController.java`. Si absent, ajouter pour permettre à l'enseignant de saisir ses exceptions :
```java
@PutMapping("/teachers/me/availability/overrides")
public ResponseEntity<Void> saveWeeklyOverrides(
        @RequestBody WeeklyOverridesRequest request,
        Authentication auth) {
    UUID teacherId = extractTeacherId(auth);
    overrideRepository.deleteByTeacherIdAndWeekStart(teacherId, request.getWeekStart());
    overrideRepository.saveAll(request.toEntities(teacherId));
    return ResponseEntity.noContent().build();
}
```

**d) Mettre à jour UserServiceClient dans planning-service**
Vérifier si `UserServiceClient.java` du planning-service appelle déjà le endpoint `/semaine`.
Si non, ajouter :
```java
@GetMapping("/internal/disponibilites/enseignant/{enseignantId}/semaine")
List<DisponibiliteDTO> getDisponibilitesSemaine(
    @PathVariable UUID enseignantId,
    @RequestParam("weekStart") LocalDate weekStart);
```
Et s'assurer que `CampusScheduleGenerationService` utilise cette méthode plutôt que les disponibilités génériques.

### B.2 Vérifier le frontend

**Fichier** : `timely-frontend/src/app/features/teacher/availability/teacher-availability.component.ts`

Vérifier si l'onglet "Exceptions de semaine" existe. Si absent, ajouter :
- Un date picker pour sélectionner la semaine (filtre sur les lundis)
- La grille pré-remplie depuis le template
- Toggle ON/OFF des créneaux
- Bouton "Sauvegarder les exceptions"
- Appel `PUT /api/users/teachers/me/availability/overrides`

---

## 5. Phase C — Frontend : combler les stubs

> **Priorité** : 🔴 HAUTE — visible dans la démo
> **Effort** : ~4h
> **Prérequis** : Phase A (pour les statistiques qui dépendent du report-service)

### C.1 Statistics Component — Implémenter depuis zéro

**Fichier** : `timely-frontend/src/app/features/admin/statistics/statistics.component.ts`

Le composant est un stub vide. Implémenter avec 4 sections :

**Données à afficher** (via `report.service.ts`) :
1. **Occupation des salles** : graphique en barres (salle → % occupation)
2. **Charge horaire enseignants** : tableau trié (nom, heures/semaine, heures/mois)
3. **Distribution des cours** : pie chart (CM vs TD vs TP)
4. **Conflits par semaine** : sparkline sur les 4 dernières semaines

**Template minimal** :
```typescript
@Component({
  selector: 'app-statistics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent implements OnInit {
  stats = signal<StatisticsData | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.reportService.getStatistiquesGlobales().pipe(
      finalize(() => this.loading.set(false))
    ).subscribe(data => this.stats.set(data));
  }
}
```

**Note** : Utiliser Angular Material cards + un graphique léger. Ne pas importer Chart.js si non déjà présent — utiliser des barres CSS pures si nécessaire pour éviter une dépendance lourde.

### C.2 Dashboard — Connecter les graphiques

**Fichier** : `timely-frontend/src/app/features/admin/dashboard/dashboard.component.ts`

Remplacer `updateChartData()` vide par les vraies données :
```typescript
private updateChartData(kpis: DashboardKPIs): void {
  this.chartData.set({
    labels: ['Cette semaine', 'Semaine -1', 'Semaine -2', 'Semaine -3'],
    datasets: [{
      label: 'Cours planifiés',
      data: kpis.coursParSemaine ?? [0, 0, 0, 0]
    }]
  });
}
```

Si `DashboardResponse` du backend ne retourne pas d'historique par semaine, ajouter ce champ dans `KPIService.getDashboard()` :
```java
List<Integer> coursParSemaine = buildWeeklyHistory(4); // 4 dernières semaines
```

### C.3 Admin Settings — Stub minimal acceptable

**Fichier** : `timely-frontend/src/app/features/admin/settings/settings.component.ts`

Pas besoin d'une page fonctionnelle complète, mais le composant ne peut pas être vide lors d'une démo live. Ajouter au minimum :
- Section "Profil administrateur" (nom, email, changement de mot de passe)
- Section "Préférences" (thème clair/sombre — déjà géré par `ThemeService`)

### C.4 Route 'schedule' dupliquée — Vérifier

**Fichier** : `timely-frontend/src/app/features/teacher/teacher.routes.ts`

La duplication signalée dans le diagnostic initial a peut-être déjà été corrigée (non détectée dans le dernier audit). Vérifier et confirmer que la route `profile` est accessible.

---

## 6. Phase D — Sécurité et performance baseline

> **Priorité** : 🟡 HAUTE — critique pour le déploiement VPS
> **Effort** : ~3h
> **Prérequis** : Aucun (indépendant)

### D.1 Externaliser les secrets (P0)

**Créer** `.env.example` à la racine (committer) et `.env` (dans `.gitignore`) :

```env
# Bases de données
DB_PASSWORD=<mot_de_passe_fort>

# JWT
JWT_SECRET=<clé_aléatoire_512_bits>

# RabbitMQ
RABBITMQ_USERNAME=admin
RABBITMQ_PASSWORD=<mot_de_passe_fort>

# Redis
REDIS_PASSWORD=<mot_de_passe_fort>

# MongoDB
MONGODB_PASSWORD=<mot_de_passe_fort>

# CORS (URL du frontend en production)
CORS_ORIGINS=https://timely.votredomaine.com

# Agora (pour quand l'API sera disponible)
AGORA_API_URL=
AGORA_API_USERNAME=
AGORA_API_PASSWORD=
```

**Dans chaque `application.yaml`** remplacer les valeurs en dur :
```yaml
spring:
  datasource:
    password: ${DB_PASSWORD:changeme}
  security:
    jwt:
      secret: ${JWT_SECRET}  # pas de valeur par défaut
  rabbitmq:
    username: ${RABBITMQ_USERNAME:guest}
    password: ${RABBITMQ_PASSWORD:guest}
```

**Dans `docker-compose.yml`** ajouter `env_file: - .env` à chaque service et supprimer les fallbacks faibles.

### D.2 Corriger les ports BD locaux

**Fichiers à corriger** :
- `services/auth-service/src/main/resources/application.yaml` : `localhost:5432` → `localhost:5001`
- `services/user-service/src/main/resources/application.yaml` : `localhost:5432` → `localhost:5002`
- `services/report-service/src/main/resources/application.yaml` : `report_db` → `report-service-db`

### D.3 Ajouter RabbitMQ/Redis hosts dans docker-compose

**Problème** : `auth-service`, `user-service`, `planning-service` n'ont pas `RABBITMQ_HOST` et `REDIS_HOST` dans leurs env docker-compose, donc utilisent `localhost` (inexistant dans le réseau Docker).

**Ajouter** pour chaque service concerné dans `docker-compose.yml` :
```yaml
environment:
  - SPRING_RABBITMQ_HOST=rabbitmq
  - SPRING_RABBITMQ_PORT=5672
  - SPRING_DATA_REDIS_HOST=redis
  - SPRING_DATA_REDIS_PORT=6379
```

### D.4 Sécuriser les endpoints UserController

**Fichier** : `services/user-service/src/main/java/com/timely/userservice/controller/UserController.java`

Ajouter les annotations manquantes selon le workflow de remédiation :
```java
@GetMapping("/{id}")
@PreAuthorize("hasAnyRole('ADMIN', 'ENSEIGNANT')")

@GetMapping
@PreAuthorize("hasRole('ADMIN')")

@GetMapping("/{enseignantId}/cours")
@PreAuthorize("hasRole('ADMIN') or #enseignantId.toString() == authentication.name")
```

### D.5 Désactiver show-sql en profil docker

Dans tous les `application-docker.yaml` :
```yaml
spring:
  jpa:
    show-sql: false
  logging:
    level:
      com.timely: INFO
      org.springframework: WARN
```

### D.6 Configurer HikariCP

Dans tous les `application.yaml` de services avec PostgreSQL :
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 3
      connection-timeout: 20000
      idle-timeout: 300000
      max-lifetime: 1200000
```

### D.7 FetchType EAGER → LAZY

**Fichier** : `services/user-service/src/main/java/com/timely/userservice/model/TeacherAvailability.java` ligne 48

```java
// AVANT
@OneToMany(fetch = FetchType.EAGER)

// APRÈS
@OneToMany(fetch = FetchType.LAZY)
```

Adapter la requête du repository :
```java
@Query("SELECT ta FROM TeacherAvailability ta LEFT JOIN FETCH ta.timeSlots WHERE ta.teacherId = :teacherId")
Optional<TeacherAvailability> findByTeacherIdWithTimeSlots(@Param("teacherId") UUID teacherId);
```

---

## 7. Phase E — Déploiement VPS

> **Priorité** : 🔴 CRITIQUE — sans déploiement, pas de démo live stable
> **Effort** : ~4h
> **Prérequis** : Phases A, D terminées

### E.1 Provisionner le VPS (Contabo)

**Recommandation** : VPS S (4 vCPU, 8GB RAM, SSD 200GB) ~5€/mois.

**OS** : Ubuntu 24.04 LTS.

**Actions** :
```bash
# Créer un utilisateur non-root
adduser timely
usermod -aG sudo timely
# Copier les clés SSH
# Désactiver auth password SSH
```

### E.2 Installer Docker et Docker Compose

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker timely
sudo apt install docker-compose-plugin
```

### E.3 Créer docker-compose.prod.yml

Créer un fichier de production distinct qui :
- Utilise les images buildées (pas les builds locaux)
- Supprime pgAdmin, mongo-express (outils dev)
- Ajoute Nginx comme reverse proxy
- Désactive les ports exposés sauf 80/443

**Structure minimale** :
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/timely
      - ./timely-frontend/dist:/usr/share/nginx/html
    depends_on:
      - api-gateway

  api-gateway:
    # Pas de ports exposés en prod (nginx fait le proxy)
    expose:
      - "8090"
```

### E.4 Configurer Nginx

**Fichier** : `nginx.conf` à la racine du projet :

```nginx
upstream api {
    server api-gateway:8090;
}

server {
    listen 80;
    server_name timely.votredomaine.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name timely.votredomaine.com;

    ssl_certificate /etc/ssl/timely/cert.pem;
    ssl_certificate_key /etc/ssl/timely/key.pem;

    # Frontend Angular
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api/ {
        proxy_pass http://api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 60s;
    }
}
```

### E.5 SSL avec Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d timely.votredomaine.com
```

Si pas de domaine pour la présentation, utiliser un certificat self-signed ou ngrok temporairement.

### E.6 Build du frontend Angular

```bash
cd timely-frontend
npm run build -- --configuration=production
# L'output va dans dist/
```

Vérifier que `environment.prod.ts` pointe vers la bonne URL API :
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://timely.votredomaine.com/api'
};
```

### E.7 Build et push des images Docker

```bash
# Depuis la racine du projet
docker compose -f docker-compose.prod.yml build
# Ou utiliser un registry Docker si disponible
```

### E.8 Script de déploiement

**Créer** `scripts/deploy.sh` :
```bash
#!/bin/bash
set -e

echo "=== Deploying Timely ==="

# Pull dernières modifications
git pull origin main

# Build frontend
cd timely-frontend && npm ci && npm run build -- --configuration=production && cd ..

# Restart services
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --build

# Wait for health
echo "Waiting for services..."
sleep 30
docker compose -f docker-compose.prod.yml ps

echo "=== Deploy complete ==="
```

---

## 8. Phase F — Seed data et répétition démo

> **Priorité** : 🔴 CRITIQUE — la démo sans données cohérentes est impossible
> **Effort** : ~2h
> **Prérequis** : Phase E terminée

### F.1 Vérifier et compléter les scripts seed

Les fichiers `docs/seed/` contiennent :
- `seed-user-service.sql` — 6 enseignants avec disponibilités ✅
- `seed-booking-service.sql` — 4 écoles, filières, classes, salles, cours ✅
- `seed-planning-service.sql` — Vide intentionnellement (généré via API)

**Vérifier la cohérence** :
- Les enseignants dans `seed-user-service.sql` ont-ils les bons IDs référencés dans `seed-booking-service.sql` (cours avec `enseignant_id`) ?
- Les filières ont-elles leur `cycle_type` correspondant aux 4 écoles (SJI, SJM, CPGE, PV) ?
- Y a-t-il au moins 15-20 cours avec `volume_horaire` entre 1-4h pour que la génération produise un résultat intéressant ?

### F.2 Créer un script shell Linux de seed

**Fichier** : `scripts/seed-all.sh` :
```bash
#!/bin/bash
set -e

PGPASSWORD=${DB_PASSWORD:-changeme}
PG_HOST=${PG_HOST:-localhost}

echo "=== Seeding user-service ==="
PGPASSWORD=$PGPASSWORD psql -h $PG_HOST -p 5002 -U postgres -d user-service-db \
  -f docs/seed/seed-user-service.sql

echo "=== Seeding booking-service ==="
PGPASSWORD=$PGPASSWORD psql -h $PG_HOST -p 5004 -U postgres -d booking-service-db \
  -f docs/seed/seed-booking-service.sql

echo "=== Triggering campus-wide generation ==="
curl -s -X POST http://localhost:8090/api/planning/generate/campus \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"weekStart": "2026-04-27"}' | jq .

echo "=== Seed complete ==="
```

### F.3 Scénario de répétition

Répéter le scénario de démo (section 2) au moins 2 fois sur l'environnement de production avant vendredi :

- [ ] Connexion admin → dashboard charge en < 2s
- [ ] Génération campus-wide pour la semaine du 2026-04-27 → succès (taux > 70%)
- [ ] Visualiser l'EDT → grille 6 jours visible avec créneaux
- [ ] Résoudre un conflit → marque comme RESOLU
- [ ] Publier l'EDT
- [ ] Générer un rapport PDF → téléchargement réel
- [ ] Connexion enseignant → voir son planning
- [ ] Saisir une exception de disponibilité
- [ ] Exporter en iCal

**Identifier les écrans de chargement trop longs** (> 3s) et les mettre en cache ou optimiser.

---

## 9. Phase G (Optionnel) — UI/UX Premium

> **Priorité** : 🟡 OPTIONNEL — à faire seulement si les Phases A-F sont toutes terminées et stables
> **Effort** : Variable (8-20h selon périmètre)
> **Outil** : Skill `frontend-design` installé + Claude Design pour génération de composants

### Approche recommandée

**Ne pas refaire toute l'UI.** Cibler les écrans clés de la démo :
1. **Admin Dashboard** — La première impression. Cartes KPI premium, graphiques propres.
2. **Schedule Viewer** — Le cœur fonctionnel. Grille EDT visuellement soignée.
3. **Report Page** — PDF et statistiques. Doit sembler professionnel.

**Ce qui ne change pas** : navigation, formulaires CRUD (Enseignants, Cours, Salles) — suffisamment corrects.

### Principes de design à respecter

- Palette : dark sidebar (#1e293b) + fond blanc ou gris très clair (#f8fafc)
- Typographie : Inter ou Geist (déjà sous Angular Material)
- Cards avec shadow légère, border-radius 12px
- Tableaux avec hover state et row striping
- États de chargement avec skeleton screens (pas de spinners seuls)
- Transitions courtes (150-200ms) sur les interactions clés

### Priorité des composants à refondre

| Composant | Impact démo | Effort |
|-----------|------------|--------|
| Admin Dashboard (KPI cards + chart) | ⭐⭐⭐ | ~3h |
| Schedule Viewer (grille EDT) | ⭐⭐⭐ | ~4h |
| Login page | ⭐⭐ | ~2h |
| Report page | ⭐⭐ | ~2h |
| Teacher Dashboard | ⭐ | ~2h |

---

## 10. Tableau de bord des priorités

### Ordre d'exécution recommandé pour 48h

```
Mercredi 14h → Jeudi 14h (24h — backend et infra)
├── Phase D.2 + D.3 : Corrections ports BD + RabbitMQ/Redis Docker   ~30min
├── Phase A : Report Service complet                                   ~3h
├── Phase B : Overrides hebdo (vérification + complétion)             ~2h
├── Phase D.1 : Secrets .env                                           ~1h
├── Phase D.4-D.7 : Sécurité/perf baseline                           ~1h30
└── Phase E : Déploiement VPS                                          ~4h

Jeudi 14h → Vendredi 8h (18h — frontend et finition)
├── Phase C.1 : Statistics component                                   ~2h
├── Phase C.2 : Dashboard chart                                        ~1h
├── Phase C.3 : Settings page minimale                                 ~1h
├── Phase F : Seed + répétition démo                                   ~2h
└── Phase G (si temps) : UI Premium sur Dashboard + Viewer            ~4-6h

Vendredi 8h → Présentation
└── Buffer répétition et correction des bugs détectés
```

### Résumé par criticité

| Phase | Contenu | Effort | Bloquant démo |
|-------|---------|--------|--------------|
| **D.2+D.3** | Ports BD + hosts Docker | 30min | Oui (démarrage) |
| **A** | Report Service câblage | 3h | Oui (rapport PDF) |
| **B** | Overrides enseignant | 2h | Oui (démo enseignant) |
| **D** | Sécurité/perf baseline | 3h | Oui (déploiement) |
| **E** | Déploiement VPS | 4h | Oui (démo live) |
| **C** | Frontend stubs | 4h | Partiellement |
| **F** | Seed + répétition | 2h | Oui (données démo) |
| **G** | UI Premium | 8-20h | Non |

**Total minimum garanti** : ~18-19h de travail effectif
**Marge** : ~29h disponibles → ~10h de buffer pour imprévus et Phase G

---

## Annexe — Fichiers clés par phase

| Phase | Fichiers principaux |
|-------|-------------------|
| A | `report-service/.../ReportService.java`, `ExportService.java`, `KPIService.java`, `client/UserServiceClient.java`, `client/BookingServiceClient.java` |
| B | `user-service/.../AvailabilityServiceImpl.java`, `InternalAvailabilityController.java`, `planning-service/.../UserServiceClient.java`, `teacher-availability.component.ts` |
| C | `admin/statistics/statistics.component.ts`, `admin/dashboard/dashboard.component.ts`, `admin/settings/settings.component.ts` |
| D | Tous les `application.yaml` + `application-docker.yaml`, `docker-compose.yml`, `.env`, `UserController.java` |
| E | `docker-compose.prod.yml`, `nginx.conf`, `scripts/deploy.sh`, `timely-frontend/src/environments/environment.prod.ts` |
| F | `docs/seed/*.sql`, `scripts/seed-all.sh` |
