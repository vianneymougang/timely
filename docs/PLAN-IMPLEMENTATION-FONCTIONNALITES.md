# Plan d'Implémentation des Fonctionnalités - Timely

> **Date** : 09/02/2026
> **Projet** : Timely - Gestion des emplois du temps universitaires (IUSJC)
> **Objectif** : Implémenter toutes les fonctionnalités métier manquantes pour un système complet
> **Prérequis** : Tous les microservices sont setup, toutes les entités et opérations CRUD sont en place

---

## 1. Bilan de l'existant

### Services 100% complets (CRUD + logique métier)
| Service | Statut | Détail |
|---------|--------|--------|
| config-server | ✅ Complet | Config centralisée native |
| discovery-server | ✅ Complet | Eureka Server |
| notification-service | ✅ Complet | Send/bulk/schedule, templates, RabbitMQ listeners, email/SMS/push, Redis |

### Services avec fonctionnalités manquantes
| Service | CRUD | Logique métier | Manques identifiés |
|---------|------|----------------|-------------------|
| api-gateway | ✅ | 🔶 Partiel | Routes 5 services manquantes, rate limiting, circuit breaker |
| auth-service | ✅ | 🔶 Partiel | Blacklist JWT Redis |
| user-service | ✅ | 🔶 Partiel | Charge horaire, affectations enseignant-école/cours |
| booking-service | ✅ | 🔶 Partiel | Auto-assign salle, génération auto groupes |
| planning-service | ✅ | 🔶 Partiel | Algorithme génération emploi du temps, export PDF/iCal |
| report-service | ✅ | 🔶 Partiel | Planification rapports automatiques |
| agora-service | ✅ | 🔶 Partiel | Import étudiants depuis Agora |

---

## 2. Plan d'implémentation par phases

### PHASE 1 : Infrastructure & Sécurité (Priorité CRITIQUE)

> **Objectif** : Sécuriser le système et rendre tous les services accessibles via la gateway

#### F1.1 — API Gateway : Routes complètes
**Service** : `api-gateway`
**Fichiers** : `GatewayConfig.java`, config YAML
**Description** : Ajouter les définitions de routes pour les 5 services manquants
- Route `/api/bookings/**` → booking-service
- Route `/api/planning/**` → planning-service
- Route `/api/notifications/**` → notification-service
- Route `/api/reports/**` → report-service
- Route `/api/agora/**` → agora-service

**Complexité** : Faible
**Dépendances** : Aucune

#### F1.2 — API Gateway : Rate Limiting
**Service** : `api-gateway`
**Fichiers** : `RateLimiterConfig.java`, `application.yaml`
**Description** : Implémenter le rate limiting par IP/utilisateur via Spring Cloud Gateway + Redis
- `RequestRateLimiter` filter avec Redis
- Configuration : 100 requêtes/minute par utilisateur (spec architecture)
- Key resolver par JWT userId ou IP pour requêtes anonymes
**Complexité** : Moyenne
**Dépendances** : Redis

#### F1.3 — API Gateway : Circuit Breaker
**Service** : `api-gateway`
**Fichiers** : `application.yaml`, dépendance `resilience4j`
**Description** : Configurer Resilience4j circuit breaker sur chaque route
- Fallback par défaut retournant 503 Service Unavailable
- Seuil : 5 échecs consécutifs → circuit ouvert pendant 30s
- TimeLimiter : timeout 5s par requête
**Complexité** : Moyenne
**Dépendances** : F1.1

#### F1.4 — Auth Service : Blacklist JWT Redis
**Service** : `auth-service`
**Fichiers** : `RedisConfig.java`, `TokenBlacklistService.java`, `AuthService.java` (modif logout)
**Description** : Implémenter la révocation de tokens via blacklist Redis
- Stocker les tokens révoqués dans Redis avec TTL = durée restante du token
- Modifier `logout()` pour ajouter le token à la blacklist
- Modifier `validate()` pour vérifier la blacklist avant validation
- Le gateway doit vérifier la blacklist lors de la validation JWT
**Complexité** : Moyenne
**Dépendances** : Redis

---

### PHASE 2 : Logique Métier User & Booking (Priorité HAUTE)

> **Objectif** : Compléter les fonctionnalités métier des services fondamentaux

#### F2.1 — User Service : Affectations enseignant-école
**Service** : `user-service`
**Fichiers** : Entité `IntervenirEcole`, repository, service, controller (endpoints `/users/{enseignantId}/ecoles`)
**Description** : Gérer l'affectation des enseignants aux écoles d'intervention
- `POST /users/{enseignantId}/ecoles/{ecoleId}` — Assigner à une école
- `DELETE /users/{enseignantId}/ecoles/{ecoleId}` — Retirer d'une école
- `GET /users/{enseignantId}/ecoles` — Lister les écoles d'un enseignant
- Validation : enseignant existe, pas de doublon d'affectation
**Complexité** : Moyenne
**Dépendances** : Aucune

#### F2.2 — User Service : Affectations enseignant-cours
**Service** : `user-service`
**Fichiers** : Entité `Enseigner`, repository, service, controller (endpoints `/users/{enseignantId}/cours`)
**Description** : Gérer l'affectation des enseignants aux cours
- `POST /users/{enseignantId}/cours/{coursId}` — Assigner à un cours
- `DELETE /users/{enseignantId}/cours/{coursId}` — Retirer d'un cours
- `GET /users/{enseignantId}/cours` — Lister les cours d'un enseignant
- Référence externe `coursId` (UUID) vers booking-service
**Complexité** : Moyenne
**Dépendances** : Aucune

#### F2.3 — User Service : Calcul charge horaire
**Service** : `user-service`
**Fichiers** : `ChargeHoraireService.java`, modif `UserController.java`
**Description** : Calculer la charge horaire annuelle d'un enseignant
- `GET /users/{enseignantId}/charge-horaire` — Retourne le total d'heures
- Appel Feign vers booking-service pour récupérer les cours assignés et leurs volumes horaires
- Agrégation par type de cours (CM, TD, TP) et par semestre
- Retour : `ChargeHoraireResponse` (totalHeures, détail par type, par école)
**Complexité** : Moyenne
**Dépendances** : F2.2, Feign client vers booking-service

#### F2.4 — Booking Service : Assignation automatique de salle
**Service** : `booking-service`
**Fichiers** : `SalleAssignmentService.java`, modif `ReservationController.java`
**Description** : Implémenter l'algorithme d'assignation automatique de salle (Algorithme 2 de la conception)
- `POST /reservations/auto-assign` — Assignation automatique
- Filtrage progressif : disponibilité → type compatible → capacité → équipements
- Optimisation : salle avec capacité la plus proche (minimise gaspillage)
- Retourne la salle optimale ou 404 si aucune trouvée
**Complexité** : Elevée
**Dépendances** : Aucune

#### F2.5 — Booking Service : Génération automatique de groupes
**Service** : `booking-service`
**Fichiers** : modif `GroupeEtudiantService.java`, modif `CoursController.java`
**Description** : Générer automatiquement les groupes d'étudiants pour un cours
- `POST /cours/{id}/groupes/generate` — Génération automatique
- Paramètre : tailleGroupe (optionnel, défaut basé sur typeCours)
- Répartition équitable des étudiants de la classe dans les groupes
- CM → 1 groupe (classe entière), TD → 2 groupes, TP → 3 groupes (configurable)
**Complexité** : Moyenne
**Dépendances** : Aucune

---

### PHASE 3 : Algorithme de Planification (Priorité HAUTE)

> **Objectif** : Implémenter le coeur du système — la génération automatique d'emplois du temps

#### F3.1 — Planning Service : Algorithme de génération d'emploi du temps
**Service** : `planning-service`
**Fichiers** : `PlanningGenerationService.java`, `PlanningGenerationConfig.java`, modif `PlanningController.java`
**Description** : Implémenter l'algorithme heuristique greedy (Algorithme 3 de la conception)
- `POST /plannings/generate` — Générer un emploi du temps automatiquement
- Paramètres : `ecoleId`, `dateDebut`, `dateFin`, `periode`
- Étapes de l'algorithme :
  1. Récupérer tous les cours à planifier (Feign → booking-service)
  2. Trier par priorité (CM > TD > TP, puis volume horaire décroissant)
  3. Pour chaque cours :
     a. Obtenir disponibilités enseignant (Feign → user-service)
     b. Générer créneaux possibles
     c. Pour chaque créneau : trouver salle optimale (Feign → booking-service)
     d. Vérifier conflits (ConflitService existant)
     e. Si pas de conflit → créer réservation + créneau
  4. Retourner emploi avec statistiques (taux réussite, cours non planifiés)
- Statut initial : BROUILLON
**Complexité** : Très élevée
**Dépendances** : F2.4 (auto-assign salle), Feign clients existants

#### F3.2 — Planning Service : Export PDF
**Service** : `planning-service`
**Fichiers** : `PdfExportService.java`, modif `PlanningController.java`
**Description** : Exporter un emploi du temps au format PDF
- `GET /plannings/{id}/export/pdf` — Télécharger PDF
- Utiliser iText / Flying Saucer + Thymeleaf pour le rendu
- Layout : grille semaine (Lundi-Samedi) × créneaux horaires
- Inclure : cours, enseignant, salle, groupe, type
- Dépendance Maven : `flying-saucer-pdf-itext5` ou `openhtmltopdf`
**Complexité** : Elevée
**Dépendances** : Aucune

#### F3.3 — Planning Service : Export iCalendar
**Service** : `planning-service`
**Fichiers** : `ICalExportService.java`, modif `PlanningController.java`
**Description** : Exporter un emploi du temps au format iCalendar (.ics)
- `GET /plannings/{id}/export/ical` — Télécharger fichier .ics
- Utiliser la librairie `ical4j`
- Chaque créneau → un VEVENT avec DTSTART, DTEND, SUMMARY, LOCATION, RRULE
- Compatible Google Calendar, Outlook, Apple Calendar
**Complexité** : Moyenne
**Dépendances** : Aucune

#### F3.4 — Planning Service : Recherche avancée
**Service** : `planning-service`
**Fichiers** : modif `EmploiDuTempsRepository.java`, modif `PlanningController.java`
**Description** : Endpoint de recherche multi-critères
- `GET /plannings/search` — Recherche avec filtres
- Filtres : ecoleId, enseignantId, salleId, groupeId, semaine, statut
- Pagination et tri
- Vue personnalisée par enseignant (filtre automatique sur userId du JWT)
**Complexité** : Moyenne
**Dépendances** : Aucune

---

### PHASE 4 : Fonctionnalités Complémentaires (Priorité MOYENNE)

> **Objectif** : Compléter les services auxiliaires

#### F4.1 — Report Service : Planification de rapports automatiques
**Service** : `report-service`
**Fichiers** : `ReportSchedulerService.java`, entité `ScheduledReport`, modif `ReportController.java`
**Description** : Permettre la planification de rapports récurrents
- `POST /reports/schedule` — Planifier un rapport automatique
- Paramètres : typeRapport, cron expression, destinataires email, format
- Spring `@Scheduled` ou Quartz pour l'exécution
- Envoi automatique du rapport par notification (Feign → notification-service)
**Complexité** : Moyenne
**Dépendances** : Aucune

#### F4.2 — Agora Service : Import étudiants
**Service** : `agora-service`
**Fichiers** : `AgoraImportService.java`, modif `AgoraController.java`, Feign client vers booking-service
**Description** : Importer la liste des étudiants depuis la plateforme Agora
- `POST /agora/import/etudiants` — Déclencher l'import
- Appel API Agora externe pour récupérer les étudiants
- Transformation des données au format interne
- Appel Feign vers booking-service pour créer/mettre à jour les étudiants
- Gestion des doublons (par matricule)
- Logging de l'import dans LogIntegration
**Complexité** : Moyenne
**Dépendances** : Feign client vers booking-service

#### F4.3 — Booking Service : Cache Redis pour disponibilités salles
**Service** : `booking-service`
**Fichiers** : `RedisConfig.java`, `CacheConfig.java`, modif `SalleService.java`
**Description** : Mettre en cache les disponibilités des salles avec Redis
- Cache TTL : 5 minutes (spec architecture)
- Invalidation automatique après création/modification/suppression de réservation
- `@Cacheable` / `@CacheEvict` sur les méthodes de SalleService
**Complexité** : Faible
**Dépendances** : Redis

---

### PHASE 5 : Intégration & Qualité (Priorité MOYENNE)

> **Objectif** : Assurer la cohérence du système et la qualité globale

#### F5.1 — Workflow complet : Publication d'emploi du temps
**Service** : `planning-service` (orchestrateur)
**Description** : Vérifier et compléter le workflow de publication end-to-end
- Publication change statut VALIDE → PUBLIE
- Événement RabbitMQ `planning.published` envoyé (existant)
- notification-service envoie emails/SMS aux enseignants (existant)
- agora-service déclenche export automatique (existant)
- **Vérifier** que le flux complet fonctionne de bout en bout
**Complexité** : Moyenne (intégration)
**Dépendances** : F3.1, F1.1

#### F5.2 — Gestion d'erreurs inter-services
**Service** : Tous les services avec Feign clients
**Fichiers** : `FeignErrorDecoder.java` (par service), `FallbackFactory` classes
**Description** : Implémenter la gestion d'erreurs robuste pour les appels Feign
- Fallback factories pour chaque Feign client
- Circuit breaker Resilience4j sur les appels critiques
- Retry automatique (max 3 tentatives, délai exponentiel)
- Logging des erreurs inter-services
**Complexité** : Moyenne
**Dépendances** : Aucune

#### F5.3 — Audit Trail
**Service** : `report-service` ou transversal
**Fichiers** : `AuditService.java`, `AuditEvent.java`, table `historique_modifications`
**Description** : Traçabilité des actions critiques (spec architecture)
- Intercepteur Spring AOP pour capturer les actions CRUD
- Événements : CREATE, UPDATE, DELETE sur entités critiques
- Stockage : utilisateur, type action, timestamp, valeur avant/après (JSON)
- Endpoints de consultation dans report-service
**Complexité** : Elevée
**Dépendances** : Aucune

---

## 3. Récapitulatif & Priorisation

### Vue d'ensemble par phase

| Phase | Nb features | Complexité globale | Services impactés |
|-------|-------------|-------------------|-------------------|
| **Phase 1** : Infra & Sécurité | 4 | Moyenne | api-gateway, auth-service |
| **Phase 2** : Métier User & Booking | 5 | Moyenne-Haute | user-service, booking-service |
| **Phase 3** : Planification | 4 | Très haute | planning-service |
| **Phase 4** : Compléments | 3 | Moyenne | report-service, agora-service, booking-service |
| **Phase 5** : Intégration & Qualité | 3 | Moyenne-Haute | Transversal |

### Ordre d'implémentation recommandé

```
Phase 1 (F1.1 → F1.2 → F1.3 → F1.4)
    ↓
Phase 2 (F2.1 → F2.2 → F2.3 en parallèle avec F2.4 → F2.5)
    ↓
Phase 3 (F3.1 → F3.2 + F3.3 + F3.4 en parallèle)
    ↓
Phase 4 (F4.1 + F4.2 + F4.3 en parallèle)
    ↓
Phase 5 (F5.1 → F5.2 → F5.3)
```

### Graphe de dépendances

```
F1.1 (Routes Gateway)
 └─→ F1.3 (Circuit Breaker)
 └─→ F5.1 (Workflow E2E)

F2.1 (Affectation école) ──→ F2.3 (Charge horaire)
F2.2 (Affectation cours) ──→ F2.3 (Charge horaire)
F2.4 (Auto-assign salle) ──→ F3.1 (Algo génération)

F3.1 (Algo génération) ──→ F5.1 (Workflow E2E)
```

---

## 4. Détail des fichiers à créer/modifier par service

### api-gateway
| Action | Fichier |
|--------|---------|
| Modifier | `GatewayConfig.java` — ajouter 5 routes |
| Créer | `RateLimiterConfig.java` — config rate limiting |
| Modifier | `application.yaml` — circuit breaker, rate limiter |
| Ajouter dep. | `spring-boot-starter-data-redis-reactive`, `resilience4j-spring-cloud2` |

### auth-service
| Action | Fichier |
|--------|---------|
| Créer | `config/RedisConfig.java` |
| Créer | `service/TokenBlacklistService.java` |
| Modifier | `service/AuthService.java` — logout + validate |
| Ajouter dep. | `spring-boot-starter-data-redis` |

### user-service
| Action | Fichier |
|--------|---------|
| Créer | `entity/IntervenirEcole.java` |
| Créer | `entity/Enseigner.java` |
| Créer | `repository/IntervenirEcoleRepository.java` |
| Créer | `repository/EnseignerRepository.java` |
| Créer | `service/AffectationService.java` |
| Créer | `service/ChargeHoraireService.java` |
| Créer | `client/BookingServiceClient.java` (Feign) |
| Créer | `dto/response/ChargeHoraireResponse.java` |
| Modifier | `controller/UserController.java` — nouveaux endpoints |
| Créer | Migration Flyway `V2__add_affectations.sql` |

### booking-service
| Action | Fichier |
|--------|---------|
| Créer | `service/SalleAssignmentService.java` |
| Modifier | `controller/ReservationController.java` — endpoint auto-assign |
| Modifier | `service/GroupeEtudiantService.java` — génération auto |
| Modifier | `controller/CoursController.java` — endpoint generate groupes |
| Créer | `config/RedisConfig.java` |
| Créer | `config/CacheConfig.java` |
| Modifier | `service/SalleService.java` — annotations cache |
| Ajouter dep. | `spring-boot-starter-data-redis`, `spring-boot-starter-cache` |

### planning-service
| Action | Fichier |
|--------|---------|
| Créer | `service/PlanningGenerationService.java` |
| Créer | `service/PdfExportService.java` |
| Créer | `service/ICalExportService.java` |
| Modifier | `controller/PlanningController.java` — endpoints generate, export, search |
| Modifier | `repository/EmploiDuTempsRepository.java` — queries search |
| Ajouter dep. | `openhtmltopdf-pdfbox`, `ical4j`, `thymeleaf` |

### report-service
| Action | Fichier |
|--------|---------|
| Créer | `entity/ScheduledReport.java` |
| Créer | `repository/ScheduledReportRepository.java` |
| Créer | `service/ReportSchedulerService.java` |
| Modifier | `controller/ReportController.java` — endpoint schedule |
| Créer | Migration Flyway `V2__add_scheduled_reports.sql` |

### agora-service
| Action | Fichier |
|--------|---------|
| Créer | `service/AgoraImportService.java` |
| Créer | `client/BookingServiceClient.java` (Feign) |
| Créer | `dto/request/ImportEtudiantsRequest.java` |
| Modifier | `controller/AgoraController.java` — endpoint import |

---

## 5. Critères de validation par phase

### Phase 1 — Validée si :
- [ ] Toutes les routes gateway fonctionnent (curl vers chaque service)
- [ ] Rate limiting bloque après 100 req/min
- [ ] Circuit breaker s'ouvre après 5 échecs
- [ ] Logout invalide le token (blacklist Redis)

### Phase 2 — Validée si :
- [ ] Affectation enseignant-école CRUD fonctionnel
- [ ] Affectation enseignant-cours CRUD fonctionnel
- [ ] Charge horaire calculée correctement
- [ ] Auto-assign retourne la salle optimale
- [ ] Génération auto de groupes répartit équitablement

### Phase 3 — Validée si :
- [ ] `POST /plannings/generate` produit un emploi du temps sans conflits
- [ ] Taux de réussite > 80% pour un jeu de données nominal
- [ ] Export PDF lisible avec grille semaine
- [ ] Export iCal importable dans Google Calendar
- [ ] Recherche multi-critères retourne les bons résultats

### Phase 4 — Validée si :
- [ ] Rapport planifié s'exécute automatiquement
- [ ] Import étudiants Agora crée les étudiants dans booking-service
- [ ] Cache Redis réduit les temps de réponse sur disponibilités salles

### Phase 5 — Validée si :
- [ ] Publication E2E : planification → validation → publication → notifications → export Agora
- [ ] Fallbacks Feign fonctionnent quand un service est down
- [ ] Audit trail enregistre les actions critiques

---

**FIN DU DOCUMENT — Plan d'Implémentation des Fonctionnalités Timely**

*Version : 1.0 | Date : 09/02/2026*
