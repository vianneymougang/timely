import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorCalendarDots,
  phosphorArrowRight,
  phosphorTrash,
  phosphorMagnifyingGlass,
  phosphorArrowClockwise,
  phosphorWarningCircle,
  phosphorCaretLeft,
  phosphorCaretRight,
} from '@ng-icons/phosphor-icons/regular';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, SPRING_DEFAULT } from '../../../../core/animations/motion.variants';
import {
  EmploiDuTempsResponse,
  SearchPlanningRequest,
  StatutEmploi,
  StatutEmploiLabels,
} from '../../../../core/models/planning.model';
import { EcoleDto, EcoleService } from '../../../../core/services/ecole.service';
import { PlanningService } from '../../../../core/services/planning.service';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon, NgmMotionDirective],
  providers: [
    provideIcons({
      phosphorCalendarDots, phosphorArrowRight, phosphorTrash,
      phosphorMagnifyingGlass, phosphorArrowClockwise, phosphorWarningCircle,
      phosphorCaretLeft, phosphorCaretRight,
    }),
  ],
  templateUrl: './schedule-list.component.html',
  styleUrl: './schedule-list.component.scss',
})
export class ScheduleListComponent implements OnInit {
  readonly FADE_UP = FADE_UP;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;
  private planningService = inject(PlanningService);
  private router = inject(Router);
  private ecoleService = inject(EcoleService);

  emploisDuTemps = signal<EmploiDuTempsResponse[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  currentPage = signal(0);
  pageSize = signal(20);
  totalPages = signal(0);
  totalElements = signal(0);

  ecoles = signal<EcoleDto[]>([]);
  ecolesMap = signal<Map<string, string>>(new Map());
  selectedEcoleId = signal<string>('');

  searchRequest: SearchPlanningRequest = {
    page: 0,
    size: 20,
  };

  statutOptions: { value: StatutEmploi | ''; label: string }[] = [
    { value: '', label: 'Tous les statuts' },
    { value: 'DRAFT', label: 'Brouillon' },
    { value: 'VALIDATED', label: 'Validé' },
    { value: 'PUBLISHED', label: 'Publié' },
    { value: 'ARCHIVED', label: 'Archivé' },
  ];

  statutLabels = StatutEmploiLabels;

  ngOnInit(): void {
    this.loadEmploisDuTemps();
    this.ecoleService
      .fetchEcolesFromApi()
      .pipe(catchError(() => of([])))
      .subscribe((ecoles) => {
        this.ecoles.set(ecoles);
        this.ecolesMap.set(new Map(ecoles.map((e) => [e.id, e.nom])));
      });
  }

  loadEmploisDuTemps(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.searchRequest.page = this.currentPage();
    this.searchRequest.size = this.pageSize();

    const observable =
      this.searchRequest.dateDebut || this.searchRequest.statut || this.searchRequest.ecoleId
        ? this.planningService.searchEmploisDuTemps(this.searchRequest)
        : this.planningService.getAllEmploisDuTemps(this.currentPage(), this.pageSize());

    observable
      .pipe(
        catchError((error) => {
          console.error('Erreur lors du chargement:', error);
          this.errorMessage.set('Impossible de charger les emplois du temps');
          return of({
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: 20,
            number: 0,
            first: true,
            last: true,
            empty: true,
          });
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((page) => {
        this.emploisDuTemps.set(page.content);
        this.totalPages.set(page.totalPages);
        this.totalElements.set(page.totalElements);
        this.currentPage.set(page.number);
      });
  }

  onSearch(): void {
    this.currentPage.set(0);
    this.loadEmploisDuTemps();
  }

  onReset(): void {
    this.searchRequest = { page: 0, size: 20 };
    this.currentPage.set(0);
    this.loadEmploisDuTemps();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadEmploisDuTemps();
  }

  viewSchedule(id: string): void {
    this.router.navigate(['/admin/schedule/view', id]);
  }

  deleteSchedule(id: string, event: Event): void {
    event.stopPropagation();

    if (!confirm('Voulez-vous vraiment supprimer cet emploi du temps ?')) {
      return;
    }

    this.planningService
      .deleteEmploiDuTemps(id)
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression');
          return of(null);
        }),
      )
      .subscribe(() => {
        this.loadEmploisDuTemps();
      });
  }

  getEcoleNom(ecoleId: string): string {
    return this.ecolesMap().get(ecoleId) ?? 'École ' + ecoleId.substring(0, 8) + '…';
  }

  onEcoleFilter(): void {
    const ecoleId = this.searchRequest.ecoleId ?? '';
    if (ecoleId) {
      this.searchRequest = { ...this.searchRequest, ecoleId, page: 0 };
    } else {
      const { ecoleId: _removed, ...rest } = this.searchRequest;
      this.searchRequest = { ...rest, page: 0 };
    }
    this.currentPage.set(0);
    this.loadEmploisDuTemps();
  }

  getWeekLabel(dateDebut: string): string {
    if (!dateDebut) return '';
    const d = new Date(dateDebut);
    return (
      'Semaine du ' +
      d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    );
  }

  get groupedByWeek(): { weekLabel: string; emplois: EmploiDuTempsResponse[] }[] {
    const groups = new Map<string, EmploiDuTempsResponse[]>();
    for (const emploi of this.emploisDuTemps()) {
      const key = emploi.dateDebut ?? '';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(emploi);
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, emplois]) => ({ weekLabel: this.getWeekLabel(key), emplois }));
  }

  getStatutColor(statut: StatutEmploi): string {
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
}
