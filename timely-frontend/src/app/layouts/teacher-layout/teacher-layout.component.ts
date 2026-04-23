import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopHeaderComponent } from '../../shared/components/top-header/top-header.component';

@Component({
  selector: 'app-teacher-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, TopHeaderComponent],
  template: `
    <div class="flex min-h-[100dvh] bg-surface-canvas">
      <app-sidebar role="teacher" />
      <div class="flex-1 flex flex-col min-w-0">
        <app-top-header />
        <main class="flex-1 px-8 py-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class TeacherLayoutComponent {}
