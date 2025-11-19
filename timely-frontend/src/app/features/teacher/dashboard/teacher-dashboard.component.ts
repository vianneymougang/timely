import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { TeacherService } from '../../../core/services/teacher.service';

interface CourseCard {
  title: string;
  badge: string;
  badgeColor: string;
  classe: string;
  salle: string;
  students: number;
  timeStart: string;
  timeEnd: string;
}

interface Notification {
  title: string;
  time: string;
}

interface WeekOverview {
  day: string;
  courses: string;
  hours: string;
}

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private teacherService = inject(TeacherService);

  currentUser = this.authService.currentUser;
  currentDate = signal('Lundi 20 Octobre 2025');

  stats = signal({
    todayCourses: 2,
    totalCourses: 6,
    weekHours: '10h',
    notifications: 3
  });

  todayCourses = signal<CourseCard[]>([
    {
      title: 'Architecture web',
      badge: 'CM',
      badgeColor: 'bg-emerald-400',
      classe: 'INGE 3 ISI FR',
      salle: 'S003',
      students: 35,
      timeStart: '08:00',
      timeEnd: '10:00'
    },
    {
      title: 'Dev Mobile',
      badge: 'TP',
      badgeColor: 'bg-cyan-400',
      classe: 'INGE 3 ISI FR',
      salle: 'S003',
      students: 35,
      timeStart: '13:00',
      timeEnd: '17:00'
    }
  ]);

  notifications = signal<Notification[]>([
    {
      title: 'Rappel: Cours de Programmation Java demain à 08:00',
      time: '9:00'
    },
    {
      title: 'Emploi du temps mis à jour avec succès',
      time: '9:00'
    },
    {
      title: 'Emploi du temps mis à jour avec succès',
      time: '9:00'
    }
  ]);

  weekOverview = signal<WeekOverview[]>([
    { day: 'Lun', courses: '2 cours', hours: '6h' },
    { day: 'mar', courses: 'aucun', hours: '0h' },
    { day: 'mer', courses: '1 cours', hours: '2h' },
    { day: 'ven', courses: 'aucun', hours: '0h' },
    { day: 'jeu', courses: '1 cours', hours: '4h' },
    { day: 'sam', courses: 'aucun', hours: '0h' }
  ]);

  ngOnInit(): void {
    this.loadTeacherData();
  }

  loadTeacherData(): void {
    // TODO: Charger les vraies données depuis l'API
  }

  logout(): void {
    this.authService.logout();
  }
}
