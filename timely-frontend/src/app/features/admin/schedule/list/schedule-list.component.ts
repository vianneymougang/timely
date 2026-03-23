import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlanningService } from '../../../../core/services/planning.service';
import {
  EmploiDuTempsResponse,
  SearchPlanningRequest,
  StatutEmploi,
  StatutEmploiLabels
} from '../../../../core/models/planning.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-list.component.html',
  styleUrl: './schedule-list.component.scss'
})
export class ScheduleListComponent implements OnInit {
  private planningService = inject(PlanningService);
  private router = inject(Router);

  emploisDuTemps = signal<EmploiDuTempsResponse[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  currentPage = signal(0);
  pageSize = signal(20);
  totalPages = signal(0);
  totalElements = signal(0);

  searchRequest: SearchPlanningRequest = {
    page: 0,
    size: 20
  };

  statutOptions: { value: StatutEmploi | ''; label: string }[] = [
    { value: '', label: 'Tous les statuts' },
    { value: 'DRAFT', label: 'Brouillon' },
    { value: 'VALIDATED', label: 'Validé' },
    { value: 'PUBLISHED', label: 'Publié' },
    { value: 'ARCHIVED', label: 'Archivé' }
  ];

  statutLabels = StatutEmploiLabels;

  ngOnInit(): void {
    this.loadEmploisDuTemps();
  }

  loadEmploisDuTemps(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.searchRequest.page = this.currentPage();
    this.searchRequest.size = this.pageSize();

    const observable = this.searchRequest.dateDebut || this.searchRequest.statut
      ? this.planningService.searchEmploisDuTemps(this.searchRequest)
      : this.planningService.getAllEmploisDuTemps(this.currentPage(), this.pageSize());

    observable
      .pipe(
        catchError(error => {
          console.error('Erreur lors du chargement:', error);
          this.errorMessage.set('Impossible de charger les emplois du temps');
          return of({ content: [], totalElements: 0, totalPages: 0, size: 20, number: 0, first: true, last: true, empty: true });
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe(page => {
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
    this.router.navigate(['/admin/schedule/viewer', id]);
  }

  deleteSchedule(id: string, event: Event): void {
    event.stopPropagation();

    if (!confirm('Voulez-vous vraiment supprimer cet emploi du temps ?')) {
      return;
    }

    this.planningService.deleteEmploiDuTemps(id)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression');
          return of(null);
        })
      )
      .subscribe(() => {
        this.loadEmploisDuTemps();
      });
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
