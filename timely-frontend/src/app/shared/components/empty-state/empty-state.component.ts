import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { SCALE_IN, SPRING_DEFAULT } from '../../../core/animations/motion.variants';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, NgmMotionDirective],
  template: `
    <div class="flex flex-col items-center justify-center py-16 px-8 text-center"
         ngmMotion
         [initial]="'hidden'"
         [animate]="'visible'"
         [variants]="SCALE_IN"
         [transition]="SPRING_DEFAULT">

      <div class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
        <svg [attr.width]="32" [attr.height]="32" viewBox="0 0 32 32" fill="none">
          @switch (icon) {
            @case ('check') {
              <circle cx="16" cy="16" r="12" stroke="#22C55E" stroke-width="1.5"/>
              <path d="M11 16l3.5 3.5L21 12" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            }
            @case ('search') {
              <circle cx="14" cy="14" r="8" stroke="#9CA3AF" stroke-width="1.5"/>
              <path d="M20 20l4 4" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round"/>
            }
            @case ('calendar') {
              <rect x="4" y="6" width="24" height="22" rx="3" stroke="#9CA3AF" stroke-width="1.5"/>
              <path d="M4 12h24M10 3v6M22 3v6" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round"/>
            }
            @default {
              <rect x="6" y="6" width="20" height="20" rx="4" stroke="#9CA3AF" stroke-width="1.5" stroke-dasharray="3 2"/>
              <path d="M16 12v8M12 16h8" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round"/>
            }
          }
        </svg>
      </div>

      <h3 class="text-base font-semibold text-gray-900 mb-1">{{ title }}</h3>

      @if (description) {
        <p class="text-sm text-gray-500 max-w-xs leading-relaxed">{{ description }}</p>
      }

      @if (actionLabel) {
        <button (click)="action.emit()"
                class="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition-colors">
          {{ actionLabel }}
        </button>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() title: string = 'Aucun résultat';
  @Input() description?: string;
  @Input() icon: 'check' | 'search' | 'calendar' | 'default' = 'default';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();

  readonly SCALE_IN = SCALE_IN;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;
}
