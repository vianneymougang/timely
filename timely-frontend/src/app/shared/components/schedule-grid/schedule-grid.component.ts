import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CreneauResponse,
  DayOfWeek,
  DayOfWeekLabels
} from '../../../core/models/planning.model';

interface TimeSlot {
  time: string;
  creneaux: Map<DayOfWeek, CreneauResponse | null>;
}

@Component({
  selector: 'app-schedule-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-grid.component.html',
  styleUrl: './schedule-grid.component.scss'
})
export class ScheduleGridComponent {
  @Input() creneaux: CreneauResponse[] = [];
  @Input() daysOfWeek: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  @Output() creneauClicked = new EventEmitter<CreneauResponse>();

  dayLabels = DayOfWeekLabels;

  get timeSlots(): TimeSlot[] {
    const timeSlotsMap = new Map<string, Map<DayOfWeek, CreneauResponse>>();

    this.creneaux.forEach(creneau => {
      const timeKey = creneau.heureDebut;
      if (!timeSlotsMap.has(timeKey)) {
        timeSlotsMap.set(timeKey, new Map());
      }
      timeSlotsMap.get(timeKey)!.set(creneau.jourSemaine, creneau);
    });

    return Array.from(timeSlotsMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([time, creneauxMap]) => ({
        time,
        creneaux: new Map(
          this.daysOfWeek.map(day => [day, creneauxMap.get(day) || null])
        )
      }));
  }

  onCreneauClick(creneau: CreneauResponse): void {
    this.creneauClicked.emit(creneau);
  }

  getCreneauColor(creneau: CreneauResponse): string {
    switch (creneau.statutCreneau) {
      case 'CONFIRME':
        return 'bg-green-50 hover:bg-green-100 border-green-200';
      case 'RESERVE':
        return 'bg-blue-50 hover:bg-blue-100 border-blue-200';
      case 'ANNULE':
        return 'bg-red-50 hover:bg-red-100 border-red-200';
      case 'DISPONIBLE':
      default:
        return 'bg-gray-50 hover:bg-gray-100 border-gray-200';
    }
  }
}
