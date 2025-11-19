import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
      <div [class]="type === 'warning' ? 'bg-red-50 p-3 rounded-lg' : 'bg-emerald-50 p-3 rounded-lg'">
        @if (type === 'warning') {
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        } @else {
          <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        }
      </div>
      <div class="flex-1">
        <h3 class="font-semibold text-slate-800">{{ title }}</h3>
        <p class="text-sm text-slate-500">{{ subtitle }} • {{ time }}</p>
      </div>
      <button
        [class]="type === 'warning' ? 'bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity' : 'bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity'">
        Résoudre
      </button>
    </div>
  `
})
export class AlertCardComponent {
  @Input() type: 'warning' | 'success' = 'warning';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() time: string = '';
}

