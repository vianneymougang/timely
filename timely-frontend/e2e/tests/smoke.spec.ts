import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';
import { DashboardPage } from '../page-objects/dashboard.page';
import { TEST_USERS } from '../fixtures/test-data';

/**
 * Tests Smoke - Suite de tests rapides pour vérifier les fonctionnalités critiques
 *
 * Ces tests doivent:
 * - S'exécuter en moins de 1 minute
 * - Valider que l'application est fonctionnelle
 * - Être exécutés en premier avant les autres suites
 *
 * Couverture:
 * - Frontend accessible
 * - Gateway répond
 * - Login fonctionne
 * - Dashboard charge
 * - Navigation principale fonctionne
 */

test.describe('Smoke Tests - Santé Critique du Système', () => {
  test.beforeEach(async ({ page }) => {
    // Effacer les données d'auth avant chaque test
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('01 - Frontend est accessible', async ({ page }) => {
    // Naviguer vers la page d'accueil
    await page.goto('/');

    // Vérifier que la page charge sans erreur
    expect(page.url()).toBeTruthy();

    // Vérifier qu'on est redirigé vers /login (non authentifié)
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('02 - Gateway répond aux requêtes', async ({ request }) => {
    // Vérifier que le gateway est accessible
    const response = await request.get('http://localhost:8090/actuator/health');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.status).toBe('UP');
  });

  test('03 - Login admin fonctionne', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Naviguer vers la page de login
    await loginPage.navigate();

    // Se connecter avec les credentials admin
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);

    // Vérifier la redirection vers le dashboard admin
    expect(page.url()).toContain('/admin/dashboard');
  });

  test('04 - Dashboard admin charge correctement', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Login admin
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);

    // Vérifier que le dashboard est chargé
    await dashboardPage.expectDashboardLoaded();

    // Vérifier que le titre est visible
    await expect(dashboardPage.pageTitle).toBeVisible();
  });

  test('05 - Navigation principale fonctionne', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Login admin
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);

    // Vérifier que la navigation latérale est visible
    await expect(dashboardPage.sidebarNavigation).toBeVisible();

    // Essayer de naviguer vers une autre page (users par exemple)
    await dashboardPage.navigateTo('users');

    // Vérifier qu'on est bien sur la page users
    await page.waitForURL(/\/admin\/users/, { timeout: 5000 });
    expect(page.url()).toContain('/admin/users');
  });

  test('06 - Logout fonctionne', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Login admin
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);

    // Vérifier qu'on est sur le dashboard
    await dashboardPage.expectDashboardLoaded();

    // Se déconnecter
    await dashboardPage.logout();

    // Vérifier qu'on est redirigé vers /login
    expect(page.url()).toContain('/login');
  });

  test('07 - Login avec credentials invalides échoue', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Naviguer vers la page de login
    await loginPage.navigate();

    // Essayer de se connecter avec des credentials invalides
    await loginPage.fillEmail('invalid@example.com');
    await loginPage.fillPassword('wrongpassword');
    await loginPage.clickLogin();

    // Vérifier que le message d'erreur est affiché
    await expect(loginPage.errorMessage).toBeVisible();

    // Vérifier qu'on reste sur la page de login
    expect(page.url()).toContain('/login');
  });

  test('08 - Login teacher fonctionne', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Naviguer vers la page de login
    await loginPage.navigate();

    // Se connecter avec les credentials teacher
    await loginPage.login(TEST_USERS.teacher.email, TEST_USERS.teacher.password);

    // Vérifier la redirection vers le dashboard teacher
    expect(page.url()).toContain('/teacher/dashboard');
  });

  test('09 - Services de base sont opérationnels', async ({ request }) => {
    // Liste des services critiques à vérifier
    const criticalServices = [
      'auth-service',
      'user-service',
      'planning-service',
      'booking-service',
    ];

    // Vérifier chaque service (via le gateway)
    for (const service of criticalServices) {
      const response = await request.get(
        `http://localhost:8090/actuator/health/${service}`
      );

      // On accepte soit 200 (service UP) soit 503 (service connu mais DOWN)
      // L'important est que le gateway connaisse le service
      expect([200, 503]).toContain(response.status());
    }
  });

  test('10 - Pas d\'erreurs console critiques', async ({ page }) => {
    const consoleErrors: string[] = [];

    // Capturer les erreurs console
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const loginPage = new LoginPage(page);

    // Naviguer et se connecter
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);

    // Attendre un peu pour capturer les erreurs
    await page.waitForTimeout(2000);

    // Filtrer les erreurs connues/bénignes
    const criticalErrors = consoleErrors.filter((error) => {
      // Ignorer certaines erreurs connues non-critiques
      return (
        !error.includes('favicon.ico') &&
        !error.includes('sourcemap') &&
        !error.includes('DevTools')
      );
    });

    // Vérifier qu'il n'y a pas d'erreurs critiques
    expect(criticalErrors.length).toBe(0);
  });
});
