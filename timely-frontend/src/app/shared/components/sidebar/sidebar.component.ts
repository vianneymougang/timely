import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/ThemeService';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Tableau de bord', route: '/admin/dashboard' },
    { icon: 'schedule', label: 'Emplois du temps', route: '/admin/schedule' },
    { icon: 'event_note', label: 'Réservations', route: '/admin/reservations' },
    { icon: 'school', label: 'Enseignants', route: '/admin/teachers' },
    { icon: 'school', label: 'Étudiants', route: '/admin/students' },
    { icon: 'menu_book', label: 'Cours & UE', route: '/admin/courses' },
    { icon: 'account_tree', label: 'Écoles & Filières', route: '/admin/academic' },
    { icon: 'inventory_2', label: 'Ressources', route: '/admin/resources' },
    { icon: 'bar_chart', label: 'Statistiques', route: '/admin/statistics' },
    { icon: 'settings', label: 'Paramètres', route: '/admin/settings' },
  ];

  currentUser = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }

  currentTheme: 'light' | 'dark' = 'light';

  constructor(private themeService: ThemeService) {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  /**
   * Get user initials from name
   * Examples: "John Doe" -> "JD", "Admin" -> "AD"
   */
  getUserInitials(name: string): string {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
