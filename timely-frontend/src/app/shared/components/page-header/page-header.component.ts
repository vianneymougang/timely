import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, SPRING_DEFAULT } from '../../../core/animations/motion.variants';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, NgmMotionDirective],
  template: `
    <div class="flex items-start justify-between mb-8"
         ngmMotion
         [initial]="'hidden'"
         [animate]="'visible'"
         [variants]="FADE_UP"
         [transition]="SPRING_DEFAULT">
      <div>
        @if (section) {
          <p class="text-xs font-semibold uppercase tracking-[0.08em] text-accent-500 mb-1">{{ section }}</p>
        }
        <h1 class="font-display text-2xl font-semibold tracking-tight text-gray-900">{{ title }}</h1>
        @if (description) {
          <p class="text-sm text-gray-500 mt-1">{{ description }}</p>
        }
      </div>
      @if (hasActions) {
        <div class="flex items-center gap-2 flex-shrink-0 ml-4">
          <ng-content select="[actions]"></ng-content>
        </div>
      }
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() section?: string;
  @Input() title: string = '';
  @Input() description?: string;
  @Input() hasActions = false;

  readonly FADE_UP = FADE_UP;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;
}
