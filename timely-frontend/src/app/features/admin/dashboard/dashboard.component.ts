import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { switchMap, startWith, catchError } from 'rxjs/operators';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { AlertCardComponent } from '../../../shared/components/alert-card/alert-card.component';
import { KpiCardComponent } from './widgets/kpi-card.component';
import { RecentActivityComponent } from './widgets/recent-activity.component';
import { AlertsWidgetComponent } from './widgets/alerts-widget.component';
import { ReportService } from '../../../core/services/report.service';
import { DashboardStats, GlobalKPIs, Alert, AuditEntry } from '../../../core/models/report.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    KpiCardComponent,
    RecentActivityComponent,
    AlertsWidgetComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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

  // Chart data pour occupation des salles
  chartData = signal([
    { day: 'Lun', coord: 80, avail: 90, limited: 70 },
    { day: 'Mar', coord: 90, avail: 98, limited: 75 },
    { day: 'Mer', coord: 90, avail: 106, limited: 80 },
    { day: 'Jeu', coord: 100, avail: 114, limited: 85 },
    { day: 'Ven', coord: 110, avail: 122, limited: 90 },
    { day: 'Sam', coord: 120, avail: 130, limited: 95 }
  ]);

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

    this.reportService.getDashboardStats()
      .pipe(
        catchError(err => {
          this.error.set('Erreur lors du chargement des données');
          console.error('Dashboard loading error:', err);
          this.isLoading.set(false);
          throw err;
        })
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
        }
      });
  }

  /**
   * Configure le rafraîchissement automatique toutes les 5 minutes
   */
  private setupAutoRefresh(): void {
    // Rafraîchir toutes les 5 minutes (300000 ms)
    this.refreshSubscription = interval(300000)
      .pipe(
        startWith(0),
        switchMap(() => this.reportService.getDashboardStats())
      )
      .subscribe({
        next: (stats: DashboardStats) => {
          this.kpis.set(stats.kpis);
          this.recentActivities.set(stats.recentActivities || []);
          this.alerts.set(stats.alerts || []);
          this.updateChartData(stats);
        },
        error: (err) => {
          console.error('Auto-refresh error:', err);
        }
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
