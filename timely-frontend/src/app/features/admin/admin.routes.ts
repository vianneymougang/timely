import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'schedule',
    children: [
      { path: '', redirectTo: 'generate', pathMatch: 'full' },
      {
        path: 'generate',
        loadComponent: () =>
          import('./schedule/generator/schedule-generator.component').then(
            (m) => m.ScheduleGeneratorComponent,
          ),
      },
      {
        path: 'explore',
        loadComponent: () =>
          import('./schedule/list/schedule-list.component').then(
            (m) => m.ScheduleListComponent,
          ),
      },
      {
        path: 'view/:id',
        loadComponent: () =>
          import('./schedule/viewer/schedule-viewer.component').then(
            (m) => m.ScheduleViewerComponent,
          ),
      },
    ],
  },
  {
    path: 'conflicts',
    loadComponent: () =>
      import('./conflicts/conflicts.component').then((m) => m.ConflictsComponent),
  },
  {
    path: 'teachers',
    loadComponent: () =>
      import('./teachers/teachers-list/teachers-list.component').then(
        (m) => m.TeachersListComponent,
      ),
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./etudiants/etudiants.component').then((m) => m.EtudiantsComponent),
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
    path: 'rooms',
    loadComponent: () =>
      import('./room/room.component').then((m) => m.RoomComponent),
  },
  {
    path: 'resources',
    loadComponent: () =>
      import('./ressources/ressources.component').then((m) => m.RessourcesComponent),
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./analytics/analytics.component').then((m) => m.AnalyticsComponent),
  },
  { path: 'statistics', redirectTo: 'analytics' },
  { path: 'reports', redirectTo: 'analytics' },
  { path: 'room', redirectTo: 'rooms' },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.component').then((m) => m.SettingsComponent),
  },
];
