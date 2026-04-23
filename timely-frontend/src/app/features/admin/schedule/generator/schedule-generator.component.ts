import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorCalendarDots,
  phosphorLightning,
  phosphorCheckCircle,
  phosphorArrowRight,
  phosphorArrowCounterClockwise,
  phosphorWarningCircle,
  phosphorInfo,
  phosphorEye,
} from '@ng-icons/phosphor-icons/regular';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, SCALE_IN, SPRING_DEFAULT } from '../../../../core/animations/motion.variants';
import {
  CampusGenerationRequest,
  CampusGenerationResponse,
} from '../../../../core/models/planning.model';
import { PlanningService } from '../../../../core/services/planning.service';

@Component({
  selector: 'app-schedule-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIcon, NgmMotionDirective],
  providers: [
    provideIcons({
      phosphorCalendarDots, phosphorLightning, phosphorCheckCircle,
      phosphorArrowRight, phosphorArrowCounterClockwise,
      phosphorWarningCircle, phosphorInfo, phosphorEye,
    }),
  ],
  templateUrl: './schedule-generator.component.html',
  styleUrl: './schedule-generator.component.scss',
})
export class ScheduleGeneratorComponent {
  readonly FADE_UP = FADE_UP;
  readonly SCALE_IN = SCALE_IN;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;
  private fb = inject(FormBuilder);
  private planningService = inject(PlanningService);
  private router = inject(Router);

  generatorForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  generationResult = signal<CampusGenerationResponse | null>(null);

  constructor() {
    this.generatorForm = this.fb.group({
      weekStart: ['', [Validators.required, this.mondayValidator]],
    });
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

    const request: CampusGenerationRequest = { weekStart: this.generatorForm.value.weekStart };

    this.planningService
      .generateCampusSchedule(request)
      .pipe(
        catchError((error) => {
          this.errorMessage.set(
            error.error?.message ||
              'Une erreur est survenue lors de la génération des emplois du temps',
          );
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((response) => {
        if (response) {
          this.generationResult.set(response);
        }
      });
  }

  viewSchedule(emploiDuTempsId: string): void {
    this.router.navigate(['/admin/schedule/viewer', emploiDuTempsId]);
  }

  resetForm(): void {
    this.generatorForm.reset();
    this.errorMessage.set(null);
    this.generationResult.set(null);
  }

  getSuccessRateClass(rate: number): string {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }

  getSuccessRateBg(rate: number): string {
    if (rate >= 90) return 'bg-green-50 border-green-200';
    if (rate >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  }

  formatDuration(ms: number): string {
    return (ms / 1000).toFixed(2) + 's';
  }

  getWeekLabel(): string {
    const ws = this.generatorForm.get('weekStart')?.value;
    if (!ws) return '';
    const date = new Date(ws);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
