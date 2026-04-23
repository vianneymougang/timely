import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center h-64 text-gray-400">
      <p class="text-sm">Analytiques — Sprint 6</p>
    </div>
  `,
})
export class AnalyticsComponent {}
