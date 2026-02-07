import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Teacher } from '../../../../core/models/teacher.model';
import {
  AvailabilityResponseDto,
  AvailabilityService,
} from '../../../../core/services/availability.service';
import { TeacherService } from '../../../../core/services/teacher.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-teachers-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teachers-list.component.html',
  styleUrls: ['./teachers-list.component.scss'],
})
export class TeachersListComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private userService = inject(UserService);
  private router = inject(Router);
  private availabilityService = inject(AvailabilityService);

  teachers = signal<Teacher[]>([]);
  selectedTeacher = signal<Teacher | null>(null);
  selectedTeacherAvailability = signal<AvailabilityResponseDto | null>(null);
  searchQuery = signal('');
  isLoading = signal(false);
  isLoadingAvailability = signal(false);
  isSubmittingTeacher = signal(false);

  // Sélection multiple
  selectedTeacherIds = signal<Set<string>>(new Set());
  isSelectionMode = signal(false);
  isBulkActionLoading = signal(false);

  // Computed pour vérifier si tous les enseignants filtrés sont sélectionnés
  allFilteredSelected = computed(() => {
    const filtered = this.filteredTeachers();
    const selected = this.selectedTeacherIds();
    return filtered.length > 0 && filtered.every((t) => selected.has(t.id));
  });

  // Nombre d'enseignants sélectionnés
  selectedCount = computed(() => this.selectedTeacherIds().size);

  /*ngOnInit(): void {
    // En développement, utilisez les données mock
    this.teacherService.getMockTeachers().subscribe(teachers => {
      this.teachers.set(teachers);
      if (teachers.length > 0) {
        this.selectTeacher(teachers[0]);
      }
    });
    this.loadTeachers();


  }*/

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.isLoading.set(true);
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => {
        this.teachers.set(teachers);
        if (teachers.length > 0) {
          // Sélectionner le premier enseignant si aucun n'est sélectionné
          if (!this.selectedTeacher()) {
            this.selectTeacher(teachers[0]);
          }
        } else {
          this.selectedTeacher.set(null);
        }
      },
      error: (error) => {
        console.error('Error loading teachers:', error);
        this.teachers.set([]);
        this.selectedTeacher.set(null);
        // Afficher un message d'erreur à l'utilisateur
        let errorMessage = 'Erreur lors du chargement des enseignants';
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.error?.error) {
          errorMessage = error.error.error;
        } else if (error?.status === 401) {
          errorMessage = "Vous devez être connecté en tant qu'administrateur";
        } else if (error?.status === 403) {
          errorMessage = 'Accès refusé. Seuls les administrateurs peuvent voir les enseignants';
        } else if (error?.status === 500) {
          errorMessage = "Erreur serveur. Vérifiez que l'auth-service est démarré";
        }
        alert('Erreur: ' + errorMessage);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  selectTeacher(teacher: Teacher): void {
    this.selectedTeacher.set(teacher);
    this.loadTeacherAvailability(teacher.id);
  }

  loadTeacherAvailability(teacherId: string): void {
    this.isLoadingAvailability.set(true);
    this.selectedTeacherAvailability.set(null);

    this.availabilityService.getTeacherAvailability(teacherId).subscribe({
      next: (availability) => {
        this.selectedTeacherAvailability.set(availability);
        this.isLoadingAvailability.set(false);
      },
      error: (error) => {
        console.error('Error loading teacher availability:', error);
        // Set to null on error (teacher may not have set availability)
        this.selectedTeacherAvailability.set(null);
        this.isLoadingAvailability.set(false);
      },
    });
  }

  getAvailableSlotsCount(): number {
    const availability = this.selectedTeacherAvailability();
    if (!availability || !availability.timeSlots) return 0;

    return availability.timeSlots.reduce((total, slot) => {
      return total + Object.values(slot.slots).filter((v) => v).length;
    }, 0);
  }

  isPauseSlotByIndex(hourIndex: number): boolean {
    return hourIndex === 4; // 12h-13h
  }

  filteredTeachers(): Teacher[] {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.teachers();

    return this.teachers().filter(
      (teacher) =>
        `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(query) ||
        teacher.email.toLowerCase().includes(query)
    );
  }

  addTeacher() {
    this.openAddTeacherModal();
  }

  showAddTeacherModal = signal(false);
  showAddCourseModal = signal(false);

  openAddTeacherModal() {
    this.showAddTeacherModal.set(true);
  }

  closeModals() {
    this.showAddTeacherModal.set(false);
    this.showAddCourseModal.set(false);
  }

  submitAddTeacher(form: any) {
    if (!form.valid) {
      // Afficher les erreurs de validation
      Object.keys(form.controls).forEach((key) => {
        const control = form.controls[key];
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.isSubmittingTeacher.set(true);
    const data = form.value;
    const userRole = data.userRole || 'teacher';

    if (userRole === 'admin') {
      const registerRequest = {
        name: data.firstName,
        surname: data.lastName,
        email: data.email,
        telephoneNumber: data.telephoneNumber ? parseInt(data.telephoneNumber) : undefined,
      };

      this.userService.createAdmin(registerRequest).subscribe({
        next: () => {
          this.isSubmittingTeacher.set(false);
          this.closeModals();
          this.loadTeachers();
          alert('Administrateur créé avec succès !');
        },
        error: (error) => {
          this.isSubmittingTeacher.set(false);
          console.error('Error creating admin:', error);
          let errorMessage = "Erreur lors de la création de l'administrateur";
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.error?.error) {
            errorMessage = error.error.error;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          alert('Erreur: ' + errorMessage);
        },
      });
    } else {
      const registerRequest = {
        name: data.firstName,
        surname: data.lastName,
        email: data.email,
        telephoneNumber: data.telephoneNumber ? parseInt(data.telephoneNumber) : undefined,
        grade: data.grade,
        rank: data.rank,
        hourlyRate: data.hourlyRate,
      };

      this.userService.createTeacher(registerRequest).subscribe({
        next: () => {
          this.isSubmittingTeacher.set(false);
          this.closeModals();
          this.loadTeachers();
          alert('Enseignant créé avec succès !');
        },
        error: (error) => {
          this.isSubmittingTeacher.set(false);
          console.error('Error creating teacher:', error);
          let errorMessage = "Erreur lors de la création de l'enseignant";
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.error?.error) {
            errorMessage = error.error.error;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          alert('Erreur: ' + errorMessage);
        },
      });
    }
  }

  submitAddCourse(form: any) {
    if (!form.valid) return;

    console.log('Course added:', form.value);
    this.closeModals();
  }

  // Méthodes pour la sélection multiple
  toggleSelectionMode(): void {
    this.isSelectionMode.update((v) => !v);
    if (!this.isSelectionMode()) {
      this.selectedTeacherIds.set(new Set());
    }
  }

  toggleTeacherSelection(teacherId: string, event: Event): void {
    event.stopPropagation();
    this.selectedTeacherIds.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(teacherId)) {
        newSet.delete(teacherId);
      } else {
        newSet.add(teacherId);
      }
      return newSet;
    });
  }

  isTeacherSelected(teacherId: string): boolean {
    return this.selectedTeacherIds().has(teacherId);
  }

  toggleSelectAll(): void {
    const filtered = this.filteredTeachers();
    if (this.allFilteredSelected()) {
      this.selectedTeacherIds.set(new Set());
    } else {
      this.selectedTeacherIds.set(new Set(filtered.map((t) => t.id)));
    }
  }

  clearSelection(): void {
    this.selectedTeacherIds.set(new Set());
  }

  // Actions de blocage/déblocage
  blockTeacher(teacherId: string): void {
    if (confirm('Êtes-vous sûr de vouloir bloquer cet enseignant ?')) {
      this.userService.blockUser(teacherId).subscribe({
        next: () => {
          const currentSelectedId = this.selectedTeacher()?.id;
          this.loadTeachers();
          // Mettre à jour le teacher sélectionné après le rechargement
          if (currentSelectedId) {
            setTimeout(() => {
              const updatedTeacher = this.teachers().find((t) => t.id === currentSelectedId);
              if (updatedTeacher) {
                this.selectedTeacher.set(updatedTeacher);
              }
            }, 100);
          }
          alert('Enseignant bloqué avec succès');
        },
        error: (error) => {
          console.error('Error blocking teacher:', error);
          alert("Erreur lors du blocage de l'enseignant: " + error.message);
        },
      });
    }
  }

  unblockTeacher(teacherId: string): void {
    if (confirm('Êtes-vous sûr de vouloir débloquer cet enseignant ?')) {
      this.userService.unblockUser(teacherId).subscribe({
        next: () => {
          const currentSelectedId = this.selectedTeacher()?.id;
          this.loadTeachers();
          // Mettre à jour le teacher sélectionné après le rechargement
          if (currentSelectedId) {
            setTimeout(() => {
              const updatedTeacher = this.teachers().find((t) => t.id === currentSelectedId);
              if (updatedTeacher) {
                this.selectedTeacher.set(updatedTeacher);
              }
            }, 100);
          }
          alert('Enseignant débloqué avec succès');
        },
        error: (error) => {
          console.error('Error unblocking teacher:', error);
          alert("Erreur lors du déblocage de l'enseignant: " + error.message);
        },
      });
    }
  }

  bulkBlockTeachers(): void {
    const selectedIds = Array.from(this.selectedTeacherIds());
    if (selectedIds.length === 0) {
      alert('Veuillez sélectionner au moins un enseignant');
      return;
    }

    if (
      confirm(`Êtes-vous sûr de vouloir bloquer ${selectedIds.length} enseignant(s) ?`)
    ) {
      this.isBulkActionLoading.set(true);
      this.userService.bulkBlockUsers(selectedIds).subscribe({
        next: (response) => {
          this.isBulkActionLoading.set(false);
          this.selectedTeacherIds.set(new Set());
          this.loadTeachers();
          alert(
            `${response.successCount} enseignant(s) bloqué(s) avec succès.` +
              (response.failureCount > 0
                ? ` ${response.failureCount} échec(s).`
                : '')
          );
        },
        error: (error) => {
          this.isBulkActionLoading.set(false);
          console.error('Error bulk blocking teachers:', error);
          alert('Erreur lors du blocage des enseignants: ' + error.message);
        },
      });
    }
  }

  bulkUnblockTeachers(): void {
    const selectedIds = Array.from(this.selectedTeacherIds());
    if (selectedIds.length === 0) {
      alert('Veuillez sélectionner au moins un enseignant');
      return;
    }

    if (
      confirm(`Êtes-vous sûr de vouloir débloquer ${selectedIds.length} enseignant(s) ?`)
    ) {
      this.isBulkActionLoading.set(true);
      this.userService.bulkUnblockUsers(selectedIds).subscribe({
        next: (response) => {
          this.isBulkActionLoading.set(false);
          this.selectedTeacherIds.set(new Set());
          this.loadTeachers();
          alert(
            `${response.successCount} enseignant(s) débloqué(s) avec succès.` +
              (response.failureCount > 0
                ? ` ${response.failureCount} échec(s).`
                : '')
          );
        },
        error: (error) => {
          this.isBulkActionLoading.set(false);
          console.error('Error bulk unblocking teachers:', error);
          alert('Erreur lors du déblocage des enseignants: ' + error.message);
        },
      });
    }
  }
}
