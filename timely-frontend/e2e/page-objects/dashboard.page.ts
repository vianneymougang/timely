import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object pour le Dashboard (Admin/Teacher)
 */
export class DashboardPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly userMenuButton: Locator;
  readonly logoutButton: Locator;
  readonly sidebarNavigation: Locator;
  readonly mainContent: Locator;
  readonly statsCards: Locator;
  readonly recentActivitiesWidget: Locator;
  readonly alertsWidget: Locator;
  readonly refreshButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-testid="page-title"]');
    this.userMenuButton = page.locator('[data-testid="user-menu-button"]');
    this.logoutButton = page.locator('[data-testid="logout-button"]');
    this.sidebarNavigation = page.locator('[data-testid="sidebar-navigation"]');
    this.mainContent = page.locator('[data-testid="main-content"]');
    this.statsCards = page.locator('[data-testid="stats-card"]');
    this.recentActivitiesWidget = page.locator('[data-testid="recent-activities"]');
    this.alertsWidget = page.locator('[data-testid="alerts-widget"]');
    this.refreshButton = page.locator('[data-testid="refresh-button"]');
  }

  /**
   * Navigue vers le dashboard admin
   */
  async navigateToAdminDashboard(): Promise<void> {
    await this.page.goto('/admin/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigue vers le dashboard teacher
   */
  async navigateToTeacherDashboard(): Promise<void> {
    await this.page.goto('/teacher/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Vérifie que le dashboard est chargé
   */
  async expectDashboardLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.mainContent).toBeVisible();
  }

  /**
   * Vérifie que les statistiques sont affichées
   */
  async expectStatsDisplayed(count: number): Promise<void> {
    await expect(this.statsCards).toHaveCount(count);
  }

  /**
   * Récupère la valeur d'une carte de statistique
   */
  async getStatCardValue(statName: string): Promise<string> {
    const statCard = this.page.locator(`[data-testid="stat-${statName}"]`);
    return await statCard.textContent() || '';
  }

  /**
   * Clique sur le bouton de rafraîchissement
   */
  async clickRefresh(): Promise<void> {
    await this.refreshButton.click();
    // Attendre que le refresh soit terminé
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigue vers une page via le menu latéral
   */
  async navigateTo(menuItem: string): Promise<void> {
    const menuLink = this.page.locator(`[data-testid="nav-${menuItem}"]`);
    await menuLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Vérifie que les activités récentes sont affichées
   */
  async expectRecentActivitiesVisible(): Promise<void> {
    await expect(this.recentActivitiesWidget).toBeVisible();
  }

  /**
   * Vérifie que les alertes sont affichées
   */
  async expectAlertsVisible(): Promise<void> {
    await expect(this.alertsWidget).toBeVisible();
  }

  /**
   * Compte le nombre d'activités récentes
   */
  async countRecentActivities(): Promise<number> {
    const activities = this.page.locator('[data-testid="activity-item"]');
    return await activities.count();
  }

  /**
   * Compte le nombre d'alertes
   */
  async countAlerts(): Promise<number> {
    const alerts = this.page.locator('[data-testid="alert-item"]');
    return await alerts.count();
  }

  /**
   * Déconnexion via le menu utilisateur
   */
  async logout(): Promise<void> {
    await this.userMenuButton.click();
    await this.logoutButton.click();
    await this.page.waitForURL('/login');
  }
}
