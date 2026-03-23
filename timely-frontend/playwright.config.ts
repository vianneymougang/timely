import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour les tests E2E de Timely
 *
 * Cette configuration gère:
 * - Multi-navigateurs (Chromium, Firefox, WebKit)
 * - Screenshots et vidéos en cas d'échec
 * - Retry logic pour tests flaky
 * - Parallélisation des tests
 * - Rapport HTML généré automatiquement
 */
export default defineConfig({
  // Répertoire contenant les tests
  testDir: './e2e/tests',

  // Timeout global par test (30 secondes)
  timeout: 30000,

  // Timeout pour les assertions (5 secondes)
  expect: {
    timeout: 5000,
  },

  // Nombre de retries en cas d'échec
  // CI: 2 retries pour stabilité
  // Local: 0 retry pour feedback rapide
  retries: process.env.CI ? 2 : 0,

  // Nombre de workers (tests en parallèle)
  // CI: 1 worker pour stabilité
  // Local: 4 workers pour performance
  workers: process.env.CI ? 1 : 4,

  // Configuration du reporter
  reporter: [
    ['html', { outputFolder: 'e2e/playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'e2e/test-results.json' }],
  ],

  // Répertoire pour les résultats de tests
  outputDir: 'e2e/test-results',

  // Options globales pour tous les tests
  use: {
    // URL de base de l'application
    baseURL: process.env.BASE_URL || 'http://localhost:4200',

    // Trace: enregistrer les actions pour debugging
    // 'on-first-retry': Trace seulement lors du premier retry
    trace: 'on-first-retry',

    // Screenshot en cas d'échec uniquement
    screenshot: 'only-on-failure',

    // Vidéo: garder seulement en cas d'échec
    video: 'retain-on-failure',

    // Timeout pour les actions (click, fill, etc.)
    actionTimeout: 10000,

    // Timeout pour la navigation
    navigationTimeout: 15000,

    // User-Agent personnalisé
    userAgent: 'Timely E2E Tests / Playwright',

    // Ignorer les erreurs HTTPS (utile pour dev local)
    ignoreHTTPSErrors: true,
  },

  // Configuration des projets (navigateurs)
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    // Décommenter pour tester sur Firefox et Safari
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1920, height: 1080 },
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     viewport: { width: 1920, height: 1080 },
    //   },
    // },
  ],

  // Serveur de développement (optionnel)
  // Lance automatiquement le frontend si non démarré
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
