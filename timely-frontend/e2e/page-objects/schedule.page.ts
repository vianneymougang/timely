import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object pour la gestion des emplois du temps (Schedule/Planning)
 */
export class SchedulePage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly generateScheduleButton: Locator;
  readonly scheduleCalendar: Locator;
  readonly conflictsPanel: Locator;
  readonly publishButton: Locator;
  readonly exportPdfButton: Locator;
  readonly exportIcalButton: Locator;
  readonly scheduleStatusBadge: Locator;
  readonly configurationForm: Locator;
  readonly submitConfigButton: Locator;
  readonly conflictItems: Locator;
  readonly resolveConflictButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-testid="page-title"]');
    this.generateScheduleButton = page.locator('[data-testid="generate-schedule-button"]');
    this.scheduleCalendar = page.locator('[data-testid="schedule-calendar"]');
    this.conflictsPanel = page.locator('[data-testid="conflicts-panel"]');
    this.publishButton = page.locator('[data-testid="publish-button"]');
    this.exportPdfButton = page.locator('[data-testid="export-pdf-button"]');
    this.exportIcalButton = page.locator('[data-testid="export-ical-button"]');
    this.scheduleStatusBadge = page.locator('[data-testid="schedule-status"]');
    this.configurationForm = page.locator('[data-testid="schedule-config-form"]');
    this.submitConfigButton = page.locator('[data-testid="submit-config-button"]');
    this.conflictItems = page.locator('[data-testid="conflict-item"]');
    this.resolveConflictButton = page.locator('[data-testid="resolve-conflict-button"]');
  }

  /**
   * Navigue vers la page de gestion des emplois du temps
   */
  async navigate(): Promise<void> {
    await this.page.goto('/admin/planning/schedules');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Vérifie que la page est chargée
   */
  async expectPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
  }

  /**
   * Configure la génération d'emploi du temps
   */
  async configureScheduleGeneration(config: {
    semester: string;
    year: number;
    autoAssignRooms: boolean;
  }): Promise<void> {
    await this.page.selectOption('[data-testid="semester-select"]', config.semester);
    await this.page.fill('[data-testid="year-input"]', config.year.toString());

    if (config.autoAssignRooms) {
      await this.page.check('[data-testid="auto-assign-rooms-checkbox"]');
    }
  }

  /**
   * Lance la génération d'emploi du temps
   */
  async generateSchedule(): Promise<void> {
    await this.generateScheduleButton.click();

    // Attendre que la génération soit terminée
    // On attend soit le succès, soit l'affichage des conflits
    await Promise.race([
      this.page.waitForSelector('[data-testid="generation-success-message"]', {
        timeout: 30000,
      }),
      this.page.waitForSelector('[data-testid="conflicts-panel"]', { timeout: 30000 }),
    ]);
  }

  /**
   * Vérifie que le calendrier est affiché
   */
  async expectCalendarDisplayed(): Promise<void> {
    await expect(this.scheduleCalendar).toBeVisible();
  }

  /**
   * Vérifie que des conflits sont détectés
   */
  async expectConflictsDetected(): Promise<void> {
    await expect(this.conflictsPanel).toBeVisible();
    const conflictCount = await this.conflictItems.count();
    expect(conflictCount).toBeGreaterThan(0);
  }

  /**
   * Compte le nombre de conflits
   */
  async countConflicts(): Promise<number> {
    return await this.conflictItems.count();
  }

  /**
   * Résout un conflit par son index
   */
  async resolveConflict(index: number, resolution: string): Promise<void> {
    const conflictItem = this.conflictItems.nth(index);
    await conflictItem.locator('[data-testid="resolution-select"]').selectOption(resolution);
    await conflictItem.locator('[data-testid="apply-resolution-button"]').click();

    // Attendre la confirmation
    await this.page.waitForSelector('[data-testid="conflict-resolved-message"]', {
      timeout: 5000,
    });
  }

  /**
   * Vérifie le statut de l'emploi du temps
   */
  async expectScheduleStatus(expectedStatus: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'): Promise<void> {
    await expect(this.scheduleStatusBadge).toContainText(expectedStatus);
  }

  /**
   * Publie l'emploi du temps
   */
  async publishSchedule(): Promise<void> {
    await this.publishButton.click();

    // Attendre la confirmation
    await this.page.waitForSelector('[data-testid="publish-success-message"]', {
      timeout: 10000,
    });
  }

  /**
   * Exporte l'emploi du temps en PDF
   */
  async exportToPdf(): Promise<void> {
    // Écouter le téléchargement
    const downloadPromise = this.page.waitForEvent('download');
    await this.exportPdfButton.click();
    const download = await downloadPromise;

    // Vérifier que le fichier est bien un PDF
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  }

  /**
   * Exporte l'emploi du temps en iCal
   */
  async exportToIcal(): Promise<void> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.exportIcalButton.click();
    const download = await downloadPromise;

    // Vérifier que le fichier est bien un iCal
    expect(download.suggestedFilename()).toMatch(/\.ics$/);
  }

  /**
   * Consulte les détails d'un cours dans le calendrier
   */
  async viewCourseDetails(courseName: string): Promise<void> {
    const courseElement = this.page.locator(`[data-testid="course-${courseName}"]`);
    await courseElement.click();

    // Attendre que le modal de détails s'affiche
    await this.page.waitForSelector('[data-testid="course-details-modal"]', {
      state: 'visible',
    });
  }

  /**
   * Vérifie qu'un cours est affiché dans le calendrier
   */
  async expectCourseInCalendar(
    courseName: string,
    dayOfWeek: string,
    time: string
  ): Promise<void> {
    const courseElement = this.page.locator(
      `[data-testid="course-${courseName}"][data-day="${dayOfWeek}"][data-time="${time}"]`
    );
    await expect(courseElement).toBeVisible();
  }
}
