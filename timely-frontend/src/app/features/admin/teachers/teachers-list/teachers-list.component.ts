import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { TeacherService } from '../../../../core/services/teacher.service';
import { Teacher } from '../../../../core/models/teacher.model';

@Component({
  selector: 'app-teachers-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './teachers-list.component.html',
  styleUrls: ['./teachers-list.component.scss']
})
export class TeachersListComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private router = inject(Router);

  teachers = signal<Teacher[]>([]);
  selectedTeacher = signal<Teacher | null>(null);
  searchQuery = signal('');
  isLoading = signal(false);
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
    this.isLoading.set(true);
    this.teacherService.getMockTeachers().subscribe(teachers => {
      this.teachers.set(teachers);
      if (teachers.length > 0) {
        this.selectTeacher(teachers[0]);
      }
      this.isLoading.set(false);
    });
  }

  loadTeachers(): void {
    this.isLoading.set(true);
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => {
        this.teachers.set(teachers);
        if (teachers.length > 0) {
          this.selectTeacher(teachers[0]);
        }
      },
      error: (error) => {
        console.error('Error loading teachers:', error);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  selectTeacher(teacher: Teacher): void {
    this.selectedTeacher.set(teacher);
  }

  filteredTeachers(): Teacher[] {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.teachers();

    return this.teachers().filter(teacher =>
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
      });
    }
  }

  submitAddCourse(form: any) {
    if (!form.valid) return;

    console.log("Course added:", form.value);
    this.closeModals();
  }


}
