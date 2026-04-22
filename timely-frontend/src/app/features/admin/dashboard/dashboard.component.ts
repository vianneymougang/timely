import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Alert, AuditEntry, DashboardStats, GlobalKPIs } from '../../../core/models/report.model';
import { ReportService } from '../../../core/services/report.service';
import { AlertsWidgetComponent } from './widgets/alerts-widget.component';
import { KpiCardComponent } from './widgets/kpi-card.component';
import { RecentActivityComponent } from './widgets/recent-activity.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, KpiCardComponent, RecentActivityComponent, AlertsWidgetComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private reportService = inject(ReportService);
  private refreshSubscription?: Subscription;

  // Signals pour state management
  kpis = signal<GlobalKPIs | null>(null);
  recentActivities = signal<AuditEntry[]>([]);
  alerts = signal<Alert[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Chart data pour occupation des salles (valeurs = nombre de salles)
  chartData = signal([
    { day: 'Lun', coord: 12, avail: 18, limited: 5 },
    { day: 'Mar', coord: 15, avail: 14, limited: 8 },
    { day: 'Mer', coord: 18, avail: 10, limited: 7 },
    { day: 'Jeu', coord: 20, avail: 12, limited: 3 },
    { day: 'Ven', coord: 16, avail: 15, limited: 6 },
    { day: 'Sam', coord: 8,  avail: 22, limited: 2 },
  ]);

  // Valeur max pour normaliser les hauteurs des barres
  readonly chartMaxValue = 25;
  readonly chartBarMaxPx = 160;

  /** Convertit une valeur métier en hauteur de barre en pixels */
  getBarHeight(value: number): number {
    return Math.max(4, Math.round((value / this.chartMaxValue) * this.chartBarMaxPx));
  }

  /** Génère les lignes de grille (ex: [0, 25, 50, 75, 100] % de chartMaxValue) */
  get gridLines(): { label: number; pct: number }[] {
    const steps = 5;
    return Array.from({ length: steps + 1 }, (_, i) => ({
      label: Math.round((i / steps) * this.chartMaxValue),
      pct: (i / steps) * 100,
    })).reverse();
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  /**
   * Charge les données du dashboard depuis l'API
   */
  loadDashboardData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.reportService
      .getDashboardStats()
      .pipe(
        catchError((err) => {
          this.error.set('Erreur lors du chargement des données');
          console.error('Dashboard loading error:', err);
          this.isLoading.set(false);
          throw err;
        }),
      )
      .subscribe({
        next: (stats: DashboardStats) => {
          this.kpis.set(stats.kpis);
          this.recentActivities.set(stats.recentActivities || []);
          this.alerts.set(stats.alerts || []);
          this.updateChartData(stats);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  /**
   * Configure le rafraîchissement automatique toutes les 5 minutes
   */
  private setupAutoRefresh(): void {
    // Rafraîchir toutes les 5 minutes (300000 ms)
    // Note: l'appel initial est géré par loadDashboardData() — pas de startWith(0) ici
    this.refreshSubscription = interval(300000)
      .pipe(switchMap(() => this.reportService.getDashboardStats()))
      .subscribe({
        next: (stats: DashboardStats) => {
          this.kpis.set(stats.kpis);
          this.recentActivities.set(stats.recentActivities || []);
          this.alerts.set(stats.alerts || []);
          this.updateChartData(stats);
        },
        error: (err) => {
          console.error('Auto-refresh error:', err);
        },
      });
  }

  /**
   * Met à jour les données du graphique
   */
  private updateChartData(stats: DashboardStats): void {
    if (stats.chartsData?.occupationParJour) {
      const data = stats.chartsData.occupationParJour;
      // Transformer les données pour le graphique
      // Pour l'instant on garde les données mockées
      // TODO: Adapter selon le format réel de l'API
    }
  }

  /**
   * Force le rechargement des données
   */
  refresh(): void {
    this.loadDashboardData();
  }
}
