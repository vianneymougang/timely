import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Teacher } from '../../../../core/models/teacher.model';
import { AuthService } from '../../../../core/services/auth.service';
import { TeacherService } from '../../../../core/services/teacher.service';

@Component({
  selector: 'app-teachers-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teachers-list.component.html',
  styleUrls: ['./teachers-list.component.scss'],
})
export class TeachersListComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private authService = inject(AuthService);
  private router = inject(Router);

  teachers = signal<Teacher[]>([]);
  selectedTeacher = signal<Teacher | null>(null);
  searchQuery = signal('');
  isLoading = signal(false);
  isSubmittingTeacher = signal(false);

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

  addCourse() {
    this.openAddCourseModal();
  }

  showAddTeacherModal = signal(false);
  showAddCourseModal = signal(false);

  openAddTeacherModal() {
    this.showAddTeacherModal.set(true);
  }

  openAddCourseModal() {
    this.showAddCourseModal.set(true);
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

      this.authService.registerAdmin(registerRequest).subscribe({
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

      this.authService.registerTeacher(registerRequest).subscribe({
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
}
