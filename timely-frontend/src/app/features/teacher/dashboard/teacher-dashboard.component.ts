import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorCalendarBlank, phosphorBooks, phosphorClock,
  phosphorChalkboardTeacher, phosphorDoor, phosphorStudent,
  phosphorArrowRight,
} from '@ng-icons/phosphor-icons/regular';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, SPRING_DEFAULT } from '../../../core/animations/motion.variants';
import { AuthService } from '../../../core/services/auth.service';
import { PlanningService } from '../../../core/services/planning.service';
import { CreneauResponse } from '../../../core/models/planning.model';
import { catchError, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIcon, NgmMotionDirective],
  providers: [
    provideIcons({
      phosphorCalendarBlank, phosphorBooks, phosphorClock,
      phosphorChalkboardTeacher, phosphorDoor, phosphorStudent, phosphorArrowRight,
    }),
  ],
  templateUrl: './teacher-dashboard.component.html',
})
export class TeacherDashboardComponent implements OnInit, OnDestroy {
  readonly FADE_UP = FADE_UP;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;

  private authService = inject(AuthService);
  private planningService = inject(PlanningService);

  private subs: Subscription[] = [];

  currentUser = this.authService.currentUser;
  loading = signal(true);
  weekCreneaux = signal<CreneauResponse[]>([]);

  currentDate = computed(() => {
    const today = new Date();
    return today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  });

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

  todayLabel = computed(() => this.toISODate(new Date()));

  todayCreneaux = computed(() =>
    this.weekCreneaux().filter(c => c.dateCreneau === this.todayLabel())
  );

  weekStats = computed(() => {
    const all = this.weekCreneaux();
    const today = this.todayCreneaux();
    const totalMinutes = all.reduce((acc, c) => {
      const [h1, m1] = c.heureDebut.split(':').map(Number);
      const [h2, m2] = c.heureFin.split(':').map(Number);
      return acc + ((h2 * 60 + m2) - (h1 * 60 + m1));
    }, 0);
    return {
      today: today.length,
      week: all.length,
      hours: Math.round(totalMinutes / 60 * 10) / 10,
    };
  });

  weekDays = computed(() => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const monday = this.getMonday(new Date());
    return days.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = this.toISODate(d);
      const count = this.weekCreneaux().filter(c => c.dateCreneau === iso).length;
      return { label, iso, count, isToday: iso === this.todayLabel() };
    });
  });

  ngOnInit(): void {
    this.loadWeek();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private loadWeek(): void {
    const user = this.authService.currentUser();
    if (!user?.id) { this.loading.set(false); return; }

    const weekStart = this.toISODate(this.getMonday(new Date()));
    const sub = this.planningService.getCreneauxByEnseignant(user.id, weekStart)
      .pipe(catchError(() => of([])))
      .subscribe(data => {
        this.weekCreneaux.set(data);
        this.loading.set(false);
      });
    this.subs.push(sub);
  }

  getTypeBadge(type: string | undefined): string {
    const map: Record<string, string> = {
      CM: 'bg-violet-50 text-violet-700 border-violet-200',
      TD: 'bg-blue-50 text-blue-700 border-blue-200',
      TP: 'bg-teal-50 text-teal-700 border-teal-200',
    };
    return map[type ?? ''] ?? 'bg-gray-50 text-gray-700 border-gray-200';
  }

  getTypeIconBg(type: string | undefined): string {
    const map: Record<string, string> = {
      CM: 'bg-violet-50', TD: 'bg-blue-50', TP: 'bg-teal-50',
    };
    return map[type ?? ''] ?? 'bg-gray-50';
  }

  firstName(): string {
    const name = this.authService.currentUser()?.name ?? '';
    return name.split(' ')[0] || 'Enseignant';
  }

  getDotArray(count: number): number[] {
    return Array.from({ length: Math.min(count, 3) }, (_, i) => i);
  }

  getTypeIconColor(type: string | undefined): string {
    const map: Record<string, string> = {
      CM: 'text-violet-500', TD: 'text-blue-500', TP: 'text-teal-500',
    };
    return map[type ?? ''] ?? 'text-gray-400';
  }
}
