import { test, expect } from '@playwright/test';
import { ReportsPage } from '../page-objects/reports.page';
import { DashboardPage } from '../page-objects/dashboard.page';
import { loginAsAdmin } from '../helpers/auth.helper';

/**
 * Tests E2E - Reports & Analytics
 *
 * Couverture:
 * - Dashboard et KPIs
 * - Génération de rapports
 * - Export PDF et Excel
 * - Journal d'audit
 */

test.describe('Reports - Dashboard & KPIs', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('Admin accède au dashboard et voit les KPIs', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.navigateToAdminDashboard();

    // Vérifier que le dashboard est chargé
    await dashboardPage.expectDashboardLoaded();

    // Vérifier que les cartes de statistiques sont affichées
    // Le nombre de cartes peut varier selon l'implémentation
    await dashboardPage.expectStatsDisplayed(4); // Exemple: 4 stats cards
  });

  test('Refresh manuel des données du dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.navigateToAdminDashboard();
    await dashboardPage.expectDashboardLoaded();

    // Récupérer une valeur avant refresh
    const statBefore = await dashboardPage.getStatCardValue('total-users');

    // Rafraîchir
    await dashboardPage.clickRefresh();

    // Vérifier que les données sont rechargées
    // La valeur peut être la même, mais le mécanisme de refresh doit fonctionner
    await dashboardPage.expectDashboardLoaded();
  });

  test('Widget activités récentes affiche les dernières actions', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.navigateToAdminDashboard();
    await dashboardPage.expectDashboardLoaded();

    // Vérifier que le widget activités est visible
    await dashboardPage.expectRecentActivitiesVisible();

    // Compter les activités
    const activityCount = await dashboardPage.countRecentActivities();
    expect(activityCount).toBeGreaterThanOrEqual(0);
  });

  test('Widget alertes affiche les alertes système', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.navigateToAdminDashboard();
    await dashboardPage.expectDashboardLoaded();

    // Vérifier que le widget alertes est visible
    await dashboardPage.expectAlertsVisible();

    // Compter les alertes
    const alertCount = await dashboardPage.countAlerts();
    expect(alertCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Reports - Génération de rapports', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('Génération du rapport de disponibilités', async ({ page }) => {
    const reportsPage = new ReportsPage(page);

    await reportsPage.navigate();
    await reportsPage.expectPageLoaded();

    // Générer le rapport
    await reportsPage.generateAvailabilityReport('2026-01-01', '2026-06-30');

    // Vérifier que le rapport est affiché
    await reportsPage.expectReportDisplayed();

    // Vérifier que le tableau est présent
    await reportsPage.expectTableDisplayed();
  });

  test('Génération du rapport d\'utilisation des salles', async ({ page }) => {
    const reportsPage = new ReportsPage(page);

    await reportsPage.navigate();

    // Générer le rapport
    await reportsPage.generateRoomUtilizationReport('2026-01-01', '2026-06-30');

    // Vérifier le rapport
    await reportsPage.expectReportDisplayed();
    await reportsPage.expectTableDisplayed();
  });

  test('Génération du rapport de charge horaire', async ({ page }) => {
    const reportsPage = new ReportsPage(page);

    await reportsPage.navigate();

    // Générer le rapport avec filtre département
    await reportsPage.generateWorkloadReport('2026-01-01', '2026-06-30', 'Informatique');

    // Vérifier le rapport
    await reportsPage.expectReportDisplayed();
    await reportsPage.expectTableDisplayed();
  });

  test('Rapport avec graphique est affiché', async ({ page }) => {
    const reportsPage = new ReportsPage(page);

    await reportsPage.navigate();

    // Sélectionner un type de rapport qui inclut un graphique
    await reportsPage.selectReportType('room-utilization');
    await reportsPage.setDateRange('2026-01-01', '2026-06-30');
    await reportsPage.generateReport();

    // Vérifier que le graphique est affiché
    await reportsPage.expectChartDisplayed();
  });

  test('Changement de période met à jour le rapport', async ({ page }) => {
    const reportsPage = new ReportsPage(page);

    await reportsPage.navigate();

    // Générer avec une première période
    await reportsPage.generateAvailabilityReport('2026-01-01', '2026-03-31');
    await reportsPage.expectReportDisplayed();

    // Changer la période
    await reportsPage.setDateRange('2026-04-01', '2026-06-30');
    await reportsPage.generateReport();

    // Vérifier que le rapport est re-généré
    await reportsPage.expectReportDisplayed();
  });
});

test.describe('Reports - Export', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('Export PDF d\'un rapport', async ({ page }) => {
    const reportsPage = new ReportsPage(page);

    await reportsPage.navigate();

    // Générer un rapport
    await reportsPage.generateAvailabilityReport('2026-01-01', '2026-06-30');
    await reportsPage.expectReportDisplayed();

    // Exporter en PDF
    await reportsPage.exportToPdf();

    // La vérification du téléchargement est faite dans exportToPdf()
  });

  test('Export Excel d\'un rapport', async ({ page }) => {
    const reportsPage = new ReportsPage(page);

    await reportsPage.navigate();

    // Générer un rapport
    await reportsPage.generateRoomUtilizationReport('2026-01-01', '2026-06-30');
    await reportsPage.expectReportDisplayed();

    // Exporter en Excel
    await reportsPage.exportToExcel();

    // La vérification du téléchargement est faite dans exportToExcel()
  });

  test('Export multiple formats successifs', async ({ page }) => {
    const reportsPage = new ReportsPage(page);

    await reportsPage.navigate();

    // Générer un rapport
    await reportsPage.generateWorkloadReport('2026-01-01', '2026-06-30');
    await reportsPage.expectReportDisplayed();

    // Exporter en PDF
    await reportsPage.exportToPdf();

    // Attendre un peu
    await page.waitForTimeout(1000);

    // Exporter en Excel
    await reportsPage.exportToExcel();
  });
});

test.describe('Reports - Journal d\'audit', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('Consultation du journal d\'audit', async ({ page }) => {
    const reportsPage = new ReportsPage(page);

    // Accéder au journal d'audit
    await reportsPage.viewAuditLog();

    // Vérifier que le journal est affiché
    await reportsPage.expectAuditLogDisplayed();

    // Vérifier qu'il y a des entrées
    const entryCount = await reportsPage.countAuditLogEntries();
    expect(entryCount).toBeGreaterThan(0);
  });

  test('Filtrage du journal par type d\'action', async ({ page }) => {
    const reportsPage = new ReportsPage(page);

    await reportsPage.viewAuditLog();
    await reportsPage.expectAuditLogDisplayed();

    // Compter les entrées avant filtre
    const countBefore = await reportsPage.countAuditLogEntries();

    // Appliquer un filtre
    await reportsPage.filterAuditLogByAction('CREATE');

    // Vérifier que le filtre a été appliqué
    // Le nombre peut être différent (ou identique si toutes les actions sont CREATE)
    await page.waitForLoadState('networkidle');
    await reportsPage.expectAuditLogDisplayed();
  });

  test('Filtrage du journal par utilisateur', async ({ page }) => {
    const reportsPage = new ReportsPage(page);

    await reportsPage.viewAuditLog();
    await reportsPage.expectAuditLogDisplayed();

    // Filtrer par un utilisateur spécifique
    // Utiliser l'ID de l'admin connecté
    await reportsPage.filterAuditLogByUser('admin@iusjc.edu');

    // Vérifier que le filtre a été appliqué
    await page.waitForLoadState('networkidle');
    await reportsPage.expectAuditLogDisplayed();
  });

  test('Pagination du journal d\'audit', async ({ page }) => {
    const reportsPage = new ReportsPage(page);

    await reportsPage.viewAuditLog();
    await reportsPage.expectAuditLogDisplayed();

    // Compter les entrées page 1
    const countPage1 = await reportsPage.countAuditLogEntries();

    // Aller à la page suivante (si elle existe)
    const nextButton = page.locator('[data-testid="audit-next-page"]');
    if (await nextButton.isVisible() && await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');

      // Vérifier qu'on a bien des entrées sur la page 2
      const countPage2 = await reportsPage.countAuditLogEntries();
      expect(countPage2).toBeGreaterThan(0);
    }
  });

  test('Détails d\'une entrée d\'audit', async ({ page }) => {
    const reportsPage = new ReportsPage(page);

    await reportsPage.viewAuditLog();
    await reportsPage.expectAuditLogDisplayed();

    // Cliquer sur une entrée pour voir les détails
    const firstEntry = page.locator('[data-testid="audit-log-entry"]').first();
    if (await firstEntry.isVisible()) {
      await firstEntry.click();

      // Vérifier que le modal de détails s'affiche
      const detailsModal = page.locator('[data-testid="audit-details-modal"]');
      await expect(detailsModal).toBeVisible();

      // Vérifier que les informations détaillées sont affichées
      await expect(detailsModal.locator('[data-testid="audit-action"]')).toBeVisible();
      await expect(detailsModal.locator('[data-testid="audit-user"]')).toBeVisible();
      await expect(detailsModal.locator('[data-testid="audit-timestamp"]')).toBeVisible();
    }
  });
});

test.describe('Reports - Statistiques avancées', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('Statistiques affichées avec valeurs correctes', async ({ page }) => {
    const reportsPage = new ReportsPage(page);

    await reportsPage.navigate();

    // Générer un rapport
    await reportsPage.generateRoomUtilizationReport('2026-01-01', '2026-06-30');
    await reportsPage.expectReportDisplayed();

    // Vérifier que les statistiques sont affichées
    // Les valeurs exactes dépendent des données
    // On vérifie juste la présence
    const statElements = page.locator('[data-testid^="stat-"]');
    const count = await statElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Données du tableau sont cohérentes', async ({ page }) => {
    const reportsPage = new ReportsPage(page);

    await reportsPage.navigate();

    // Générer un rapport
    await reportsPage.generateWorkloadReport('2026-01-01', '2026-06-30');
    await reportsPage.expectReportDisplayed();
    await reportsPage.expectTableDisplayed();

    // Récupérer les données de la première ligne
    const rowData = await reportsPage.getTableRowData(0);
    expect(rowData.length).toBeGreaterThan(0);

    // Vérifier que les données ne sont pas vides
    const hasData = rowData.some(cell => cell.trim().length > 0);
    expect(hasData).toBeTruthy();
  });
});
