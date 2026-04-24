import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import {
  AvailabilityRequestDto,
  AvailabilityService,
  WeeklyOverrideItem,
  WeeklyOverridesRequestDto,
} from '../../../core/services/availability.service';

interface TimeSlot {
  hour: string;
  slots: { [key: string]: boolean };
}

@Component({
  selector: 'app-teacher-availability',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-availability.component.html',
  styleUrls: ['./teacher-availability.component.scss'],
})
export class TeacherAvailabilityComponent implements OnInit {
  private authService = inject(AuthService);
  private availabilityService = inject(AvailabilityService);

  currentUser = this.authService.currentUser;

  activeTab = signal<'template' | 'exceptions'>('template');

  // — Template tab state —
  isSaving = signal(false);
  successMessage = signal('');
  isDragging = signal(false);
  dragMode = signal<'select' | 'deselect'>('select');
  timeSlots = signal<TimeSlot[]>([]);

  // — Exceptions tab state —
  selectedWeek = signal<string>(this.getCurrentMondayIso());
  exceptionSlots = signal<TimeSlot[]>([]);
  isSavingExceptions = signal(false);
  exceptionsSuccess = signal('');
  isLoadingExceptions = signal(false);

  weekDays = [
    { key: 'lundi',    label: 'Lundi',    dayOfWeek: 'MONDAY'    },
    { key: 'mardi',    label: 'Mardi',    dayOfWeek: 'TUESDAY'   },
    { key: 'mercredi', label: 'Mercredi', dayOfWeek: 'WEDNESDAY' },
    { key: 'jeudi',    label: 'Jeudi',    dayOfWeek: 'THURSDAY'  },
    { key: 'vendredi', label: 'Vendredi', dayOfWeek: 'FRIDAY'    },
    { key: 'samedi',   label: 'Samedi',   dayOfWeek: 'SATURDAY'  },
  ];

  ngOnInit(): void {
    this.initializeTimeSlots();
    this.loadSavedAvailability();
  }

  // ─── Shared helpers ───────────────────────────────────────────

  initializeTimeSlots(): void {
    const slots: TimeSlot[] = [];
    for (let hour = 8; hour < 17; hour++) {
      slots.push({
        hour: `${hour}h - ${hour + 1}h`,
        slots: { lundi: false, mardi: false, mercredi: false, jeudi: false, vendredi: false, samedi: false },
      });
    }
    this.timeSlots.set(slots);
    this.exceptionSlots.set(JSON.parse(JSON.stringify(slots)));
  }

  isPauseSlot(hourIndex: number): boolean {
    return hourIndex === 4; // 12h-13h
  }

  getCurrentMondayIso(): string {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    return monday.toISOString().split('T')[0];
  }

  // ─── Template tab ─────────────────────────────────────────────

  switchTab(tab: 'template' | 'exceptions'): void {
    this.activeTab.set(tab);
    if (tab === 'exceptions') {
      this.loadExceptionSlots();
    }
  }

  loadSavedAvailability(): void {
    this.availabilityService.getMyAvailability().subscribe({
      next: (data) => {
        if (data?.timeSlots) {
          this.timeSlots.set(data.timeSlots);
        }
      },
      error: (error) => {
        if (error?.status !== 404) {
          console.error('Error loading availability:', error);
        }
      },
    });
  }

  toggleSlot(hourIndex: number, day: string): void {
    if (this.isPauseSlot(hourIndex)) return;
    const slots = JSON.parse(JSON.stringify(this.timeSlots()));
    slots[hourIndex].slots[day] = !slots[hourIndex].slots[day];
    this.timeSlots.set(slots);
    this.successMessage.set('');
  }

  onMouseDown(hourIndex: number, day: string, event: MouseEvent): void {
    event.preventDefault();
    if (this.isPauseSlot(hourIndex)) return;
    this.isDragging.set(true);
    this.dragMode.set(this.timeSlots()[hourIndex].slots[day] ? 'deselect' : 'select');
    this.toggleSlot(hourIndex, day);
  }

  onMouseEnter(hourIndex: number, day: string): void {
    if (this.isPauseSlot(hourIndex) || !this.isDragging()) return;
    const currentValue = this.timeSlots()[hourIndex].slots[day];
    const shouldSelect = this.dragMode() === 'select';
    if ((shouldSelect && !currentValue) || (!shouldSelect && currentValue)) {
      this.toggleSlot(hourIndex, day);
    }
  }

  onMouseUp(): void {
    this.isDragging.set(false);
  }

  clearAll(): void {
    const slots = JSON.parse(JSON.stringify(this.timeSlots()));
    slots.forEach((slot: TimeSlot, index: number) => {
      if (!this.isPauseSlot(index)) {
        Object.keys(slot.slots).forEach(k => slot.slots[k] = false);
      }
    });
    this.timeSlots.set(slots);
    this.successMessage.set('');
  }

  selectAll(): void {
    const slots = JSON.parse(JSON.stringify(this.timeSlots()));
    slots.forEach((slot: TimeSlot, index: number) => {
      if (!this.isPauseSlot(index)) {
        Object.keys(slot.slots).forEach(k => slot.slots[k] = true);
      }
    });
    this.timeSlots.set(slots);
    this.successMessage.set('');
  }

  selectWorkDays(): void {
    const slots = JSON.parse(JSON.stringify(this.timeSlots()));
    slots.forEach((slot: TimeSlot, index: number) => {
      if (!this.isPauseSlot(index)) {
        slot.slots = { lundi: true, mardi: true, mercredi: true, jeudi: true, vendredi: true, samedi: false };
      }
    });
    this.timeSlots.set(slots);
    this.successMessage.set('');
  }

  submitAvailability(): void {
    this.isSaving.set(true);
    this.successMessage.set('');
    const availabilityData: AvailabilityRequestDto = { timeSlots: this.timeSlots() };
    this.availabilityService.saveMyAvailability(availabilityData).subscribe({
      next: () => {
        this.successMessage.set('✓ Disponibilités enregistrées avec succès !');
        this.isSaving.set(false);
        setTimeout(() => this.successMessage.set(''), 5000);
      },
      error: (error) => {
        console.error('Error saving availability:', error);
        alert(error?.error?.message ?? "Erreur lors de l'enregistrement");
        this.isSaving.set(false);
      },
    });
  }

  getSelectedSlotsCount(): number {
    return this.timeSlots().reduce((total, slot) =>
      total + Object.values(slot.slots).filter(v => v).length, 0);
  }

  getSelectedHoursCount(): number {
    return this.getSelectedSlotsCount();
  }

  // ─── Exceptions tab ───────────────────────────────────────────

  loadExceptionSlots(): void {
    this.isLoadingExceptions.set(true);
    this.exceptionsSuccess.set('');
    this.availabilityService.getEffectiveAvailability(this.selectedWeek()).subscribe({
      next: (data) => {
        if (data?.timeSlots) {
          this.exceptionSlots.set(data.timeSlots);
        }
        this.isLoadingExceptions.set(false);
      },
      error: (error) => {
        console.error('Error loading effective availability:', error);
        this.exceptionSlots.set(JSON.parse(JSON.stringify(this.timeSlots())));
        this.isLoadingExceptions.set(false);
      },
    });
  }

  onWeekChange(value: string): void {
    const date = new Date(value);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    const monday = date.toISOString().split('T')[0];
    this.selectedWeek.set(monday);
    this.loadExceptionSlots();
  }

  toggleExceptionSlot(hourIndex: number, day: string): void {
    if (this.isPauseSlot(hourIndex)) return;
    const slots = JSON.parse(JSON.stringify(this.exceptionSlots()));
    slots[hourIndex].slots[day] = !slots[hourIndex].slots[day];
    this.exceptionSlots.set(slots);
    this.exceptionsSuccess.set('');
  }

  saveExceptions(): void {
    this.isSavingExceptions.set(true);
    this.exceptionsSuccess.set('');

    const overrides: WeeklyOverrideItem[] = [];
    const template = this.timeSlots();
    const exceptions = this.exceptionSlots();

    for (let i = 0; i < template.length; i++) {
      if (this.isPauseSlot(i)) continue;
      const hourStart = 8 + i;
      for (const day of this.weekDays) {
        const inTemplate = template[i].slots[day.key];
        const inExceptions = exceptions[i].slots[day.key];
        if (inTemplate && !inExceptions) {
          overrides.push({ dayOfWeek: day.dayOfWeek, hourStart, hourEnd: hourStart + 1, overrideType: 'UNAVAILABLE' });
        } else if (!inTemplate && inExceptions) {
          overrides.push({ dayOfWeek: day.dayOfWeek, hourStart, hourEnd: hourStart + 1, overrideType: 'AVAILABLE' });
        }
      }
    }

    const request: WeeklyOverridesRequestDto = { weekStart: this.selectedWeek(), overrides };

    this.availabilityService.saveWeeklyOverrides(request).subscribe({
      next: () => {
        this.exceptionsSuccess.set('✓ Exceptions enregistrées avec succès !');
        this.isSavingExceptions.set(false);
        setTimeout(() => this.exceptionsSuccess.set(''), 5000);
      },
      error: (error) => {
        console.error('Error saving overrides:', error);
        alert(error?.error?.message ?? "Erreur lors de l'enregistrement des exceptions");
        this.isSavingExceptions.set(false);
      },
    });
  }

  getExceptionsCount(): number {
    const template = this.timeSlots();
    const exceptions = this.exceptionSlots();
    let count = 0;
    for (let i = 0; i < template.length; i++) {
      if (this.isPauseSlot(i)) continue;
      for (const day of this.weekDays) {
        if (template[i].slots[day.key] !== exceptions[i].slots[day.key]) count++;
      }
    }
    return count;
  }
}
