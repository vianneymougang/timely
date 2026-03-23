# Tests E2E Timely - Documentation

## Vue d'ensemble

Cette suite de tests End-to-End (E2E) valide les scénarios complets utilisateur de Timely, de bout en bout (frontend → gateway → microservices → base de données).

### Technologies

- **Framework**: Playwright v1.58+
- **Langage**: TypeScript
- **Pattern**: Page Object Model
- **Navigateurs**: Chromium (par défaut), Firefox, WebKit

### Couverture des tests

| Suite | Tests | Durée | Priorité |
|-------|-------|-------|----------|
| Smoke | 10 tests | < 1 min | P0 - Critique |
| Auth | 15+ tests | ~ 2 min | P1 - Important |
| Users | 15+ tests | ~ 3 min | P1 - Important |
| Planning | 12+ tests | ~ 5 min | P1 - Important |
| Reports | 15+ tests | ~ 3 min | P1 - Important |

**Total**: ~60 tests en ~15 minutes

## Installation

### Prérequis

- Node.js 18+
- npm ou pnpm
- Frontend Angular (port 4200)
- Gateway Spring Boot (port 8090)
- Tous les microservices actifs

### Setup initial

```bash
# Installer les dépendances
npm install

# Installer les navigateurs Playwright
npx playwright install chromium

# (Optionnel) Installer tous les navigateurs
npx playwright install
```

## Commandes disponibles

### Exécution des tests

```bash
# Tous les tests E2E (headless)
npm run e2e

# Tests avec interface visible (headed)
npm run e2e:headed

# Mode debug (pause à chaque étape)
npm run e2e:debug

# Mode UI (interface interactive Playwright)
npm run e2e:ui

# Tests smoke uniquement (rapide)
npm run e2e:smoke

# Tests par suite
npm run e2e:auth
npm run e2e:users
npm run e2e:planning
npm run e2e:reports
```

### Rapports

```bash
# Afficher le dernier rapport HTML
npm run e2e:report

# Le rapport est aussi généré automatiquement après chaque run dans:
# e2e/playwright-report/index.html
```

### Exécution avancée

```bash
# Exécuter un test spécifique
npx playwright test e2e/tests/smoke.spec.ts

# Exécuter un test avec un pattern
npx playwright test --grep "Login admin"

# Exécuter en parallèle (4 workers)
npx playwright test --workers=4

# Exécuter sur un navigateur spécifique
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Exécuter avec retry
npx playwright test --retries=2

# Exécuter avec timeout personnalisé
npx playwright test --timeout=60000
```

## Structure du projet

```
e2e/
├── tests/                      # Tests E2E
│   ├── smoke.spec.ts          # Tests smoke (rapides)
│   ├── auth.spec.ts           # Tests authentification
│   ├── users.spec.ts          # Tests gestion utilisateurs
│   ├── planning.spec.ts       # Tests planning/emploi du temps
│   └── reports.spec.ts        # Tests rapports/analytics
├── page-objects/              # Page Objects (pattern)
│   ├── login.page.ts
│   ├── dashboard.page.ts
│   ├── schedule.page.ts
│   ├── users.page.ts
│   └── reports.page.ts
├── helpers/                   # Fonctions utilitaires
│   ├── auth.helper.ts         # Helpers authentification
│   ├── api.helper.ts          # Helpers API
│   └── database.helper.ts     # Helpers DB
├── fixtures/                  # Données de test
│   └── test-data.ts           # Données centralisées
├── screenshots/               # Screenshots en cas d'échec
├── videos/                    # Vidéos en cas d'échec
├── playwright-report/         # Rapport HTML généré
└── README.md                  # Cette documentation
```

## Architecture des tests

### Pattern Page Object

Les tests utilisent le **Page Object Model** pour:
- Centraliser les sélecteurs
- Réutiliser les actions communes
- Faciliter la maintenance

Exemple:

```typescript
// Page Object
export class LoginPage {
  readonly emailInput: Locator;

  constructor(page: Page) {
    this.emailInput = page.locator('[data-testid="email-input"]');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }
}

// Utilisation dans un test
const loginPage = new LoginPage(page);
await loginPage.fillEmail('admin@iusjc.edu');
```

### Sélecteurs data-testid

**IMPORTANT**: Tous les éléments interactifs dans le frontend doivent avoir un `data-testid` pour garantir la stabilité des tests.

```html
<!-- Bon -->
<button data-testid="login-button">Se connecter</button>
<input data-testid="email-input" type="email">

<!-- À éviter -->
<button class="btn-primary">Se connecter</button>
```

### Fixtures et données de test

Les données de test sont centralisées dans `fixtures/test-data.ts`:

```typescript
import { TEST_USERS, generateUniqueEmail } from '../fixtures/test-data';

// Utiliser des données prédéfinies
await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);

// Générer des données uniques pour éviter les conflits
const email = generateUniqueEmail('teacher');
```

### Helpers

Les helpers simplifient les opérations courantes:

```typescript
// Auth helper
import { loginAsAdmin } from '../helpers/auth.helper';

test('Mon test', async ({ page }) => {
  await loginAsAdmin(page); // Login rapide
  // ... suite du test
});

// API helper
import { createUser } from '../helpers/api.helper';

// Créer des données via API (plus rapide que l'UI)
const user = await createUser(request, userData, token);
```

## Bonnes pratiques

### 1. Tests indépendants

Chaque test doit être **complètement indépendant**:

```typescript
test.beforeEach(async ({ page }) => {
  // Nettoyer l'état avant chaque test
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});
```

### 2. Attentes explicites

Toujours attendre les éléments et actions:

```typescript
// ❌ Mauvais (peut être flaky)
await page.click('button');

// ✅ Bon
await page.locator('[data-testid="submit-button"]').click();
await page.waitForURL('/dashboard');
```

### 3. Pas de hard-coded delays

```typescript
// ❌ Mauvais
await page.waitForTimeout(5000);

// ✅ Bon
await page.waitForSelector('[data-testid="success-message"]');
await page.waitForLoadState('networkidle');
```

### 4. Assertions claires

```typescript
// ✅ Assertions spécifiques
await expect(loginButton).toBeVisible();
await expect(errorMessage).toContainText('Email ou mot de passe incorrect');
expect(users.length).toBeGreaterThan(0);
```

### 5. Cleanup des données

```typescript
test.afterEach(async ({ page, request }) => {
  // Nettoyer les données créées pendant le test
  // Exemple: supprimer les utilisateurs de test créés
});
```

## Debugging

### Mode Debug

```bash
# Lance le test en mode debug avec pause
npm run e2e:debug
```

Le test s'arrêtera à chaque étape. Vous pouvez:
- Inspecter la page
- Exécuter des commandes dans la console
- Avancer pas à pas

### Mode UI

```bash
# Lance l'interface interactive Playwright
npm run e2e:ui
```

L'UI Playwright permet de:
- Voir les tests en temps réel
- Re-exécuter des tests spécifiques
- Inspecter les étapes
- Voir les traces

### Screenshots et vidéos

En cas d'échec, Playwright génère automatiquement:
- **Screenshots**: `e2e/screenshots/`
- **Vidéos**: `e2e/videos/`
- **Traces**: consultables via `npx playwright show-trace <trace-file>`

### Console du navigateur

Pour capturer les logs console:

```typescript
page.on('console', (msg) => {
  console.log(`[BROWSER ${msg.type()}]: ${msg.text()}`);
});
```

### Erreurs réseau

Pour détecter les erreurs réseau:

```typescript
page.on('requestfailed', (request) => {
  console.error(`Request failed: ${request.url()}`);
});
```

## Configuration

### playwright.config.ts

La configuration principale se trouve dans `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './e2e/tests',
  timeout: 30000,              // 30s par test
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

### Variables d'environnement

```bash
# URL de base (défaut: http://localhost:4200)
export BASE_URL=http://localhost:4200

# URL du gateway (défaut: http://localhost:8090)
export GATEWAY_URL=http://localhost:8090

# Mode CI
export CI=true
```

## Prérequis pour les tests

### Services requis

Avant d'exécuter les tests, assurez-vous que ces services sont actifs:

1. **Frontend Angular** (localhost:4200)
   ```bash
   cd timely-frontend
   npm start
   ```

2. **API Gateway** (localhost:8090)
   ```bash
   cd services/gateway-service
   ./mvnw spring-boot:run
   ```

3. **Microservices**:
   - auth-service (localhost:8091)
   - user-service (localhost:8092)
   - planning-service (localhost:8093)
   - booking-service (localhost:8094)
   - notification-service (localhost:8095)
   - report-service (localhost:8096)

4. **Base de données** PostgreSQL
5. **Redis** (pour le cache)
6. **RabbitMQ** (pour les messages)

### Vérification rapide

```bash
# Vérifier que le gateway répond
curl http://localhost:8090/actuator/health

# Vérifier que le frontend est accessible
curl http://localhost:4200
```

## Données de test

### Utilisateurs par défaut

Les utilisateurs suivants doivent exister dans la base de données:

```typescript
// Admin
Email: admin@iusjc.edu
Password: admin123

// Teacher
Email: teacher@iusjc.edu
Password: teacher123
```

### Création de données

Pour créer les données de test initiales:

```bash
# TODO: Script à créer
npm run e2e:seed-data
```

## Troubleshooting

### Problème: Tests timeout

**Cause**: Services backend non démarrés ou lents

**Solution**:
```bash
# Vérifier les services
docker-compose ps

# Augmenter le timeout dans playwright.config.ts
timeout: 60000  // 60 secondes
```

### Problème: Sélecteur non trouvé

**Cause**: data-testid manquant dans le composant Angular

**Solution**: Ajouter `data-testid` dans le template:
```html
<button [attr.data-testid]="'login-button'">Login</button>
```

### Problème: Tests flaky (instables)

**Cause**: Race conditions, attentes implicites

**Solution**:
- Utiliser `waitForSelector()`, `waitForURL()`, `waitForLoadState()`
- Éviter `waitForTimeout()`
- Augmenter les timeouts si nécessaire

### Problème: Vidéos/Screenshots non générés

**Cause**: Configuration incorrecte

**Solution**: Vérifier dans `playwright.config.ts`:
```typescript
video: 'retain-on-failure',
screenshot: 'only-on-failure',
```

## CI/CD Integration

### GitHub Actions

Exemple de workflow:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps chromium

      - name: Start services
        run: docker-compose up -d

      - name: Wait for services
        run: npm run wait-for-services

      - name: Run E2E tests
        run: npm run e2e

      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: e2e/playwright-report/
```

## Contribution

### Ajouter un nouveau test

1. Identifier la suite appropriée (auth, users, planning, reports)
2. Créer le test dans le fichier `.spec.ts` correspondant
3. Utiliser les Page Objects existants ou en créer de nouveaux
4. Suivre les bonnes pratiques (tests indépendants, data-testid, etc.)
5. Tester localement avant de commit

### Ajouter un nouveau Page Object

1. Créer le fichier dans `page-objects/`
2. Suivre le pattern existant
3. Utiliser `data-testid` pour les sélecteurs
4. Documenter les méthodes publiques

### Guidelines

- **Commits atomiques**: Un test = Un commit
- **Messages clairs**: "E2E: Ajout test création utilisateur admin"
- **Tests qui passent**: Ne jamais commit un test qui échoue
- **Documentation**: Mettre à jour ce README si nécessaire

## Ressources

- [Documentation Playwright](https://playwright.dev)
- [Best Practices Playwright](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Debugging Playwright](https://playwright.dev/docs/debug)

## Support

En cas de problème avec les tests E2E:

1. Consulter cette documentation
2. Vérifier les issues GitHub
3. Consulter les logs Playwright
4. Contacter l'équipe QA

---

**Dernière mise à jour**: 2026-02-14
**Version**: 1.0.0
**Auteur**: Timely Team
