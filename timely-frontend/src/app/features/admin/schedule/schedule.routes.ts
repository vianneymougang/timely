import { Routes } from '@angular/router';
import { ScheduleComponent } from './schedule.component';
import { ScheduleViewerComponent } from './viewer/schedule-viewer.component';

export const routes: Routes = [
  {
    path: '',
    component: ScheduleComponent
  },
  {
    path: 'viewer/:id',
    component: ScheduleViewerComponent
  }
];
