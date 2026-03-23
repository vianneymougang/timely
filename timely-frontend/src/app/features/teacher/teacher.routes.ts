import { Routes } from '@angular/router';

export const TEACHER_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/teacher-dashboard.component').then(
        (m) => m.TeacherDashboardComponent,
      ),
  },
  {
    path: 'schedule',
    loadComponent: () =>
      import('./schedule/teacher-schedule.component').then(
        (m) => m.TeacherScheduleComponent,
      ),
  },
  {
    path: 'availability',
    loadComponent: () =>
      import('./availability/teacher-availability.component').then(
        (m) => m.TeacherAvailabilityComponent,
      ),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./notifications/teacher-notifications.component').then(
        (m) => m.TeacherNotificationsComponent,
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/teacher-profile.component').then(
        (m) => m.TeacherProfileComponent,
      ),
  },
];
