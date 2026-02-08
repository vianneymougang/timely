# Checklist d'Implémentation - Entités & CRUD

> Cocher `[x]` au fur et à mesure de l'avancement

---

## BOOKING-SERVICE (`com.timely.bookingservice`)

### Phase B1 : Fondations
- [x] SecurityConfig (JWT filter chain, CORS, endpoint rules)
- [x] JwtUtil (extraction claims, validation token)
- [x] JwtAuthenticationFilter (OncePerRequestFilter)
- [x] GlobalExceptionHandler (@RestControllerAdvice)
- [x] ResourceNotFoundException
- [x] DuplicateResourceException
- [x] ConflictException
- [x] Enum : Niveau
- [x] Enum : TypeCours
- [x] Enum : StatutCours
- [x] Enum : TypeSalle
- [x] Enum : StatutSalle
- [x] Enum : TypeGroupe
- [x] Enum : Recurrence
- [x] Enum : StatutReservation
- [x] Enum : TypeEvenement
- [x] Enum : StatutEvenement
- [x] Migration Flyway V1__create_booking_schema.sql

### Phase B2 : Ecole + Equipement
- [x] Entité Ecole
- [x] EcoleRepository
- [x] EcoleRequest DTO
- [x] EcoleResponse DTO
- [x] EcoleMapper
- [x] EcoleService
- [x] EcoleController
- [x] Entité Equipement
- [x] EquipementRepository
- [x] EquipementRequest DTO
- [x] EquipementResponse DTO
- [x] EquipementMapper
- [x] EquipementService
- [x] EquipementController

### Phase B3 : Filiere + Salle + Evenement
- [x] Entité Filiere
- [x] FiliereRepository
- [x] FiliereRequest DTO
- [x] FiliereResponse DTO
- [x] FiliereMapper
- [x] FiliereService
- [x] FiliereController
- [x] Entité Salle (+ relation M:N Equipement)
- [x] SalleRepository
- [x] SalleRequest DTO
- [x] SalleResponse DTO
- [x] SalleMapper
- [x] SalleService
- [x] SalleController
- [x] Entité Evenement
- [x] EvenementRepository
- [x] EvenementRequest DTO
- [x] EvenementResponse DTO
- [x] EvenementMapper
- [x] EvenementService
- [x] EvenementController

### Phase B4 : Classe + UE
- [x] Entité Classe
- [x] ClasseRepository
- [x] ClasseRequest DTO
- [x] ClasseResponse DTO
- [x] ClasseMapper
- [x] ClasseService
- [x] ClasseController
- [x] Entité UE
- [x] UERepository
- [x] UERequest DTO
- [x] UEResponse DTO
- [x] UEMapper
- [x] UEService
- [x] UEController

### Phase B5 : Etudiant + Cours
- [x] Entité Etudiant
- [x] EtudiantRepository
- [x] EtudiantRequest DTO
- [x] EtudiantResponse DTO
- [x] EtudiantMapper
- [x] EtudiantService
- [x] EtudiantController
- [x] Entité Cours (+ ref externe enseignantId)
- [x] CoursRepository
- [x] CoursRequest DTO
- [x] CoursResponse DTO
- [x] CoursMapper
- [x] CoursService
- [x] CoursController

### Phase B6 : GroupeEtudiant
- [x] Entité GroupeEtudiant (+ M:N Etudiant)
- [x] GroupeEtudiantRepository
- [x] GroupeEtudiantRequest DTO
- [x] GroupeEtudiantResponse DTO
- [x] GroupeEtudiantMapper
- [x] GroupeEtudiantService (+ ajout/retrait étudiants)
- [x] GroupeEtudiantController

### Phase B7 : Reservation
- [x] Entité Reservation
- [x] ReservationRepository (+ query chevauchement horaire)
- [x] ReservationRequest DTO
- [x] ReservationResponse DTO
- [x] ReservationMapper
- [x] ReservationService (+ validations : capacité, type salle, chevauchement)
- [x] ReservationController

### Booking-service : Validation finale
- [x] Compilation sans erreur (`mvn compile`)
- [ ] Application démarre correctement
- [ ] Migration Flyway exécutée avec succès
- [ ] Endpoints testés via Postman/curl

---

## PLANNING-SERVICE (`com.timely.planningservice`)

### Phase P1 : Fondations
- [ ] SecurityConfig
- [ ] JwtUtil
- [ ] JwtAuthenticationFilter
- [ ] GlobalExceptionHandler
- [ ] ResourceNotFoundException
- [ ] Enum : PeriodeEmploi
- [ ] Enum : StatutEmploi
- [ ] Enum : TypeConflit
- [ ] Enum : Severite
- [ ] Enum : StatutResolution
- [ ] Enum : TypeRecurrence
- [ ] Enum : StatutCreneau
- [ ] Migration Flyway V1__create_planning_schema.sql

### Phase P2 : Clients Feign
- [ ] BookingServiceClient (getCours, getSalle, getReservations, getSallesDisponibles)
- [ ] UserServiceClient (getEnseignant, getDisponibilites)

### Phase P3 : EmploiDuTemps
- [ ] Entité EmploiDuTemps
- [ ] EmploiDuTempsRepository
- [ ] EmploiDuTempsRequest DTO
- [ ] EmploiDuTempsResponse DTO
- [ ] EmploiDuTempsMapper
- [ ] EmploiDuTempsService (+ validate, publish)
- [ ] PlanningController

### Phase P4 : Creneau
- [ ] Entité Creneau
- [ ] CreneauRepository
- [ ] CreneauRequest DTO
- [ ] CreneauResponse DTO
- [ ] CreneauMapper
- [ ] CreneauService

### Phase P5 : Conflit
- [ ] Entité Conflit
- [ ] ConflitRepository
- [ ] ConflitResponse DTO
- [ ] ConflitMapper
- [ ] ConflitService (+ résolution)
- [ ] ConflitController

### Phase P6 : Événements RabbitMQ
- [ ] RabbitMQConfig (exchange, queues, bindings)
- [ ] EmploiDuTempsPublieEvent
- [ ] ConflitDetecteEvent
- [ ] Publication événements dans EmploiDuTempsService

### Planning-service : Validation finale
- [ ] Compilation sans erreur
- [ ] Application démarre correctement
- [ ] Migration Flyway exécutée
- [ ] Endpoints testés

---

## NOTIFICATION-SERVICE (`com.timely.notificationservice`)

### Phase N1 : Fondations + Documents MongoDB
- [ ] SecurityConfig
- [ ] JwtUtil
- [ ] JwtAuthenticationFilter
- [ ] GlobalExceptionHandler
- [ ] ResourceNotFoundException
- [ ] Enum : TypeNotification
- [ ] Enum : CanalNotification
- [ ] Enum : StatutNotification
- [ ] Enum : StatutEnvoi
- [ ] Document : Notification
- [ ] Document : Template
- [ ] Document : HistoriqueEnvoi

### Phase N2 : Repositories + DTOs + Mappers
- [ ] NotificationRepository (MongoRepository)
- [ ] TemplateRepository (MongoRepository)
- [ ] HistoriqueEnvoiRepository (MongoRepository)
- [ ] SendNotificationRequest DTO
- [ ] ScheduleNotificationRequest DTO
- [ ] TemplateRequest DTO
- [ ] NotificationResponse DTO
- [ ] TemplateResponse DTO
- [ ] HistoriqueResponse DTO
- [ ] NotificationMapper
- [ ] TemplateMapper

### Phase N3 : Template CRUD
- [ ] TemplateService
- [ ] TemplateController

### Phase N4 : Notification (envoi + suivi)
- [ ] NotificationService (envoi unitaire, bulk, différé, suivi)
- [ ] NotificationController (send, send-bulk, schedule, status, historique)

### Phase N5 : Nouveaux listeners RabbitMQ
- [ ] Mise à jour RabbitMQConfig (nouvelles queues planning)
- [ ] PlanningEventListener (EmploiPublieEvent, ConflitDetecteEvent)

### Notification-service : Validation finale
- [ ] Compilation sans erreur
- [ ] Application démarre correctement
- [ ] Collections MongoDB créées
- [ ] Listeners RabbitMQ fonctionnels

---

## REPORT-SERVICE (`com.timely.reportservice`)

### Phase R1 : Fondations
- [ ] SecurityConfig
- [ ] JwtUtil
- [ ] JwtAuthenticationFilter
- [ ] GlobalExceptionHandler
- [ ] ResourceNotFoundException
- [ ] Enum : TypeRapport
- [ ] Enum : FormatExport
- [ ] Enum : StatutExport
- [ ] Migration Flyway V1__create_report_schema.sql

### Phase R2 : Clients Feign
- [ ] BookingServiceClient
- [ ] UserServiceClient
- [ ] PlanningServiceClient

### Phase R3 : Rapport + Export
- [ ] Entité Rapport
- [ ] RapportRepository
- [ ] GenerateReportRequest DTO
- [ ] RapportResponse DTO
- [ ] RapportMapper
- [ ] Entité Export
- [ ] ExportRepository
- [ ] ExportResponse DTO
- [ ] ExportMapper
- [ ] ReportService
- [ ] ExportService
- [ ] ReportController

### Phase R4 : KPI + Dashboard
- [ ] Entité KPIHistorique
- [ ] KPIHistoriqueRepository
- [ ] KPIResponse DTO
- [ ] DashboardResponse DTO
- [ ] KPIService

### Phase R5 : Génération fichiers
- [ ] Génération PDF (Flying Saucer + Thymeleaf)
- [ ] Génération Excel (Apache POI)
- [ ] Génération CSV
- [ ] Endpoint download

### Report-service : Validation finale
- [ ] Compilation sans erreur
- [ ] Application démarre correctement
- [ ] Migration Flyway exécutée
- [ ] Endpoints testés

---

## AGORA-SERVICE (`com.timely.agoraservice`)

### Phase A0 : Correction typo package
- [ ] Renommer `com.timely.agora_ervice` → `com.timely.agoraservice`
- [ ] Mettre à jour le répertoire source
- [ ] Mettre à jour AgoraServiceApplication.java

### Phase A1 : Fondations
- [ ] SecurityConfig
- [ ] JwtUtil
- [ ] JwtAuthenticationFilter
- [ ] GlobalExceptionHandler
- [ ] ResourceNotFoundException
- [ ] Enum : FormatExportAgora
- [ ] Enum : StatutExportAgora
- [ ] Enum : TypeLog
- [ ] Migration Flyway V1__create_agora_schema.sql

### Phase A2 : Client Feign
- [ ] PlanningServiceClient (getEmploiDuTemps, getCreneaux)

### Phase A3 : ExportAgora + LogIntegration
- [ ] Entité ExportAgora
- [ ] ExportAgoraRepository
- [ ] ExportRequest DTO
- [ ] ExportAgoraResponse DTO
- [ ] ExportAgoraMapper
- [ ] Entité LogIntegration
- [ ] LogIntegrationRepository
- [ ] LogResponse DTO
- [ ] ExportAgoraService
- [ ] LogIntegrationService
- [ ] AgoraController (export + logs + health)

### Phase A4 : MappingEntites
- [ ] Entité MappingEntites
- [ ] MappingEntitesRepository
- [ ] MappingRequest DTO
- [ ] MappingResponse DTO
- [ ] MappingMapper
- [ ] MappingService

### Phase A5 : Listener RabbitMQ
- [ ] RabbitMQConfig (queue agora)
- [ ] PlanningEventListener (EmploiDuTempsPublieEvent → export auto)

### Agora-service : Validation finale
- [ ] Compilation sans erreur
- [ ] Application démarre correctement
- [ ] Migration Flyway exécutée
- [ ] Endpoints testés

---

## VALIDATION GLOBALE

- [ ] Tous les services compilent (`mvn compile` pour chaque)
- [ ] Docker Compose up (tous les services démarrent)
- [ ] Flyway migrations exécutées sur toutes les DB
- [ ] Eureka Dashboard : tous les services enregistrés
- [ ] API Gateway : routes vers tous les services fonctionnelles
- [ ] Tests inter-services Feign fonctionnels
- [ ] Événements RabbitMQ transmis correctement
