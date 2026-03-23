import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanningService } from '../../../../core/services/planning.service';
import { EcoleDto, EcoleService } from '../../../../core/services/ecole.service';
import { GeneratePlanningRequest, GeneratePlanningResponse, PeriodeEmploi } from '../../../../core/models/planning.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-schedule-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule-generator.component.html',
  styleUrl: './schedule-generator.component.scss'
})
export class ScheduleGeneratorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private planningService = inject(PlanningService);
  private ecoleService = inject(EcoleService);
  private router = inject(Router);

  generatorForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  generationResult = signal<GeneratePlanningResponse | null>(null);
  ecoles = signal<EcoleDto[]>([]);

  periodeOptions: { value: PeriodeEmploi; label: string }[] = [
    { value: 'SEMESTRE_1', label: 'Semestre 1' },
    { value: 'SEMESTRE_2', label: 'Semestre 2' },
    { value: 'ANNUEL', label: 'Annuel' }
  ];

  constructor() {
    this.generatorForm = this.fb.group({
      ecoleId: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      periode: ['SEMESTRE_1', Validators.required],
      creneauxParJour: [6, [Validators.required, Validators.min(1), Validators.max(12)]],
      heureDebutJournee: ['08:00', Validators.required],
      heureFinJournee: ['18:00', Validators.required],
      dureeCreneauMinutes: [90, [Validators.required, Validators.min(30), Validators.max(240)]],
      pauseEntreCreneauxMinutes: [15, [Validators.required, Validators.min(0), Validators.max(60)]]
    });
  }

  ngOnInit(): void {
    this.ecoleService.fetchEcolesFromApi().pipe(
      catchError(() => of([]))
    ).subscribe(ecoles => this.ecoles.set(ecoles));
  }

  onSubmit(): void {
    if (this.generatorForm.invalid) {
      this.generatorForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.generationResult.set(null);

    const request: GeneratePlanningRequest = this.generatorForm.value;

    this.planningService.generateSchedule(request)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la génération:', error);
          this.errorMessage.set(
            error.error?.message ||
            'Une erreur est survenue lors de la génération de l\'emploi du temps'
          );
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe(response => {
        if (response) {
          this.generationResult.set(response);
        }
      });
  }

  viewSchedule(): void {
    const result = this.generationResult();
    if (result) {
      this.router.navigate(['/admin/schedule/viewer', result.emploiDuTempsId]);
    }
  }

  resetForm(): void {
    this.generatorForm.reset({
      periode: 'SEMESTRE_1',
      creneauxParJour: 6,
      heureDebutJournee: '08:00',
      heureFinJournee: '18:00',
      dureeCreneauMinutes: 90,
      pauseEntreCreneauxMinutes: 15
    });
    this.errorMessage.set(null);
    this.generationResult.set(null);
  }

  getSeverityClass(): string {
    const result = this.generationResult();
    if (!result) return '';

    if (result.tauxReussite >= 90) return 'text-green-600';
    if (result.tauxReussite >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }
}
