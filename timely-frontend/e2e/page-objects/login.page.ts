import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object pour la page de Login
 *
 * Ce pattern permet de:
 * - Centraliser les sélecteurs
 * - Réutiliser les actions communes
 * - Faciliter la maintenance (si l'UI change, on modifie un seul endroit)
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.forgotPasswordLink = page.locator('[data-testid="forgot-password-link"]');
    this.rememberMeCheckbox = page.locator('[data-testid="remember-me-checkbox"]');
  }

  /**
   * Navigue vers la page de login
   */
  async navigate(): Promise<void> {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Remplit le champ email
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Remplit le champ mot de passe
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Coche la case "Se souvenir de moi"
   */
  async checkRememberMe(): Promise<void> {
    await this.rememberMeCheckbox.check();
  }

  /**
   * Clique sur le bouton de connexion
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Effectue une connexion complète
   */
  async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);

    if (rememberMe) {
      await this.checkRememberMe();
    }

    await this.clickLogin();

    // Attendre la redirection (vers dashboard admin ou teacher)
    await this.page.waitForURL(/\/(admin|teacher)\/dashboard/, { timeout: 10000 });
  }

  /**
   * Vérifie que le message d'erreur est affiché
   */
  async expectErrorMessage(expectedMessage: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  /**
   * Vérifie que le bouton de login est désactivé
   */
  async expectLoginButtonDisabled(): Promise<void> {
    await expect(this.loginButton).toBeDisabled();
  }

  /**
   * Vérifie que le bouton de login est activé
   */
  async expectLoginButtonEnabled(): Promise<void> {
    await expect(this.loginButton).toBeEnabled();
  }

  /**
   * Vérifie que les champs sont vides
   */
  async expectEmptyForm(): Promise<void> {
    await expect(this.emailInput).toHaveValue('');
    await expect(this.passwordInput).toHaveValue('');
  }

  /**
   * Clique sur "Mot de passe oublié"
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
    await this.page.waitForURL('/forgot-password');
  }
}
