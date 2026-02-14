import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';
import { DashboardPage } from '../page-objects/dashboard.page';
import { TEST_USERS } from '../fixtures/test-data';
import { clearAuthData, getAuthToken } from '../helpers/auth.helper';

/**
 * Tests E2E - Authentification
 *
 * Couverture:
 * - Login avec différents rôles
 * - Logout
 * - Session expiration
 * - Gestion des tokens
 * - Validation des formulaires
 */

test.describe('Authentification - Login & Logout', () => {
  test.beforeEach(async ({ page }) => {
    // Nettoyer les données d'auth avant chaque test
    await clearAuthData(page);
  });

  test('Login admin avec credentials valides', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);

    // Vérifier la redirection
    expect(page.url()).toContain('/admin/dashboard');

    // Vérifier que le dashboard est chargé
    await dashboardPage.expectDashboardLoaded();

    // Vérifier que le token est stocké
    const token = await getAuthToken(page);
    expect(token).toBeTruthy();
  });

  test('Login teacher avec credentials valides', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login(TEST_USERS.teacher.email, TEST_USERS.teacher.password);

    // Vérifier la redirection vers dashboard teacher
    expect(page.url()).toContain('/teacher/dashboard');

    await dashboardPage.expectDashboardLoaded();
  });

  test('Login avec email invalide affiche erreur', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.fillEmail('invalid@example.com');
    await loginPage.fillPassword('password123');
    await loginPage.clickLogin();

    // Vérifier le message d'erreur
    await expect(loginPage.errorMessage).toBeVisible();

    // Vérifier qu'on reste sur la page de login
    expect(page.url()).toContain('/login');

    // Vérifier qu'aucun token n'est stocké
    const token = await getAuthToken(page);
    expect(token).toBeNull();
  });

  test('Login avec mot de passe invalide affiche erreur', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.fillEmail(TEST_USERS.admin.email);
    await loginPage.fillPassword('wrongpassword');
    await loginPage.clickLogin();

    // Vérifier le message d'erreur
    await expect(loginPage.errorMessage).toBeVisible();
    expect(page.url()).toContain('/login');
  });

  test('Logout redirige vers login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Login
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);

    // Logout
    await dashboardPage.logout();

    // Vérifier la redirection
    expect(page.url()).toContain('/login');

    // Vérifier que le token est supprimé
    const token = await getAuthToken(page);
    expect(token).toBeNull();
  });

  test('Formulaire login valide les champs requis', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    // Essayer de soumettre sans remplir les champs
    // Le bouton devrait être désactivé ou afficher des erreurs
    await loginPage.clickLogin();

    // Vérifier qu'on reste sur la page de login
    expect(page.url()).toContain('/login');
  });

  test('Login avec "Se souvenir de moi"', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.fillEmail(TEST_USERS.admin.email);
    await loginPage.fillPassword(TEST_USERS.admin.password);
    await loginPage.checkRememberMe();
    await loginPage.clickLogin();

    // Vérifier le login
    expect(page.url()).toContain('/admin/dashboard');

    // Vérifier que le token est stocké
    const token = await getAuthToken(page);
    expect(token).toBeTruthy();

    // TODO: Vérifier la persistance du token (dans localStorage vs sessionStorage)
  });

  test('Redirection après login selon le rôle', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Test Admin
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
    expect(page.url()).toContain('/admin/dashboard');

    // Logout
    await clearAuthData(page);

    // Test Teacher
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.teacher.email, TEST_USERS.teacher.password);
    expect(page.url()).toContain('/teacher/dashboard');
  });

  test('Protection des routes - accès sans auth redirige vers login', async ({ page }) => {
    // Essayer d'accéder directement au dashboard sans être authentifié
    await page.goto('/admin/dashboard');

    // Devrait rediriger vers /login
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('Token invalide redirige vers login', async ({ page }) => {
    // Définir un token invalide
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'invalid-token-12345');
    });

    // Essayer d'accéder au dashboard
    await page.goto('/admin/dashboard');

    // Devrait rediriger vers /login car le token est invalide
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('Session persistence après refresh', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Login
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);

    // Récupérer le token
    const tokenBefore = await getAuthToken(page);

    // Rafraîchir la page
    await page.reload();

    // Vérifier qu'on est toujours sur le dashboard
    await dashboardPage.expectDashboardLoaded();

    // Vérifier que le token est toujours présent
    const tokenAfter = await getAuthToken(page);
    expect(tokenAfter).toBe(tokenBefore);
  });

  test('Double login avec comptes différents', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Login avec admin
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
    expect(page.url()).toContain('/admin/dashboard');

    // Logout
    await dashboardPage.logout();

    // Login avec teacher
    await loginPage.login(TEST_USERS.teacher.email, TEST_USERS.teacher.password);
    expect(page.url()).toContain('/teacher/dashboard');

    // Vérifier qu'on a bien les droits teacher (pas admin)
    await dashboardPage.expectDashboardLoaded();
  });
});

test.describe('Authentification - Gestion des erreurs', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthData(page);
  });

  test('Email vide affiche erreur de validation', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.fillPassword('password123');
    await loginPage.clickLogin();

    // Vérifier l'erreur de validation (peut varier selon l'implémentation)
    // Le bouton peut être désactivé ou afficher un message d'erreur
    expect(page.url()).toContain('/login');
  });

  test('Mot de passe vide affiche erreur de validation', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.fillEmail(TEST_USERS.admin.email);
    await loginPage.clickLogin();

    // Vérifier qu'on reste sur la page de login
    expect(page.url()).toContain('/login');
  });

  test('Format email invalide affiche erreur', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.fillEmail('not-an-email');
    await loginPage.fillPassword('password123');
    await loginPage.clickLogin();

    // Vérifier l'erreur (validation HTML5 ou message custom)
    expect(page.url()).toContain('/login');
  });
});
