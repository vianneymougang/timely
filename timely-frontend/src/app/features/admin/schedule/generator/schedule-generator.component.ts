import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanningService } from '../../../../core/services/planning.service';
import { EcoleDto, EcoleService } from '../../../../core/services/ecole.service';
import { GeneratePlanningRequest, GeneratePlanningResponse } from '../../../../core/models/planning.model';
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

  constructor() {
    this.generatorForm = this.fb.group({
      ecoleId: ['', Validators.required],
      weekStart: ['', [Validators.required, this.mondayValidator]]
    });
  }

  ngOnInit(): void {
    this.ecoleService.fetchEcolesFromApi().pipe(
      catchError(() => of([]))
    ).subscribe(ecoles => this.ecoles.set(ecoles));
  }

  private mondayValidator(control: import('@angular/forms').AbstractControl) {
    if (!control.value) return null;
    const date = new Date(control.value);
    return date.getDay() === 1 ? null : { notMonday: true };
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
    this.generatorForm.reset();
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
