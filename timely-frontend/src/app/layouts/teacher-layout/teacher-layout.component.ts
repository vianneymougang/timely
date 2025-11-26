import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeacherSidebarComponent } from '../../shared/components/teacher-sidebar/teacher-sidebar.component';

@Component({
  selector: 'app-teacher-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, TeacherSidebarComponent],
  template: `
    <div class="min-h-screen bg-slate-50 flex">
      <app-teacher-sidebar></app-teacher-sidebar>
      <div class="flex-1">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class TeacherLayoutComponent {}
