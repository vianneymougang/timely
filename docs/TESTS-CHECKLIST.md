# Checklist d'Implementation des Tests - Timely

**Date** : 11/02/2026
**Statut** : EN COURS
**Reference** : [TESTS-IMPLEMENTATION-PLAN.md](./TESTS-IMPLEMENTATION-PLAN.md)

---

## Lot 0 : Infrastructure Testcontainers

### Dependances Maven
- [ ] auth-service/pom.xml : testcontainers-bom, junit-jupiter, postgresql, redis
- [ ] user-service/pom.xml : testcontainers-bom, junit-jupiter, postgresql
- [ ] booking-service/pom.xml : testcontainers-bom, junit-jupiter, postgresql, redis
- [ ] planning-service/pom.xml : testcontainers-bom, junit-jupiter, postgresql, rabbitmq
- [ ] report-service/pom.xml : testcontainers-bom, junit-jupiter, postgresql
- [ ] agora-service/pom.xml : testcontainers-bom, junit-jupiter, postgresql

### Classes abstraites
- [ ] AbstractAuthIntegrationTest.java (PostgreSQL + Redis)
- [ ] AbstractUserIntegrationTest.java (PostgreSQL)
- [ ] AbstractBookingIntegrationTest.java (PostgreSQL + Redis)
- [ ] AbstractPlanningIntegrationTest.java (PostgreSQL + RabbitMQ)
- [ ] AbstractReportIntegrationTest.java (PostgreSQL)
- [ ] AbstractAgoraIntegrationTest.java (PostgreSQL)

### Fichiers de configuration test
- [ ] auth-service/src/test/resources/application-test.yaml
- [ ] user-service/src/test/resources/application-test.yaml
- [ ] booking-service/src/test/resources/application-test.yaml
- [ ] planning-service/src/test/resources/application-test.yaml
- [ ] report-service/src/test/resources/application-test.yaml
- [ ] agora-service/src/test/resources/application-test.yaml

---

## Lot 1 : auth-service

### Tests unitaires
- [ ] AuthServiceTest.java
  - [ ] login_validCredentials_returnsTokens
  - [ ] login_invalidCredentials_throwsException
  - [ ] refreshToken_validRefreshToken_returnsNewAccessToken
  - [ ] refreshToken_expiredRefreshToken_throwsException
  - [ ] logout_withAccessToken_blacklistsTokenAndDeletesRefreshToken
  - [ ] logout_withoutAccessToken_onlyDeletesRefreshToken
  - [ ] validateToken_validToken_returnsTrue
  - [ ] validateToken_blacklistedToken_returnsFalse
  - [ ] validateToken_expiredToken_returnsFalse

- [ ] TokenBlacklistServiceTest.java
  - [ ] blacklistToken_validToken_storesInRedisWithTTL
  - [ ] blacklistToken_expiredToken_doesNotStore
  - [ ] isTokenBlacklisted_tokenInRedis_returnsTrue
  - [ ] isTokenBlacklisted_tokenNotInRedis_returnsFalse
  - [ ] isTokenBlacklisted_redisError_returnsFalse
  - [ ] getBlacklistTTL_blacklistedToken_returnsTTL
  - [ ] getBlacklistTTL_notBlacklisted_returnsMinusOne

### Tests d'integration
- [ ] AuthIntegrationTest.java
  - [ ] login_andValidate_fullWorkflow
  - [ ] logout_tokenBecomesInvalid
  - [ ] logout_tokenBlacklistedInRedis_withTTL
  - [ ] refreshToken_afterLogout_fails
  - [ ] validateToken_afterBlacklist_returnsFalse

### Verification
- [ ] `mvn test` passe dans auth-service

---

## Lot 2 : user-service

### Tests unitaires
- [ ] AffectationServiceImplTest.java
  - [ ] assignToSchool_validIds_createsAffectation
  - [ ] assignToSchool_duplicateAffectation_throwsException
  - [ ] assignToSchool_enseignantNotFound_throwsException
  - [ ] removeFromSchool_existingAffectation_deletesIt
  - [ ] getSchools_existingTeacher_returnsSchoolList
  - [ ] assignToCourse_validIds_createsAffectation
  - [ ] assignToCourse_duplicateAffectation_throwsException
  - [ ] removeCourse_existingAffectation_deletesIt
  - [ ] getCourses_existingTeacher_returnsCourseList

- [ ] ChargeHoraireServiceImplTest.java
  - [ ] calculate_multipleCourses_correctTotalHours
  - [ ] calculate_aggregatesByType_CM_TD_TP
  - [ ] calculate_aggregatesBySchool_correctGrouping
  - [ ] calculate_noCoursesAssigned_returnsZeroHours
  - [ ] calculate_feignClientError_throwsException

- [ ] AvailabilityServiceImplTest.java
  - [ ] create_validAvailability_createsSuccessfully
  - [ ] getByTeacherId_existingTeacher_returnsAvailabilities
  - [ ] checkAvailability_teacherAvailable_returnsTrue
  - [ ] checkAvailability_teacherBusy_returnsFalse
  - [ ] delete_existingAvailability_deletesIt

### Tests d'integration
- [ ] UserServiceIntegrationTest.java
  - [ ] createTeacher_andAssignToSchool_fullWorkflow
  - [ ] assignToSchool_thenListSchools_returnsAssigned
  - [ ] assignToSchool_duplicate_throwsConflict
  - [ ] assignToCourse_thenListCourses_returnsAssigned
  - [ ] calculateChargeHoraire_withMockedBookingService_correctTotal

### Verification
- [ ] `mvn test` passe dans user-service

---

## Lot 3 : booking-service

### Tests unitaires
- [ ] SalleAssignmentServiceTest.java
  - [ ] autoAssign_availableSlot_returnsOptimalRoom
  - [ ] autoAssign_allRoomsOccupied_returns404
  - [ ] autoAssign_filtersByCompatibleType_CM_Amphi
  - [ ] autoAssign_filtersByCompatibleType_TP_Labo
  - [ ] autoAssign_filtersBySufficientCapacity
  - [ ] autoAssign_filtersByRequiredEquipment
  - [ ] autoAssign_selectsClosestCapacity_minimizesWaste
  - [ ] autoAssign_noEquipmentRequired_skipsEquipmentFilter

- [ ] GroupeEtudiantServiceTest.java
  - [ ] generateGroupes_CM_creates1Group
  - [ ] generateGroupes_TD_creates2Groups
  - [ ] generateGroupes_TP_creates3Groups
  - [ ] generateGroupes_customNumber_createsRequestedGroups
  - [ ] generateGroupes_distributesFairly_withRemainder
  - [ ] generateGroupes_deletesExistingGroupsFirst

- [ ] SalleServiceTest.java
  - [ ] getById_existingId_returnsSalle
  - [ ] getById_notFound_throwsException
  - [ ] getByEcoleId_existingEcole_returnsSalles
  - [ ] getDisponibles_withFilters_returnsFiltered
  - [ ] create_validRequest_createsSalle
  - [ ] update_existingId_updatesSalle
  - [ ] delete_existingId_deletesSalle

### Tests d'integration
- [ ] BookingIntegrationTest.java
  - [ ] autoAssignSalle_withRealDB_returnsOptimalRoom
  - [ ] autoAssignSalle_noAvailableRoom_returns404
  - [ ] generateGroupes_withStudentsInDB_createsGroups
  - [ ] generateGroupes_fairDistribution_withRealData
  - [ ] salleCache_secondCall_servedFromRedis
  - [ ] salleCache_afterUpdate_invalidated
  - [ ] salleCache_TTL_expiresAfter5Minutes

### Verification
- [ ] `mvn test` passe dans booking-service

---

## Lot 4 : planning-service

### Tests unitaires
- [ ] PlanningGenerationServiceTest.java
  - [ ] generate_validRequest_createsEmploiDuTemps
  - [ ] generate_sortsCoursbyConstraintScore_MCF
  - [ ] generate_courseSansEnseignant_markedNonPlanifiable
  - [ ] generate_continuesDespitePartialFailures
  - [ ] generate_createsReservationAndCreneau
  - [ ] generate_returnsStatistics_tauxReussite
  - [ ] generate_scoringSlots_CMmorningBonus
  - [ ] generate_scoringSlots_lateAfternoonPenalty

- [ ] PdfExportServiceTest.java
  - [ ] export_validPlanning_returnsPdfBytes
  - [ ] export_emptyPlanning_returnsPdfWithEmptyGrid
  - [ ] export_organizesIntoWeekGrid
  - [ ] export_planningNotFound_throwsException

- [ ] ICalExportServiceTest.java
  - [ ] export_validPlanning_returnsIcsFormat
  - [ ] export_containsVCalendarHeaders
  - [ ] export_eachCreneau_createsVEvent
  - [ ] export_weeklyRecurrence_addsRRule
  - [ ] export_usesAfricaDoualTimezone

- [ ] EmploiDuTempsServiceTest.java
  - [ ] searchAdvanced_byEcoleId_returnsFiltered
  - [ ] searchAdvanced_byStatut_returnsFiltered
  - [ ] searchAdvanced_multipleFilters_combinesSpecs
  - [ ] searchAdvanced_pagination_returnsCorrectPage
  - [ ] publish_valideStatus_changestoPublie
  - [ ] publish_sendsRabbitMQEvent
  - [ ] publish_nonValideStatus_throwsException

### Tests d'integration
- [ ] PlanningIntegrationTest.java
  - [ ] searchAdvanced_realDB_multipleFilters_returnsCorrect
  - [ ] searchAdvanced_pagination_worksWithRealData
  - [ ] publish_realDB_statusChangesAndEventSent
  - [ ] publish_rabbitMQReceivesMessage
  - [ ] exportPdf_realPlanning_returnsPdfBytes
  - [ ] exportICal_realPlanning_returnsValidIcs

### Verification
- [ ] `mvn test` passe dans planning-service

---

## Lot 5 : report-service

### Tests unitaires
- [ ] ReportSchedulerServiceTest.java
  - [ ] scheduleReport_validCron_createsScheduledReport
  - [ ] scheduleReport_invalidCron_throwsException
  - [ ] executeScheduledReports_dueReports_executesAndNotifies
  - [ ] executeScheduledReports_inactiveReport_skipped
  - [ ] toggleReport_activateDeactivate
  - [ ] deleteReport_existingId_deletesIt
  - [ ] calculateNextExecution_correctlyComputed

- [ ] AuditServiceTest.java
  - [ ] logCreate_savesAuditLogWithCreateAction
  - [ ] logCreate_storesValeurApresOnly
  - [ ] logUpdate_calculatesChangements
  - [ ] logUpdate_storesValeurAvantAndApres
  - [ ] logDelete_savesAuditLogWithDeleteAction
  - [ ] logDelete_storesValeurAvantOnly
  - [ ] logCustomAction_PUBLISH_savesWithMetadata
  - [ ] getEntityHistory_returnsOrderedLogs
  - [ ] getLogsByAction_withPagination_returnsPage
  - [ ] getLogsByUser_returnsUserLogs
  - [ ] getLogsByDateRange_returnsFilteredLogs
  - [ ] getRecentLogs_returnsTop10
  - [ ] logCreate_auditFailure_doesNotBlockOperation

### Tests controller
- [ ] AuditControllerTest.java
  - [ ] getEntityHistory_asAdmin_returns200
  - [ ] getEntityHistory_asTeacher_returns200
  - [ ] getLogsByAction_asAdmin_returns200
  - [ ] getLogsByUser_asAdmin_returns200
  - [ ] getLogsByDateRange_validDates_returns200
  - [ ] getRecentLogs_returns200
  - [ ] getLogsByAction_asStudent_returns403

### Tests d'integration
- [ ] ReportIntegrationTest.java
  - [ ] scheduleReport_persistsInDB_andRetrieves
  - [ ] toggleReport_updatesActiveStatus
  - [ ] auditLog_create_persistsWithJsonbFields
  - [ ] auditLog_update_calculatesAndStoresChangements
  - [ ] auditLog_getEntityHistory_orderedByTimestamp
  - [ ] auditLog_getByDateRange_filtersCorrectly
  - [ ] auditLog_getByUser_paginates

### Verification
- [ ] `mvn test` passe dans report-service

---

## Lot 6 : agora-service

### Tests unitaires
- [ ] AgoraImportServiceTest.java
  - [ ] importEtudiants_newStudents_createsInBooking
  - [ ] importEtudiants_existingStudent_modeSkip_ignores
  - [ ] importEtudiants_existingStudent_modeUpdate_updates
  - [ ] importEtudiants_partialFailure_continuesAndReports
  - [ ] importEtudiants_returnsCorrectStatistics
  - [ ] importEtudiants_withClasseFilter_filtersStudents

- [ ] AgoraExportServiceTest.java
  - [ ] export_validPlanning_createsExportRecord
  - [ ] export_setsStatusEnAttente
  - [ ] processExport_success_updatesStatusTermine
  - [ ] processExport_failure_updatesStatusEchec

### Tests d'integration
- [ ] AgoraIntegrationTest.java
  - [ ] importEtudiants_endpoint_returnsStatistics
  - [ ] exportAgora_persistsRecordInDB

### Verification
- [ ] `mvn test` passe dans agora-service

---

## Lot 7 : planning-service fallback (F5.2)

### Tests unitaires
- [ ] BookingServiceClientFallbackTest.java
  - [ ] fallback_readOperations_returnsEmptyList
  - [ ] fallback_writeOperations_throwsException
  - [ ] fallback_logsError

### Verification
- [ ] `mvn test` passe dans planning-service (avec lot 4)

---

## Verification finale

- [ ] Tous les tests unitaires passent dans les 6 services
- [ ] Tous les tests d'integration Testcontainers passent (Docker requis)
- [ ] Aucune regression sur les tests existants (UserServiceImplTest.java)
- [ ] Couverture des tests de validation de chaque phase (F1-F5)

---

## Statistiques

| Categorie | Nombre |
|-----------|--------|
| Tests unitaires | ~119 |
| Tests controller (slice) | ~7 |
| Tests d'integration | ~25 |
| **Total tests** | **~151** |
| Fichiers de test | 24 |
| Classes abstraites | 6 |
| Fichiers config | 6 |
| **Total fichiers** | **~36** |

---

*Document genere le 11/02/2026*
