import { Component, computed, inject } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorBell, phosphorUserCircle, phosphorSignOut, phosphorCaretDown } from '@ng-icons/phosphor-icons/regular';
import { AuthService } from '../../../core/services/auth.service';

const ROUTE_LABELS: Record<string, string> = {
  admin: 'Admin',
  teacher: 'Enseignant',
  dashboard: 'Tableau de bord',
  week: 'Vue semaine',
  schedule: 'Emplois du temps',
  generate: 'Générer',
  explore: 'Explorer',
  view: 'Visualiser',
  conflicts: 'Conflits',
  teachers: 'Enseignants',
  students: 'Étudiants',
  courses: 'Cours',
  academic: 'Structure académique',
  rooms: 'Salles',
  resources: 'Ressources',
  analytics: 'Statistiques & Rapports',
  settings: 'Paramètres',
  availability: 'Disponibilités',
  notifications: 'Notifications',
  profile: 'Profil',
};

export interface BreadcrumbItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-top-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIcon],
  providers: [
    provideIcons({ phosphorBell, phosphorUserCircle, phosphorSignOut, phosphorCaretDown }),
  ],
  templateUrl: './top-header.component.html',
})
export class TopHeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  avatarOpen = false;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const url = this.currentUrl() ?? '';
    const segments = url.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [];
    let accumulated = '';
    for (const seg of segments) {
      accumulated += '/' + seg;
      const label = ROUTE_LABELS[seg];
      if (label) {
        crumbs.push({ label, url: accumulated });
      }
    }
    return crumbs;
  });

  getUserInitials(): string {
    const name = this.currentUser()?.name ?? '';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase() || 'U';
  }

  toggleAvatar(): void {
    this.avatarOpen = !this.avatarOpen;
  }

  logout(): void {
    this.avatarOpen = false;
    this.authService.logout();
  }
}
