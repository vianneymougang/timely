import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorArrowUp,
  phosphorArrowDown,
} from '@ng-icons/phosphor-icons/regular';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, SPRING_DEFAULT } from '../../../core/animations/motion.variants';

export type StatColor = 'indigo' | 'green' | 'amber' | 'red' | 'blue';

const COLOR_MAP: Record<StatColor, { icon: string; value: string; trend: string; bg: string }> = {
  indigo: {
    icon: 'bg-accent-50 text-accent-600',
    value: 'text-gray-900',
    trend: '',
    bg: '',
  },
  green: {
    icon: 'bg-green-50 text-green-600',
    value: 'text-gray-900',
    trend: '',
    bg: '',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600',
    value: 'text-gray-900',
    trend: '',
    bg: '',
  },
  red: {
    icon: 'bg-red-50 text-red-600',
    value: 'text-gray-900',
    trend: '',
    bg: '',
  },
  blue: {
    icon: 'bg-blue-50 text-blue-600',
    value: 'text-gray-900',
    trend: '',
    bg: '',
  },
};

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, NgIcon, NgmMotionDirective],
  providers: [
    provideIcons({ phosphorArrowUp, phosphorArrowDown }),
  ],
  template: `
    <div class="bg-white rounded-xl border border-slate-200/70 p-5 flex items-start gap-4 shadow-[0_2px_8px_rgba(17,24,39,0.06)]"
         ngmMotion
         [initial]="'hidden'"
         [animate]="'visible'"
         [variants]="FADE_UP"
         [transition]="{ type: 'spring', stiffness: 280, damping: 24, delay: delay }">

      <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
           [class]="colorMap[color].icon">
        <ng-content select="[icon]"></ng-content>
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-xs font-medium text-gray-500 mb-0.5 truncate">{{ label }}</p>
        <p class="text-2xl font-bold text-gray-900 font-mono tabular-nums leading-tight">{{ value }}</p>
        @if (sublabel) {
          <p class="text-xs text-gray-400 mt-0.5 truncate">{{ sublabel }}</p>
        }
      </div>

      @if (trend !== null && trend !== undefined) {
        <div class="flex-shrink-0 mt-0.5">
          <span class="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full"
                [class]="trend >= 0
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'">
            <ng-icon [name]="trend >= 0 ? 'phosphorArrowUp' : 'phosphorArrowDown'"
                     style="font-size: 0.7rem">
            </ng-icon>
            {{ trend >= 0 ? '+' : '' }}{{ trend }}%
          </span>
        </div>
      }

    </div>
  `,
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: string | number = '';
  @Input() sublabel?: string;
  @Input() color: StatColor = 'indigo';
  @Input() trend?: number;
  @Input() delay: number = 0;

  readonly colorMap = COLOR_MAP;
  readonly FADE_UP = FADE_UP;
}
