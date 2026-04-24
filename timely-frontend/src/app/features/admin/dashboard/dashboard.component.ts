import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorUsers,
  phosphorDoor,
  phosphorBooks,
  phosphorWarningCircle,
  phosphorArrowClockwise,
  phosphorX,
  phosphorClock,
  phosphorCheckCircle,
  phosphorInfo,
  phosphorFire,
  phosphorCalendar,
} from '@ng-icons/phosphor-icons/regular';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, FADE_IN, SCALE_IN, SPRING_DEFAULT, SPRING_SNAPPY } from '../../../core/animations/motion.variants';
import { Alert, AuditAction, AuditEntry, DashboardStats, EntityTypeLabels, AuditActionLabels, GlobalKPIs } from '../../../core/models/report.model';
import { ReportService } from '../../../core/services/report.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIcon, NgmMotionDirective, StatCardComponent],
  providers: [
    provideIcons({
      phosphorUsers, phosphorDoor, phosphorBooks, phosphorWarningCircle,
      phosphorArrowClockwise, phosphorX, phosphorClock, phosphorCheckCircle,
      phosphorInfo, phosphorFire, phosphorCalendar,
    }),
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private reportService = inject(ReportService);
  private destroyRef = inject(DestroyRef);
  private refreshSubscription?: Subscription;

  kpis = signal<GlobalKPIs | null>(null);
  recentActivities = signal<AuditEntry[]>([]);
  alerts = signal<Alert[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  chartData = signal([
    { day: 'Lun', coord: 12, avail: 18, limited: 5 },
    { day: 'Mar', coord: 15, avail: 14, limited: 8 },
    { day: 'Mer', coord: 18, avail: 10, limited: 7 },
    { day: 'Jeu', coord: 20, avail: 12, limited: 3 },
    { day: 'Ven', coord: 16, avail: 15, limited: 6 },
    { day: 'Sam', coord: 8,  avail: 22, limited: 2 },
  ]);

  readonly chartMax = 25;
  readonly barMaxPx = 148;
  readonly FADE_UP = FADE_UP;
  readonly FADE_IN = FADE_IN;
  readonly SCALE_IN = SCALE_IN;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;
  readonly SPRING_SNAPPY = SPRING_SNAPPY;
  readonly EntityTypeLabels = EntityTypeLabels;
  readonly AuditActionLabels = AuditActionLabels;

  get gridLines(): { label: number }[] {
    return Array.from({ length: 6 }, (_, i) => ({
      label: Math.round(((5 - i) / 5) * this.chartMax),
    }));
  }

  getBarHeight(value: number): number {
    return Math.max(4, Math.round((value / this.chartMax) * this.barMaxPx));
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.destroyRef.onDestroy(() => this.refreshSubscription?.unsubscribe());
    this.refreshSubscription = interval(300000)
      .pipe(switchMap(() => this.reportService.getDashboardStats()))
      .subscribe({
        next: (stats) => this.applyStats(stats),
        error: () => {},
      });
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.reportService
      .getDashboardStats()
      .pipe(catchError((err) => { this.isLoading.set(false); throw err; }))
      .subscribe({
        next: (stats) => { this.applyStats(stats); this.isLoading.set(false); },
        error: () => {},
      });
  }

  dismissAlert(id: string): void {
    this.alerts.update(list => list.filter(a => a.id !== id));
  }

  refresh(): void {
    this.loadDashboardData();
  }

  alertSeverityIcon(severity: Alert['severity']): string {
    const map: Record<Alert['severity'], string> = {
      CRITICAL: 'phosphorFire',
      ERROR:    'phosphorWarningCircle',
      WARNING:  'phosphorWarningCircle',
      INFO:     'phosphorInfo',
    };
    return map[severity];
  }

  alertSeverityClasses(severity: Alert['severity']): string {
    const map: Record<Alert['severity'], string> = {
      CRITICAL: 'bg-red-50 border-red-100 text-red-700',
      ERROR:    'bg-red-50 border-red-100 text-red-700',
      WARNING:  'bg-amber-50 border-amber-100 text-amber-700',
      INFO:     'bg-blue-50 border-blue-100 text-blue-700',
    };
    return map[severity];
  }

  activityIcon(action: AuditAction): string {
    const map: Record<AuditAction, string> = {
      CREATE: 'phosphorCheckCircle', UPDATE: 'phosphorCheckCircle',
      DELETE: 'phosphorX', VALIDATE: 'phosphorCheckCircle',
      PUBLISH: 'phosphorCalendar', GENERATE: 'phosphorCalendar', EXPORT: 'phosphorCalendar',
    };
    return map[action] ?? 'phosphorClock';
  }

  private applyStats(stats: DashboardStats): void {
    this.kpis.set(stats.kpis);
    this.recentActivities.set(stats.recentActivities || []);
    this.alerts.set((stats.alerts || []).filter(a => !a.dismissed));
  }
}
