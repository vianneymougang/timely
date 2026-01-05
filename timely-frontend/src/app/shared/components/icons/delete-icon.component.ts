import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg [attr.class]="sizeClass + ' ' + colorClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11v6" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 11v6" />
    </svg>
  `
})
export class DeleteIconComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color: 'default' | 'danger' | 'muted' = 'danger';

  get sizeClass() {
    switch (this.size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-6 h-6';
      default: return 'w-5 h-5';
    }
  }

  get colorClass() {
    switch (this.color) {
      case 'muted': return 'text-slate-400';
      case 'default': return 'text-slate-600';
      default: return 'text-red-600';
    }
  }
}
