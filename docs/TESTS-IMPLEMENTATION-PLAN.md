# Plan de Tests - Timely (Unitaires + Integration Testcontainers)

## Contexte

Le projet Timely comprend 19 fonctionnalites implementees en 5 phases, mais ne dispose que d'un seul fichier de test reel (`UserServiceImplTest.java`). L'objectif est de creer une suite complete de tests unitaires ET d'integration couvrant les services et controllers critiques de chaque microservice.

## Conventions

### Tests unitaires
- JUnit 5 + `@ExtendWith(MockitoExtension.class)`
- `@Mock` pour les dependances, `@InjectMocks` pour le SUT
- Pattern AAA (Given/When/Then)
- AssertJ pour les assertions
- Nommage : `methodName_condition_expectedResult`

### Tests d'integration (Testcontainers)
- `@SpringBootTest` + `@Testcontainers`
- PostgreSQL Testcontainer pour services JPA (auth, user, booking, planning, report, agora)
- Redis Testcontainer pour auth-service (blacklist) et booking-service (cache)
- RabbitMQ Testcontainer pour planning-service (publication events)
- Classe abstraite `AbstractIntegrationTest` par service (config Testcontainers partagee)
- `@DynamicPropertySource` pour injecter URLs dynamiques
- MockMvc pour tester endpoints HTTP
- `@WithMockUser` pour securite
- `@Sql` ou TestEntityManager pour preparer les donnees

### Tests controller (slice)
- `@WebMvcTest(XxxController.class)` + `@WithMockUser`
- MockMvc + `@MockBean` pour services

---

## Lot 0 : Infrastructure Testcontainers (prerequis)

### 0.1 Dependances Maven a ajouter dans chaque `pom.xml` concerne

```xml
<!-- Testcontainers BOM dans <dependencyManagement> -->
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>testcontainers-bom</artifactId>
    <version>1.20.4</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>

<!-- Testcontainers dans <dependencies> -->
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <scope>test</scope>
</dependency>
```

**Services necessitant Redis Testcontainer** (auth-service, booking-service) :
```xml
<dependency>
    <groupId>com.redis</groupId>
    <artifactId>testcontainers-redis</artifactId>
    <version>2.2.2</version>
    <scope>test</scope>
</dependency>
```

**Services necessitant RabbitMQ Testcontainer** (planning-service, notification-service) :
```xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>rabbitmq</artifactId>
    <scope>test</scope>
</dependency>
```

### 0.2 Classes abstraites de base (1 par service)

Chaque service qui a des tests d'integration aura une classe abstraite :

**Exemple** `AbstractBookingIntegrationTest.java` :
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@ActiveProfiles("test")
public abstract class AbstractBookingIntegrationTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
}
```

**Fichiers** :
- `services/booking-service/src/test/java/.../AbstractBookingIntegrationTest.java` (PostgreSQL)
- `services/auth-service/src/test/java/.../AbstractAuthIntegrationTest.java` (PostgreSQL + Redis)
- `services/planning-service/src/test/java/.../AbstractPlanningIntegrationTest.java` (PostgreSQL + RabbitMQ)
- `services/report-service/src/test/java/.../AbstractReportIntegrationTest.java` (PostgreSQL)
- `services/user-service/src/test/java/.../AbstractUserIntegrationTest.java` (PostgreSQL)
- `services/agora-service/src/test/java/.../AbstractAgoraIntegrationTest.java` (PostgreSQL)

### 0.3 `application-test.yaml` par service

Configuration minimale pour le profil test :
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: create-drop
  flyway:
    enabled: true
eureka:
  client:
    enabled: false
```

---

## Lot 1 : auth-service (2 unit + 1 integration)

### 1.1 `AuthServiceTest.java` (unitaire)
**Fichier** : `services/auth-service/src/test/java/com/timely/authservice/service/AuthServiceTest.java`
**Mocks** : UserDetailsService, JwtService, RefreshTokenService, TokenBlacklistService, AuthenticationManager
**Tests** :
- login_validCredentials_returnsTokens
- login_invalidCredentials_throwsException
- refreshToken_validRefreshToken_returnsNewAccessToken
- refreshToken_expiredRefreshToken_throwsException
- logout_withAccessToken_blacklistsTokenAndDeletesRefreshToken
- logout_withoutAccessToken_onlyDeletesRefreshToken
- validateToken_validToken_returnsTrue
- validateToken_blacklistedToken_returnsFalse
- validateToken_expiredToken_returnsFalse

### 1.2 `TokenBlacklistServiceTest.java` (unitaire)
**Fichier** : `services/auth-service/src/test/java/com/timely/authservice/service/TokenBlacklistServiceTest.java`
**Mocks** : StringRedisTemplate, JwtService
**Tests** (F1.4 validation) :
- blacklistToken_validToken_storesInRedisWithTTL
- blacklistToken_expiredToken_doesNotStore
- isTokenBlacklisted_tokenInRedis_returnsTrue
- isTokenBlacklisted_tokenNotInRedis_returnsFalse
- isTokenBlacklisted_redisError_returnsFalse (fail-open)
- getBlacklistTTL_blacklistedToken_returnsTTL
- getBlacklistTTL_notBlacklisted_returnsMinusOne

### 1.3 `AuthIntegrationTest.java` (integration Testcontainers)
**Fichier** : `services/auth-service/src/test/java/com/timely/authservice/integration/AuthIntegrationTest.java`
**Extends** : AbstractAuthIntegrationTest (PostgreSQL + Redis)
**Tests** (F1.4 validation E2E) :
- login_andValidate_fullWorkflow
- logout_tokenBecomesInvalid
- logout_tokenBlacklistedInRedis_withTTL
- refreshToken_afterLogout_fails
- validateToken_afterBlacklist_returnsFalse

---

## Lot 2 : user-service (3 unit + 1 integration)

### 2.1 `AffectationServiceImplTest.java` (unitaire)
**Fichier** : `services/user-service/src/test/java/com/timely/userservice/service/AffectationServiceImplTest.java`
**Mocks** : IntervenirEcoleRepository, EnseignerRepository, UserRepository
**Tests** (F2.1/F2.2 validation) :
- assignToSchool_validIds_createsAffectation
- assignToSchool_duplicateAffectation_throwsException
- assignToSchool_enseignantNotFound_throwsException
- removeFromSchool_existingAffectation_deletesIt
- getSchools_existingTeacher_returnsSchoolList
- assignToCourse_validIds_createsAffectation
- assignToCourse_duplicateAffectation_throwsException
- removeCourse_existingAffectation_deletesIt
- getCourses_existingTeacher_returnsCourseList

### 2.2 `ChargeHoraireServiceImplTest.java` (unitaire)
**Fichier** : `services/user-service/src/test/java/com/timely/userservice/service/ChargeHoraireServiceImplTest.java`
**Mocks** : EnseignerRepository, BookingServiceClient, UserRepository
**Tests** (F2.3 validation) :
- calculate_multipleCourses_correctTotalHours
- calculate_aggregatesByType_CM_TD_TP
- calculate_aggregatesBySchool_correctGrouping
- calculate_noCoursesAssigned_returnsZeroHours
- calculate_feignClientError_throwsException

### 2.3 `AvailabilityServiceImplTest.java` (unitaire)
**Fichier** : `services/user-service/src/test/java/com/timely/userservice/service/AvailabilityServiceImplTest.java`
**Mocks** : DisponibiliteRepository, UserRepository
**Tests** :
- create_validAvailability_createsSuccessfully
- getByTeacherId_existingTeacher_returnsAvailabilities
- checkAvailability_teacherAvailable_returnsTrue
- checkAvailability_teacherBusy_returnsFalse
- delete_existingAvailability_deletesIt

### 2.4 `UserServiceIntegrationTest.java` (integration Testcontainers)
**Fichier** : `services/user-service/src/test/java/com/timely/userservice/integration/UserServiceIntegrationTest.java`
**Extends** : AbstractUserIntegrationTest (PostgreSQL)
**MockBean** : BookingServiceClient (Feign mock), RabbitTemplate
**Tests** (F2.1/F2.2/F2.3 validation E2E) :
- createTeacher_andAssignToSchool_fullWorkflow
- assignToSchool_thenListSchools_returnsAssigned
- assignToSchool_duplicate_throwsConflict
- assignToCourse_thenListCourses_returnsAssigned
- calculateChargeHoraire_withMockedBookingService_correctTotal

---

## Lot 3 : booking-service (3 unit + 1 integration)

### 3.1 `SalleAssignmentServiceTest.java` (unitaire)
**Fichier** : `services/booking-service/src/test/java/com/timely/bookingservice/service/SalleAssignmentServiceTest.java`
**Mocks** : SalleRepository, ReservationRepository, EquipementService
**Tests** (F2.4 validation - algorithme 6 etapes) :
- autoAssign_availableSlot_returnsOptimalRoom
- autoAssign_allRoomsOccupied_returns404
- autoAssign_filtersByCompatibleType_CM_Amphi
- autoAssign_filtersByCompatibleType_TP_Labo
- autoAssign_filtersBySufficientCapacity
- autoAssign_filtersByRequiredEquipment
- autoAssign_selectsClosestCapacity_minimizesWaste
- autoAssign_noEquipmentRequired_skipsEquipmentFilter

### 3.2 `GroupeEtudiantServiceTest.java` (unitaire)
**Fichier** : `services/booking-service/src/test/java/com/timely/bookingservice/service/GroupeEtudiantServiceTest.java`
**Mocks** : GroupeEtudiantRepository, CoursRepository, EtudiantRepository, ClasseRepository
**Tests** (F2.5 validation) :
- generateGroupes_CM_creates1Group
- generateGroupes_TD_creates2Groups
- generateGroupes_TP_creates3Groups
- generateGroupes_customNumber_createsRequestedGroups
- generateGroupes_distributesFairly_withRemainder
- generateGroupes_deletesExistingGroupsFirst

### 3.3 `SalleServiceTest.java` (unitaire)
**Fichier** : `services/booking-service/src/test/java/com/timely/bookingservice/service/SalleServiceTest.java`
**Mocks** : SalleRepository, SalleMapper
**Tests** (F4.3 cache) :
- getById_existingId_returnsSalle
- getById_notFound_throwsException
- getByEcoleId_existingEcole_returnsSalles
- getDisponibles_withFilters_returnsFiltered
- create_validRequest_createsSalle
- update_existingId_updatesSalle
- delete_existingId_deletesSalle

### 3.4 `BookingIntegrationTest.java` (integration Testcontainers)
**Fichier** : `services/booking-service/src/test/java/com/timely/bookingservice/integration/BookingIntegrationTest.java`
**Extends** : AbstractBookingIntegrationTest (PostgreSQL + Redis)
**Tests** (F2.4/F2.5/F4.3 validation E2E) :
- autoAssignSalle_withRealDB_returnsOptimalRoom
- autoAssignSalle_noAvailableRoom_returns404
- generateGroupes_withStudentsInDB_createsGroups
- generateGroupes_fairDistribution_withRealData
- salleCache_secondCall_servedFromRedis
- salleCache_afterUpdate_invalidated
- salleCache_TTL_expiresAfter5Minutes

---

## Lot 4 : planning-service (4 unit + 1 integration)

### 4.1 `PlanningGenerationServiceTest.java` (unitaire)
**Fichier** : `services/planning-service/src/test/java/com/timely/planningservice/service/PlanningGenerationServiceTest.java`
**Mocks** : EmploiDuTempsRepository, CreneauRepository, BookingServiceClient, UserServiceClient, ConflitService, PlanningGenerationConfig
**Tests** (F3.1 validation - algorithme MCF) :
- generate_validRequest_createsEmploiDuTemps
- generate_sortsCoursbyConstraintScore_MCF
- generate_courseSansEnseignant_markedNonPlanifiable
- generate_continuesDespitePartialFailures
- generate_createsReservationAndCreneau
- generate_returnsStatistics_tauxReussite
- generate_scoringSlots_CMmorningBonus
- generate_scoringSlots_lateAfternoonPenalty

### 4.2 `PdfExportServiceTest.java` (unitaire)
**Fichier** : `services/planning-service/src/test/java/com/timely/planningservice/service/PdfExportServiceTest.java`
**Mocks** : EmploiDuTempsRepository, PlanningDataEnricher, TemplateEngine
**Tests** (F3.2 validation) :
- export_validPlanning_returnsPdfBytes
- export_emptyPlanning_returnsPdfWithEmptyGrid
- export_organizesIntoWeekGrid
- export_planningNotFound_throwsException

### 4.3 `ICalExportServiceTest.java` (unitaire)
**Fichier** : `services/planning-service/src/test/java/com/timely/planningservice/service/ICalExportServiceTest.java`
**Mocks** : EmploiDuTempsRepository, PlanningDataEnricher
**Tests** (F3.3 validation) :
- export_validPlanning_returnsIcsFormat
- export_containsVCalendarHeaders
- export_eachCreneau_createsVEvent
- export_weeklyRecurrence_addsRRule
- export_usesAfricaDoualTimezone

### 4.4 `EmploiDuTempsServiceTest.java` (unitaire)
**Fichier** : `services/planning-service/src/test/java/com/timely/planningservice/service/EmploiDuTempsServiceTest.java`
**Mocks** : EmploiDuTempsRepository, EmploiDuTempsMapper, RabbitTemplate
**Tests** (F3.4 recherche + F5.1 publication) :
- searchAdvanced_byEcoleId_returnsFiltered
- searchAdvanced_byStatut_returnsFiltered
- searchAdvanced_multipleFilters_combinesSpecs
- searchAdvanced_pagination_returnsCorrectPage
- publish_valideStatus_changestoPublie
- publish_sendsRabbitMQEvent
- publish_nonValideStatus_throwsException

### 4.5 `PlanningIntegrationTest.java` (integration Testcontainers)
**Fichier** : `services/planning-service/src/test/java/com/timely/planningservice/integration/PlanningIntegrationTest.java`
**Extends** : AbstractPlanningIntegrationTest (PostgreSQL + RabbitMQ)
**MockBean** : BookingServiceClient, UserServiceClient (Feign mocks)
**Tests** (F3.1/F3.4/F5.1 validation E2E) :
- searchAdvanced_realDB_multipleFilters_returnsCorrect
- searchAdvanced_pagination_worksWithRealData
- publish_realDB_statusChangesAndEventSent
- publish_rabbitMQReceivesMessage
- exportPdf_realPlanning_returnsPdfBytes
- exportICal_realPlanning_returnsValidIcs

---

## Lot 5 : report-service (2 unit + 1 controller + 1 integration)

### 5.1 `ReportSchedulerServiceTest.java` (unitaire)
**Fichier** : `services/report-service/src/test/java/com/timely/reportservice/service/ReportSchedulerServiceTest.java`
**Mocks** : ScheduledReportRepository, ReportService, NotificationServiceClient, ScheduledReportMapper
**Tests** (F4.1 validation) :
- scheduleReport_validCron_createsScheduledReport
- scheduleReport_invalidCron_throwsException
- executeScheduledReports_dueReports_executesAndNotifies
- executeScheduledReports_inactiveReport_skipped
- toggleReport_activateDeactivate
- deleteReport_existingId_deletesIt
- calculateNextExecution_correctlyComputed

### 5.2 `AuditServiceTest.java` (unitaire)
**Fichier** : `services/report-service/src/test/java/com/timely/reportservice/service/AuditServiceTest.java`
**Mocks** : AuditLogRepository, ObjectMapper
**Tests** (F5.3 validation) :
- logCreate_savesAuditLogWithCreateAction
- logCreate_storesValeurApresOnly
- logUpdate_calculatesChangements
- logUpdate_storesValeurAvantAndApres
- logDelete_savesAuditLogWithDeleteAction
- logDelete_storesValeurAvantOnly
- logCustomAction_PUBLISH_savesWithMetadata
- getEntityHistory_returnsOrderedLogs
- getLogsByAction_withPagination_returnsPage
- getLogsByUser_returnsUserLogs
- getLogsByDateRange_returnsFilteredLogs
- getRecentLogs_returnsTop10
- logCreate_auditFailure_doesNotBlockOperation

### 5.3 `AuditControllerTest.java` (controller slice)
**Fichier** : `services/report-service/src/test/java/com/timely/reportservice/controller/AuditControllerTest.java`
**Type** : `@WebMvcTest(AuditController.class)` + `@WithMockUser`
**MockBean** : AuditService, AuditLogMapper
**Tests** (F5.3 validation) :
- getEntityHistory_asAdmin_returns200
- getEntityHistory_asTeacher_returns200
- getLogsByAction_asAdmin_returns200
- getLogsByUser_asAdmin_returns200
- getLogsByDateRange_validDates_returns200
- getRecentLogs_returns200
- getLogsByAction_asStudent_returns403

### 5.4 `ReportIntegrationTest.java` (integration Testcontainers)
**Fichier** : `services/report-service/src/test/java/com/timely/reportservice/integration/ReportIntegrationTest.java`
**Extends** : AbstractReportIntegrationTest (PostgreSQL)
**MockBean** : NotificationServiceClient (Feign mock)
**Tests** (F4.1/F5.3 validation E2E) :
- scheduleReport_persistsInDB_andRetrieves
- toggleReport_updatesActiveStatus
- auditLog_create_persistsWithJsonbFields
- auditLog_update_calculatesAndStoresChangements
- auditLog_getEntityHistory_orderedByTimestamp
- auditLog_getByDateRange_filtersCorrectly
- auditLog_getByUser_paginates

---

## Lot 6 : agora-service (2 unit + 1 integration)

### 6.1 `AgoraImportServiceTest.java` (unitaire)
**Fichier** : `services/agora-service/src/test/java/com/timely/agoraservice/service/AgoraImportServiceTest.java`
**Mocks** : BookingServiceClient, RestTemplate
**Tests** (F4.2 validation) :
- importEtudiants_newStudents_createsInBooking
- importEtudiants_existingStudent_modeSkip_ignores
- importEtudiants_existingStudent_modeUpdate_updates
- importEtudiants_partialFailure_continuesAndReports
- importEtudiants_returnsCorrectStatistics
- importEtudiants_withClasseFilter_filtersStudents

### 6.2 `AgoraExportServiceTest.java` (unitaire)
**Fichier** : `services/agora-service/src/test/java/com/timely/agoraservice/service/AgoraExportServiceTest.java`
**Mocks** : ExportAgoraRepository, MappingService, RestTemplate
**Tests** :
- export_validPlanning_createsExportRecord
- export_setsStatusEnAttente
- processExport_success_updatesStatusTermine
- processExport_failure_updatesStatusEchec

### 6.3 `AgoraIntegrationTest.java` (integration Testcontainers)
**Fichier** : `services/agora-service/src/test/java/com/timely/agoraservice/integration/AgoraIntegrationTest.java`
**Extends** : AbstractAgoraIntegrationTest (PostgreSQL)
**MockBean** : BookingServiceClient (Feign mock)
**Tests** (F4.2 validation E2E) :
- importEtudiants_endpoint_returnsStatistics
- exportAgora_persistsRecordInDB

---

## Lot 7 : planning-service fallback F5.2 (1 unit)

### 7.1 `BookingServiceClientFallbackTest.java` (unitaire)
**Fichier** : `services/planning-service/src/test/java/com/timely/planningservice/client/BookingServiceClientFallbackTest.java`
**Tests** (F5.2 validation) :
- fallback_readOperations_returnsEmptyList
- fallback_writeOperations_throwsException
- fallback_logsError

---

## Recapitulatif

| Lot | Service | Unit | Controller | Integration | Total tests |
|-----|---------|------|------------|-------------|-------------|
| 0 | Infrastructure | - | - | 6 classes abstraites + configs | prerequis |
| 1 | auth-service | 2 fichiers | - | 1 fichier | ~21 |
| 2 | user-service | 3 fichiers | - | 1 fichier | ~24 |
| 3 | booking-service | 3 fichiers | - | 1 fichier | ~28 |
| 4 | planning-service | 4 fichiers | - | 1 fichier | ~33 |
| 5 | report-service | 2 fichiers | 1 fichier | 1 fichier | ~30 |
| 6 | agora-service | 2 fichiers | - | 1 fichier | ~12 |
| 7 | planning fallback | 1 fichier | - | - | ~3 |
| **Total** | **6 services** | **17 fichiers** | **1 fichier** | **6 fichiers** | **~151 tests** |

Fichiers totaux a creer : **6 abstracts + 6 configs + 24 tests = ~36 fichiers**

## Ordre d'implementation

1. **Lot 0** - Infrastructure Testcontainers (pom.xml + classes abstraites + application-test.yaml)
2. **Lot 3** - booking-service (algorithmes critiques SalleAssignment, GroupeEtudiant)
3. **Lot 4** - planning-service (coeur systeme MCF, exports, publication)
4. **Lot 2** - user-service (logique metier fondamentale)
5. **Lot 1** - auth-service (securite, Redis blacklist)
6. **Lot 5** - report-service (audit trail, scheduler)
7. **Lot 6** - agora-service (import/export)
8. **Lot 7** - planning-service fallback (resilience)

## Verification

Apres implementation de chaque lot :
```bash
cd services/<service-name> && mvn test
```

Verification finale globale :
```bash
for svc in auth-service user-service booking-service planning-service report-service agora-service; do
  echo "=== Testing $svc ===" && (cd services/$svc && mvn test) || echo "FAILED: $svc"
done
```
