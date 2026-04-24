import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreneauResponse, DayOfWeek, DayOfWeekLabels } from '../../../core/models/planning.model';

interface TimeSlot {
  time: string;
  label: string;
  creneaux: Map<DayOfWeek, CreneauResponse[]>;
}

@Component({
  selector: 'app-schedule-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-grid.component.html',
  styleUrl: './schedule-grid.component.scss',
})
export class ScheduleGridComponent {
  @Input() creneaux: CreneauResponse[] = [];
  @Input() daysOfWeek: DayOfWeek[] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];
  @Output() creneauClicked = new EventEmitter<CreneauResponse>();

  dayLabels = DayOfWeekLabels;

  readonly fixedTimeSlots = [
    { time: '08:00' },
    { time: '09:00' },
    { time: '10:00' },
    { time: '11:00' },
    { time: '13:00' },
    { time: '14:00' },
    { time: '15:00' },
    { time: '16:00' },
  ];

  readonly lunchAfterSlot = '11:00';

  getSlotLabel(time: string): string {
    const hour = parseInt(time.split(':')[0], 10);
    return `${hour}h00–${hour + 1}h00`;
  }

  get timeSlots(): TimeSlot[] {
    const timeSlotsMap = new Map<string, Map<DayOfWeek, CreneauResponse[]>>();

    for (const slot of this.fixedTimeSlots) {
      const dayMap = new Map<DayOfWeek, CreneauResponse[]>();
      for (const day of this.daysOfWeek) {
        dayMap.set(day, []);
      }
      timeSlotsMap.set(slot.time, dayMap);
    }

    this.creneaux.forEach((creneau) => {
      const timeKey = creneau.heureDebut.substring(0, 5);
      if (timeSlotsMap.has(timeKey)) {
        timeSlotsMap.get(timeKey)!.get(creneau.jourSemaine)?.push(creneau);
      }
    });

    return this.fixedTimeSlots.map((slot) => ({
      time: slot.time,
      label: this.getSlotLabel(slot.time),
      creneaux: timeSlotsMap.get(slot.time)!,
    }));
  }

  onCreneauClick(creneau: CreneauResponse): void {
    this.creneauClicked.emit(creneau);
  }

  getCreneauColor(creneau: CreneauResponse): string {
    switch (creneau.coursType) {
      case 'CM':
        return 'bg-blue-50 hover:bg-blue-100 border-blue-200 border-l-blue-500';
      case 'TD':
        return 'bg-green-50 hover:bg-green-100 border-green-200 border-l-green-500';
      case 'TP':
        return 'bg-amber-50 hover:bg-amber-100 border-amber-200 border-l-amber-500';
      default:
        return 'bg-gray-50 hover:bg-gray-100 border-gray-200 border-l-gray-400';
    }
  }

  getTypeBadgeColor(coursType: string | undefined): string {
    switch (coursType) {
      case 'CM':
        return 'bg-blue-100 text-blue-700';
      case 'TD':
        return 'bg-green-100 text-green-700';
      case 'TP':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }
}
