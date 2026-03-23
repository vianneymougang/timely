import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

/**
 * Interface for time slot DTO
 */
export interface TimeSlotDto {
  hour: string;
  slots: { [key: string]: boolean };
}

/**
 * Interface for availability request
 */
export interface AvailabilityRequestDto {
  timeSlots: TimeSlotDto[];
}

/**
 * Interface for availability response
 */
export interface AvailabilityResponseDto {
  teacherId: string;
  teacherName: string;
  lastUpdated: string | null;
  timeSlots: TimeSlotDto[];
}

/**
 * Interface for teacher availability summary
 */
export interface TeacherAvailabilitySummaryDto {
  teacherId: string;
  teacherName: string;
  totalSlotsAvailable: number;
  lastUpdated: string | null;
}

/**
 * Service for managing teacher availability
 */
@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {
  private apiService = inject(ApiService);

  /**
   * Save or update teacher's own availability
   */
  saveMyAvailability(data: AvailabilityRequestDto): Observable<AvailabilityResponseDto> {
    return this.apiService.put<AvailabilityResponseDto>('/availability', data);
  }

  /**
   * Get teacher's own availability
   */
  getMyAvailability(): Observable<AvailabilityResponseDto> {
    return this.apiService.get<AvailabilityResponseDto>('/availability/me');
  }

  /**
   * Get specific teacher's availability (admin only)
   */
  getTeacherAvailability(teacherId: string): Observable<AvailabilityResponseDto> {
    return this.apiService.get<AvailabilityResponseDto>(`/availability/teacher/${teacherId}`);
  }

  /**
   * Get all teachers' availability summaries (admin only)
   */
  getAllTeacherAvailabilities(): Observable<TeacherAvailabilitySummaryDto[]> {
    return this.apiService.get<TeacherAvailabilitySummaryDto[]>('/availability/all');
  }
}
