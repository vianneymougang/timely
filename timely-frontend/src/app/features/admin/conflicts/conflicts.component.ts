import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conflicts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center h-64 text-gray-400">
      <p class="text-sm">Conflits — Sprint 4</p>
    </div>
  `,
})
export class ConflictsComponent {}
