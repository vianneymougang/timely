import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorCaretLeft, phosphorCaretRight, phosphorCalendarBlank,
  phosphorWarningCircle, phosphorArrowClockwise,
} from '@ng-icons/phosphor-icons/regular';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, SPRING_DEFAULT } from '../../../core/animations/motion.variants';
import { CreneauResponse } from '../../../core/models/planning.model';
import { AuthService } from '../../../core/services/auth.service';
import { PlanningService } from '../../../core/services/planning.service';
import { ScheduleGridComponent } from '../../../shared/components/schedule-grid/schedule-grid.component';

@Component({
  selector: 'app-teacher-schedule',
  standalone: true,
  imports: [CommonModule, NgIcon, NgmMotionDirective, ScheduleGridComponent],
  providers: [
    provideIcons({
      phosphorCaretLeft, phosphorCaretRight, phosphorCalendarBlank,
      phosphorWarningCircle, phosphorArrowClockwise,
    }),
  ],
  templateUrl: './teacher-schedule.component.html',
  styleUrl: './teacher-schedule.component.scss',
})
export class TeacherScheduleComponent implements OnInit {
  readonly FADE_UP = FADE_UP;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;

  private planningService = inject(PlanningService);
  private authService = inject(AuthService);
  private router = inject(Router);

  creneaux = signal<CreneauResponse[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  currentWeekStart = signal<Date>(this.getMonday(new Date()));

  readonly weekLabel = computed(() => {
    const d = this.currentWeekStart();
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  });

  ngOnInit(): void {
    this.loadSchedule();
  }

  private getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  loadSchedule(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      this.errorMessage.set('Impossible de récupérer votre identifiant utilisateur.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const weekStart = this.toISODate(this.currentWeekStart());

    this.planningService
      .getCreneauxByEnseignant(user.id, weekStart)
      .pipe(
        catchError((error) => {
          this.errorMessage.set(
            error.error?.message ?? 'Impossible de charger votre emploi du temps.',
          );
          return of([]);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((data) => this.creneaux.set(data));
  }

  prevWeek(): void {
    const d = new Date(this.currentWeekStart());
    d.setDate(d.getDate() - 7);
    this.currentWeekStart.set(d);
    this.loadSchedule();
  }

  nextWeek(): void {
    const d = new Date(this.currentWeekStart());
    d.setDate(d.getDate() + 7);
    this.currentWeekStart.set(d);
    this.loadSchedule();
  }

  goToCurrentWeek(): void {
    this.currentWeekStart.set(this.getMonday(new Date()));
    this.loadSchedule();
  }

  openAvailability(): void {
    const weekStart = this.toISODate(this.currentWeekStart());
    this.router.navigate(['/teacher/availability'], { queryParams: { weekStart } });
  }
}
