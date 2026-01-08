import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
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
<<<<<<< HEAD
  // edit flow
  editMode = signal(false);
  editingTeacher = signal<Teacher | null>(null);
  // form bindings for modal
  formFirstName = signal('');
  formLastName = signal('');
  formEmail = signal('');
  // alert message shown after operations
  alertMessage = signal<string | null>(null);
  alertType = signal<'success' | 'danger' | 'info'>('success');

  private showAlert(message: string, type: 'success' | 'danger' | 'info' = 'success') {
    this.alertMessage.set(message);
    this.alertType.set(type);
    // auto-hide after 3 seconds
    setTimeout(() => this.alertMessage.set(null), 3000);
  }
=======
  isLoadingAvailability = signal(false);
  isSubmittingTeacher = signal(false);
>>>>>>> 0ea8e076f89dd6ae6a11210df6b146a8af9075d8

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
    this.editMode.set(false);
    this.editingTeacher.set(null);
    this.openAddTeacherModal();
  }

  addCourse() {
    this.openAddCourseModal();
  }

  showAddTeacherModal = signal(false);
  showAddCourseModal = signal(false);

  openAddTeacherModal() {
    this.showAddTeacherModal.set(true);
  }

  openEdit(teacher: Teacher) {
    this.editMode.set(true);
    this.editingTeacher.set(teacher);
    // populate form bindings
    this.formFirstName.set(teacher.firstName);
    this.formLastName.set(teacher.lastName);
    this.formEmail.set(teacher.email);
    this.openAddTeacherModal();
  }

  openAddCourseModal() {
    this.showAddCourseModal.set(true);
  }

  closeModals() {
    this.showAddTeacherModal.set(false);
    this.showAddCourseModal.set(false);
    // reset form
    this.formFirstName.set('');
    this.formLastName.set('');
    this.formEmail.set('');
    this.editMode.set(false);
    this.editingTeacher.set(null);
  }

  toggleBlock(teacher: Teacher) {
    const newStatus = teacher.status === 'unavailable' ? 'available' : 'unavailable';
    this.teacherService.updateTeacher(teacher.id!, { status: newStatus }).subscribe(() => {
      this.loadTeachers();
      // if currently selected, refresh selection
      if (this.selectedTeacher()?.id === teacher.id) {
        this.teacherService.getTeacherById(teacher.id!).subscribe(t => this.selectedTeacher.set(t));
      }
      // show confirmation message
      const verb = newStatus === 'unavailable' ? 'bloqué' : 'débloqué';
      this.showAlert(`Enseignant ${verb} avec succès`, 'success');
    }, err => console.error('Failed to toggle block status', err));
  }

  submitAddTeacher(form: any) {
<<<<<<< HEAD
    if (!form.valid) return;
    const data = {
      firstName: this.formFirstName(),
      lastName: this.formLastName(),
      email: this.formEmail()
    };
    const payload: Partial<Teacher> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      initials: (data.firstName[0] + data.lastName[0]).toUpperCase(),
      assignedCourses: 0,
      hourlyLoad: { used: 0, total: 24 },
      status: 'available'
    };

    if (this.editMode()) {
      const id = this.editingTeacher()?.id;
      if (!id) return;
      this.teacherService.updateTeacher(id, payload).subscribe(() => {
        this.closeModals();
        this.loadTeachers();
        this.editMode.set(false);
        this.editingTeacher.set(null);
        // show confirmation after edit
        this.showAlert('Enseignant modifié avec succès', 'success');
      });
    } else {
      this.teacherService.createTeacher(payload).subscribe(() => {
        this.closeModals();
        this.loadTeachers();
        this.showAlert('Enseignant ajouté avec succès', 'success');
=======
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
>>>>>>> 0ea8e076f89dd6ae6a11210df6b146a8af9075d8
      });
    }
  }

  submitAddCourse(form: any) {
    if (!form.valid) return;

    console.log('Course added:', form.value);
    this.closeModals();
  }
}
