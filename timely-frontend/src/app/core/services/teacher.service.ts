import { Injectable, inject, signal } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';
import { Teacher } from '../models/teacher.model';
import { ApiService } from './api.service';
import { MOCK_TEACHERS } from '../data/mock-data';
@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiService = inject(ApiService);

  teachers = signal<Teacher[]>([]);
  selectedTeacher = signal<Teacher | null>(null);

  getTeachers(): Observable<Teacher[]> {
    return this.apiService.get<Teacher[]>('/teachers').pipe(
      tap(teachers => this.teachers.set(teachers))
    );
  }

  getTeacherById(id: string): Observable<Teacher> {
    return this.apiService.get<Teacher>(`/teachers/${id}`).pipe(
      tap(teacher => this.selectedTeacher.set(teacher))
    );
  }

  createTeacher(teacher: Partial<Teacher>): Observable<Teacher> {
    return this.apiService.post<Teacher>('/teachers', teacher);
  }

  updateTeacher(id: string, teacher: Partial<Teacher>): Observable<Teacher> {
    return this.apiService.put<Teacher>(`/teachers/${id}`, teacher);
  }

  deleteTeacher(id: string): Observable<void> {
    return this.apiService.delete<void>(`/teachers/${id}`);
  }

  getMockTeachers(): Observable<Teacher[]> {
    return of(MOCK_TEACHERS).pipe(delay(500));
  }
}
