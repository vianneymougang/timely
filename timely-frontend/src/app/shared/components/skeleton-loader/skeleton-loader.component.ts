import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host { display: block; }
    .skeleton-line {
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
      background-size: 400% 100%;
      animation: shimmer 1.5s ease infinite;
      border-radius: 6px;
    }
    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `],
  template: `
    @switch (variant) {
      @case ('card') {
        <div class="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="skeleton-line w-9 h-9 rounded-lg flex-shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="skeleton-line h-3 w-24"></div>
              <div class="skeleton-line h-5 w-16"></div>
            </div>
          </div>
          <div class="skeleton-line h-3 w-full"></div>
          <div class="skeleton-line h-3 w-3/4"></div>
        </div>
      }
      @case ('row') {
        <div class="flex items-center gap-3 py-3 px-4">
          <div class="skeleton-line w-8 h-8 rounded-full flex-shrink-0"></div>
          <div class="flex-1 space-y-1.5">
            <div class="skeleton-line h-3.5 w-40"></div>
            <div class="skeleton-line h-3 w-24"></div>
          </div>
          <div class="skeleton-line h-6 w-16 rounded-full"></div>
        </div>
      }
      @case ('table') {
        <div class="space-y-0">
          @for (_ of rows; track $index) {
            <div class="flex items-center gap-4 px-4 py-3.5 border-b border-slate-50">
              <div class="skeleton-line h-3.5 w-8"></div>
              <div class="skeleton-line h-3.5 flex-1"></div>
              <div class="skeleton-line h-3.5 w-24"></div>
              <div class="skeleton-line h-6 w-20 rounded-full"></div>
            </div>
          }
        </div>
      }
      @default {
        <div class="space-y-3">
          <div class="skeleton-line h-4 w-full"></div>
          <div class="skeleton-line h-4 w-5/6"></div>
          <div class="skeleton-line h-4 w-4/6"></div>
        </div>
      }
    }
  `,
})
export class SkeletonLoaderComponent {
  @Input() variant: 'card' | 'row' | 'table' | 'text' = 'text';
  @Input() count = 5;

  get rows(): number[] {
    return Array(this.count).fill(0);
  }
}
