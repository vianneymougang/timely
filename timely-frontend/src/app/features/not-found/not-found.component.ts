import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [NgmMotionDirective],
  template: `
    <div class="min-h-[100dvh] bg-slate-50 flex items-center justify-center px-6 py-16 overflow-hidden">
      <div class="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

        <!-- Colonne gauche : contenu -->
        <div class="flex flex-col gap-7">

          <div
            ngmMotion
            [initial]="{ opacity: 0, y: 20 }"
            [animate]="{ opacity: 1, y: 0 }"
            [transition]="{ type: 'spring', stiffness: 260, damping: 22, delay: 0.05 }"
            class="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full border border-slate-200 bg-white text-[10px] uppercase tracking-[0.18em] font-medium text-slate-500 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
            Erreur 404
          </div>

          <div
            ngmMotion
            [initial]="{ opacity: 0, y: 24 }"
            [animate]="{ opacity: 1, y: 0 }"
            [transition]="{ type: 'spring', stiffness: 260, damping: 22, delay: 0.15 }"
            class="flex flex-col gap-4"
          >
            <h1 class="text-4xl md:text-[2.85rem] font-bold text-slate-800 leading-tight tracking-tight">
              Page introuvable
            </h1>
            <p class="text-slate-500 text-[0.95rem] leading-relaxed max-w-[48ch]">
              La page que vous cherchez n'existe pas ou a été déplacée.
              Revenez à votre espace de travail ou à la page précédente.
            </p>
          </div>

          <div
            ngmMotion
            [initial]="{ opacity: 0, y: 24 }"
            [animate]="{ opacity: 1, y: 0 }"
            [transition]="{ type: 'spring', stiffness: 260, damping: 22, delay: 0.26 }"
            class="flex flex-col sm:flex-row gap-3 mt-1"
          >
            <button
              (click)="goHome()"
              ngmMotion
              [whileTap]="{ scale: 0.97 }"
              [whileHover]="{ scale: 1.01 }"
              [transition]="{ type: 'spring', stiffness: 400, damping: 20 }"
              class="group inline-flex items-center justify-center gap-3 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-sm transition-colors duration-200"
            >
              Retour au tableau de bord
              <span class="flex items-center justify-center w-6 h-6 rounded-md bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                </svg>
              </span>
            </button>

            <button
              (click)="goBack()"
              ngmMotion
              [whileTap]="{ scale: 0.97 }"
              [transition]="{ type: 'spring', stiffness: 400, damping: 20 }"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium rounded-lg text-sm transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
              </svg>
              Page précédente
            </button>
          </div>

        </div>

        <!-- Colonne droite : décoratif -->
        <div class="relative flex items-center justify-center h-72 md:h-[28rem] select-none" aria-hidden="true">

          <!-- Anneaux concentriques -->
          <div
            ngmMotion
            [initial]="{ opacity: 0, scale: 0.88 }"
            [animate]="{ opacity: 1, scale: 1 }"
            [transition]="{ type: 'spring', stiffness: 200, damping: 24, delay: 0.1 }"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div class="w-80 h-80 rounded-full border border-slate-200/70"></div>
            <div class="absolute w-56 h-56 rounded-full border border-slate-200/50"></div>
            <div class="absolute w-32 h-32 rounded-full border border-teal-200/40"></div>
          </div>

          <!-- Formes flottantes — CSS pur, sans ngmMotion -->
          <div class="float-a absolute top-6 right-10 w-6 h-6 rounded-lg bg-teal-100 border border-teal-200/70"></div>
          <div class="float-b absolute bottom-10 left-6 w-4 h-4 rounded-md bg-teal-200/80 border border-teal-300/60 rotate-45"></div>
          <div class="float-c absolute top-14 left-16 w-2.5 h-2.5 rounded-sm bg-slate-300/80"></div>
          <div class="float-a absolute bottom-6 right-16 w-3 h-3 rounded-sm bg-teal-100 border border-teal-200/50" style="animation-delay: 1.2s;"></div>

          <!-- Chiffre 404 central -->
          <div
            ngmMotion
            [initial]="{ opacity: 0, scale: 0.75, y: 16 }"
            [animate]="{ opacity: 1, scale: 1, y: 0 }"
            [transition]="{ type: 'spring', stiffness: 220, damping: 20, delay: 0.2 }"
            class="relative z-10 flex flex-col items-center gap-3"
          >
            <span class="float-b text-[8rem] md:text-[10rem] font-black leading-none tracking-tighter text-slate-200 select-none">
              404
            </span>
            <div class="flex items-center gap-1.5">
              <div class="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
              <div class="w-8 h-px bg-teal-300/60 rounded-full"></div>
              <div class="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `,
  styles: [`
    @keyframes floatA {
      0%, 100% { transform: translateY(0) rotate(12deg); }
      50%       { transform: translateY(-10px) rotate(12deg); }
    }
    @keyframes floatB {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-14px); }
    }
    @keyframes floatC {
      0%, 100% { transform: translateY(0) rotate(6deg); }
      50%       { transform: translateY(-7px) rotate(6deg); }
    }

    .float-a { animation: floatA 5s ease-in-out infinite; }
    .float-b { animation: floatB 4.5s ease-in-out infinite; }
    .float-c { animation: floatC 3.5s ease-in-out infinite 0.4s; }
  `]
})
export class NotFoundComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  goHome(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.isTeacher()) {
      this.router.navigate(['/teacher/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  goBack(): void {
    window.history.back();
  }
}
