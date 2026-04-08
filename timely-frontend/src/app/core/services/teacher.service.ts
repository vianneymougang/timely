import { inject, Injectable, signal } from '@angular/core';
import { delay, map, Observable, of, tap } from 'rxjs';
import { MOCK_TEACHERS } from '../data/mock-data';
import { Teacher, UserStatus } from '../models/teacher.model';
import { ApiService } from './api.service';

interface TeacherResponseDTO {
  id: string;
  name: string;
  surname: string;
  email: string;
  telephoneNumber?: number;
  matricule: string;
  grade: string;
  rank: string;
  hourlyRate: string;
  status: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiService = inject(ApiService);

  teachers = signal<Teacher[]>([]);
  selectedTeacher = signal<Teacher | null>(null);

  /**
   * Convertir TeacherResponseDTO (backend) vers Teacher (frontend)
   */
  private mapToTeacher(dto: TeacherResponseDTO): Teacher {
    const initials = (dto.name.charAt(0) + dto.surname.charAt(0)).toUpperCase();

    // Mapper le status backend vers le status frontend
    let status: 'available' | 'busy' | 'unavailable' = 'available';
    const userStatus = (dto.status as UserStatus) || 'ACTIVE';

    if (dto.status === 'INACTIVE' || dto.status === 'SUSPENDED' || dto.status === 'BLOCKED') {
      status = 'unavailable';
    } else if (dto.status === 'ACTIVE') {
      status = 'available';
    }

    return {
      id: dto.id,
      firstName: dto.name,
      lastName: dto.surname,
      email: dto.email,
      initials: initials,
      phone: dto.telephoneNumber?.toString(),
      assignedCourses: 0,
      hourlyLoad: {
        used: 0,
        total: 24,
      },
      availability: {
        monday: '8h-17h',
        tuesday: '8h-17h',
        wednesday: '8h-17h',
        thursday: '8h-17h',
        friday: '8h-17h',
        saturday: '-',
      },
      schedule: {
        monday: '-',
        tuesday: '-',
        wednesday: '-',
        thursday: '-',
        friday: '-',
        saturday: '-',
      },
      status: status,
      userStatus: userStatus,
    };
  }

  getTeachers(): Observable<Teacher[]> {
    return this.apiService.get<PageResponse<TeacherResponseDTO>>('/users/teachers').pipe(
      map((response) => response.content.map((dto) => this.mapToTeacher(dto))),
      tap((teachers) => this.teachers.set(teachers))
    );
  }

  getTeacherById(id: string): Observable<Teacher> {
    return this.apiService.get<TeacherResponseDTO>(`/users/teachers/${id}`).pipe(
      map((dto) => this.mapToTeacher(dto)),
      tap((teacher) => this.selectedTeacher.set(teacher))
    );
  }

  updateTeacher(id: string, teacher: Partial<Teacher>): Observable<Teacher> {
    // À implémenter si nécessaire dans le backend
    return this.apiService.put<Teacher>(`/users/${id}`, teacher);
  }

  deleteTeacher(id: string): Observable<void> {
    return this.apiService.delete<void>(`/users/${id}`);
  }

  getMockTeachers(): Observable<Teacher[]> {
    return of(MOCK_TEACHERS).pipe(delay(500));
  }
}
