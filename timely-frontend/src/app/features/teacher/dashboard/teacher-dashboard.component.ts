import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

interface CourseToday {
  title: string;
  badge: string;
  badgeColor: string;
  timeStart: string;
  timeEnd: string;
  classe: string;
  salle: string;
  students: number;
}

interface Notification {
  title: string;
  time: string;
}

interface DayOverview {
  day: string;
  courses: string;
  hours: string;
}
@Component({
  selector: 'app-teacher-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl:'./teacher-dashboard.component.html'
})
export class TeacherDashboardComponent {
  private authService = inject(AuthService);

  // User info
  currentUser = this.authService.currentUser;

  logout(): void { this.authService.logout(); }
  // Current date
  currentDate = computed(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return today.toLocaleDateString('fr-FR', options);
  });

  // Stats
  stats = signal({
    todayCourses: 3,
    totalCourses: 12,
    weekHours: 24,
    notifications: 5
  });

  // Today's courses
  todayCourses = signal<CourseToday[]>([
    {
      title: 'Mathématiques Avancées',
      badge: 'En cours',
      badgeColor: 'bg-emerald-500',
      timeStart: '08:00',
      timeEnd: '10:00',
      classe: 'L3 Info',
      salle: 'A101',
      students: 45
    },
    {
      title: 'Algorithmique',
      badge: 'À venir',
      badgeColor: 'bg-blue-500',
      timeStart: '10:30',
      timeEnd: '12:30',
      classe: 'L2 Info',
      salle: 'B205',
      students: 38
    },
    {
      title: 'Bases de données',
      badge: 'À venir',
      badgeColor: 'bg-slate-400',
      timeStart: '14:00',
      timeEnd: '16:00',
      classe: 'M1 Info',
      salle: 'C103',
      students: 32
    }
  ]);

  // Notifications
  notifications = signal<Notification[]>([
    {
      title: 'Nouvelle modification de l\'emploi du temps',
      time: 'Il y a 2h'
    },
    {
      title: 'Rappel : Réunion pédagogique demain',
      time: 'Il y a 4h'
    },
    {
      title: 'Demande de rendez-vous étudiant',
      time: 'Hier'
    },
    {
      title: 'Évaluation de cours disponible',
      time: 'Il y a 2 jours'
    },
    {
      title: 'Nouveau document partagé',
      time: 'Il y a 3 jours'
    }
  ]);

  // Week overview
  weekOverview = signal<DayOverview[]>([
    { day: 'Lundi', courses: '3 cours', hours: '6h' },
    { day: 'Mardi', courses: '4 cours', hours: '8h' },
    { day: 'Mercredi', courses: '2 cours', hours: '4h' },
    { day: 'Jeudi', courses: '3 cours', hours: '6h' },
    { day: 'Vendredi', courses: '0 cours', hours: '0h' },
    { day: 'Samedi', courses: '0 cours', hours: '0h' }
  ]);
}
