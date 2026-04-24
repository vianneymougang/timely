import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScheduleGeneratorComponent } from './generator/schedule-generator.component';
import { ScheduleListComponent } from './list/schedule-list.component';

type Tab = 'generate' | 'list';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ScheduleGeneratorComponent,
    ScheduleListComponent
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent {
  activeTab = signal<Tab>('generate');

  selectTab(tab: Tab): void {
    this.activeTab.set(tab);
  }
}
