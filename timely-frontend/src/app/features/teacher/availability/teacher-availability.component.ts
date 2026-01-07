import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

interface TimeSlot {
  hour: string;
  slots: {
    [key: string]: boolean; // lundi, mardi, etc.
  };
}

@Component({
  selector: 'app-teacher-availability',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-availability.component.html',
  styleUrls: ['./teacher-availability.component.scss']
})
export class TeacherAvailabilityComponent implements OnInit {
  private authService = inject(AuthService);
  
  currentUser = this.authService.currentUser;
  isSaving = signal(false);
  successMessage = signal('');
  isDragging = signal(false);
  dragMode = signal<'select' | 'deselect'>('select');

  // Jours de la semaine
  weekDays = [
    { key: 'lundi', label: 'Lundi' },
    { key: 'mardi', label: 'Mardi' },
    { key: 'mercredi', label: 'Mercredi' },
    { key: 'jeudi', label: 'Jeudi' },
    { key: 'vendredi', label: 'Vendredi' },
    { key: 'samedi', label: 'Samedi' }
  ];

  // Créneaux horaires (8h - 17h)
  timeSlots = signal<TimeSlot[]>([]);

  ngOnInit(): void {
    this.initializeTimeSlots();
    this.loadSavedAvailability();
  }

  initializeTimeSlots(): void {
    const slots: TimeSlot[] = [];
    
    for (let hour = 8; hour < 17; hour++) {
      slots.push({
        hour: `${hour}h - ${hour + 1}h`,
        slots: {
          lundi: false,
          mardi: false,
          mercredi: false,
          jeudi: false,
          vendredi: false,
          samedi: false
        }
      });
    }
    
    this.timeSlots.set(slots);
  }

  loadSavedAvailability(): void {
    // TODO: Charger les disponibilités sauvegardées depuis l'API
    // this.availabilityService.getMyAvailability().subscribe(...)
    
    // Exemple de données pré-remplies pour la démo
    const savedSlots = [...this.timeSlots()];
    
    // Lundi 12h-17h
    savedSlots[4].slots['lundi'] = true; // 12h-13h
    savedSlots[5].slots['lundi'] = true; // 13h-14h
    savedSlots[6].slots['lundi'] = true; // 14h-15h
    savedSlots[7].slots['lundi'] = true; // 15h-16h
    savedSlots[8].slots['lundi'] = true; // 16h-17h
    
    // Mercredi 8h-17h
    for (let i = 0; i < 9; i++) {
      savedSlots[i].slots['mercredi'] = true;
    }
    
    // Vendredi 8h-11h et 10h-11h
    savedSlots[0].slots['vendredi'] = true; // 8h-9h
    savedSlots[1].slots['vendredi'] = true; // 9h-10h
    savedSlots[2].slots['vendredi'] = true; // 10h-11h
    
    this.timeSlots.set(savedSlots);
  }

  toggleSlot(hourIndex: number, day: string): void {
    const slots = [...this.timeSlots()];
    slots[hourIndex].slots[day] = !slots[hourIndex].slots[day];
    this.timeSlots.set(slots);
    this.successMessage.set('');
  }

  onMouseDown(hourIndex: number, day: string, event: MouseEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
    
    // Déterminer le mode (sélection ou désélection)
    const currentValue = this.timeSlots()[hourIndex].slots[day];
    this.dragMode.set(currentValue ? 'deselect' : 'select');
    
    // Appliquer le changement
    this.toggleSlot(hourIndex, day);
  }

  onMouseEnter(hourIndex: number, day: string): void {
    if (this.isDragging()) {
      const slots = [...this.timeSlots()];
      const shouldSelect = this.dragMode() === 'select';
      
      // Appliquer seulement si l'état est différent
      if (slots[hourIndex].slots[day] !== shouldSelect) {
        slots[hourIndex].slots[day] = shouldSelect;
        this.timeSlots.set(slots);
      }
    }
  }

  onMouseUp(): void {
    this.isDragging.set(false);
  }

  clearAll(): void {
    const slots = this.timeSlots().map(slot => ({
      ...slot,
      slots: {
        lundi: false,
        mardi: false,
        mercredi: false,
        jeudi: false,
        vendredi: false,
        samedi: false
      }
    }));
    this.timeSlots.set(slots);
    this.successMessage.set('');
  }

  selectAll(): void {
    const slots = this.timeSlots().map(slot => ({
      ...slot,
      slots: {
        lundi: true,
        mardi: true,
        mercredi: true,
        jeudi: true,
        vendredi: true,
        samedi: true
      }
    }));
    this.timeSlots.set(slots);
    this.successMessage.set('');
  }

  selectWorkDays(): void {
    const slots = this.timeSlots().map(slot => ({
      ...slot,
      slots: {
        lundi: true,
        mardi: true,
        mercredi: true,
        jeudi: true,
        vendredi: true,
        samedi: false
      }
    }));
    this.timeSlots.set(slots);
    this.successMessage.set('');
  }

  submitAvailability(): void {
    this.isSaving.set(true);
    this.successMessage.set('');

    // TODO: Envoyer les disponibilités à l'API
    /*
    const availabilityData = this.timeSlots();
    this.availabilityService.updateMyAvailability(availabilityData).subscribe({
      next: () => {
        this.successMessage.set('✓ Disponibilités enregistrées avec succès !');
        this.isSaving.set(false);
      },
      error: (error) => {
        alert('Erreur lors de l\'enregistrement');
        this.isSaving.set(false);
      }
    });
    */

    // Simulation
    setTimeout(() => {
      this.successMessage.set('✓ Disponibilités enregistrées avec succès !');
      this.isSaving.set(false);
      
      // Effacer le message après 5 secondes
      setTimeout(() => {
        this.successMessage.set('');
      }, 5000);
    }, 1000);
  }

  getSelectedSlotsCount(): number {
    return this.timeSlots().reduce((total, slot) => {
      return total + Object.values(slot.slots).filter(v => v).length;
    }, 0);
  }

  getSelectedHoursCount(): number {
    return this.getSelectedSlotsCount();
  }
}