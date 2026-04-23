import { Component, Input, computed, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorSquaresFour,
  phosphorMagicWand,
  phosphorFolderOpen,
  phosphorWarningCircle,
  phosphorUsers,
  phosphorGraduationCap,
  phosphorBookOpen,
  phosphorTreeStructure,
  phosphorDoor,
  phosphorArchive,
  phosphorChartBar,
  phosphorGear,
  phosphorSignOut,
  phosphorBell,
  phosphorUser,
  phosphorClock,
  phosphorCalendarDots,
  phosphorBooks,
  phosphorHouse,
  phosphorCalendarBlank,
} from '@ng-icons/phosphor-icons/regular';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { AuthService } from '../../../core/services/auth.service';

export interface NavItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

const ADMIN_GROUPS: NavGroup[] = [
  {
    label: 'Vue d\'ensemble',
    items: [
      { icon: 'phosphorSquaresFour', label: 'Tableau de bord', route: '/admin/dashboard' },
    ],
  },
  {
    label: 'Emplois du temps',
    items: [
      { icon: 'phosphorMagicWand', label: 'Générer un EDT', route: '/admin/schedule/generate' },
      { icon: 'phosphorFolderOpen', label: 'Explorer les EDTs', route: '/admin/schedule/explore' },
      { icon: 'phosphorWarningCircle', label: 'Conflits', route: '/admin/conflicts' },
    ],
  },
  {
    label: 'Gestion académique',
    items: [
      { icon: 'phosphorUsers', label: 'Enseignants', route: '/admin/teachers' },
      { icon: 'phosphorGraduationCap', label: 'Étudiants', route: '/admin/students' },
      { icon: 'phosphorBookOpen', label: 'Cours', route: '/admin/courses' },
      { icon: 'phosphorTreeStructure', label: 'Structure académique', route: '/admin/academic' },
    ],
  },
  {
    label: 'Infrastructures',
    items: [
      { icon: 'phosphorDoor', label: 'Salles', route: '/admin/rooms' },
      { icon: 'phosphorArchive', label: 'Ressources', route: '/admin/resources' },
    ],
  },
  {
    label: 'Analyse',
    items: [
      { icon: 'phosphorChartBar', label: 'Statistiques & Rapports', route: '/admin/analytics' },
    ],
  },
];

const TEACHER_GROUPS: NavGroup[] = [
  {
    label: 'Mon planning',
    items: [
      { icon: 'phosphorHouse', label: 'Vue semaine', route: '/teacher/week' },
      { icon: 'phosphorCalendarDots', label: 'Mon EDT complet', route: '/teacher/schedule' },
    ],
  },
  {
    label: 'Ma charge',
    items: [
      { icon: 'phosphorBooks', label: 'Mes cours', route: '/teacher/courses' },
      { icon: 'phosphorClock', label: 'Mes disponibilités', route: '/teacher/availability' },
    ],
  },
  {
    label: 'Personnel',
    items: [
      { icon: 'phosphorBell', label: 'Notifications', route: '/teacher/notifications' },
      { icon: 'phosphorUser', label: 'Mon profil', route: '/teacher/profile' },
    ],
  },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIcon, NgmMotionDirective],
  providers: [
    provideIcons({
      phosphorSquaresFour,
      phosphorMagicWand,
      phosphorFolderOpen,
      phosphorWarningCircle,
      phosphorUsers,
      phosphorGraduationCap,
      phosphorBookOpen,
      phosphorTreeStructure,
      phosphorDoor,
      phosphorArchive,
      phosphorChartBar,
      phosphorGear,
      phosphorSignOut,
      phosphorBell,
      phosphorUser,
      phosphorClock,
      phosphorCalendarDots,
      phosphorBooks,
      phosphorHouse,
      phosphorCalendarBlank,
    }),
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() role: 'admin' | 'teacher' = 'admin';

  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;

  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly navGroups = computed<NavGroup[]>(() =>
    this.role === 'admin' ? ADMIN_GROUPS : TEACHER_GROUPS,
  );

  readonly settingsRoute = computed(() =>
    this.role === 'admin' ? '/admin/settings' : '',
  );

  isActive(route: string): boolean {
    const url = this.currentUrl() ?? '';
    return url === route || url.startsWith(route + '/');
  }

  getUserInitials(): string {
    const name = this.currentUser()?.name ?? '';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase() || 'U';
  }

  logout(): void {
    this.authService.logout();
  }
}
