import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface TimeSlotDto {
  hour: string;
  slots: { [key: string]: boolean };
}

export interface AvailabilityRequestDto {
  timeSlots: TimeSlotDto[];
}

export interface AvailabilityResponseDto {
  teacherId: string;
  teacherName: string;
  lastUpdated: string | null;
  timeSlots: TimeSlotDto[];
}

export interface TeacherAvailabilitySummaryDto {
  teacherId: string;
  teacherName: string;
  totalSlotsAvailable: number;
  lastUpdated: string | null;
}

export interface WeeklyOverrideItem {
  dayOfWeek: string;
  hourStart: number;
  hourEnd: number;
  overrideType: 'UNAVAILABLE' | 'AVAILABLE';
}

export interface WeeklyOverridesRequestDto {
  weekStart: string;
  overrides: WeeklyOverrideItem[];
}

@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {
  private apiService = inject(ApiService);

  saveMyAvailability(data: AvailabilityRequestDto): Observable<AvailabilityResponseDto> {
    return this.apiService.put<AvailabilityResponseDto>('/availability', data);
  }

  getMyAvailability(): Observable<AvailabilityResponseDto> {
    return this.apiService.get<AvailabilityResponseDto>('/availability/me');
  }

  getTeacherAvailability(teacherId: string): Observable<AvailabilityResponseDto> {
    return this.apiService.get<AvailabilityResponseDto>(`/availability/teacher/${teacherId}`);
  }

  getAllTeacherAvailabilities(): Observable<TeacherAvailabilitySummaryDto[]> {
    return this.apiService.get<TeacherAvailabilitySummaryDto[]>('/availability/all');
  }

  getEffectiveAvailability(weekStart: string): Observable<AvailabilityResponseDto> {
    return this.apiService.get<AvailabilityResponseDto>(`/availability/effective?weekStart=${weekStart}`);
  }

  saveWeeklyOverrides(request: WeeklyOverridesRequestDto): Observable<void> {
    return this.apiService.put<void>('/availability/overrides', request);
  }
}
