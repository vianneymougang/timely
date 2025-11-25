import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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
        <a
          routerLink="/teacher/dashboard"
          routerLinkActive="bg-teal-50 text-teal-700 font-medium"
          class="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg mb-2 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"/>
          </svg>
          Mon tableau de bord
        </a>

        <a
          routerLink="/teacher/schedule"
          routerLinkActive="bg-teal-50 text-teal-700 font-medium"
          class="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg mb-2 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Mon emplois du temps
        </a>

        <a
          routerLink="/teacher/availability"
          routerLinkActive="bg-teal-50 text-teal-700 font-medium"
          class="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg mb-2 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Mes disponibilités
        </a>

        <a
          routerLink="/teacher/notifications"
          routerLinkActive="bg-teal-50 text-teal-700 font-medium"
          class="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg mb-2 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          Mes notifications
        </a>

        <a
          routerLink="/teacher/profile"
          routerLinkActive="bg-teal-50 text-teal-700 font-medium"
          class="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg mb-2 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          Mon profil
        </a>
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
          Se deconnecter
        </button>
      </div>

      <!-- User Profile -->
      <div class="p-4 border-t bg-slate-50">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center">
            <span class="text-slate-600 font-semibold text-lg">
              @if (currentUser()) {
                {{ currentUser()!.firstName.charAt(0) }}{{ currentUser()!.lastName.charAt(0) }}
              }
            </span>
          </div>
          <div class="flex-1">
            <p class="font-semibold text-slate-800 text-sm">Enseignant</p>
            <p class="text-sm text-slate-600">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</p>
            <p class="text-xs text-slate-500 truncate">{{ currentUser()?.email }}</p>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class TeacherSidebarComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}
