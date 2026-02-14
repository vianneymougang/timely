import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-sm text-slate-600 mb-1 font-medium">{{ title }}</p>
          <p class="text-3xl font-bold text-slate-800 mb-2">{{ value }}</p>
          @if (subtitle) {
            <p class="text-xs text-slate-500">{{ subtitle }}</p>
          }
          @if (trend !== undefined) {
            <div class="flex items-center mt-2 text-xs">
              @if (trend > 0) {
                <span class="text-green-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  +{{ trend }}%
                </span>
              } @else if (trend < 0) {
                <span class="text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path>
                  </svg>
                  {{ trend }}%
                </span>
              } @else {
                <span class="text-slate-500">Stable</span>
              }
            </div>
          }
        </div>
        <div [class]="'text-white p-4 rounded-xl ' + bgColor">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class KpiCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() subtitle?: string;
  @Input() trend?: number; // Pourcentage de variation
  @Input() bgColor: string = 'bg-blue-500';
}
