import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object pour la page des rapports
 */
export class ReportsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly reportTypeSelect: Locator;
  readonly generateReportButton: Locator;
  readonly exportPdfButton: Locator;
  readonly exportExcelButton: Locator;
  readonly reportContent: Locator;
  readonly dateRangeStartInput: Locator;
  readonly dateRangeEndInput: Locator;
  readonly filterDepartmentSelect: Locator;
  readonly reportTable: Locator;
  readonly chartContainer: Locator;
  readonly auditLogTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-testid="page-title"]');
    this.reportTypeSelect = page.locator('[data-testid="report-type-select"]');
    this.generateReportButton = page.locator('[data-testid="generate-report-button"]');
    this.exportPdfButton = page.locator('[data-testid="export-pdf-button"]');
    this.exportExcelButton = page.locator('[data-testid="export-excel-button"]');
    this.reportContent = page.locator('[data-testid="report-content"]');
    this.dateRangeStartInput = page.locator('[data-testid="date-range-start"]');
    this.dateRangeEndInput = page.locator('[data-testid="date-range-end"]');
    this.filterDepartmentSelect = page.locator('[data-testid="filter-department"]');
    this.reportTable = page.locator('[data-testid="report-table"]');
    this.chartContainer = page.locator('[data-testid="chart-container"]');
    this.auditLogTable = page.locator('[data-testid="audit-log-table"]');
  }

  /**
   * Navigue vers la page des rapports
   */
  async navigate(): Promise<void> {
    await this.page.goto('/admin/reports');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Vérifie que la page est chargée
   */
  async expectPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
  }

  /**
   * Sélectionne un type de rapport
   */
  async selectReportType(reportType: string): Promise<void> {
    await this.reportTypeSelect.selectOption(reportType);
  }

  /**
   * Configure la période du rapport
   */
  async setDateRange(startDate: string, endDate: string): Promise<void> {
    await this.dateRangeStartInput.fill(startDate);
    await this.dateRangeEndInput.fill(endDate);
  }

  /**
   * Filtre par département
   */
  async filterByDepartment(department: string): Promise<void> {
    await this.filterDepartmentSelect.selectOption(department);
  }

  /**
   * Génère le rapport
   */
  async generateReport(): Promise<void> {
    await this.generateReportButton.click();

    // Attendre que le rapport soit généré
    await this.page.waitForSelector('[data-testid="report-content"]', {
      state: 'visible',
      timeout: 15000,
    });
  }

  /**
   * Vérifie que le rapport est affiché
   */
  async expectReportDisplayed(): Promise<void> {
    await expect(this.reportContent).toBeVisible();
  }

  /**
   * Vérifie que le tableau est affiché
   */
  async expectTableDisplayed(): Promise<void> {
    await expect(this.reportTable).toBeVisible();
  }

  /**
   * Vérifie que le graphique est affiché
   */
  async expectChartDisplayed(): Promise<void> {
    await expect(this.chartContainer).toBeVisible();
  }

  /**
   * Exporte le rapport en PDF
   */
  async exportToPdf(): Promise<void> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.exportPdfButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  }

  /**
   * Exporte le rapport en Excel
   */
  async exportToExcel(): Promise<void> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.exportExcelButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.(xlsx|xls)$/);
  }

  /**
   * Génère le rapport de disponibilités
   */
  async generateAvailabilityReport(startDate: string, endDate: string): Promise<void> {
    await this.selectReportType('availability');
    await this.setDateRange(startDate, endDate);
    await this.generateReport();
  }

  /**
   * Génère le rapport d'utilisation des salles
   */
  async generateRoomUtilizationReport(startDate: string, endDate: string): Promise<void> {
    await this.selectReportType('room-utilization');
    await this.setDateRange(startDate, endDate);
    await this.generateReport();
  }

  /**
   * Génère le rapport de charge horaire
   */
  async generateWorkloadReport(
    startDate: string,
    endDate: string,
    department?: string
  ): Promise<void> {
    await this.selectReportType('workload');
    await this.setDateRange(startDate, endDate);

    if (department) {
      await this.filterByDepartment(department);
    }

    await this.generateReport();
  }

  /**
   * Consulte le journal d'audit
   */
  async viewAuditLog(): Promise<void> {
    await this.page.goto('/admin/reports/audit-log');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Vérifie que le journal d'audit est affiché
   */
  async expectAuditLogDisplayed(): Promise<void> {
    await expect(this.auditLogTable).toBeVisible();
  }

  /**
   * Compte le nombre d'entrées dans le journal d'audit
   */
  async countAuditLogEntries(): Promise<number> {
    const entries = this.page.locator('[data-testid="audit-log-entry"]');
    return await entries.count();
  }

  /**
   * Filtre le journal d'audit par type d'action
   */
  async filterAuditLogByAction(action: string): Promise<void> {
    await this.page.locator('[data-testid="audit-action-filter"]').selectOption(action);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Filtre le journal d'audit par utilisateur
   */
  async filterAuditLogByUser(userId: string): Promise<void> {
    await this.page.locator('[data-testid="audit-user-filter"]').fill(userId);
    await this.page.locator('[data-testid="apply-filter-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Récupère les données d'une ligne du tableau
   */
  async getTableRowData(rowIndex: number): Promise<string[]> {
    const row = this.reportTable.locator('tbody tr').nth(rowIndex);
    const cells = row.locator('td');
    const count = await cells.count();
    const data: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await cells.nth(i).textContent();
      data.push(text || '');
    }

    return data;
  }

  /**
   * Vérifie qu'une statistique spécifique est affichée
   */
  async expectStatistic(name: string, expectedValue: string): Promise<void> {
    const statElement = this.page.locator(`[data-testid="stat-${name}"]`);
    await expect(statElement).toContainText(expectedValue);
  }
}
