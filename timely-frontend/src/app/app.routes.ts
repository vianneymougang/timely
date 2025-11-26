import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard, teacherGuard } from './core/guards/role.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { TeacherLayoutComponent } from './layouts/teacher-layout/teacher-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent)
  },

  // Routes Admin avec Layout
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'teachers',
        loadComponent: () => import('./features/admin/teachers/teachers-list/teachers-list.component')
          .then(m => m.TeachersListComponent)
      },
      {
        path: 'schedule',
        loadComponent: () => import('./features/admin/schedule/schedule.component')
          .then(m => m.ScheduleComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./features/admin/reservations/reservations.component')
          .then(m => m.ReservationsComponent)
      },
      {
        path: 'resources',
        loadComponent: () => import('./features/admin/ressources/ressources.component')
          .then(m => m.RessourcesComponent)
      },
      {
        path: 'statistics',
        loadComponent: () => import('./features/admin/statistics/statistics.component')
          .then(m => m.StatisticsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/settings/settings.component')
          .then(m => m.SettingsComponent)
      }
    ]
  },

  // Routes Teacher avec Layout
  {
    path: 'teacher',
    component: TeacherLayoutComponent,
    canActivate: [authGuard, teacherGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/teacher/dashboard/teacher-dashboard.component')
          .then(m => m.TeacherDashboardComponent)
      },
      {
        path: 'schedule',
        loadComponent: () => import('./features/teacher/schedule/teacher-schedule.component')
          .then(m => m.TeacherScheduleComponent)
      },
      {
        path: 'availability',
        loadComponent: () => import('./features/teacher/availability/teacher-availability.component')
          .then(m => m.TeacherAvailabilityComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/teacher/notifications/teacher-notifications.component')
          .then(m => m.TeacherNotificationsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/teacher/profile/teacher-profile.component')
          .then(m => m.TeacherProfileComponent)
      }
    ]
  },

  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
