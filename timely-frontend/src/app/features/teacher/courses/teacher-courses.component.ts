import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorBooks, phosphorChalkboardTeacher, phosphorClock,
  phosphorFunnel, phosphorNotebook, phosphorStack,
  phosphorChartBar,
} from '@ng-icons/phosphor-icons/regular';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, SPRING_DEFAULT, SPRING_SNAPPY } from '../../../core/animations/motion.variants';
import { AuthService } from '../../../core/services/auth.service';
import { CoursService } from '../../../core/services/cours.service';
import { UEService } from '../../../core/services/ue.service';
import { Cours, UE } from '../../../core/models/cours.model';
import { Subscription } from 'rxjs';

type TypeFilter = 'all' | 'CM' | 'TD' | 'TP';

@Component({
  selector: 'app-teacher-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon, NgmMotionDirective],
  providers: [
    provideIcons({
      phosphorBooks, phosphorChalkboardTeacher, phosphorClock,
      phosphorFunnel, phosphorNotebook, phosphorStack, phosphorChartBar,
    }),
  ],
  templateUrl: './teacher-courses.component.html',
  styleUrl: './teacher-courses.component.scss',
})
export class TeacherCoursesComponent implements OnInit, OnDestroy {
  readonly FADE_UP = FADE_UP;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;
  readonly SPRING_SNAPPY = SPRING_SNAPPY;

  private authService = inject(AuthService);
  private coursService = inject(CoursService);
  private ueService = inject(UEService);

  private subs: Subscription[] = [];

  currentUser = this.authService.currentUser;

  loading = signal(true);
  cours = signal<Cours[]>([]);
  ues = signal<UE[]>([]);

  typeFilter = signal<TypeFilter>('all');

  readonly typeFilters: { id: TypeFilter; label: string }[] = [
    { id: 'all', label: 'Tous' },
    { id: 'CM', label: 'CM' },
    { id: 'TD', label: 'TD' },
    { id: 'TP', label: 'TP' },
  ];

  filteredCours = computed(() => {
    const all = this.cours();
    const filter = this.typeFilter();
    return filter === 'all' ? all : all.filter(c => c.typeCours === filter);
  });

  stats = computed(() => {
    const all = this.cours();
    return {
      total: all.length,
      cm: all.filter(c => c.typeCours === 'CM').length,
      td: all.filter(c => c.typeCours === 'TD').length,
      tp: all.filter(c => c.typeCours === 'TP').length,
      totalHours: all.reduce((acc, c) => acc + c.volumeHoraire, 0),
    };
  });

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private loadData(): void {
    const sub1 = this.coursService.getCours().subscribe(data => {
      const user = this.currentUser();
      const filtered = user?.id
        ? data.filter(c => c.enseignantId === user.id)
        : data;
      this.cours.set(filtered);
      this.loading.set(false);
    });
    const sub2 = this.ueService.getUE().subscribe(data => this.ues.set(data));
    this.subs.push(sub1, sub2);
  }

  getUEName(ueId: string): string {
    const ue = this.ues().find(u => u.id === ueId);
    return ue?.intituleUE ?? '—';
  }

  getTypeBadge(type: 'CM' | 'TD' | 'TP'): string {
    const map: Record<string, string> = {
      CM: 'bg-violet-50 text-violet-700 border-violet-200',
      TD: 'bg-blue-50 text-blue-700 border-blue-200',
      TP: 'bg-teal-50 text-teal-700 border-teal-200',
    };
    return map[type] ?? 'bg-gray-50 text-gray-700 border-gray-200';
  }

  getTypeIcon(type: 'CM' | 'TD' | 'TP'): string {
    const map: Record<string, string> = {
      CM: 'phosphorChalkboardTeacher',
      TD: 'phosphorNotebook',
      TP: 'phosphorStack',
    };
    return map[type] ?? 'phosphorBooks';
  }

  getTypeIconColor(type: 'CM' | 'TD' | 'TP'): string {
    const map: Record<string, string> = {
      CM: 'text-violet-500',
      TD: 'text-blue-500',
      TP: 'text-teal-500',
    };
    return map[type] ?? 'text-gray-400';
  }

  getTypeBgColor(type: 'CM' | 'TD' | 'TP'): string {
    const map: Record<string, string> = {
      CM: 'bg-violet-50',
      TD: 'bg-blue-50',
      TP: 'bg-teal-50',
    };
    return map[type] ?? 'bg-gray-50';
  }
}
