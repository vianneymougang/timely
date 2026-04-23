import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorArrowLeft, phosphorFilePdf, phosphorCalendarCheck,
  phosphorWarningCircle, phosphorCheckCircle, phosphorCheck,
  phosphorFunnel, phosphorX, phosphorEye, phosphorArchive,
  phosphorArrowClockwise, phosphorWarningDiamond, phosphorLightbulb,
  phosphorArrowsDownUp, phosphorChalkboardTeacher, phosphorDoor,
  phosphorUsersThree, phosphorSealWarning,
} from '@ng-icons/phosphor-icons/regular';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, SPRING_DEFAULT, SPRING_SNAPPY } from '../../../../core/animations/motion.variants';
import {
  ConflitResponse,
  CreneauResponse,
  DayOfWeek,
  DayOfWeekLabels,
  EmploiDuTempsResponse,
  SeveriteLabels,
  StatutEmploiLabels,
  TypeConflitLabels,
} from '../../../../core/models/planning.model';
import { PlanningService } from '../../../../core/services/planning.service';
import { ConflictDetailComponent } from '../components/conflict-detail/conflict-detail.component';
import {
  ConflictResolverComponent,
  ResolutionData,
} from '../components/conflict-resolver/conflict-resolver.component';
import { ConflictStatsComponent } from '../components/conflict-stats/conflict-stats.component';

interface ToastItem { id: number; type: 'success' | 'error' | 'info'; message: string; }

interface TimeSlot {
  time: string;
  creneaux: Map<DayOfWeek, CreneauResponse[]>;
}

@Component({
  selector: 'app-schedule-viewer',
  standalone: true,
  imports: [
    CommonModule,
    NgIcon,
    NgmMotionDirective,
    ConflictStatsComponent,
    ConflictDetailComponent,
    ConflictResolverComponent,
  ],
  providers: [
    provideIcons({
      phosphorArrowLeft, phosphorFilePdf, phosphorCalendarCheck,
      phosphorWarningCircle, phosphorCheckCircle, phosphorCheck,
      phosphorFunnel, phosphorX, phosphorEye, phosphorArchive,
      phosphorArrowClockwise, phosphorWarningDiamond, phosphorLightbulb,
      phosphorArrowsDownUp, phosphorChalkboardTeacher, phosphorDoor,
      phosphorUsersThree, phosphorSealWarning,
    }),
  ],
  templateUrl: './schedule-viewer.component.html',
  styleUrl: './schedule-viewer.component.scss',
})
export class ScheduleViewerComponent implements OnInit {
  readonly FADE_UP = FADE_UP;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;
  readonly SPRING_SNAPPY = SPRING_SNAPPY;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private planningService = inject(PlanningService);

  emploiDuTemps = signal<EmploiDuTempsResponse | null>(null);
  conflits = signal<ConflitResponse[]>([]);
  timeSlots = signal<TimeSlot[]>([]);
  allCreneaux = signal<CreneauResponse[]>([]);
  viewType = signal<'salle' | 'classe' | 'enseignant'>('salle');
  availableSalles = signal<{ id: string; nom: string }[]>([]);
  availableClasses = signal<{ id: string; nom: string }[]>([]);
  availableEnseignants = signal<{ id: string; nom: string }[]>([]);
  selectedFilterId = signal<string | null>(null);

  get selectedSalleId() { return this.selectedFilterId; }

  readonly FIXED_SLOT_TIMES = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00'];

  isLoading = signal(false);
  isLoadingConflits = signal(false);
  errorMessage = signal<string | null>(null);
  selectedTab = signal<'grid' | 'conflits'>('grid');

  selectedConflits = signal<Set<string>>(new Set());
  filterSeverite = signal<string | null>(null);
  filterType = signal<string | null>(null);
  filterStatut = signal<string | null>(null);
  sortBy = signal<'date' | 'severite' | 'type'>('severite');

  showResolverModal = signal(false);
  showDetailModal = signal(false);
  selectedConflitForResolution = signal<ConflitResponse | null>(null);
  selectedConflitForDetail = signal<ConflitResponse | null>(null);

  private toastId = 0;
  toasts = signal<ToastItem[]>([]);

  pendingValidation = signal(false);
  pendingPublish = signal(false);

  daysOfWeek: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  dayLabels = DayOfWeekLabels;
  statutLabels = StatutEmploiLabels;
  typeConflitLabels = TypeConflitLabels;
  severiteLabels = SeveriteLabels;

  filteredConflits = computed(() => {
    let filtered = this.conflits();
    if (this.filterSeverite()) filtered = filtered.filter((c) => c.severite === this.filterSeverite());
    if (this.filterType()) filtered = filtered.filter((c) => c.typeConflit === this.filterType());
    if (this.filterStatut()) filtered = filtered.filter((c) => c.statutResolution === this.filterStatut());

    const sortBy = this.sortBy();
    return [...filtered].sort((a, b) => {
      if (sortBy === 'date') return new Date(b.dateDetection).getTime() - new Date(a.dateDetection).getTime();
      if (sortBy === 'severite') {
        const order = { CRITIQUE: 0, MOYENNE: 1, MINEURE: 2 };
        return (order[a.severite as keyof typeof order] ?? 3) - (order[b.severite as keyof typeof order] ?? 3);
      }
      if (sortBy === 'type') return a.typeConflit.localeCompare(b.typeConflit);
      return 0;
    });
  });

  allSelected = computed(() => {
    const filtered = this.filteredConflits();
    return filtered.length > 0 && filtered.every((c) => this.selectedConflits().has(c.id));
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmploiDuTemps(id);
    } else {
      this.errorMessage.set("ID d'emploi du temps manquant");
    }
  }

  loadEmploiDuTemps(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.planningService
      .getEmploiDuTempsById(id)
      .pipe(
        catchError((error) => {
          this.errorMessage.set(error.error?.message ?? "Impossible de charger l'emploi du temps");
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((response) => {
        if (response) {
          this.emploiDuTemps.set(response);
          this.conflits.set(response.conflits || []);
          const creneaux = response.creneaux || [];
          this.allCreneaux.set(creneaux);
          this.buildFilterOptions(creneaux);
          this.rebuildGrid();
        }
      });
  }

  private buildFilterOptions(creneaux: CreneauResponse[]): void {
    this.availableSalles.set([
      ...new Map(creneaux.filter((c) => c.salleId).map((c) => [
        c.salleId, { id: c.salleId!, nom: c.salleNom || c.salleId!.substring(0, 8) + '…' },
      ])).values(),
    ]);
    this.availableClasses.set([
      ...new Map(creneaux.filter((c) => c.groupeId).map((c) => [
        c.groupeId, { id: c.groupeId!, nom: c.groupeNom || c.groupeId!.substring(0, 8) + '…' },
      ])).values(),
    ]);
    this.availableEnseignants.set([
      ...new Map(creneaux.filter((c) => c.enseignantId).map((c) => [
        c.enseignantId, { id: c.enseignantId!, nom: c.enseignantNom || c.enseignantId!.substring(0, 8) + '…' },
      ])).values(),
    ]);
  }

  buildTimeSlots(creneaux: CreneauResponse[]): void {
    this.allCreneaux.set(creneaux);
    this.buildFilterOptions(creneaux);
    this.rebuildGrid();
  }

  rebuildGrid(): void {
    const filterId = this.selectedFilterId();
    const type = this.viewType();
    const filtered = filterId
      ? this.allCreneaux().filter((c) => {
          if (type === 'salle') return c.salleId === filterId;
          if (type === 'classe') return c.groupeId === filterId;
          if (type === 'enseignant') return c.enseignantId === filterId;
          return true;
        })
      : this.allCreneaux();

    const timeSlotsMap = new Map<string, Map<DayOfWeek, CreneauResponse[]>>();
    for (const timeStr of this.FIXED_SLOT_TIMES) {
      const dayMap = new Map<DayOfWeek, CreneauResponse[]>();
      for (const day of this.daysOfWeek) dayMap.set(day, []);
      timeSlotsMap.set(timeStr, dayMap);
    }

    filtered.forEach((creneau) => {
      const timeKey = creneau.heureDebut.substring(0, 5);
      if (timeSlotsMap.has(timeKey)) timeSlotsMap.get(timeKey)!.get(creneau.jourSemaine)?.push(creneau);
    });

    this.timeSlots.set(
      Array.from(timeSlotsMap.entries()).map(([time, creneaux]) => ({ time, creneaux }))
    );
  }

  setViewType(type: 'salle' | 'classe' | 'enseignant'): void {
    this.viewType.set(type);
    this.selectedFilterId.set(null);
    this.rebuildGrid();
  }

  setFilter(id: string | null): void {
    this.selectedFilterId.set(id);
    this.rebuildGrid();
  }

  filterBySalle(salleId: string | null): void { this.setFilter(salleId); }

  get currentFilterItems(): { id: string; nom: string }[] {
    const type = this.viewType();
    if (type === 'salle') return this.availableSalles();
    if (type === 'classe') return this.availableClasses();
    return this.availableEnseignants();
  }

  get currentFilterLabel(): string {
    const type = this.viewType();
    if (type === 'salle') return 'salle';
    if (type === 'classe') return 'classe';
    return 'enseignant';
  }

  detectConflits(): void {
    const emploi = this.emploiDuTemps();
    if (!emploi) return;
    this.isLoadingConflits.set(true);
    this.planningService
      .getConflitsByEmploi(emploi.id)
      .pipe(
        catchError(() => { this.showToast('Erreur lors de la détection', 'error'); return of([]); }),
        finalize(() => this.isLoadingConflits.set(false)),
      )
      .subscribe((conflits) => {
        this.conflits.set(conflits);
        this.selectedTab.set('conflits');
        this.showToast(`${conflits.length} conflit${conflits.length !== 1 ? 's' : ''} détecté${conflits.length !== 1 ? 's' : ''}`, conflits.length > 0 ? 'info' : 'success');
      });
  }

  exportPDF(): void {
    const emploi = this.emploiDuTemps();
    if (!emploi) return;
    this.planningService.exportToPDF(emploi.id)
      .pipe(catchError(() => { this.showToast("Erreur lors de l'export PDF", 'error'); return of(null); }))
      .subscribe((blob) => {
        if (blob) this.planningService.downloadFile(blob, `emploi-du-temps-${emploi.id}.pdf`);
      });
  }

  exportICal(): void {
    const emploi = this.emploiDuTemps();
    if (!emploi) return;
    this.planningService.exportToICal(emploi.id)
      .pipe(catchError(() => { this.showToast("Erreur lors de l'export iCal", 'error'); return of(null); }))
      .subscribe((blob) => {
        if (blob) this.planningService.downloadFile(blob, `emploi-du-temps-${emploi.id}.ics`);
      });
  }

  confirmValidate(): void { this.pendingValidation.set(true); }
  cancelValidate(): void { this.pendingValidation.set(false); }

  confirmPublish(): void { this.pendingPublish.set(true); }
  cancelPublish(): void { this.pendingPublish.set(false); }

  validateEmploi(): void {
    const emploi = this.emploiDuTemps();
    if (!emploi) return;
    this.pendingValidation.set(false);
    this.planningService.validateEmploi(emploi.id)
      .pipe(catchError(() => { this.showToast('Erreur lors de la validation', 'error'); return of(null); }))
      .subscribe((response) => {
        if (response) { this.emploiDuTemps.set(response); this.showToast('Emploi du temps validé', 'success'); }
      });
  }

  publishEmploi(): void {
    const emploi = this.emploiDuTemps();
    if (!emploi) return;
    this.pendingPublish.set(false);
    this.planningService.publishEmploi(emploi.id)
      .pipe(catchError(() => { this.showToast('Erreur lors de la publication', 'error'); return of(null); }))
      .subscribe((response) => {
        if (response) { this.emploiDuTemps.set(response); this.showToast('Emploi du temps publié', 'success'); }
      });
  }

  openResolverModal(conflit: ConflitResponse): void {
    this.selectedConflitForResolution.set(conflit);
    this.showResolverModal.set(true);
  }

  openDetailModal(conflit: ConflitResponse): void {
    this.selectedConflitForDetail.set(conflit);
    this.showDetailModal.set(true);
  }

  closeResolverModal(): void { this.showResolverModal.set(false); this.selectedConflitForResolution.set(null); }
  closeDetailModal(): void { this.showDetailModal.set(false); this.selectedConflitForDetail.set(null); }

  resolveConflit(data: ResolutionData): void {
    const emploi = this.emploiDuTemps();
    const conflit = this.selectedConflitForResolution();
    if (!emploi || !conflit) return;

    let resolution = data.commentaire;
    if (data.type === 'DEPLACER_SALLE' && data.nouvelleSalle) resolution = `Déplacé vers salle ${data.nouvelleSalle}: ${data.commentaire}`;
    else if (data.type === 'CHANGER_HORAIRE' && data.nouvelHoraire) resolution = `Horaire modifié à ${data.nouvelHoraire}: ${data.commentaire}`;
    else if (data.type === 'REASSIGNER_ENSEIGNANT' && data.nouvelEnseignant) resolution = `Enseignant réassigné (${data.nouvelEnseignant}): ${data.commentaire}`;
    else if (data.type === 'ANNULER_COURS') resolution = `Cours annulé: ${data.commentaire}`;

    this.planningService.resolveConflit(emploi.id, conflit.id, resolution)
      .pipe(catchError(() => { this.showToast('Erreur lors de la résolution', 'error'); return of(null); }))
      .subscribe((response) => {
        if (response) {
          this.conflits.set(this.conflits().map((c) => (c.id === conflit.id ? response : c)));
          this.showToast('Conflit résolu', 'success');
          this.closeResolverModal();
        }
      });
  }

  resolveConflitFromDetail(conflitId: string): void {
    const conflit = this.conflits().find((c) => c.id === conflitId);
    if (conflit) { this.closeDetailModal(); this.openResolverModal(conflit); }
  }

  toggleConflitSelection(conflitId: string): void {
    const selected = new Set(this.selectedConflits());
    selected.has(conflitId) ? selected.delete(conflitId) : selected.add(conflitId);
    this.selectedConflits.set(selected);
  }

  toggleSelectAll(): void {
    if (this.allSelected()) {
      this.selectedConflits.set(new Set());
    } else {
      this.selectedConflits.set(new Set(this.filteredConflits().map((c) => c.id)));
    }
  }

  markSelectedAsInProgress(): void {
    const selected = this.selectedConflits();
    if (selected.size === 0) { this.showToast('Aucun conflit sélectionné', 'info'); return; }
    this.showToast(`${selected.size} conflit(s) marqué(s) comme en cours`, 'success');
    this.selectedConflits.set(new Set());
  }

  exportConflitsCSV(): void {
    const selected = this.selectedConflits();
    const conflitsToExport = selected.size > 0
      ? this.filteredConflits().filter((c) => selected.has(c.id))
      : this.filteredConflits();

    if (conflitsToExport.length === 0) { this.showToast('Aucun conflit à exporter', 'info'); return; }

    const headers = ['ID', 'Type', 'Sévérité', 'Statut', 'Description', 'Suggestion', 'Date détection'];
    const rows = conflitsToExport.map((c) => [
      c.id, this.typeConflitLabels[c.typeConflit], this.severiteLabels[c.severite],
      c.statutResolution, c.description.replace(/"/g, '""'),
      (c.suggestionResolution || '').replace(/"/g, '""'),
      new Date(c.dateDetection).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `conflits-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast(`${conflitsToExport.length} conflit(s) exporté(s)`, 'success');
  }

  archiveResolvedConflicts(): void {
    const count = this.filteredConflits().filter((c) => c.statutResolution === 'RESOLU').length;
    if (count === 0) { this.showToast('Aucun conflit résolu à archiver', 'info'); return; }
    this.showToast(`${count} conflit(s) archivé(s)`, 'success');
  }

  setFilterSeverite(severite: string | null): void { this.filterSeverite.set(severite); }
  setFilterType(type: string | null): void { this.filterType.set(type); }
  setFilterStatut(statut: string | null): void { this.filterStatut.set(statut); }
  setSortBy(sortBy: string): void { this.sortBy.set(sortBy as 'date' | 'severite' | 'type'); }
  clearFilters(): void { this.filterSeverite.set(null); this.filterType.set(null); this.filterStatut.set(null); }
  clearSelection(): void { this.selectedConflits.set(new Set()); }

  showToast(message: string, type: ToastItem['type']): void {
    const id = ++this.toastId;
    this.toasts.update(l => [...l, { id, type, message }]);
    setTimeout(() => this.toasts.update(l => l.filter(t => t.id !== id)), 4000);
  }

  goBack(): void { this.router.navigate(['/admin/schedule']); }

  getSlotLabel(time: string): string {
    const hour = parseInt(time.split(':')[0], 10);
    return `${hour}h–${hour + 1}h`;
  }

  getStatutBadge(statut: string): string {
    const map: Record<string, string> = {
      PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      VALIDATED: 'bg-blue-50 text-blue-700 border-blue-200',
      DRAFT: 'bg-amber-50 text-amber-700 border-amber-200',
      ARCHIVED: 'bg-gray-50 text-gray-500 border-gray-200',
    };
    return map[statut] ?? 'bg-gray-50 text-gray-500 border-gray-200';
  }

  getSeveriteBadge(severite: string): string {
    const map: Record<string, string> = {
      CRITIQUE: 'bg-red-50 text-red-700 border-red-200',
      MOYENNE: 'bg-amber-50 text-amber-700 border-amber-200',
      MINEURE: 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return map[severite] ?? 'bg-gray-50 text-gray-500 border-gray-200';
  }

  getStatutResolutionBadge(statut: string): string {
    const map: Record<string, string> = {
      RESOLU: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      EN_COURS: 'bg-amber-50 text-amber-700 border-amber-200',
      NON_RESOLU: 'bg-red-50 text-red-700 border-red-200',
    };
    return map[statut] ?? 'bg-gray-50 text-gray-500 border-gray-200';
  }

  getCreneauCellStyle(creneau: CreneauResponse): string {
    const map: Record<string, string> = {
      CM: 'bg-violet-50 border-violet-200 border-l-violet-500',
      TD: 'bg-blue-50 border-blue-200 border-l-blue-500',
      TP: 'bg-teal-50 border-teal-200 border-l-teal-500',
    };
    return map[creneau.coursType ?? ''] ?? 'bg-gray-50 border-gray-200 border-l-gray-400';
  }

  getCreneauTypeBadge(coursType: string): string {
    const map: Record<string, string> = {
      CM: 'bg-violet-100 text-violet-700',
      TD: 'bg-blue-100 text-blue-700',
      TP: 'bg-teal-100 text-teal-700',
    };
    return map[coursType] ?? 'bg-gray-100 text-gray-600';
  }
}
