import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { TeacherService } from '../../../core/services/teacher.service';


@Component({
  selector: 'app-teacher-courses.component',
  imports: [],
  templateUrl: './teacher-courses.component.html',
  styleUrl: './teacher-courses.component.scss',
})
export class TeacherCoursesComponent {
  private authService = inject(AuthService);
  private teacherService = inject(TeacherService);

  currentUser = this.authService.currentUser;
  //currentDate = signal('Lundi 20 Octobre 2025');

  logout(): void {
    this.authService.logout();
  }
}
