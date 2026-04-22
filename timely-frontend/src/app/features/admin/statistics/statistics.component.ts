// statistics.component.ts (version corrigée)
import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, KeyValuePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ReportService } from '../../../core/services/report.service';
import {
  GlobalKPIs,
  RoomUtilizationReport,
  WorkloadReport,
  ReportType,
} from '../../../core/models/report.model';
import { catchError, forkJoin, of, Subscription } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface HistoriqueRapport {
  id: string;
  type: ReportType;
  typeLabel: string;
  dateGeneration: string;
  periode: string;
  statut: 'DISPONIBLE' | 'EN_COURS' | 'ERREUR';
  taille?: string;
}

export interface RapportDetail {
  id: string;
  type: ReportType;
  typeLabel: string;
  dateGeneration: string;
  periode: string;
  statut: 'DISPONIBLE' | 'EN_COURS' | 'ERREUR';
  taille?: string;
  contenu?: {
    resume?: string;
    indicateurs?: Record<string, string | number>;
    details?: string[];
  };
  generatedBy?: string;
  format?: string;
  pages?: number;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, DatePipe], // KeyValuePipe sera utilisé dans le template
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent implements OnInit, OnDestroy {
  private reportService = inject(ReportService);
  private subs: Subscription[] = [];
  private toastCounter = 0;

  // ── State ────────────────────────────────────────────────────────────────
  isLoading      = signal<boolean>(true);
  error          = signal<string | null>(null);
  exportingPdf   = signal<boolean>(false);
  downloadingId  = signal<string | null>(null);
  toasts         = signal<Toast[]>([]);
  showPeriodMenu = signal<boolean>(false);
  selectedPeriod = signal<string>('week');

  // Modal détails
  showDetailModal = signal<boolean>(false);
  selectedRapport = signal<RapportDetail | null>(null);
  isLoadingDetail = signal<boolean>(false);

  kpis         = signal<GlobalKPIs | null>(null);
  roomReport   = signal<RoomUtilizationReport | null>(null);
  workloads    = signal<WorkloadReport[]>([]);

  // ── Computed ─────────────────────────────────────────────────────────────
  periodLabel = computed(() => {
    const map: Record<string, string> = {
      week: 'Cette semaine', month: 'Ce mois',
      semester: 'Ce semestre', year: 'Cette année',
    };
    return map[this.selectedPeriod()] ?? 'Cette semaine';
  });

  maxBar = computed(() =>
    Math.max(...this.occupationParJour().flatMap(d => [d.amphi, d.labo, d.td]), 1)
  );

  // ── Static chart data ─────────────────────────────────────────────────────
  occupationParJour = signal([
    { day: 'Lundi',    amphi: 20, labo: 80,  td: 95  },
    { day: 'Mardi',    amphi: 15, labo: 90,  td: 100 },
    { day: 'Mercredi', amphi: 10, labo: 70,  td: 85  },
    { day: 'Jeudi',    amphi: 18, labo: 85,  td: 90  },
    { day: 'Vendredi', amphi: 60, labo: 75,  td: 78  },
  ]);

  evaluationMensuelle = signal([
    { mois: 'jan', conflits: 12, reservations: 95  },
    { mois: 'fév', conflits: 10, reservations: 90  },
    { mois: 'mar', conflits: 8,  reservations: 100 },
    { mois: 'avr', conflits: 15, reservations: 88  },
    { mois: 'mai', conflits: 6,  reservations: 105 },
  ]);

  historiqueRapports = signal<HistoriqueRapport[]>([
    { id: '1', type: 'ROOM_UTILIZATION', typeLabel: 'Utilisation des Salles',
      dateGeneration: new Date(Date.now() - 86400000).toISOString(),
      periode: '01 avr. – 07 avr. 2025', statut: 'DISPONIBLE', taille: '1.2 Mo' },
    { id: '2', type: 'AVAILABILITY', typeLabel: 'Disponibilités Enseignants',
      dateGeneration: new Date(Date.now() - 172800000).toISOString(),
      periode: '01 mars – 31 mars 2025', statut: 'DISPONIBLE', taille: '845 Ko' },
    { id: '3', type: 'WORKLOAD', typeLabel: 'Charge Horaire',
      dateGeneration: new Date(Date.now() - 259200000).toISOString(),
      periode: '01 mars – 31 mars 2025', statut: 'DISPONIBLE', taille: '2.1 Mo' },
    { id: '4', type: 'AUDIT', typeLabel: "Journal d'Audit",
      dateGeneration: new Date(Date.now() - 345600000).toISOString(),
      periode: 'Semaine 14 – 2025', statut: 'DISPONIBLE', taille: '560 Ko' },
    { id: '5', type: 'ROOM_UTILIZATION', typeLabel: 'Utilisation des Salles',
      dateGeneration: new Date(Date.now() - 432000000).toISOString(),
      periode: '01 fév. – 28 fév. 2025', statut: 'DISPONIBLE', taille: '980 Ko' },
  ]);

  generatingType = signal<ReportType | null>(null);

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void { this.updateChartData(); this.loadData(); }
  ngOnDestroy(): void { this.subs.forEach(s => s.unsubscribe()); }

  // ── Chargement données ────────────────────────────────────────────────────
  loadData(): void {
    this.isLoading.set(true);
    this.error.set(null);
    const { startDate, endDate } = this.getPeriodDates();
    const filters = { startDate, endDate };
    const sub = forkJoin({
      kpis:     this.reportService.getGlobalKPIs().pipe(catchError(() => of(null))),
      room:     this.reportService.getRoomUtilizationReport(filters).pipe(catchError(() => of(null))),
      workload: this.reportService.getAllWorkloadReports(filters).pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ kpis, room, workload }) => {
        if (kpis)     this.kpis.set(kpis as GlobalKPIs);
        if (room)     this.roomReport.set(room as RoomUtilizationReport);
        if (workload) this.workloads.set(workload as WorkloadReport[]);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Erreur lors du chargement des statistiques.');
        this.isLoading.set(false);
      },
    });
    this.subs.push(sub);
  }

  // ── Période ───────────────────────────────────────────────────────────────
  setPeriod(p: string): void {
    this.selectedPeriod.set(p);
    this.showPeriodMenu.set(false);
    this.updateChartData();
    this.loadData();
  }

  togglePeriodMenu(): void {
    this.showPeriodMenu.set(!this.showPeriodMenu());
  }

  private getPeriodDates(): { startDate: string; endDate: string } {
    const now = new Date();
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    let start: Date;
    switch (this.selectedPeriod()) {
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'semester':
        start = new Date(now.getFullYear(), now.getMonth() < 6 ? 0 : 6, 1);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default: {
        start = new Date(now);
        const day = now.getDay() || 7;
        start.setDate(now.getDate() - day + 1);
      }
    }
    return { startDate: fmt(start), endDate: fmt(now) };
  }

  private updateChartData(): void {
    switch (this.selectedPeriod()) {
      case 'month':
        this.occupationParJour.set([
          { day: 'S1', amphi: 55, labo: 70, td: 82 },
          { day: 'S2', amphi: 48, labo: 85, td: 90 },
          { day: 'S3', amphi: 62, labo: 78, td: 88 },
          { day: 'S4', amphi: 70, labo: 92, td: 95 },
        ]);
        this.evaluationMensuelle.set([
          { mois: 'S1',  conflits: 4,  reservations: 24 },
          { mois: 'S2',  conflits: 6,  reservations: 22 },
          { mois: 'S3',  conflits: 3,  reservations: 28 },
          { mois: 'S4',  conflits: 2,  reservations: 26 },
        ]);
        break;
      case 'semester':
        this.occupationParJour.set([
          { day: 'jan', amphi: 40, labo: 65, td: 78 },
          { day: 'fév', amphi: 52, labo: 72, td: 85 },
          { day: 'mar', amphi: 60, labo: 80, td: 92 },
          { day: 'avr', amphi: 55, labo: 88, td: 95 },
          { day: 'mai', amphi: 45, labo: 76, td: 88 },
          { day: 'jun', amphi: 30, labo: 60, td: 70 },
        ]);
        this.evaluationMensuelle.set([
          { mois: 'jan', conflits: 14, reservations: 88 },
          { mois: 'fév', conflits: 10, reservations: 92 },
          { mois: 'mar', conflits: 8,  reservations: 100 },
          { mois: 'avr', conflits: 15, reservations: 85 },
          { mois: 'mai', conflits: 6,  reservations: 108 },
          { mois: 'jun', conflits: 4,  reservations: 75 },
        ]);
        break;
      case 'year':
        this.occupationParJour.set([
          { day: 'T1', amphi: 50, labo: 75, td: 88 },
          { day: 'T2', amphi: 65, labo: 82, td: 92 },
          { day: 'T3', amphi: 45, labo: 68, td: 78 },
          { day: 'T4', amphi: 58, labo: 80, td: 86 },
        ]);
        this.evaluationMensuelle.set([
          { mois: 'jan', conflits: 14, reservations: 88 },
          { mois: 'avr', conflits: 10, reservations: 95 },
          { mois: 'jul', conflits: 6,  reservations: 72 },
          { mois: 'oct', conflits: 12, reservations: 100 },
          { mois: 'déc', conflits: 8,  reservations: 90 },
        ]);
        break;
      default:
        this.occupationParJour.set([
          { day: 'Lundi',    amphi: 20, labo: 80,  td: 95  },
          { day: 'Mardi',    amphi: 15, labo: 90,  td: 100 },
          { day: 'Mercredi', amphi: 10, labo: 70,  td: 85  },
          { day: 'Jeudi',    amphi: 18, labo: 85,  td: 90  },
          { day: 'Vendredi', amphi: 60, labo: 75,  td: 78  },
        ]);
        this.evaluationMensuelle.set([
          { mois: 'lun', conflits: 3,  reservations: 22 },
          { mois: 'mar', conflits: 2,  reservations: 25 },
          { mois: 'mer', conflits: 5,  reservations: 18 },
          { mois: 'jeu', conflits: 1,  reservations: 28 },
          { mois: 'ven', conflits: 4,  reservations: 20 },
        ]);
    }
  }

  // ── Affichage des détails d'un rapport ────────────────────────────────────

  /**
   * Ouvre le modal avec les détails du rapport sélectionné
   */
  viewRapportDetails(rapport: HistoriqueRapport): void {
    this.isLoadingDetail.set(true);
    this.showDetailModal.set(true);

    // Simuler un chargement depuis l'API
    setTimeout(() => {
      const details = this.getRapportDetails(rapport);
      this.selectedRapport.set(details);
      this.isLoadingDetail.set(false);
    }, 300);
  }

  /**
   * Ferme le modal des détails
   */
  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.selectedRapport.set(null);
    this.isLoadingDetail.set(false);
  }

  /**
   * Génère les détails d'un rapport (simulation)
   */
  private getRapportDetails(rapport: HistoriqueRapport): RapportDetail {
    const detailsMap: Record<ReportType, Partial<RapportDetail>> = {
      'ROOM_UTILIZATION': {
        contenu: {
          resume: "Analyse de l'occupation des salles sur la période sélectionnée.",
          indicateurs: {
            'Taux d\'occupation moyen': 78,
            'Salles les plus utilisées': 3,
            'Salles sous-utilisées': 2,
            'Heures de pointe': '10h-12h, 14h-16h'
          },
          details: [
            'Amphithéâtre A : 85% d\'occupation',
            'Laboratoire Bio : 92% d\'occupation',
            'Salle TD 101 : 67% d\'occupation',
            'Salle CM 202 : 73% d\'occupation'
          ]
        },
        generatedBy: 'admin@example.com',
        format: 'PDF',
        pages: 4
      },
      'AVAILABILITY': {
        contenu: {
          resume: "Rapport des disponibilités des enseignants sur la période.",
          indicateurs: {
            'Enseignants disponibles': 28,
            'Enseignants en congé': 2,
            'Taux de couverture': 94,
            'Créneaux critiques': 3
          },
          details: [
            'Disponibilité moyenne : 76%',
            'Jean Dupont : Disponible (12h/semaine)',
            'Marie Martin : Disponible (15h/semaine)',
            'Pierre Durand : Congé cette semaine'
          ]
        },
        generatedBy: 'admin@example.com',
        format: 'PDF',
        pages: 3
      },
      'WORKLOAD': {
        contenu: {
          resume: "Analyse de la charge horaire des enseignants.",
          indicateurs: {
            'Charge moyenne': 18,
            'Charge max': 24,
            'Charge min': 6,
            'Heures totales': 540
          },
          details: [
            'UFR Sciences : 210h',
            'UFR Lettres : 180h',
            'UFR Droit : 150h',
            'Sous-charge détectée : 2 enseignants'
          ]
        },
        generatedBy: 'admin@example.com',
        format: 'PDF',
        pages: 5
      },
      'AUDIT': {
        contenu: {
          resume: "Journal d'audit des actions effectuées dans l'application.",
          indicateurs: {
            'Actions totales': 1247,
            'Créations': 234,
            'Modifications': 567,
            'Suppressions': 89
          },
          details: [
            '23/03/2025 - Création de réservation (user@example.com)',
            '22/03/2025 - Modification planning (admin)',
            '22/03/2025 - Export rapport (manager)',
            '21/03/2025 - Suppression conflit (moderator)'
          ]
        },
        generatedBy: 'system@example.com',
        format: 'PDF',
        pages: 8
      }
    };

    const baseDetail: RapportDetail = {
      id: rapport.id,
      type: rapport.type,
      typeLabel: rapport.typeLabel,
      dateGeneration: rapport.dateGeneration,
      periode: rapport.periode,
      statut: rapport.statut,
      taille: rapport.taille,
      ...detailsMap[rapport.type]
    };

    return baseDetail;
  }

  // ── Export PDF global ─────────────────────────────────────────────────────
  exportPDF(): void {
    if (this.exportingPdf()) return;
    this.exportingPdf.set(true);

    const sub = this.reportService
      .exportReportPDF('ROOM_UTILIZATION')
      .pipe(catchError((err: unknown) => of({ __error: true, raw: err })))
      .subscribe({
        next: async (result: unknown) => {
          this.exportingPdf.set(false);
          if (result instanceof Blob) {
            const errMsg = await this.checkBlob(result);
            if (errMsg) { this.toast('error', `Export impossible : ${errMsg}`); return; }
            this.download(result, this.reportService.generateExportFilename('ROOM_UTILIZATION', 'pdf'));
            this.toast('success', 'Rapport exporté avec succès.');
          } else {
            this.toast('error', `Échec : ${this.httpMsg((result as { __error: true; raw: unknown }).raw)}`);
          }
        },
      });
    this.subs.push(sub);
  }

  // ── Téléchargement ligne historique ──────────────────────────────────────
  downloadRapport(rapport: HistoriqueRapport | RapportDetail): void {
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

  // ── Toast helpers ─────────────────────────────────────────────────────────
  toast(type: Toast['type'], message: string): void {
    const id = ++this.toastCounter;
    this.toasts.update(list => [...list, { id, type, message }]);
    setTimeout(() => this.dismissToast(id), 4500);
  }

  dismissToast(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  // ── Download helpers ──────────────────────────────────────────────────────

  /** Déclenche le téléchargement côté navigateur. */
  private download(blob: Blob, filename: string): void {
    const url  = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href     = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /**
   * Vérifie si le Blob reçu est un vrai PDF.
   * Retourne un message d'erreur si ce n'est pas le cas, null sinon.
   */
  private async checkBlob(blob: Blob): Promise<string | null> {
    try {
      const header = await blob.slice(0, 4).text();
      if (header.startsWith('%PDF')) return null;
    } catch { return null; }
    try {
      const json = JSON.parse(await blob.text());
      return json?.message ?? json?.error ?? 'Réponse serveur invalide.';
    } catch {
      return "Le fichier reçu n'est pas un PDF valide.";
    }
  }

  /** Traduit une erreur HTTP en message lisible. */
  private httpMsg(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0)   return 'Serveur inaccessible.';
      if (err.status === 401) return 'Session expirée, reconnectez-vous.';
      if (err.status === 403) return 'Accès refusé.';
      if (err.status === 404) return 'Rapport introuvable.';
      if (err.status >= 500)  return 'Erreur interne du serveur.';
      return `Erreur ${err.status}`;
    }
    return 'Erreur inattendue.';
  }

  // ── UI helpers ────────────────────────────────────────────────────────────
  barH(v: number): number { return Math.round((v / this.maxBar()) * 110); }

  linePoints(key: 'conflits' | 'reservations'): string {
    const data   = this.evaluationMensuelle();
    const maxVal = Math.max(...data.map(d => d[key]), 1);
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * 300;
      const y = 110 - (d[key] / maxVal) * 100;
      return `${x},${y}`;
    }).join(' ');
  }

  statutClass(s: string): string {
    return ({ DISPONIBLE: 'badge-success', EN_COURS: 'badge-warning', ERREUR: 'badge-error' } as Record<string,string>)[s] ?? 'badge-info';
  }
  statutLabel(s: string): string {
    return ({ DISPONIBLE: 'Disponible', EN_COURS: 'En cours', ERREUR: 'Erreur' } as Record<string,string>)[s] ?? s;
  }
  typeIcon(t: ReportType): string {
    return ({ ROOM_UTILIZATION: 'meeting_room', AVAILABILITY: 'event_available', WORKLOAD: 'bar_chart', AUDIT: 'manage_search' } as Record<string,string>)[t] ?? 'description';
  }
  typeColor(t: ReportType): string {
    return ({ ROOM_UTILIZATION: 'teal', AVAILABILITY: 'green', WORKLOAD: 'blue', AUDIT: 'purple' } as Record<string,string>)[t] ?? 'gray';
  }

  generateReport(type: ReportType): void {
    if (this.generatingType() === type) return;
    this.generatingType.set(type);
    const { startDate, endDate } = this.getPeriodDates();
    const typeLabels: Record<ReportType, string> = {
      ROOM_UTILIZATION: 'Utilisation des Salles',
      AVAILABILITY: 'Disponibilités Enseignants',
      WORKLOAD: 'Charge Horaire',
      AUDIT: "Journal d'Audit",
    };
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
              id: Date.now().toString(),
              type,
              typeLabel: typeLabels[type],
              dateGeneration: new Date().toISOString(),
              periode: `${startDate} – ${endDate}`,
              statut: 'DISPONIBLE',
            };
            this.historiqueRapports.update(list => [newRapport, ...list]);
            this.download(result, this.reportService.generateExportFilename(type, 'pdf'));
            this.toast('success', `Rapport « ${typeLabels[type]} » généré avec succès.`);
          } else {
            this.toast('error', `Échec : ${this.httpMsg((result as { __error: true; raw: unknown }).raw)}`);
          }
        },
      });
    this.subs.push(sub);
  }

getObjectKeys(obj: Record<string, string | number> | null | undefined): string[] {
  return obj ? Object.keys(obj) : [];
}

getEntries(obj: Record<string, string | number> | null | undefined): [string, string | number][] {
  return obj ? Object.entries(obj) : [];
}

hasIndicateurs(rapport: RapportDetail | null): boolean {
  return rapport?.contenu?.indicateurs !== undefined &&
         Object.keys(rapport.contenu.indicateurs).length > 0;
}

hasDetails(rapport: RapportDetail | null): boolean {
  return rapport?.contenu?.details !== undefined &&
         rapport.contenu.details.length > 0;
}

getResume(rapport: RapportDetail | null): string {
  return rapport?.contenu?.resume ?? '';
}

getDetails(rapport: RapportDetail | null): string[] {
  return rapport?.contenu?.details ?? [];
}

  get tauxOccupation():    number { return this.kpis()?.tauxOccupationGlobal       ?? 82; }
  get conflitsDetectes():  number { return this.kpis()?.conflitsActifs              ?? 2;  }
  get enseignantsActifs(): number { return this.kpis()?.totalEnseignants            ?? 30; }
  get reservationsTotales():number{ return this.kpis()?.totalReservations           ?? 30; }
}
