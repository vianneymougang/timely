# Plan d'Implémentation Global - Entités & CRUD

> **Date** : 08/02/2026
> **Projet** : Timely - Gestion des emplois du temps universitaires (IUSJC)
> **Objectif** : Implémenter toutes les entités et opérations CRUD conformément à la modélisation

---

## 1. État actuel du projet

| Service | Package | Port | Status | Détail |
|---------|---------|------|--------|--------|
| config-server | `com.timely.configserver` | 8888 | ✅ Complet | Config centralisée |
| discovery-server | `com.timely.discoveryserver` | 8761 | ✅ Complet | Eureka |
| api-gateway | `com.timely.apigateway` | 8090 | ✅ Complet | Routage + CORS |
| auth-service | `com.timely.authservice` | 8091 | ✅ Complet | User/Role/Token/PasswordReset |
| user-service | `com.timely.userservice` | 8092 | ✅ Complet | User/Teacher/Admin/Disponibilité |
| **booking-service** | `com.timely.bookingservice` | 8094 | ✅ Complet | 11 entités + CRUD complet |
| **planning-service** | `com.timely.planningservice` | 8093 | ✅ Complet | EmploiDuTemps/Creneau/Conflit + détection conflits |
| **notification-service** | `com.timely.notificationservice` | 8095 | 🔶 Partiel | Event listeners RabbitMQ, email |
| **report-service** | `com.timely.reportservice` | 8096 | ⬜ Scaffolding | Application class + configs |
| **agora-service** | `com.timely.agora_ervice` | 8097 | ⬜ Scaffolding | Application class + configs (typo package) |

### Conventions établies (héritées du user-service)
- **Entités** : UUID PK (`GenerationType.AUTO`), Lombok (`@Getter @Setter @NoArgsConstructor`), Jakarta Validation
- **Repositories** : `JpaRepository<Entity, UUID>`
- **Services** : `@Service @RequiredArgsConstructor`, `@Transactional` / `@Transactional(readOnly = true)`
- **Controllers** : `@RestController`, `@PreAuthorize`, `@Valid`, `ResponseEntity`
- **Mappers** : MapStruct (`componentModel = "spring"`, `unmappedTargetPolicy = IGNORE`)
- **Migrations** : Flyway (`V1__init.sql`)
- **Références inter-services** : ID seul (UUID) + Feign pour résolution à la demande
- **Sécurité** : JWT partagé via config-server, `JwtUtil` + `JwtAuthenticationFilter` par service

---

## 2. Ordre global d'implémentation des services

```
1. BOOKING-SERVICE    (entités de référence : Ecole, Filiere, Salle, Cours, etc.)
       ↓
2. PLANNING-SERVICE   (dépend de booking-service via Feign pour Cours, Salle, Reservation)
       ↓
3. NOTIFICATION-SERVICE  (consomme événements de booking + planning via RabbitMQ)
       ↓
4. REPORT-SERVICE     (lit les données de booking + planning + user via Feign)
       ↓
5. AGORA-SERVICE      (exporte les emplois du temps de planning via Feign)
```

> **Justification** : Le booking-service contient les données maîtres (écoles, salles, cours) dont tous les autres services dépendent. Le planning-service orchestre ces données. Les services notification, report et agora sont des consommateurs.

---

# SERVICE 1 : BOOKING-SERVICE

## 2.1 Entités (11 entités + 10 enums)

### Structure académique

| Entité | Table | Attributs clés | Relations |
|--------|-------|----------------|-----------|
| **Ecole** | `ecoles` | nom, code (unique), adresse, telephone, email, contactResponsable | 1:N Filiere, 1:N Salle, 1:N Evenement |
| **Filiere** | `filieres` | nom, code (unique), description, ecole_id (FK) | N:1 Ecole, 1:N Classe, 1:N UE |
| **Classe** | `classes` | niveau (enum), code (unique), effectif, anneeAcademique, filiere_id (FK) | N:1 Filiere, 1:N Cours |
| **Etudiant** | `etudiants` | matricule (unique), nom, prenom, email, telephone, dateInscription, classe_id (FK) | N:1 Classe |
| **UE** | `unites_enseignement` | code (unique), intitule, creditEcts, volumeHoraireTotal, description, filiere_id (FK) | N:1 Filiere, 1:N Cours |
| **Cours** | `cours` | intitule, typeCours (enum), volumeHoraire, effectifGroupe, description, statut, ue_id (FK), classe_id (FK), enseignantId (ext. UUID) | N:1 UE, N:1 Classe, 1:N GroupeEtudiant, 1:N Reservation |

### Salles & Équipements

| Entité | Table | Attributs clés | Relations |
|--------|-------|----------------|-----------|
| **Salle** | `salles` | numero, nom, typeSalle (enum), capacite, superficieM2, batiment, etage, statut (enum), ecole_id (FK) | N:1 Ecole, M:N Equipement, 1:N Reservation |
| **Equipement** | `equipements` | nom, code (unique), description, quantiteDisponible | M:N Salle |

### Groupes, Réservations & Événements

| Entité | Table | Attributs clés | Relations |
|--------|-------|----------------|-----------|
| **GroupeEtudiant** | `groupes_etudiants` | numeroGroupe, effectif, typeGroupe (enum), cours_id (FK) | N:1 Cours, M:N Etudiant |
| **Reservation** | `reservations` | dateReservation, heureDebut, heureFin, jourSemaine, recurrence (enum), statut (enum), cours_id, salle_id, groupeEtudiant_id (FK), enseignantId (ext.) | N:1 Cours, N:1 Salle, N:1 GroupeEtudiant |
| **Evenement** | `evenements` | titre, typeEvenement (enum), description, dateDebut, dateFin, heureDebut, heureFin, priorite, statut (enum), ecole_id (FK) | N:1 Ecole |

### Enums

| Enum | Valeurs |
|------|---------|
| `Niveau` | L1, L2, L3, M1, M2 |
| `TypeCours` | CM, TD, TP |
| `StatutCours` | ACTIF, INACTIF, SUSPENDU |
| `TypeSalle` | AMPHITHEATRE, SALLE_COURS, LABORATOIRE, SALLE_REUNION |
| `StatutSalle` | ACTIVE, MAINTENANCE, FERMEE |
| `TypeGroupe` | SEANCE_COMPLETE, DEMI_GROUPE, TIERS_GROUPE |
| `Recurrence` | UNIQUE, HEBDOMADAIRE, BIHEBDOMADAIRE |
| `StatutReservation` | CONFIRMEE, TEMPORAIRE, ANNULEE |
| `TypeEvenement` | EXAMEN, REUNION, FERMETURE, VACATION, CONGES |
| `StatutEvenement` | PLANIFIE, EN_COURS, TERMINE, ANNULE |

## 2.2 Architecture des packages

```
com.timely.bookingservice/
├── config/          (SecurityConfig, RabbitMQConfig)
├── security/        (JwtUtil, JwtAuthenticationFilter)
├── entity/enums/    (10 enums)
├── entity/          (11 entités JPA)
├── repository/      (11 repositories)
├── dto/request/     (11 request DTOs)
├── dto/response/    (11 response DTOs)
├── mapper/          (11 MapStruct mappers)
├── service/         (11 services)
├── controller/      (11 controllers)
└── exception/       (ResourceNotFoundException, DuplicateResourceException, ConflictException, GlobalExceptionHandler)
```

## 2.3 Endpoints REST (base: `/api/bookings`)

| Ressource | Endpoints | Auth |
|-----------|-----------|------|
| `/ecoles` | CRUD + GET par id | ADMIN (write), ADMIN+TEACHER (read) |
| `/filieres` | CRUD + GET par ecoleId | ADMIN (write), ADMIN+TEACHER (read) |
| `/classes` | CRUD + GET par filiereId | ADMIN (write), ADMIN+TEACHER (read) |
| `/etudiants` | CRUD + GET par classeId | ADMIN |
| `/ues` | CRUD + GET par filiereId | ADMIN (write), ADMIN+TEACHER (read) |
| `/cours` | CRUD + GET par ueId/classeId | ADMIN (write), ADMIN+TEACHER (read) |
| `/salles` | CRUD + GET par ecoleId + GET disponibles | ADMIN (write), ADMIN+TEACHER (read) |
| `/equipements` | CRUD | ADMIN |
| `/groupes` | CRUD + GET par coursId + gestion étudiants | ADMIN (write), ADMIN+TEACHER (read) |
| `/reservations` | CRUD + GET par salleId | ADMIN (write), ADMIN+TEACHER (read) |
| `/evenements` | CRUD + GET par ecoleId | ADMIN (write), ADMIN+TEACHER (read) |

## 2.4 Validations métier

- Unicité des codes (école, filière, UE, équipement) et matricules (étudiant)
- Capacité salle >= effectif groupe lors d'une réservation
- Compatibilité type salle / type cours (CM→AMPHI/SALLE_COURS, TD→SALLE_COURS, TP→LABO)
- Pas de chevauchement horaire sur une même salle (réservation)
- Volume horaire et crédits ECTS > 0

## 2.5 Phases d'implémentation booking-service

| Phase | Contenu | Fichiers | Complexité |
|-------|---------|----------|------------|
| B1 | Config, Security, Exceptions, Enums, Migration Flyway | ~15 | Moyenne |
| B2 | Ecole + Equipement (entités racines) | ~12 | Faible |
| B3 | Filiere + Salle + Evenement (dépendent d'Ecole) | ~18 | Moyenne |
| B4 | Classe + UE (dépendent de Filière) | ~12 | Faible |
| B5 | Etudiant + Cours (dépendent de Classe/UE) | ~12 | Moyenne |
| B6 | GroupeEtudiant (dépend de Cours, M:N Etudiant) | ~6 | Moyenne |
| B7 | Reservation (validations métier avancées) | ~6 | Élevée |
| **Total** | | **~81** | |

---

# SERVICE 2 : PLANNING-SERVICE

## 3.1 Entités (3 entités + 5 enums)

| Entité | Table | Attributs clés | Relations |
|--------|-------|----------------|-----------|
| **EmploiDuTemps** | `emplois_du_temps` | ecoleId (ext.), dateDebut, dateFin, periode (enum), statut (enum), dateCreation, datePublication, utilisateurValidation, notes | 1:N Creneau, 1:N Conflit |
| **Creneau** | `creneaux` | jourSemaine, heureDebut, heureFin, dateCreneau, typeRecurrence (enum), statutCreneau (enum), emploi_id (FK), reservationId (ext.), enseignantId (ext.), salleId (ext.), groupeId (ext.), coursId (ext.) | N:1 EmploiDuTemps |
| **Conflit** | `conflits` | typeConflit (enum), description, severite (enum), suggestionResolution (JSON), statutResolution (enum), dateDetection, dateResolution, emploi_id (FK), reservation1Id (ext.), reservation2Id (ext.) | N:1 EmploiDuTemps |

### Enums

| Enum | Valeurs |
|------|---------|
| `PeriodeEmploi` | SEMAINE, MOIS, TRIMESTRE, SEMESTRE |
| `StatutEmploi` | BROUILLON, VALIDE, PUBLIE |
| `TypeConflit` | ENSEIGNANT_OCCUPE, SALLE_OCCUPEE, GROUPE_OCCUPE, CAPACITE_INSUFFISANTE, EQUIPEMENTS_MANQUANTS, CHEVAUCHEMENT_DISPONIBILITE |
| `Severite` | CRITIQUE, MAJEURE, MINEURE |
| `StatutResolution` | NON_RESOLU, EN_COURS, RESOLU |
| `TypeRecurrence` | UNIQUE, HEBDOMADAIRE |
| `StatutCreneau` | ACTIF, ANNULE, REPORTE |

## 3.2 Architecture des packages

```
com.timely.planningservice/
├── config/          (SecurityConfig, RabbitMQConfig)
├── security/        (JwtUtil, JwtAuthenticationFilter)
├── entity/enums/    (7 enums)
├── entity/          (3 entités JPA)
├── repository/      (3 repositories)
├── dto/request/     (3 request DTOs)
├── dto/response/    (3 response DTOs)
├── mapper/          (3 MapStruct mappers)
├── service/         (3 services)
├── controller/      (2 controllers: PlanningController, ConflitController)
├── client/          (Feign clients: BookingServiceClient, UserServiceClient)
├── exception/       (ResourceNotFoundException, GlobalExceptionHandler)
└── event/           (EmploiPublieEvent, ConflitDetecteEvent)
```

## 3.3 Endpoints REST (base: `/api/planning`)

| Ressource | Endpoints | Auth |
|-----------|-----------|------|
| `/plannings` | POST (créer), GET (lister), GET /{id} | ADMIN |
| `/plannings/{id}` | PUT (modifier), DELETE, PUT /validate, PUT /publish | ADMIN |
| `/plannings/{id}/creneaux` | GET (lister), GET /{creneauId}, PUT /{creneauId}, DELETE /{creneauId} | ADMIN (write), ADMIN+TEACHER (read) |
| `/plannings/{id}/conflits` | GET (lister), GET /{conflitId}, PUT /{conflitId}/resolve | ADMIN |
| `/plannings/search` | GET (filtres: ecoleId, dateDebut, dateFin, statut) | ADMIN, TEACHER |

## 3.4 Clients Feign (inter-services)

| Client | Service cible | Méthodes |
|--------|---------------|----------|
| `BookingServiceClient` | booking-service | getCours, getSalle, getReservations, getSallesDisponibles |
| `UserServiceClient` | user-service | getEnseignant, getDisponibilites |

## 3.5 Événements RabbitMQ (publication)

| Événement | Routing key | Consommé par |
|-----------|-------------|--------------|
| `EmploiDuTempsPublieEvent` | `planning.published` | notification-service, agora-service |
| `ConflitDetecteEvent` | `planning.conflict.detected` | notification-service |

## 3.6 Phases d'implémentation planning-service

| Phase | Contenu | Fichiers | Complexité |
|-------|---------|----------|------------|
| P1 | Config, Security, Exceptions, Enums, Migration Flyway | ~12 | Moyenne |
| P2 | Clients Feign (BookingServiceClient, UserServiceClient) | ~2 | Faible |
| P3 | EmploiDuTemps (entité + CRUD complet) | ~6 | Moyenne |
| P4 | Creneau (entité + CRUD, lié à EmploiDuTemps) | ~6 | Moyenne |
| P5 | Conflit (entité + CRUD + résolution) | ~6 | Élevée |
| P6 | Événements RabbitMQ (publication) | ~3 | Faible |
| **Total** | | **~35** | |

---

# SERVICE 3 : NOTIFICATION-SERVICE

## 4.1 Entités (3 entités + 4 enums) — MongoDB Documents

| Entité | Collection | Attributs clés | Relations |
|--------|-----------|----------------|-----------|
| **Notification** | `notifications` | destinataireId (ext.), typeNotification (enum), sujet, contenu, canal (enum), statut (enum), dateCreation, dateEnvoi, dateLecture, tentativesRestantes | N:1 Template (par type) |
| **Template** | `templates` | nom, typeNotification, contenuTemplate, variablesDisponibles (liste), actif, dateCreation, dateModification | 1:N Notification |
| **HistoriqueEnvoi** | `historique_envois` | notificationId (ref), utilisateurId (ext.), canal (enum), statut (enum), timestampEnvoi, timestampLecture, messageErreur, tentativeNumero | N:1 Notification |

### Enums

| Enum | Valeurs |
|------|---------|
| `TypeNotification` | CHANGEMENT_EMPLOI_TEMPS, RAPPEL_COURS, CONFLIT_HORAIRE, NOUVEL_EMPLOI_TEMPS, ANNULATION_COURS, EVENEMENT_A_VENIR |
| `CanalNotification` | EMAIL, SMS, PUSH |
| `StatutNotification` | PENDING, SENT, FAILED, BOUNCED |
| `StatutEnvoi` | ENVOYE, ECHOUE, LU |

## 4.2 Architecture des packages

```
com.timely.notificationservice/
├── config/          (MailConfig [existant], RabbitMQConfig [existant], SecurityConfig)
├── security/        (JwtUtil, JwtAuthenticationFilter)
├── document/enums/  (4 enums)
├── document/        (3 documents MongoDB)
├── repository/      (3 MongoRepository)
├── dto/request/     (SendNotificationRequest, TemplateRequest, ScheduleNotificationRequest)
├── dto/response/    (NotificationResponse, TemplateResponse, HistoriqueResponse)
├── mapper/          (NotificationMapper, TemplateMapper)
├── service/         (NotificationService, TemplateService, EmailService [existant])
├── controller/      (NotificationController, TemplateController)
├── listener/        (UserCreatedEventListener [existant], PasswordResetEventListener [existant], PlanningEventListener [nouveau])
└── exception/       (ResourceNotFoundException, GlobalExceptionHandler)
```

> **Note** : Ce service utilise MongoDB (`@Document`) au lieu de JPA (`@Entity`). Les repositories étendent `MongoRepository`.

## 4.3 Endpoints REST (base: `/api/notifications`)

| Ressource | Endpoints | Auth |
|-----------|-----------|------|
| `/notifications/send` | POST (envoi unitaire) | ADMIN |
| `/notifications/send-bulk` | POST (envoi groupé) | ADMIN |
| `/notifications/schedule` | POST (envoi différé) | ADMIN |
| `/notifications/{id}/status` | GET (statut) | ADMIN |
| `/notifications/historique` | GET (historique, filtres) | ADMIN |
| `/templates` | CRUD complet | ADMIN |

## 4.4 Événements RabbitMQ (consommation)

| Événement | Queue | Action |
|-----------|-------|--------|
| `UserCreatedEvent` | `user.created.queue` | Envoi email de bienvenue [existant] |
| `PasswordResetEvent` | `password.reset.queue` | Envoi email reset [existant] |
| `EmploiDuTempsPublieEvent` | `planning.published.queue` | Envoi notification emploi publié [nouveau] |
| `ConflitDetecteEvent` | `planning.conflict.queue` | Envoi alerte conflit aux admins [nouveau] |

## 4.5 Phases d'implémentation notification-service

| Phase | Contenu | Fichiers | Complexité |
|-------|---------|----------|------------|
| N1 | Security + Enums + Documents MongoDB | ~10 | Moyenne |
| N2 | Repositories + DTOs + Mappers | ~8 | Faible |
| N3 | Template (CRUD complet) | ~4 | Faible |
| N4 | Notification (envoi + historique + suivi) | ~6 | Moyenne |
| N5 | Nouveaux listeners RabbitMQ (planning events) | ~3 | Faible |
| **Total** | | **~31** | |

---

# SERVICE 4 : REPORT-SERVICE

## 5.1 Entités (3 entités + 3 enums)

| Entité | Table | Attributs clés | Relations |
|--------|-------|----------------|-----------|
| **Rapport** | `rapports` | typeRapport (enum), titre, description, dateGeneration, dateDebut, dateFin, ecoleId (ext.), format (enum), cheminFichier, utilisateurCreateur, parametresRapport (JSON) | 1:N Export |
| **KPIHistorique** | `kpi_historique` | date, nomKpi, valeur, unite, periode, detailJson (JSON) | — |
| **Export** | `exports` | rapport_id (FK), format (enum), dateExport, utilisateur, cheminFichier, statut (enum) | N:1 Rapport |

### Enums

| Enum | Valeurs |
|------|---------|
| `TypeRapport` | UTILISATION_SALLES, CHARGE_ENSEIGNANTS, CONFLITS, REPARTITION_COURS, EVENEMENTS, AUDIT |
| `FormatExport` | PDF, EXCEL, CSV |
| `StatutExport` | EN_COURS, TERMINE, ECHOUE |

## 5.2 Architecture des packages

```
com.timely.reportservice/
├── config/          (SecurityConfig)
├── security/        (JwtUtil, JwtAuthenticationFilter)
├── entity/enums/    (3 enums)
├── entity/          (3 entités JPA)
├── repository/      (3 repositories)
├── dto/request/     (GenerateReportRequest)
├── dto/response/    (RapportResponse, KPIResponse, ExportResponse, DashboardResponse)
├── mapper/          (RapportMapper, ExportMapper)
├── service/         (ReportService, KPIService, ExportService)
├── controller/      (ReportController)
├── client/          (BookingServiceClient, UserServiceClient, PlanningServiceClient)
└── exception/       (ResourceNotFoundException, GlobalExceptionHandler)
```

## 5.3 Endpoints REST (base: `/api/reports`)

| Ressource | Endpoints | Auth |
|-----------|-----------|------|
| `/reports/dashboard` | GET (KPIs résumés) | ADMIN |
| `/reports/generate` | POST (générer un rapport) | ADMIN |
| `/reports/{id}` | GET (détail rapport) | ADMIN |
| `/reports/{id}/download` | GET (télécharger fichier) | ADMIN |
| `/reports/statistics/salles` | GET (stats utilisation salles) | ADMIN |
| `/reports/statistics/enseignants` | GET (stats charge enseignants) | ADMIN |
| `/reports/statistics/cours` | GET (stats répartition cours) | ADMIN |
| `/reports/types` | GET (types de rapports disponibles) | ADMIN |

## 5.4 Clients Feign

| Client | Service cible | Méthodes |
|--------|---------------|----------|
| `BookingServiceClient` | booking-service | getSalles, getReservations, getCours, getEtudiants |
| `UserServiceClient` | user-service | getEnseignants, getChargeHoraire |
| `PlanningServiceClient` | planning-service | getPlannings, getConflits |

## 5.5 Phases d'implémentation report-service

| Phase | Contenu | Fichiers | Complexité |
|-------|---------|----------|------------|
| R1 | Config, Security, Exceptions, Enums, Migration Flyway | ~10 | Moyenne |
| R2 | Clients Feign (3 clients) | ~3 | Faible |
| R3 | Rapport + Export (entités + CRUD) | ~12 | Moyenne |
| R4 | KPIHistorique + Dashboard | ~6 | Moyenne |
| R5 | Génération PDF/Excel (POI + Flying Saucer) | ~4 | Élevée |
| **Total** | | **~35** | |

---

# SERVICE 5 : AGORA-SERVICE

## 6.1 Entités (3 entités + 3 enums)

> **Note** : Le package actuel a un typo (`agora_ervice`). À corriger en `agora_service` avant l'implémentation.

| Entité | Table | Attributs clés | Relations |
|--------|-------|----------------|-----------|
| **ExportAgora** | `exports_agora` | emploiDuTempsId (ext.), dateExport, format (enum), statut (enum), numeroTentative, messageErreur, reponseAgora (JSON), dateDerniereTentative | 1:N LogIntegration |
| **MappingEntites** | `mapping_entites` | entiteLocaleType, entiteLocaleId, entiteAgoraId, typeMapping, dateCreation, dateModification | — |
| **LogIntegration** | `logs_integration` | export_agora_id (FK), typeLog (enum), message, timestamp, stackTrace | N:1 ExportAgora |

### Enums

| Enum | Valeurs |
|------|---------|
| `FormatExportAgora` | JSON, XML |
| `StatutExportAgora` | EN_ATTENTE, ENVOYE, ECHEC, CONFIRME |
| `TypeLog` | INFO, WARN, ERROR |

## 6.2 Architecture des packages

```
com.timely.agoraservice/   (package corrigé)
├── config/          (SecurityConfig, RabbitMQConfig)
├── security/        (JwtUtil, JwtAuthenticationFilter)
├── entity/enums/    (3 enums)
├── entity/          (3 entités JPA)
├── repository/      (3 repositories)
├── dto/request/     (ExportRequest, MappingRequest)
├── dto/response/    (ExportAgoraResponse, MappingResponse, LogResponse)
├── mapper/          (ExportAgoraMapper, MappingMapper)
├── service/         (ExportAgoraService, MappingService, LogIntegrationService)
├── controller/      (AgoraController)
├── client/          (PlanningServiceClient)
├── listener/        (PlanningEventListener — consomme EmploiValideEvent)
└── exception/       (ResourceNotFoundException, GlobalExceptionHandler)
```

## 6.3 Endpoints REST (base: `/api/agora`)

| Ressource | Endpoints | Auth |
|-----------|-----------|------|
| `/agora/export/emploi-du-temps/{id}` | POST (exporter un emploi) | ADMIN |
| `/agora/exports/historique` | GET (historique exports) | ADMIN |
| `/agora/exports/{id}` | GET (détail export) | ADMIN |
| `/agora/mappings` | CRUD (gestion des mappings) | ADMIN |
| `/agora/logs` | GET (logs d'intégration, filtres) | ADMIN |
| `/agora/sync/status` | GET (statut synchronisation) | ADMIN |
| `/agora/health` | GET (test connexion Agora) | ADMIN |

## 6.4 Événements RabbitMQ (consommation)

| Événement | Queue | Action |
|-----------|-------|--------|
| `EmploiDuTempsPublieEvent` | `agora.planning.published.queue` | Déclenche export automatique vers Agora |

## 6.5 Phases d'implémentation agora-service

| Phase | Contenu | Fichiers | Complexité |
|-------|---------|----------|------------|
| A0 | Correction typo package `agora_ervice` → `agora_service` | ~2 | Faible |
| A1 | Config, Security, Exceptions, Enums, Migration Flyway | ~10 | Moyenne |
| A2 | Client Feign (PlanningServiceClient) | ~1 | Faible |
| A3 | ExportAgora + LogIntegration (entités + CRUD) | ~10 | Moyenne |
| A4 | MappingEntites (CRUD) | ~6 | Faible |
| A5 | Listener RabbitMQ + logique d'export | ~3 | Moyenne |
| **Total** | | **~32** | |

---

## 7. Résumé global

| Service | Entités | Enums | Fichiers estimés | Priorité |
|---------|---------|-------|------------------|----------|
| booking-service | 11 | 10 | ~81 | 1 (Core) |
| planning-service | 3 | 7 | ~35 | 2 |
| notification-service | 3 | 4 | ~31 | 3 |
| report-service | 3 | 3 | ~35 | 4 |
| agora-service | 3 | 3 | ~32 | 5 |
| **TOTAL** | **23** | **27** | **~214** | |

---

## 8. Dépendances inter-services (Feign)

```
booking-service  ←── planning-service (getCours, getSalle, getReservations)
                 ←── report-service (getSalles, getReservations, getCours, getEtudiants)

user-service     ←── planning-service (getEnseignant, getDisponibilites)
                 ←── report-service (getEnseignants, getChargeHoraire)

planning-service ←── report-service (getPlannings, getConflits)
                 ←── agora-service (getEmploiDuTemps)
```

## 9. Événements RabbitMQ (flux complet)

```
user-service ──→ [user.created] ──→ notification-service
auth-service ──→ [password.reset] ──→ notification-service
planning-service ──→ [planning.published] ──→ notification-service + agora-service
planning-service ──→ [planning.conflict.detected] ──→ notification-service
```
