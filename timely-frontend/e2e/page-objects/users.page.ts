import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object pour la gestion des utilisateurs
 */
export class UsersPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly addUserButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly usersTable: Locator;
  readonly userRows: Locator;
  readonly paginationControls: Locator;
  readonly filterRoleSelect: Locator;
  readonly filterStatusSelect: Locator;
  readonly createUserModal: Locator;
  readonly userFormFirstName: Locator;
  readonly userFormLastName: Locator;
  readonly userFormEmail: Locator;
  readonly userFormPassword: Locator;
  readonly userFormRole: Locator;
  readonly submitUserButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-testid="page-title"]');
    this.addUserButton = page.locator('[data-testid="add-user-button"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.searchButton = page.locator('[data-testid="search-button"]');
    this.usersTable = page.locator('[data-testid="users-table"]');
    this.userRows = page.locator('[data-testid="user-row"]');
    this.paginationControls = page.locator('[data-testid="pagination"]');
    this.filterRoleSelect = page.locator('[data-testid="filter-role"]');
    this.filterStatusSelect = page.locator('[data-testid="filter-status"]');
    this.createUserModal = page.locator('[data-testid="create-user-modal"]');
    this.userFormFirstName = page.locator('[data-testid="user-firstname-input"]');
    this.userFormLastName = page.locator('[data-testid="user-lastname-input"]');
    this.userFormEmail = page.locator('[data-testid="user-email-input"]');
    this.userFormPassword = page.locator('[data-testid="user-password-input"]');
    this.userFormRole = page.locator('[data-testid="user-role-select"]');
    this.submitUserButton = page.locator('[data-testid="submit-user-button"]');
    this.cancelButton = page.locator('[data-testid="cancel-button"]');
  }

  /**
   * Navigue vers la page de gestion des utilisateurs
   */
  async navigate(): Promise<void> {
    await this.page.goto('/admin/users');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Vérifie que la page est chargée
   */
  async expectPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.usersTable).toBeVisible();
  }

  /**
   * Ouvre le modal de création d'utilisateur
   */
  async openCreateUserModal(): Promise<void> {
    await this.addUserButton.click();
    await expect(this.createUserModal).toBeVisible();
  }

  /**
   * Crée un nouvel utilisateur
   */
  async createUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'TEACHER';
  }): Promise<void> {
    await this.openCreateUserModal();

    await this.userFormFirstName.fill(userData.firstName);
    await this.userFormLastName.fill(userData.lastName);
    await this.userFormEmail.fill(userData.email);
    await this.userFormPassword.fill(userData.password);
    await this.userFormRole.selectOption(userData.role);

    await this.submitUserButton.click();

    // Attendre la confirmation
    await this.page.waitForSelector('[data-testid="success-message"]', { timeout: 10000 });

    // Attendre que le modal se ferme
    await expect(this.createUserModal).not.toBeVisible();
  }

  /**
   * Recherche un utilisateur par email
   */
  async searchByEmail(email: string): Promise<void> {
    await this.searchInput.fill(email);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Filtre par rôle
   */
  async filterByRole(role: string): Promise<void> {
    await this.filterRoleSelect.selectOption(role);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Filtre par statut
   */
  async filterByStatus(status: string): Promise<void> {
    await this.filterStatusSelect.selectOption(status);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Vérifie qu'un utilisateur est visible dans la liste
   */
  async expectUserVisible(email: string): Promise<void> {
    const userRow = this.page.locator(`[data-testid="user-row"][data-email="${email}"]`);
    await expect(userRow).toBeVisible();
  }

  /**
   * Vérifie qu'un utilisateur n'est pas dans la liste
   */
  async expectUserNotVisible(email: string): Promise<void> {
    const userRow = this.page.locator(`[data-testid="user-row"][data-email="${email}"]`);
    await expect(userRow).not.toBeVisible();
  }

  /**
   * Compte le nombre d'utilisateurs affichés
   */
  async countUsers(): Promise<number> {
    return await this.userRows.count();
  }

  /**
   * Édite un utilisateur
   */
  async editUser(email: string, updates: Partial<{
    firstName: string;
    lastName: string;
    role: string;
  }>): Promise<void> {
    const userRow = this.page.locator(`[data-testid="user-row"][data-email="${email}"]`);
    await userRow.locator('[data-testid="edit-button"]').click();

    // Attendre le modal d'édition
    await expect(this.page.locator('[data-testid="edit-user-modal"]')).toBeVisible();

    if (updates.firstName) {
      await this.userFormFirstName.fill(updates.firstName);
    }
    if (updates.lastName) {
      await this.userFormLastName.fill(updates.lastName);
    }
    if (updates.role) {
      await this.userFormRole.selectOption(updates.role);
    }

    await this.submitUserButton.click();

    // Attendre la confirmation
    await this.page.waitForSelector('[data-testid="success-message"]', { timeout: 10000 });
  }

  /**
   * Bloque un utilisateur
   */
  async blockUser(email: string): Promise<void> {
    const userRow = this.page.locator(`[data-testid="user-row"][data-email="${email}"]`);
    await userRow.locator('[data-testid="block-button"]').click();

    // Confirmer l'action
    await this.page.locator('[data-testid="confirm-block-button"]').click();

    // Attendre la confirmation
    await this.page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 });
  }

  /**
   * Débloque un utilisateur
   */
  async unblockUser(email: string): Promise<void> {
    const userRow = this.page.locator(`[data-testid="user-row"][data-email="${email}"]`);
    await userRow.locator('[data-testid="unblock-button"]').click();

    // Confirmer l'action
    await this.page.locator('[data-testid="confirm-unblock-button"]').click();

    // Attendre la confirmation
    await this.page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 });
  }

  /**
   * Supprime un utilisateur
   */
  async deleteUser(email: string): Promise<void> {
    const userRow = this.page.locator(`[data-testid="user-row"][data-email="${email}"]`);
    await userRow.locator('[data-testid="delete-button"]').click();

    // Confirmer la suppression
    await this.page.locator('[data-testid="confirm-delete-button"]').click();

    // Attendre la confirmation
    await this.page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 });
  }

  /**
   * Navigue vers la page suivante de résultats
   */
  async goToNextPage(): Promise<void> {
    await this.page.locator('[data-testid="next-page-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigue vers la page précédente de résultats
   */
  async goToPreviousPage(): Promise<void> {
    await this.page.locator('[data-testid="previous-page-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Récupère les détails d'un utilisateur affiché
   */
  async getUserDetails(email: string): Promise<{
    firstName: string;
    lastName: string;
    role: string;
    status: string;
  }> {
    const userRow = this.page.locator(`[data-testid="user-row"][data-email="${email}"]`);

    return {
      firstName: await userRow.locator('[data-testid="user-firstname"]').textContent() || '',
      lastName: await userRow.locator('[data-testid="user-lastname"]').textContent() || '',
      role: await userRow.locator('[data-testid="user-role"]').textContent() || '',
      status: await userRow.locator('[data-testid="user-status"]').textContent() || '',
    };
  }
}
