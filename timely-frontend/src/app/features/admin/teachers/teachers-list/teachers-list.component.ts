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
    if (!form.valid) return;

    const data = form.value;

    this.teacherService.createTeacher({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      initials: (data.firstName[0] + data.lastName[0]).toUpperCase(),
      assignedCourses: 0,
      hourlyLoad: { used: 0, total: 24 },
      //availability: {},
      //schedule: {},
      status: 'available'
    }).subscribe(() => {
      this.closeModals();
      this.loadTeachers();
    });
  }

  submitAddCourse(form: any) {
    if (!form.valid) return;

    console.log("Course added:", form.value);
    this.closeModals();
  }


}
