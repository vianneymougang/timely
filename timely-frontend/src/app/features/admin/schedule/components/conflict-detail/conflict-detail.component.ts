import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ConflitResponse,
  TypeConflitLabels,
  SeveriteLabels
} from '../../../../../core/models/planning.model';

@Component({
  selector: 'app-conflict-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conflict-detail.component.html',
  styleUrl: './conflict-detail.component.scss'
})
export class ConflictDetailComponent {
  @Input() set conflict(value: ConflitResponse | null) {
    this.conflit.set(value);
  }

  @Input() isOpen = signal(false);
  @Output() close = new EventEmitter<void>();
  @Output() resolve = new EventEmitter<string>();

  conflit = signal<ConflitResponse | null>(null);
  typeConflitLabels = TypeConflitLabels;
  severiteLabels = SeveriteLabels;

  closeModal(): void {
    this.close.emit();
  }

  resolveConflit(): void {
    const conflict = this.conflit();
    if (conflict) {
      this.resolve.emit(conflict.id);
    }
  }

  getSeveriteColor(severite: string): string {
    switch (severite) {
      case 'CRITIQUE': return 'text-red-600 bg-red-50 border-red-200';
      case 'MOYENNE': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'MINEURE': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }

  getSeveriteIcon(severite: string): string {
    switch (severite) {
      case 'CRITIQUE':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      case 'MOYENNE':
        return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'MINEURE':
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'RESOLU': return 'bg-green-100 text-green-800 border-green-200';
      case 'EN_COURS': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'NON_RESOLU': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
}
