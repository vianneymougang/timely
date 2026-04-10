import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
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

interface TimeSlot {
  time: string;
  creneaux: Map<DayOfWeek, CreneauResponse[]>;
}

@Component({
  selector: 'app-schedule-viewer',
  standalone: true,
  imports: [
    CommonModule,
    ConflictStatsComponent,
    ConflictDetailComponent,
    ConflictResolverComponent,
  ],
  templateUrl: './schedule-viewer.component.html',
  styleUrl: './schedule-viewer.component.scss',
})
export class ScheduleViewerComponent implements OnInit {
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
  // compat shim pour l'ancien code
  get selectedSalleId() {
    return this.selectedFilterId;
  }

  readonly FIXED_SLOT_TIMES = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
  ];

  isLoading = signal(false);
  isLoadingConflits = signal(false);
  errorMessage = signal<string | null>(null);

  showConflits = signal(false);
  selectedTab = signal<'grid' | 'conflits'>('grid');

  // Nouveaux signals pour la gestion des conflits
  selectedConflits = signal<Set<string>>(new Set());
  filterSeverite = signal<string | null>(null);
  filterType = signal<string | null>(null);
  filterStatut = signal<string | null>(null);
  sortBy = signal<'date' | 'severite' | 'type'>('severite');

  // Modals
  showResolverModal = signal(false);
  showDetailModal = signal(false);
  selectedConflitForResolution = signal<ConflitResponse | null>(null);
  selectedConflitForDetail = signal<ConflitResponse | null>(null);

  // Toast notification
  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'error' | 'info'>('success');

  daysOfWeek: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  dayLabels = DayOfWeekLabels;
  statutLabels = StatutEmploiLabels;
  typeConflitLabels = TypeConflitLabels;
  severiteLabels = SeveriteLabels;

  // Computed signal pour les conflits filtrés et triés
  filteredConflits = computed(() => {
    let filtered = this.conflits();

    // Appliquer les filtres
    if (this.filterSeverite()) {
      filtered = filtered.filter((c) => c.severite === this.filterSeverite());
    }
    if (this.filterType()) {
      filtered = filtered.filter((c) => c.typeConflit === this.filterType());
    }
    if (this.filterStatut()) {
      filtered = filtered.filter((c) => c.statutResolution === this.filterStatut());
    }

    // Appliquer le tri
    const sortBy = this.sortBy();
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dateDetection).getTime() - new Date(a.dateDetection).getTime();
        case 'severite':
          const severiteOrder = { CRITIQUE: 0, MOYENNE: 1, MINEURE: 2 };
          return (
            severiteOrder[a.severite as keyof typeof severiteOrder] -
            severiteOrder[b.severite as keyof typeof severiteOrder]
          );
        case 'type':
          return a.typeConflit.localeCompare(b.typeConflit);
        default:
          return 0;
      }
    });

    return filtered;
  });

  // Computed pour savoir si tous les conflits sont sélectionnés
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
          console.error('Erreur lors du chargement:', error);
          this.errorMessage.set(error.error?.message || "Impossible de charger l'emploi du temps");
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
          const salles = [
            ...new Map(
              creneaux
                .filter((c) => c.salleId)
                .map((c) => [
                  c.salleId,
                  { id: c.salleId!, nom: c.salleNom || c.salleId!.substring(0, 8) + '…' },
                ]),
            ).values(),
          ];
          const classes = [
            ...new Map(
              creneaux
                .filter((c) => c.groupeId)
                .map((c) => [
                  c.groupeId,
                  { id: c.groupeId!, nom: c.groupeNom || c.groupeId!.substring(0, 8) + '…' },
                ]),
            ).values(),
          ];
          const enseignants = [
            ...new Map(
              creneaux
                .filter((c) => c.enseignantId)
                .map((c) => [
                  c.enseignantId,
                  {
                    id: c.enseignantId!,
                    nom: c.enseignantNom || c.enseignantId!.substring(0, 8) + '…',
                  },
                ]),
            ).values(),
          ];
          this.availableSalles.set(salles);
          this.availableClasses.set(classes);
          this.availableEnseignants.set(enseignants);
          this.rebuildGrid();
        }
      });
  }

  buildTimeSlots(creneaux: CreneauResponse[]): void {
    const salles = [
      ...new Map(
        creneaux
          .filter((c) => c.salleId)
          .map((c) => [
            c.salleId,
            { id: c.salleId!, nom: c.salleNom || c.salleId!.substring(0, 8) + '…' },
          ]),
      ).values(),
    ];
    const classes = [
      ...new Map(
        creneaux
          .filter((c) => c.groupeId)
          .map((c) => [
            c.groupeId,
            { id: c.groupeId!, nom: c.groupeNom || c.groupeId!.substring(0, 8) + '…' },
          ]),
      ).values(),
    ];
    const enseignants = [
      ...new Map(
        creneaux
          .filter((c) => c.enseignantId)
          .map((c) => [
            c.enseignantId,
            { id: c.enseignantId!, nom: c.enseignantNom || c.enseignantId!.substring(0, 8) + '…' },
          ]),
      ).values(),
    ];
    this.availableSalles.set(salles);
    this.availableClasses.set(classes);
    this.availableEnseignants.set(enseignants);
    this.allCreneaux.set(creneaux);
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
      for (const day of this.daysOfWeek) {
        dayMap.set(day, []);
      }
      timeSlotsMap.set(timeStr, dayMap);
    }

    filtered.forEach((creneau) => {
      const timeKey = creneau.heureDebut.substring(0, 5);
      if (timeSlotsMap.has(timeKey)) {
        timeSlotsMap.get(timeKey)!.get(creneau.jourSemaine)?.push(creneau);
      }
    });

    const slots: TimeSlot[] = Array.from(timeSlotsMap.entries()).map(([time, creneauxMap]) => ({
      time,
      creneaux: creneauxMap,
    }));

    this.timeSlots.set(slots);
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

  // Compat pour les anciens appels HTML
  filterBySalle(salleId: string | null): void {
    this.setFilter(salleId);
  }

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
        catchError((error) => {
          console.error('Erreur lors de la détection des conflits:', error);
          return of([]);
        }),
        finalize(() => this.isLoadingConflits.set(false)),
      )
      .subscribe((conflits) => {
        this.conflits.set(conflits);
        this.showConflits.set(true);
        this.selectedTab.set('conflits');
      });
  }

  exportPDF(): void {
    const emploi = this.emploiDuTemps();
    if (!emploi) return;

    this.planningService
      .exportToPDF(emploi.id)
      .pipe(
        catchError((error) => {
          console.error("Erreur lors de l'export PDF:", error);
          alert("Erreur lors de l'export PDF");
          return of(null);
        }),
      )
      .subscribe((blob) => {
        if (blob) {
          this.planningService.downloadFile(blob, `emploi-du-temps-${emploi.id}.pdf`);
        }
      });
  }

  exportICal(): void {
    const emploi = this.emploiDuTemps();
    if (!emploi) return;

    this.planningService
      .exportToICal(emploi.id)
      .pipe(
        catchError((error) => {
          console.error("Erreur lors de l'export iCal:", error);
          alert("Erreur lors de l'export iCal");
          return of(null);
        }),
      )
      .subscribe((blob) => {
        if (blob) {
          this.planningService.downloadFile(blob, `emploi-du-temps-${emploi.id}.ics`);
        }
      });
  }

  validateEmploi(): void {
    const emploi = this.emploiDuTemps();
    if (!emploi) return;

    if (!confirm('Voulez-vous valider cet emploi du temps ?')) return;

    this.planningService
      .validateEmploi(emploi.id)
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de la validation:', error);
          alert('Erreur lors de la validation');
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (response) {
          this.emploiDuTemps.set(response);
          alert('Emploi du temps validé avec succès');
        }
      });
  }

  publishEmploi(): void {
    const emploi = this.emploiDuTemps();
    if (!emploi) return;

    if (!confirm('Voulez-vous publier cet emploi du temps ? Il sera visible par tous.')) return;

    this.planningService
      .publishEmploi(emploi.id)
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de la publication:', error);
          alert('Erreur lors de la publication');
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (response) {
          this.emploiDuTemps.set(response);
          alert('Emploi du temps publié avec succès');
        }
      });
  }

  // Gestion des modals
  openResolverModal(conflit: ConflitResponse): void {
    this.selectedConflitForResolution.set(conflit);
    this.showResolverModal.set(true);
  }

  openDetailModal(conflit: ConflitResponse): void {
    this.selectedConflitForDetail.set(conflit);
    this.showDetailModal.set(true);
  }

  closeResolverModal(): void {
    this.showResolverModal.set(false);
    this.selectedConflitForResolution.set(null);
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.selectedConflitForDetail.set(null);
  }

  // Résolution de conflit
  resolveConflit(data: ResolutionData): void {
    const emploi = this.emploiDuTemps();
    const conflit = this.selectedConflitForResolution();
    if (!emploi || !conflit) return;

    // Construire le message de résolution
    let resolution = data.commentaire;
    if (data.type === 'DEPLACER_SALLE' && data.nouvelleSalle) {
      resolution = `Déplacé vers salle ${data.nouvelleSalle}: ${data.commentaire}`;
    } else if (data.type === 'CHANGER_HORAIRE' && data.nouvelHoraire) {
      resolution = `Horaire modifié à ${data.nouvelHoraire}: ${data.commentaire}`;
    } else if (data.type === 'REASSIGNER_ENSEIGNANT' && data.nouvelEnseignant) {
      resolution = `Enseignant réassigné (${data.nouvelEnseignant}): ${data.commentaire}`;
    } else if (data.type === 'ANNULER_COURS') {
      resolution = `Cours annulé: ${data.commentaire}`;
    }

    this.planningService
      .resolveConflit(emploi.id, conflit.id, resolution)
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de la résolution:', error);
          this.showToast('Erreur lors de la résolution du conflit', 'error');
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (response) {
          const updatedConflits = this.conflits().map((c) => (c.id === conflit.id ? response : c));
          this.conflits.set(updatedConflits);
          this.showToast('Conflit résolu avec succès', 'success');
          this.closeResolverModal();
        }
      });
  }

  resolveConflitFromDetail(conflitId: string): void {
    const conflit = this.conflits().find((c) => c.id === conflitId);
    if (conflit) {
      this.closeDetailModal();
      this.openResolverModal(conflit);
    }
  }

  // Sélection multiple
  toggleConflitSelection(conflitId: string): void {
    const selected = new Set(this.selectedConflits());
    if (selected.has(conflitId)) {
      selected.delete(conflitId);
    } else {
      selected.add(conflitId);
    }
    this.selectedConflits.set(selected);
  }

  toggleSelectAll(): void {
    const filtered = this.filteredConflits();
    if (this.allSelected()) {
      this.selectedConflits.set(new Set());
    } else {
      this.selectedConflits.set(new Set(filtered.map((c) => c.id)));
    }
  }

  // Actions groupées
  markSelectedAsInProgress(): void {
    const selected = this.selectedConflits();
    if (selected.size === 0) {
      this.showToast('Aucun conflit sélectionné', 'info');
      return;
    }

    if (!confirm(`Marquer ${selected.size} conflit(s) comme "En cours de résolution" ?`)) return;

    // TODO: Implémenter l'appel API pour marquer comme en cours
    this.showToast(`${selected.size} conflit(s) marqué(s) comme en cours`, 'success');
    this.selectedConflits.set(new Set());
  }

  exportConflitsCSV(): void {
    const selected = this.selectedConflits();
    const conflitsToExport =
      selected.size > 0
        ? this.filteredConflits().filter((c) => selected.has(c.id))
        : this.filteredConflits();

    if (conflitsToExport.length === 0) {
      this.showToast('Aucun conflit à exporter', 'info');
      return;
    }

    // Créer le CSV
    const headers = [
      'ID',
      'Type',
      'Sévérité',
      'Statut',
      'Description',
      'Suggestion',
      'Date détection',
    ];
    const rows = conflitsToExport.map((c) => [
      c.id,
      this.typeConflitLabels[c.typeConflit],
      this.severiteLabels[c.severite],
      c.statutResolution,
      c.description.replace(/"/g, '""'),
      (c.suggestionResolution || '').replace(/"/g, '""'),
      new Date(c.dateDetection).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `conflits-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast(`${conflitsToExport.length} conflit(s) exporté(s)`, 'success');
  }

  archiveResolvedConflicts(): void {
    const resolvedConflits = this.filteredConflits().filter((c) => c.statutResolution === 'RESOLU');
    if (resolvedConflits.length === 0) {
      this.showToast('Aucun conflit résolu à archiver', 'info');
      return;
    }

    if (!confirm(`Archiver ${resolvedConflits.length} conflit(s) résolu(s) ?`)) return;

    // TODO: Implémenter l'appel API pour archiver
    this.showToast(`${resolvedConflits.length} conflit(s) archivé(s)`, 'success');
  }

  // Filtres et tri
  setFilterSeverite(severite: string | null): void {
    this.filterSeverite.set(severite);
  }

  setFilterType(type: string | null): void {
    this.filterType.set(type);
  }

  setFilterStatut(statut: string | null): void {
    this.filterStatut.set(statut);
  }

  setSortBy(sortBy: string): void {
    this.sortBy.set(sortBy as 'date' | 'severite' | 'type');
  }

  clearFilters(): void {
    this.filterSeverite.set(null);
    this.filterType.set(null);
    this.filterStatut.set(null);
  }

  // Toast notifications
  showToast(message: string, type: 'success' | 'error' | 'info'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }

  // Helper pour réinitialiser la sélection
  clearSelection(): void {
    this.selectedConflits.set(new Set());
  }

  // Helper pour fermer le toast
  closeToast(): void {
    this.toastMessage.set(null);
  }

  goBack(): void {
    this.router.navigate(['/admin/schedule']);
  }

  getSlotLabel(time: string): string {
    const hour = parseInt(time.split(':')[0], 10);
    return `${hour}h00–${hour + 1}h00`;
  }

  getSeveriteColor(severite: string): string {
    switch (severite) {
      case 'CRITIQUE':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'MOYENNE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'MINEURE':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'VALIDATED':
        return 'bg-blue-100 text-blue-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getCreneauCellColor(creneau: CreneauResponse): string {
    switch (creneau.coursType) {
      case 'CM':
        return 'bg-blue-50 hover:bg-blue-100 border-blue-200 border-l-blue-500';
      case 'TD':
        return 'bg-green-50 hover:bg-green-100 border-green-200 border-l-green-500';
      case 'TP':
        return 'bg-amber-50 hover:bg-amber-100 border-amber-200 border-l-amber-500';
      default:
        return 'bg-gray-50 hover:bg-gray-100 border-gray-200 border-l-gray-400';
    }
  }

  getCreneauTypeBadge(coursType: string): string {
    switch (coursType) {
      case 'CM':
        return 'bg-blue-100 text-blue-700';
      case 'TD':
        return 'bg-green-100 text-green-700';
      case 'TP':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }
}
