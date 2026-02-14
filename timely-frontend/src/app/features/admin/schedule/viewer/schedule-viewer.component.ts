import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningService } from '../../../../core/services/planning.service';
import {
  EmploiDuTempsResponse,
  CreneauResponse,
  ConflitResponse,
  DayOfWeek,
  DayOfWeekLabels,
  StatutEmploiLabels,
  TypeConflitLabels,
  SeveriteLabels
} from '../../../../core/models/planning.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface TimeSlot {
  time: string;
  creneaux: Map<DayOfWeek, CreneauResponse | null>;
}

@Component({
  selector: 'app-schedule-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-viewer.component.html',
  styleUrl: './schedule-viewer.component.scss'
})
export class ScheduleViewerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private planningService = inject(PlanningService);

  emploiDuTemps = signal<EmploiDuTempsResponse | null>(null);
  conflits = signal<ConflitResponse[]>([]);
  timeSlots = signal<TimeSlot[]>([]);

  isLoading = signal(false);
  isLoadingConflits = signal(false);
  errorMessage = signal<string | null>(null);

  showConflits = signal(false);
  selectedTab = signal<'grid' | 'conflits'>('grid');

  daysOfWeek: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  dayLabels = DayOfWeekLabels;
  statutLabels = StatutEmploiLabels;
  typeConflitLabels = TypeConflitLabels;
  severiteLabels = SeveriteLabels;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmploiDuTemps(id);
    } else {
      this.errorMessage.set('ID d\'emploi du temps manquant');
    }
  }

  loadEmploiDuTemps(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.planningService.getEmploiDuTempsById(id)
      .pipe(
        catchError(error => {
          console.error('Erreur lors du chargement:', error);
          this.errorMessage.set(
            error.error?.message ||
            'Impossible de charger l\'emploi du temps'
          );
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe(response => {
        if (response) {
          this.emploiDuTemps.set(response);
          this.conflits.set(response.conflits || []);
          this.buildTimeSlots(response.creneaux || []);
        }
      });
  }

  buildTimeSlots(creneaux: CreneauResponse[]): void {
    const timeSlotsMap = new Map<string, Map<DayOfWeek, CreneauResponse>>();

    creneaux.forEach(creneau => {
      const timeKey = creneau.heureDebut;
      if (!timeSlotsMap.has(timeKey)) {
        timeSlotsMap.set(timeKey, new Map());
      }
      timeSlotsMap.get(timeKey)!.set(creneau.jourSemaine, creneau);
    });

    const slots: TimeSlot[] = Array.from(timeSlotsMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([time, creneauxMap]) => ({
        time,
        creneaux: new Map(
          this.daysOfWeek.map(day => [day, creneauxMap.get(day) || null])
        )
      }));

    this.timeSlots.set(slots);
  }

  detectConflits(): void {
    const emploi = this.emploiDuTemps();
    if (!emploi) return;

    this.isLoadingConflits.set(true);
    this.planningService.getConflitsByEmploi(emploi.id)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la détection des conflits:', error);
          return of([]);
        }),
        finalize(() => this.isLoadingConflits.set(false))
      )
      .subscribe(conflits => {
        this.conflits.set(conflits);
        this.showConflits.set(true);
        this.selectedTab.set('conflits');
      });
  }

  exportPDF(): void {
    const emploi = this.emploiDuTemps();
    if (!emploi) return;

    this.planningService.exportToPDF(emploi.id)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de l\'export PDF:', error);
          alert('Erreur lors de l\'export PDF');
          return of(null);
        })
      )
      .subscribe(blob => {
        if (blob) {
          this.planningService.downloadFile(blob, `emploi-du-temps-${emploi.id}.pdf`);
        }
      });
  }

  exportICal(): void {
    const emploi = this.emploiDuTemps();
    if (!emploi) return;

    this.planningService.exportToICal(emploi.id)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de l\'export iCal:', error);
          alert('Erreur lors de l\'export iCal');
          return of(null);
        })
      )
      .subscribe(blob => {
        if (blob) {
          this.planningService.downloadFile(blob, `emploi-du-temps-${emploi.id}.ics`);
        }
      });
  }

  validateEmploi(): void {
    const emploi = this.emploiDuTemps();
    if (!emploi) return;

    if (!confirm('Voulez-vous valider cet emploi du temps ?')) return;

    this.planningService.validateEmploi(emploi.id)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la validation:', error);
          alert('Erreur lors de la validation');
          return of(null);
        })
      )
      .subscribe(response => {
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

    this.planningService.publishEmploi(emploi.id)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la publication:', error);
          alert('Erreur lors de la publication');
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.emploiDuTemps.set(response);
          alert('Emploi du temps publié avec succès');
        }
      });
  }

  resolveConflit(conflitId: string): void {
    const emploi = this.emploiDuTemps();
    if (!emploi) return;

    const resolution = prompt('Entrez la résolution du conflit:');
    if (!resolution) return;

    this.planningService.resolveConflit(emploi.id, conflitId, resolution)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la résolution:', error);
          alert('Erreur lors de la résolution du conflit');
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          const updatedConflits = this.conflits().map(c =>
            c.id === conflitId ? response : c
          );
          this.conflits.set(updatedConflits);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/admin/schedule']);
  }

  getSeveriteColor(severite: string): string {
    switch (severite) {
      case 'CRITIQUE': return 'bg-red-100 text-red-800 border-red-300';
      case 'MOYENNE': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'MINEURE': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'VALIDATED': return 'bg-blue-100 text-blue-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
