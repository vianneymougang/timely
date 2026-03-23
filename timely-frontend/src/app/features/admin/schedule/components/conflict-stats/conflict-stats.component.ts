import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConflitResponse } from '../../../../../core/models/planning.model';

interface ConflictStats {
  total: number;
  critique: number;
  moyenne: number;
  mineure: number;
  resolu: number;
  enCours: number;
  nonResolu: number;
  tauxResolution: number;
}

@Component({
  selector: 'app-conflict-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conflict-stats.component.html',
  styleUrl: './conflict-stats.component.scss'
})
export class ConflictStatsComponent {
  conflits = signal<ConflitResponse[]>([]);

  @Input() set conflicts(value: ConflitResponse[]) {
    this.conflits.set(value);
  }

  stats = computed<ConflictStats>(() => {
    const conflicts = this.conflits();
    const total = conflicts.length;

    const critique = conflicts.filter(c => c.severite === 'CRITIQUE').length;
    const moyenne = conflicts.filter(c => c.severite === 'MOYENNE').length;
    const mineure = conflicts.filter(c => c.severite === 'MINEURE').length;

    const resolu = conflicts.filter(c => c.statutResolution === 'RESOLU').length;
    const enCours = conflicts.filter(c => c.statutResolution === 'EN_COURS').length;
    const nonResolu = conflicts.filter(c => c.statutResolution === 'NON_RESOLU').length;

    const tauxResolution = total > 0 ? Math.round((resolu / total) * 100) : 0;

    return {
      total,
      critique,
      moyenne,
      mineure,
      resolu,
      enCours,
      nonResolu,
      tauxResolution
    };
  });

  getCritiquePercentage = computed(() => {
    const stats = this.stats();
    return stats.total > 0 ? Math.round((stats.critique / stats.total) * 100) : 0;
  });

  getMoyennePercentage = computed(() => {
    const stats = this.stats();
    return stats.total > 0 ? Math.round((stats.moyenne / stats.total) * 100) : 0;
  });

  getMineurePercentage = computed(() => {
    const stats = this.stats();
    return stats.total > 0 ? Math.round((stats.mineure / stats.total) * 100) : 0;
  });
}
