# Checklist d'Installation Tests E2E - Timely

## ✅ Installation Terminée

### Phase 1: Configuration de Base

- [x] **Playwright installé**
  - Package `@playwright/test` ajouté à `package.json`
  - Version: 1.58.2
  - Emplacement: `node_modules/@playwright/test`

- [x] **Navigateur Chromium installé**
  - Commande exécutée: `npx playwright install chromium`
  - Emplacement: `~/Library/Caches/ms-playwright/chromium-1208`

- [x] **Configuration Playwright créée**
  - Fichier: `playwright.config.ts`
  - Configuration complète avec tous les paramètres

### Phase 2: Structure des Tests

- [x] **Répertoire e2e/ créé**
  ```
  e2e/
  ├── tests/              ✅ 5 fichiers de tests
  ├── page-objects/       ✅ 5 Page Objects
  ├── helpers/            ✅ 3 helpers
  ├── fixtures/           ✅ 1 fichier de données
  ├── screenshots/        ✅ Répertoire créé
  ├── videos/             ✅ Répertoire créé
  ├── README.md           ✅ Documentation complète
  ├── EXAMPLES.md         ✅ Exemples de code
  ├── .gitignore          ✅ Fichiers ignorés
  └── RUN-TESTS.sh        ✅ Script de lancement
  ```

### Phase 3: Tests Créés

- [x] **Tests Smoke** (10 tests)
  - Fichier: `e2e/tests/smoke.spec.ts`
  - Priorité: P0 - Critique
  - Durée: < 1 minute

- [x] **Tests Auth** (15 tests)
  - Fichier: `e2e/tests/auth.spec.ts`
  - Priorité: P1 - Important
  - Durée: ~ 2 minutes

- [x] **Tests Users** (15 tests)
  - Fichier: `e2e/tests/users.spec.ts`
  - Priorité: P1 - Important
  - Durée: ~ 3 minutes

- [x] **Tests Planning** (12 tests)
  - Fichier: `e2e/tests/planning.spec.ts`
  - Priorité: P1 - Important
  - Durée: ~ 5 minutes

- [x] **Tests Reports** (15 tests)
  - Fichier: `e2e/tests/reports.spec.ts`
  - Priorité: P1 - Important
  - Durée: ~ 3 minutes

**Total**: ~60 tests / ~15 minutes

### Phase 4: Page Objects

- [x] **LoginPage** (`e2e/page-objects/login.page.ts`)
  - Sélecteurs: email, password, login button, error message
  - Actions: navigate, login, fillEmail, fillPassword
  - Assertions: expectErrorMessage, expectLoginButtonDisabled

- [x] **DashboardPage** (`e2e/page-objects/dashboard.page.ts`)
  - Sélecteurs: page title, user menu, stats cards, widgets
  - Actions: navigate, refresh, logout, navigateTo
  - Assertions: expectDashboardLoaded, expectStatsDisplayed

- [x] **SchedulePage** (`e2e/page-objects/schedule.page.ts`)
  - Sélecteurs: calendar, generate button, conflicts panel
  - Actions: configureScheduleGeneration, generateSchedule, publishSchedule
  - Exports: exportToPdf, exportToIcal

- [x] **UsersPage** (`e2e/page-objects/users.page.ts`)
  - Sélecteurs: table, add button, search, filters
  - Actions: createUser, editUser, deleteUser, blockUser
  - Recherche: searchByEmail, filterByRole, filterByStatus

- [x] **ReportsPage** (`e2e/page-objects/reports.page.ts`)
  - Sélecteurs: report type, date range, export buttons
  - Actions: generateReport, exportToPdf, exportToExcel
  - Rapports: availability, room utilization, workload

### Phase 5: Helpers

- [x] **auth.helper.ts**
  - `loginAsAdmin()` - Login admin rapide
  - `loginAsTeacher()` - Login teacher rapide
  - `logout()` - Déconnexion
  - `getAuthToken()` - Récupérer token
  - `loginViaAPI()` - Login via API (bypass UI)

- [x] **api.helper.ts**
  - `apiGet()`, `apiPost()`, `apiPut()`, `apiDelete()`
  - `createUser()`, `createCourse()`, `createRoom()`
  - `checkGatewayHealth()`, `checkServiceHealth()`
  - `getDashboardStats()`, `getUsers()`, `getCourses()`

- [x] **database.helper.ts**
  - `cleanupTestData()` - Nettoyage
  - `isDatabaseReady()` - Vérification DB
  - `waitForDatabaseReady()` - Attente DB
  - `countRecords()` - Comptage enregistrements

### Phase 6: Fixtures

- [x] **test-data.ts**
  - `TEST_USERS` - Utilisateurs de test (admin, teacher)
  - `TEST_COURSES` - Cours de test
  - `TEST_ROOMS` - Salles de test
  - `TEST_SCHEDULES` - Horaires de test
  - `EXPECTED_VALIDATION_MESSAGES` - Messages d'erreur
  - `generateUniqueEmail()` - Email unique
  - `generateUniqueCourseCode()` - Code cours unique

### Phase 7: Scripts NPM

- [x] **Scripts de test ajoutés** à `package.json`
  ```json
  "e2e": "playwright test"
  "e2e:headed": "playwright test --headed"
  "e2e:debug": "playwright test --debug"
  "e2e:ui": "playwright test --ui"
  "e2e:report": "playwright show-report e2e/playwright-report"
  "e2e:smoke": "playwright test e2e/tests/smoke.spec.ts"
  "e2e:auth": "playwright test e2e/tests/auth.spec.ts"
  "e2e:users": "playwright test e2e/tests/users.spec.ts"
  "e2e:planning": "playwright test e2e/tests/planning.spec.ts"
  "e2e:reports": "playwright test e2e/tests/reports.spec.ts"
  ```

### Phase 8: Documentation

- [x] **Documentation complète créée**
  - `e2e/README.md` - Documentation détaillée (40+ pages)
  - `E2E-QUICKSTART.md` - Guide démarrage rapide
  - `e2e/EXAMPLES.md` - Exemples de code
  - `DATA-TESTID-CHECKLIST.md` - Guide data-testid
  - `E2E-TEST-SUITE-SUMMARY.md` - Résumé exécutif
  - `E2E-TESTS-DEPLOYMENT.md` - Guide déploiement

---

## ⏳ Actions Requises (Phase 4)

### Étape 1: Ajouter data-testid dans Angular

**Priorité**: P1 - CRITIQUE
**Temps estimé**: 2-3 heures

**Tâches**:
- [ ] Ajouter data-testid dans page Login
- [ ] Ajouter data-testid dans Dashboard
- [ ] Ajouter data-testid dans page Users
- [ ] Ajouter data-testid dans page Planning
- [ ] Ajouter data-testid dans page Reports

**Guide**: Suivre `DATA-TESTID-CHECKLIST.md`

**Exemple**:
```html
<button data-testid="login-button">Se connecter</button>
<input data-testid="email-input" type="email">
```

### Étape 2: Créer données de test initiales

**Priorité**: P1 - IMPORTANT
**Temps estimé**: 30 minutes

**Tâches**:
- [ ] Créer utilisateur admin: `admin@iusjc.edu` / `admin123`
- [ ] Créer utilisateur teacher: `teacher@iusjc.edu` / `teacher123`
- [ ] (Optionnel) Créer quelques cours de base
- [ ] (Optionnel) Créer quelques salles de base

**Méthodes**:
- Via l'interface admin (manuelle)
- Via SQL insert (rapide)
- Via script seed-data (à créer)

### Étape 3: Exécuter les tests

**Priorité**: P1 - IMPORTANT
**Temps estimé**: 2-4 heures

**Workflow**:
1. [ ] Démarrer tous les services
2. [ ] Exécuter tests smoke: `npm run e2e:smoke`
3. [ ] Corriger les échecs (data-testid manquants)
4. [ ] Exécuter suite auth: `npm run e2e:auth`
5. [ ] Exécuter suite users: `npm run e2e:users`
6. [ ] Exécuter suite planning: `npm run e2e:planning`
7. [ ] Exécuter suite reports: `npm run e2e:reports`
8. [ ] Exécuter suite complète: `npm run e2e`

**En cas d'échec**:
- Voir rapport: `npm run e2e:report`
- Voir screenshots: `e2e/screenshots/`
- Voir vidéos: `e2e/videos/`
- Debug: `npm run e2e:debug`

### Étape 4: Intégrer dans CI/CD

**Priorité**: P2 - MOYEN
**Temps estimé**: 1-2 heures

**Tâches**:
- [ ] Créer workflow GitHub Actions (ou GitLab CI)
- [ ] Configurer exécution automatique sur push
- [ ] Configurer exécution sur Pull Requests
- [ ] Configurer upload des artifacts (rapports)
- [ ] Tester le workflow

**Guide**: Voir section CI/CD dans `e2e/README.md`

---

## Vérification de l'Installation

### Tests Manuels

1. **Vérifier que Playwright est installé**
   ```bash
   cd timely-frontend
   npx playwright --version
   # Devrait afficher: Version 1.58.2
   ```

2. **Vérifier que les scripts NPM existent**
   ```bash
   npm run e2e -- --help
   # Devrait afficher l'aide Playwright
   ```

3. **Vérifier la structure des fichiers**
   ```bash
   ls -la e2e/tests
   # Devrait lister: smoke.spec.ts, auth.spec.ts, etc.
   ```

4. **Vérifier les Page Objects**
   ```bash
   ls -la e2e/page-objects
   # Devrait lister: login.page.ts, dashboard.page.ts, etc.
   ```

### Test de Smoke (Sans Backend)

Pour vérifier que Playwright fonctionne (sans exécuter les tests réels):

```bash
npx playwright test --list
# Devrait lister tous les tests
```

### Test Complet (Avec Backend)

1. **Démarrer les services**
   ```bash
   # Frontend
   npm start

   # Backend (dans un autre terminal)
   cd ..
   docker-compose up -d
   ```

2. **Vérifier les services**
   ```bash
   curl http://localhost:4200
   curl http://localhost:8090/actuator/health
   ```

3. **Exécuter les tests smoke**
   ```bash
   npm run e2e:smoke
   ```

Si les tests passent, l'installation est complète ✅

---

## Troubleshooting

### Problème: "Cannot find module '@playwright/test'"

**Solution**:
```bash
npm install
```

### Problème: "browserType.launch: Executable doesn't exist"

**Solution**:
```bash
npx playwright install chromium
```

### Problème: Tests timeout

**Solution**:
1. Vérifier que le frontend est actif: `curl http://localhost:4200`
2. Vérifier que le gateway est actif: `curl http://localhost:8090/actuator/health`
3. Augmenter le timeout dans `playwright.config.ts` si nécessaire

### Problème: "Timeout waiting for locator"

**Cause**: data-testid manquant dans le composant Angular

**Solution**: Ajouter le data-testid dans le template HTML

---

## Commandes de Référence

### Installation
```bash
npm install                        # Installer dépendances
npx playwright install chromium    # Installer navigateur
```

### Tests
```bash
npm run e2e:smoke     # Tests smoke (< 1 min)
npm run e2e:auth      # Tests auth
npm run e2e:users     # Tests users
npm run e2e:planning  # Tests planning
npm run e2e:reports   # Tests reports
npm run e2e           # Tous les tests
```

### Debugging
```bash
npm run e2e:debug     # Mode debug
npm run e2e:ui        # Interface UI
npm run e2e:report    # Voir rapport
```

---

## Fichiers de Documentation

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| `e2e/README.md` | Documentation complète | Référence complète |
| `E2E-QUICKSTART.md` | Guide démarrage rapide | Premier lancement |
| `e2e/EXAMPLES.md` | Exemples de code | Écrire nouveaux tests |
| `DATA-TESTID-CHECKLIST.md` | Guide data-testid | Ajouter data-testid |
| `E2E-TEST-SUITE-SUMMARY.md` | Résumé exécutif | Vue d'ensemble |
| `E2E-TESTS-DEPLOYMENT.md` | Guide déploiement | Intégration CI/CD |

---

## Statut du Projet

### ✅ Terminé (2026-02-14)
- Configuration Playwright
- 60 tests E2E créés
- 5 Page Objects
- 3 Helpers
- Fixtures de données
- Documentation complète
- Scripts NPM

### ⏳ En Attente
- Ajout data-testid dans composants Angular
- Création données de test initiales
- Exécution et correction des tests
- Intégration CI/CD

### 📊 Progression
```
Phase 1-3 (Setup + Tests + Documentation):  ████████████████████ 100%
Phase 4 (Intégration):                      ░░░░░░░░░░░░░░░░░░░░   0%
```

---

## Prochaine Action

**Commencer par**: Ajouter les data-testid dans les composants Angular

**Guide**: `DATA-TESTID-CHECKLIST.md`

**Commencer avec**: Page Login (la plus critique)

**Temps estimé**: 30 minutes pour la page Login

**Une fois terminé**: Exécuter `npm run e2e:smoke` pour tester

---

**Dernière mise à jour**: 2026-02-14
**Statut**: ✅ Installation complète, prêt pour phase d'intégration
