import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorChartBar,
  phosphorChartLine,
  phosphorFileText,
  phosphorFilePdf,
  phosphorDownloadSimple,
  phosphorUsers,
  phosphorDoor,
  phosphorCalendar,
  phosphorWarningCircle,
  phosphorCheckCircle,
  phosphorX,
  phosphorArrowClockwise,
  phosphorTrendUp,
  phosphorCaretDown,
  phosphorEye,
} from '@ng-icons/phosphor-icons/regular';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, SCALE_IN, SPRING_DEFAULT, SPRING_SNAPPY } from '../../../core/animations/motion.variants';
import {
  GlobalKPIs,
  ReportType,
  RoomUtilizationReport,
  WorkloadReport,
} from '../../../core/models/report.model';
import { ReportService } from '../../../core/services/report.service';
import { catchError, forkJoin, of, Subscription } from 'rxjs';

export interface Toast { id: number; type: 'success' | 'error'; message: string; }
export interface HistoriqueRapport {
  id: string; type: ReportType; typeLabel: string;
  dateGeneration: string; periode: string;
  statut: 'DISPONIBLE' | 'EN_COURS' | 'ERREUR'; taille?: string;
}

const TYPE_META: Record<ReportType, { label: string; icon: string; color: string; bg: string }> = {
  ROOM_UTILIZATION: { label: 'Utilisation des salles', icon: 'phosphorDoor',     color: 'text-teal-600',   bg: 'bg-teal-50'   },
  AVAILABILITY:     { label: 'Disponibilités',          icon: 'phosphorCalendar', color: 'text-green-600',  bg: 'bg-green-50'  },
  WORKLOAD:         { label: 'Charge horaire',          icon: 'phosphorUsers',    color: 'text-blue-600',   bg: 'bg-blue-50'   },
  AUDIT:            { label: "Journal d'audit",         icon: 'phosphorChartBar', color: 'text-violet-600', bg: 'bg-violet-50' },
};

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, DatePipe, NgIcon, NgmMotionDirective],
  providers: [
    provideIcons({
      phosphorChartBar, phosphorChartLine, phosphorFileText, phosphorFilePdf,
      phosphorDownloadSimple, phosphorUsers, phosphorDoor, phosphorCalendar,
      phosphorWarningCircle, phosphorCheckCircle, phosphorX, phosphorArrowClockwise,
      phosphorTrendUp, phosphorCaretDown, phosphorEye,
    }),
  ],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private reportService = inject(ReportService);
  private subs: Subscription[] = [];
  private toastCounter = 0;

  readonly FADE_UP = FADE_UP;
  readonly SCALE_IN = SCALE_IN;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;
  readonly SPRING_SNAPPY = SPRING_SNAPPY;
  readonly TYPE_META = TYPE_META;
  readonly REPORT_TYPES: ReportType[] = ['ROOM_UTILIZATION', 'AVAILABILITY', 'WORKLOAD', 'AUDIT'];

  activeTab = signal<'overview' | 'reports'>('overview');
  isLoading = signal(true);
  exportingPdf = signal(false);
  downloadingId = signal<string | null>(null);
  generatingType = signal<ReportType | null>(null);
  toasts = signal<Toast[]>([]);
  showPeriodMenu = signal(false);
  selectedPeriod = signal('week');

  kpis = signal<GlobalKPIs | null>(null);
  roomReport = signal<RoomUtilizationReport | null>(null);
  workloads = signal<WorkloadReport[]>([]);

  occupationData = signal([
    { day: 'Lun', amphi: 20, labo: 80, td: 95  },
    { day: 'Mar', amphi: 15, labo: 90, td: 100 },
    { day: 'Mer', amphi: 10, labo: 70, td: 85  },
    { day: 'Jeu', amphi: 18, labo: 85, td: 90  },
    { day: 'Ven', amphi: 60, labo: 75, td: 78  },
  ]);

  trendData = signal([
    { label: 'lun', conflits: 3,  reservations: 22 },
    { label: 'mar', conflits: 2,  reservations: 25 },
    { label: 'mer', conflits: 5,  reservations: 18 },
    { label: 'jeu', conflits: 1,  reservations: 28 },
    { label: 'ven', conflits: 4,  reservations: 20 },
  ]);

  historiqueRapports = signal<HistoriqueRapport[]>([
    { id: '1', type: 'ROOM_UTILIZATION', typeLabel: 'Utilisation des Salles',
      dateGeneration: new Date(Date.now() - 86400000).toISOString(),
      periode: '01 avr. – 07 avr. 2026', statut: 'DISPONIBLE', taille: '1.2 Mo' },
    { id: '2', type: 'AVAILABILITY', typeLabel: 'Disponibilités Enseignants',
      dateGeneration: new Date(Date.now() - 172800000).toISOString(),
      periode: '01 mars – 31 mars 2026', statut: 'DISPONIBLE', taille: '845 Ko' },
    { id: '3', type: 'WORKLOAD', typeLabel: 'Charge Horaire',
      dateGeneration: new Date(Date.now() - 259200000).toISOString(),
      periode: '01 mars – 31 mars 2026', statut: 'DISPONIBLE', taille: '2.1 Mo' },
    { id: '4', type: 'AUDIT', typeLabel: "Journal d'Audit",
      dateGeneration: new Date(Date.now() - 345600000).toISOString(),
      periode: 'Semaine 14 – 2026', statut: 'DISPONIBLE', taille: '560 Ko' },
  ]);

  periodLabel = computed(() => ({
    week: 'Cette semaine', month: 'Ce mois',
    semester: 'Ce semestre', year: 'Cette année',
  }[this.selectedPeriod()] ?? 'Cette semaine'));

  maxOccupation = computed(() =>
    Math.max(...this.occupationData().flatMap(d => [d.amphi, d.labo, d.td]), 1)
  );

  get tauxOccupation():    number { return this.kpis()?.tauxOccupationGlobal ?? 82; }
  get conflitsDetectes():  number { return this.kpis()?.conflitsActifs       ?? 2;  }
  get enseignantsActifs(): number { return this.kpis()?.totalEnseignants     ?? 30; }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  loadData(): void {
    this.isLoading.set(true);
    const { startDate, endDate } = this.getPeriodDates();
    const sub = forkJoin({
      kpis:     this.reportService.getGlobalKPIs().pipe(catchError(() => of(null))),
      room:     this.reportService.getRoomUtilizationReport({ startDate, endDate }).pipe(catchError(() => of(null))),
      workload: this.reportService.getAllWorkloadReports({ startDate, endDate }).pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ kpis, room, workload }) => {
        if (kpis)     this.kpis.set(kpis as GlobalKPIs);
        if (room)     this.roomReport.set(room as RoomUtilizationReport);
        if (workload) this.workloads.set(workload as WorkloadReport[]);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
    this.subs.push(sub);
  }

  setPeriod(p: string): void {
    this.selectedPeriod.set(p);
    this.showPeriodMenu.set(false);
    this.updateChartData(p);
    this.loadData();
  }

  barH(v: number): number {
    return Math.round((v / this.maxOccupation()) * 120);
  }

  linePoints(key: 'conflits' | 'reservations'): string {
    const data   = this.trendData();
    const maxVal = Math.max(...data.map(d => d[key]), 1);
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * 280;
      const y = 100 - (d[key] / maxVal) * 90;
      return `${x},${y}`;
    }).join(' ');
  }

  generateReport(type: ReportType): void {
    if (this.generatingType() === type) return;
    this.generatingType.set(type);
    const { startDate, endDate } = this.getPeriodDates();
    const sub = this.reportService
      .exportReportPDF(type, { startDate, endDate })
      .pipe(catchError((err: unknown) => of({ __error: true, raw: err })))
      .subscribe({
        next: async (result: unknown) => {
          this.generatingType.set(null);
          if (result instanceof Blob) {
            const errMsg = await this.checkBlob(result);
            if (errMsg) { this.toast('error', `Génération impossible : ${errMsg}`); return; }
            const newRapport: HistoriqueRapport = {
              id: Date.now().toString(), type,
              typeLabel: TYPE_META[type].label,
              dateGeneration: new Date().toISOString(),
              periode: `${startDate} – ${endDate}`, statut: 'DISPONIBLE',
            };
            this.historiqueRapports.update(list => [newRapport, ...list]);
            this.download(result, this.reportService.generateExportFilename(type, 'pdf'));
            this.toast('success', `Rapport « ${TYPE_META[type].label} » généré.`);
          } else {
            this.toast('error', `Échec : ${this.httpMsg((result as { __error: true; raw: unknown }).raw)}`);
          }
        },
      });
    this.subs.push(sub);
  }

  downloadRapport(rapport: HistoriqueRapport): void {
    if (this.downloadingId() === rapport.id) return;
    this.downloadingId.set(rapport.id);
    const sub = this.reportService
      .exportReportPDF(rapport.type)
      .pipe(catchError((err: unknown) => of({ __error: true, raw: err })))
      .subscribe({
        next: async (result: unknown) => {
          this.downloadingId.set(null);
          if (result instanceof Blob) {
            const errMsg = await this.checkBlob(result);
            if (errMsg) { this.toast('error', `Téléchargement impossible : ${errMsg}`); return; }
            this.download(result, this.reportService.generateExportFilename(rapport.type, 'pdf'));
            this.toast('success', `« ${rapport.typeLabel} » téléchargé.`);
          } else {
            this.toast('error', `Échec : ${this.httpMsg((result as { __error: true; raw: unknown }).raw)}`);
          }
        },
      });
    this.subs.push(sub);
  }

  toast(type: Toast['type'], message: string): void {
    const id = ++this.toastCounter;
    this.toasts.update(list => [...list, { id, type, message }]);
    setTimeout(() => this.toasts.update(list => list.filter(t => t.id !== id)), 4500);
  }

  dismissToast(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  private getPeriodDates(): { startDate: string; endDate: string } {
    const now = new Date();
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    let start: Date;
    switch (this.selectedPeriod()) {
      case 'month':    start = new Date(now.getFullYear(), now.getMonth(), 1); break;
      case 'semester': start = new Date(now.getFullYear(), now.getMonth() < 6 ? 0 : 6, 1); break;
      case 'year':     start = new Date(now.getFullYear(), 0, 1); break;
      default: {
        start = new Date(now);
        const day = now.getDay() || 7;
        start.setDate(now.getDate() - day + 1);
      }
    }
    return { startDate: fmt(start), endDate: fmt(now) };
  }

  private updateChartData(period: string): void {
    switch (period) {
      case 'month':
        this.occupationData.set([
          { day: 'S1', amphi: 55, labo: 70, td: 82 }, { day: 'S2', amphi: 48, labo: 85, td: 90 },
          { day: 'S3', amphi: 62, labo: 78, td: 88 }, { day: 'S4', amphi: 70, labo: 92, td: 95 },
        ]);
        this.trendData.set([
          { label: 'S1', conflits: 4, reservations: 24 }, { label: 'S2', conflits: 6, reservations: 22 },
          { label: 'S3', conflits: 3, reservations: 28 }, { label: 'S4', conflits: 2, reservations: 26 },
        ]);
        break;
      case 'semester':
        this.occupationData.set([
          { day: 'jan', amphi: 40, labo: 65, td: 78 }, { day: 'fév', amphi: 52, labo: 72, td: 85 },
          { day: 'mar', amphi: 60, labo: 80, td: 92 }, { day: 'avr', amphi: 55, labo: 88, td: 95 },
          { day: 'mai', amphi: 45, labo: 76, td: 88 }, { day: 'jun', amphi: 30, labo: 60, td: 70 },
        ]);
        this.trendData.set([
          { label: 'jan', conflits: 14, reservations: 88 }, { label: 'fév', conflits: 10, reservations: 92 },
          { label: 'mar', conflits: 8,  reservations: 100 }, { label: 'avr', conflits: 15, reservations: 85 },
          { label: 'mai', conflits: 6,  reservations: 108 }, { label: 'jun', conflits: 4,  reservations: 75 },
        ]);
        break;
      default:
        this.occupationData.set([
          { day: 'Lun', amphi: 20, labo: 80, td: 95  }, { day: 'Mar', amphi: 15, labo: 90, td: 100 },
          { day: 'Mer', amphi: 10, labo: 70, td: 85  }, { day: 'Jeu', amphi: 18, labo: 85, td: 90  },
          { day: 'Ven', amphi: 60, labo: 75, td: 78  },
        ]);
        this.trendData.set([
          { label: 'lun', conflits: 3, reservations: 22 }, { label: 'mar', conflits: 2, reservations: 25 },
          { label: 'mer', conflits: 5, reservations: 18 }, { label: 'jeu', conflits: 1, reservations: 28 },
          { label: 'ven', conflits: 4, reservations: 20 },
        ]);
    }
  }

  private download(blob: Blob, filename: string): void {
    const url  = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url; link.download = filename;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  private async checkBlob(blob: Blob): Promise<string | null> {
    try { const h = await blob.slice(0, 4).text(); if (h.startsWith('%PDF')) return null; } catch { return null; }
    try { const j = JSON.parse(await blob.text()); return j?.message ?? j?.error ?? 'Réponse invalide.'; }
    catch { return "Le fichier reçu n'est pas un PDF valide."; }
  }

  private httpMsg(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0)   return 'Serveur inaccessible.';
      if (err.status === 401) return 'Session expirée.';
      if (err.status === 403) return 'Accès refusé.';
      if (err.status === 404) return 'Rapport introuvable.';
      if (err.status >= 500)  return 'Erreur interne serveur.';
      return `Erreur ${err.status}`;
    }
    return 'Erreur inattendue.';
  }
}
