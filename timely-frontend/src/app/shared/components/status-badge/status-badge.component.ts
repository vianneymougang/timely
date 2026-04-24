import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeStatus =
  | 'published'
  | 'available'
  | 'draft'
  | 'pending'
  | 'conflict'
  | 'unavailable'
  | 'default';

const STATUS_CONFIG: Record<BadgeStatus, { bg: string; text: string; dot: string; label: string }> = {
  published:   { bg: 'bg-green-50',  text: 'text-green-800',  dot: 'bg-green-500',  label: 'Publié' },
  available:   { bg: 'bg-green-50',  text: 'text-green-800',  dot: 'bg-green-500',  label: 'Disponible' },
  draft:       { bg: 'bg-amber-50',  text: 'text-amber-800',  dot: 'bg-amber-400',  label: 'Brouillon' },
  pending:     { bg: 'bg-amber-50',  text: 'text-amber-800',  dot: 'bg-amber-400',  label: 'En attente' },
  conflict:    { bg: 'bg-red-50',    text: 'text-red-800',    dot: 'bg-red-500',    label: 'Conflit' },
  unavailable: { bg: 'bg-red-50',    text: 'text-red-800',    dot: 'bg-red-500',    label: 'Indisponible' },
  default:     { bg: 'bg-gray-100',  text: 'text-gray-700',   dot: 'bg-gray-400',   label: '' },
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          [class]="config().bg + ' ' + config().text">
      <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" [class]="config().dot"></span>
      {{ label || config().label }}
    </span>
  `,
})
export class StatusBadgeComponent {
  @Input() status: BadgeStatus = 'default';
  @Input() label?: string;

  config = computed(() => STATUS_CONFIG[this.status] ?? STATUS_CONFIG['default']);
}
