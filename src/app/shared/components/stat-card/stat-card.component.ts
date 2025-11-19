import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-600 mb-1">{{ title }}</p>
          <p class="text-3xl font-bold text-slate-800">{{ value }}</p>
        </div>
        <div [class]="'text-white p-3 rounded-lg ' + bgColor">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() bgColor: string = 'bg-blue-500';
}
