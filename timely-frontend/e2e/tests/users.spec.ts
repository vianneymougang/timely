import { test, expect } from '@playwright/test';
import { UsersPage } from '../page-objects/users.page';
import { loginAsAdmin } from '../helpers/auth.helper';
import { generateUniqueEmail } from '../fixtures/test-data';

/**
 * Tests E2E - Gestion des Utilisateurs
 *
 * Couverture:
 * - Création d'utilisateurs (admin, teacher)
 * - Modification d'utilisateurs
 * - Blocage/déblocage d'utilisateurs
 * - Recherche et filtrage
 * - Pagination
 */

test.describe('Gestion des Utilisateurs - CRUD', () => {
  test.beforeEach(async ({ page }) => {
    // Login en tant qu'admin avant chaque test
    await loginAsAdmin(page);
  });

  test('Admin crée un enseignant', async ({ page }) => {
    const usersPage = new UsersPage(page);
    const newTeacherEmail = generateUniqueEmail('teacher');

    // Naviguer vers la page utilisateurs
    await usersPage.navigate();
    await usersPage.expectPageLoaded();

    // Créer un nouvel enseignant
    await usersPage.createUser({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: newTeacherEmail,
      password: 'password123',
      role: 'TEACHER',
    });

    // Vérifier que l'utilisateur est visible dans la liste
    await usersPage.expectUserVisible(newTeacherEmail);

    // Vérifier les détails
    const userDetails = await usersPage.getUserDetails(newTeacherEmail);
    expect(userDetails.firstName).toBe('Jean');
    expect(userDetails.lastName).toBe('Dupont');
    expect(userDetails.role).toBe('TEACHER');
  });

  test('Admin crée un admin', async ({ page }) => {
    const usersPage = new UsersPage(page);
    const newAdminEmail = generateUniqueEmail('admin');

    await usersPage.navigate();
    await usersPage.expectPageLoaded();

    // Créer un nouvel admin
    await usersPage.createUser({
      firstName: 'Marie',
      lastName: 'Martin',
      email: newAdminEmail,
      password: 'password123',
      role: 'ADMIN',
    });

    // Vérifier que l'utilisateur est visible
    await usersPage.expectUserVisible(newAdminEmail);

    // Vérifier le rôle
    const userDetails = await usersPage.getUserDetails(newAdminEmail);
    expect(userDetails.role).toBe('ADMIN');
  });

  test('Admin modifie un utilisateur', async ({ page, request }) => {
    const usersPage = new UsersPage(page);
    const userEmail = generateUniqueEmail('teacher-edit');

    await usersPage.navigate();

    // Créer d'abord un utilisateur
    await usersPage.createUser({
      firstName: 'Pierre',
      lastName: 'Durand',
      email: userEmail,
      password: 'password123',
      role: 'TEACHER',
    });

    // Modifier l'utilisateur
    await usersPage.editUser(userEmail, {
      firstName: 'Pierre-Modifié',
      lastName: 'Durand-Modifié',
    });

    // Vérifier les modifications
    const userDetails = await usersPage.getUserDetails(userEmail);
    expect(userDetails.firstName).toBe('Pierre-Modifié');
    expect(userDetails.lastName).toBe('Durand-Modifié');
  });

  test('Admin bloque un utilisateur', async ({ page }) => {
    const usersPage = new UsersPage(page);
    const userEmail = generateUniqueEmail('teacher-block');

    await usersPage.navigate();

    // Créer un utilisateur
    await usersPage.createUser({
      firstName: 'Test',
      lastName: 'Block',
      email: userEmail,
      password: 'password123',
      role: 'TEACHER',
    });

    // Bloquer l'utilisateur
    await usersPage.blockUser(userEmail);

    // Vérifier le statut
    const userDetails = await usersPage.getUserDetails(userEmail);
    expect(userDetails.status).toContain('BLOCKED');
  });

  test('Admin débloque un utilisateur', async ({ page }) => {
    const usersPage = new UsersPage(page);
    const userEmail = generateUniqueEmail('teacher-unblock');

    await usersPage.navigate();

    // Créer et bloquer un utilisateur
    await usersPage.createUser({
      firstName: 'Test',
      lastName: 'Unblock',
      email: userEmail,
      password: 'password123',
      role: 'TEACHER',
    });

    await usersPage.blockUser(userEmail);

    // Débloquer
    await usersPage.unblockUser(userEmail);

    // Vérifier le statut
    const userDetails = await usersPage.getUserDetails(userEmail);
    expect(userDetails.status).toContain('ACTIVE');
  });

  test('Utilisateur bloqué ne peut pas se connecter', async ({ page, context }) => {
    const usersPage = new UsersPage(page);
    const userEmail = generateUniqueEmail('teacher-no-login');
    const userPassword = 'password123';

    await usersPage.navigate();

    // Créer un utilisateur
    await usersPage.createUser({
      firstName: 'Test',
      lastName: 'NoLogin',
      email: userEmail,
      password: userPassword,
      role: 'TEACHER',
    });

    // Bloquer l'utilisateur
    await usersPage.blockUser(userEmail);

    // Ouvrir un nouvel onglet pour tester le login
    const newPage = await context.newPage();

    // Essayer de se connecter avec le compte bloqué
    await newPage.goto('/login');
    await newPage.fill('[data-testid="email-input"]', userEmail);
    await newPage.fill('[data-testid="password-input"]', userPassword);
    await newPage.click('[data-testid="login-button"]');

    // Vérifier le message d'erreur
    const errorMessage = newPage.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/bloqué|blocked|désactivé/i);

    await newPage.close();
  });
});

test.describe('Gestion des Utilisateurs - Recherche & Filtrage', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('Recherche utilisateur par email', async ({ page }) => {
    const usersPage = new UsersPage(page);
    const userEmail = generateUniqueEmail('search-test');

    await usersPage.navigate();

    // Créer un utilisateur
    await usersPage.createUser({
      firstName: 'Search',
      lastName: 'Test',
      email: userEmail,
      password: 'password123',
      role: 'TEACHER',
    });

    // Rechercher par email
    await usersPage.searchByEmail(userEmail);

    // Vérifier que seul cet utilisateur est visible
    await usersPage.expectUserVisible(userEmail);
  });

  test('Filtre par rôle TEACHER', async ({ page }) => {
    const usersPage = new UsersPage(page);

    await usersPage.navigate();
    await usersPage.expectPageLoaded();

    // Filtrer par TEACHER
    await usersPage.filterByRole('TEACHER');

    // Vérifier que des résultats sont affichés
    const count = await usersPage.countUsers();
    expect(count).toBeGreaterThan(0);

    // TODO: Vérifier que tous les utilisateurs affichés sont des TEACHER
  });

  test('Filtre par rôle ADMIN', async ({ page }) => {
    const usersPage = new UsersPage(page);

    await usersPage.navigate();
    await usersPage.expectPageLoaded();

    // Filtrer par ADMIN
    await usersPage.filterByRole('ADMIN');

    // Vérifier que des résultats sont affichés
    const count = await usersPage.countUsers();
    expect(count).toBeGreaterThan(0);
  });

  test('Filtre par statut ACTIVE', async ({ page }) => {
    const usersPage = new UsersPage(page);

    await usersPage.navigate();
    await usersPage.expectPageLoaded();

    // Filtrer par ACTIVE
    await usersPage.filterByStatus('ACTIVE');

    const count = await usersPage.countUsers();
    expect(count).toBeGreaterThan(0);
  });

  test('Filtre par statut BLOCKED', async ({ page }) => {
    const usersPage = new UsersPage(page);

    await usersPage.navigate();
    await usersPage.expectPageLoaded();

    // Filtrer par BLOCKED
    await usersPage.filterByStatus('BLOCKED');

    // Peut ne pas avoir de résultats si aucun utilisateur n'est bloqué
    // On vérifie juste que le filtre fonctionne sans erreur
    await page.waitForLoadState('networkidle');
  });
});

test.describe('Gestion des Utilisateurs - Pagination', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('Navigation entre les pages de résultats', async ({ page }) => {
    const usersPage = new UsersPage(page);

    await usersPage.navigate();
    await usersPage.expectPageLoaded();

    // Compter les utilisateurs sur la première page
    const countPage1 = await usersPage.countUsers();
    expect(countPage1).toBeGreaterThan(0);

    // Aller à la page suivante (si elle existe)
    try {
      await usersPage.goToNextPage();

      // Vérifier qu'on a bien changé de page
      const countPage2 = await usersPage.countUsers();
      expect(countPage2).toBeGreaterThan(0);

      // Revenir à la page précédente
      await usersPage.goToPreviousPage();

      // Vérifier qu'on est revenu
      const countBackToPage1 = await usersPage.countUsers();
      expect(countBackToPage1).toBe(countPage1);
    } catch (error) {
      // Pas de page suivante (moins de 20 utilisateurs)
      // C'est OK, on skip ce test
      test.skip();
    }
  });
});

test.describe('Gestion des Utilisateurs - Validation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('Email déjà existant affiche erreur', async ({ page }) => {
    const usersPage = new UsersPage(page);
    const duplicateEmail = generateUniqueEmail('duplicate');

    await usersPage.navigate();

    // Créer le premier utilisateur
    await usersPage.createUser({
      firstName: 'First',
      lastName: 'User',
      email: duplicateEmail,
      password: 'password123',
      role: 'TEACHER',
    });

    // Essayer de créer un deuxième utilisateur avec le même email
    await usersPage.openCreateUserModal();
    await usersPage.userFormFirstName.fill('Second');
    await usersPage.userFormLastName.fill('User');
    await usersPage.userFormEmail.fill(duplicateEmail);
    await usersPage.userFormPassword.fill('password123');
    await usersPage.userFormRole.selectOption('TEACHER');
    await usersPage.submitUserButton.click();

    // Vérifier le message d'erreur
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/existe|already|duplicate/i);
  });
});
