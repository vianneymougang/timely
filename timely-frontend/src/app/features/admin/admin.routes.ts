import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./courses/courses.component').then((m) => m.CoursesComponent),
  },
  {
    path: 'academic',
    loadComponent: () =>
      import('./academic/academic.component').then((m) => m.AcademicComponent),
  },
  {
    path: 'teachers',
    loadComponent: () =>
      import('./teachers/teachers-list/teachers-list.component').then(
        (m) => m.TeachersListComponent,
      ),
  },
  {
    path: 'schedule',
    loadComponent: () =>
      import('./schedule/schedule.component').then((m) => m.ScheduleComponent),
  },
  {
    path: 'reservations',
    loadComponent: () =>
      import('./reservations/reservations.component').then(
        (m) => m.ReservationsComponent,
      ),
  },
  {
    path: 'resources',
    loadComponent: () =>
      import('./ressources/ressources.component').then(
        (m) => m.RessourcesComponent,
      ),
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./statistics/statistics.component').then(
        (m) => m.StatisticsComponent,
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./reports/reports.component').then((m) => m.ReportsComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./etudiants/etudiants.component').then(
        (m) => m.EtudiantsComponent,
      ),
  },
  {
    path: 'room',
    loadComponent: () =>
      import('./room/room.component').then((m) => m.RoomComponent),
  },
];
