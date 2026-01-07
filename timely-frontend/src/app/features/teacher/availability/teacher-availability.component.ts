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

    // Créer tous les créneaux de 8h à 17h (9 créneaux)
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

  isPauseSlot(hourIndex: number): boolean {
    // L'index 4 correspond à 12h-13h (8h=0, 9h=1, 10h=2, 11h=3, 12h=4)
    return hourIndex === 4;
  }

  loadSavedAvailability(): void {
    // TODO: Charger les disponibilités sauvegardées depuis l'API
    // this.availabilityService.getMyAvailability().subscribe({
    //   next: (data) => {
    //     if (data && data.timeSlots) {
    //       this.timeSlots.set(data.timeSlots);
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Erreur lors du chargement des disponibilités', error);
    //   }
    // });

    // Vérifier si des données sont stockées localement (localStorage)
    const savedData = localStorage.getItem('teacher_availability');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        this.timeSlots.set(parsed);
      } catch (error) {
        console.error('Erreur lors de la lecture des disponibilités', error);
      }
    }
    // Sinon, la grille reste vide (déjà initialisée avec tous les slots à false)
  }

  toggleSlot(hourIndex: number, day: string): void {
    // Ne pas permettre la modification des créneaux de pause
    if (this.isPauseSlot(hourIndex)) {
      return;
    }

    // Créer une copie profonde complète
    const currentSlots = this.timeSlots();
    const newSlots = JSON.parse(JSON.stringify(currentSlots));

    // Modifier uniquement le slot ciblé
    newSlots[hourIndex].slots[day] = !newSlots[hourIndex].slots[day];

    // Mettre à jour avec la nouvelle référence
    this.timeSlots.set(newSlots);
    this.successMessage.set('');
  }

  onMouseDown(hourIndex: number, day: string, event: MouseEvent): void {
    event.preventDefault();

    // Ne pas permettre la sélection des créneaux de pause
    if (this.isPauseSlot(hourIndex)) {
      return;
    }

    this.isDragging.set(true);

    // Déterminer le mode (sélection ou désélection)
    const currentValue = this.timeSlots()[hourIndex].slots[day];
    this.dragMode.set(currentValue ? 'deselect' : 'select');

    // Appliquer le changement
    this.toggleSlot(hourIndex, day);
  }

  onMouseEnter(hourIndex: number, day: string): void {
    // Ne pas permettre la sélection des créneaux de pause
    if (this.isPauseSlot(hourIndex)) {
      return;
    }

    if (this.isDragging()) {
      const currentValue = this.timeSlots()[hourIndex].slots[day];
      const shouldSelect = this.dragMode() === 'select';

      // Appliquer seulement si l'état est différent du mode
      if ((shouldSelect && !currentValue) || (!shouldSelect && currentValue)) {
        this.toggleSlot(hourIndex, day);
      }
    }
  }

  onMouseUp(): void {
    this.isDragging.set(false);
  }

  clearAll(): void {
    const currentSlots = this.timeSlots();
    const slots = JSON.parse(JSON.stringify(currentSlots));

    slots.forEach((slot: TimeSlot, index: number) => {
      // Ne pas modifier les créneaux de pause
      if (!this.isPauseSlot(index)) {
        slot.slots = {
          lundi: false,
          mardi: false,
          mercredi: false,
          jeudi: false,
          vendredi: false,
          samedi: false
        };
      }
    });

    this.timeSlots.set(slots);
    this.successMessage.set('');
  }

  selectAll(): void {
    const currentSlots = this.timeSlots();
    const slots = JSON.parse(JSON.stringify(currentSlots));

    slots.forEach((slot: TimeSlot, index: number) => {
      // Ne pas sélectionner les créneaux de pause
      if (!this.isPauseSlot(index)) {
        slot.slots = {
          lundi: true,
          mardi: true,
          mercredi: true,
          jeudi: true,
          vendredi: true,
          samedi: true
        };
      }
    });

    this.timeSlots.set(slots);
    this.successMessage.set('');
  }

  selectWorkDays(): void {
    const currentSlots = this.timeSlots();
    const slots = JSON.parse(JSON.stringify(currentSlots));

    slots.forEach((slot: TimeSlot, index: number) => {
      // Ne pas sélectionner les créneaux de pause
      if (!this.isPauseSlot(index)) {
        slot.slots = {
          lundi: true,
          mardi: true,
          mercredi: true,
          jeudi: true,
          vendredi: true,
          samedi: false
        };
      }
    });

    this.timeSlots.set(slots);
    this.successMessage.set('');
  }

  submitAvailability(): void {
    this.isSaving.set(true);
    this.successMessage.set('');

    const availabilityData = this.timeSlots();

    // TODO: Envoyer les disponibilités à l'API
    /*
    this.availabilityService.updateMyAvailability(availabilityData).subscribe({
      next: () => {
        // Sauvegarder aussi localement
        localStorage.setItem('teacher_availability', JSON.stringify(availabilityData));
        this.successMessage.set('✓ Disponibilités enregistrées avec succès !');
        this.isSaving.set(false);

        setTimeout(() => {
          this.successMessage.set('');
        }, 5000);
      },
      error: (error) => {
        alert('Erreur lors de l\'enregistrement');
        this.isSaving.set(false);
      }
    });
    */

    // Simulation : Sauvegarder dans localStorage
    setTimeout(() => {
      // Sauvegarder les données
      localStorage.setItem('teacher_availability', JSON.stringify(availabilityData));

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
