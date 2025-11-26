import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-teacher-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-80 bg-white shadow-lg flex flex-col h-screen sticky top-0">
      <!-- Logo -->
      <div class="p-6 border-b">
        <div class="flex items-center gap-3">
          <svg class="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <h1 class="text-2xl font-bold text-slate-800">Timely</h1>
        </div>
      </div>

      <!-- Menu -->
      <nav class="flex-1 p-4 overflow-y-auto">
        @for (item of menuItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-teal-50 text-teal-700 font-medium"
            class="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg mb-2 transition-colors">
            <span class="material-icons text-xl">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Logout -->
      <div class="p-4 border-t">
        <button
          (click)="logout()"
          class="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span>Se déconnecter</span>
        </button>
      </div>

      <!-- User Profile -->
      <div class="p-4 border-t bg-slate-50">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center">
            <span class="text-slate-600 font-semibold text-lg">
              @if (currentUser()) {
                {{ currentUser()!.name.split(' ')[0].charAt(0) }}{{ currentUser()!.name.split(' ')[1]?.charAt(0) }}
              }
            </span>
          </div>
          <div class="flex-1">
            <p class="font-semibold text-slate-800 text-sm">Enseignant</p>
            <p class="text-sm text-slate-600">{{ currentUser()?.name }}</p>
            <p class="text-xs text-slate-500 truncate">{{ currentUser()?.email }}</p>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class TeacherSidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;

  menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Mon tableau de bord', route: '/teacher/dashboard' },
    { icon: 'schedule', label: 'Mon emplois du temps', route: '/teacher/schedule' },
    { icon: 'access_time', label: 'Mes disponibilités', route: '/teacher/availability' },
    { icon: 'notifications', label: 'Mes notifications', route: '/teacher/notifications' },
    { icon: 'person', label: 'Mon profil', route: '/teacher/profile' }
  ];

  logout(): void {
    this.authService.logout();
  }
}
