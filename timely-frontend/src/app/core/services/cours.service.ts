import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cours, CreateCoursDTO, UpdateCoursDTO } from '../models/cours.model';
import { ApiService } from './api.service';

interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface CoursApiResponse {
  id: string;
  ueId: string;
  ueIntitule: string;
  classeId: string;
  classeCode: string;
  enseignantId: string;
  ecoleId: string;
  intitule: string;
  typeCours: 'CM' | 'TD' | 'TP';
  volumeHoraire: number;
  effectifGroupe: number;
  description: string;
  statut: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  private apiService = inject(ApiService);

  getCours(): Observable<Cours[]> {
    return this.apiService.get<PagedResponse<CoursApiResponse>>('/bookings/cours', { page: 0, size: 100 }).pipe(
      map(page => page.content.map(this.toCours))
    );
  }

  getCoursById(id: string): Observable<Cours> {
    return this.apiService.get<CoursApiResponse>(`/bookings/cours/${id}`).pipe(
      map(this.toCours)
    );
  }

  getCoursByUE(ueId: string): Observable<Cours[]> {
    return this.apiService.get<PagedResponse<CoursApiResponse>>(`/bookings/ues/${ueId}/cours`, { page: 0, size: 100 }).pipe(
      map(page => page.content.map(this.toCours))
    );
  }

  getCoursByClasse(classeId: string): Observable<Cours[]> {
    return this.apiService.get<PagedResponse<CoursApiResponse>>(`/bookings/classes/${classeId}/cours`, { page: 0, size: 100 }).pipe(
      map(page => page.content.map(this.toCours))
    );
  }

  createCours(cours: CreateCoursDTO): Observable<Cours> {
    const body: any = {
      ueId: cours.ueId,
      classeId: (cours as any).classeId ?? null,
      intitule: cours.intitule,
      typeCours: cours.typeCours,
      volumeHoraire: cours.volumeHoraire
    };
    if (cours.enseignantId) body.enseignantId = cours.enseignantId;
    return this.apiService.post<CoursApiResponse>('/bookings/cours', body).pipe(
      map(this.toCours)
    );
  }

  updateCours(cours: UpdateCoursDTO): Observable<Cours> {
    const { id, ...rest } = cours;
    const body: any = {
      ueId: rest.ueId,
      classeId: (rest as any).classeId ?? null,
      intitule: rest.intitule,
      typeCours: rest.typeCours,
      volumeHoraire: rest.volumeHoraire
    };
    if ((rest as any).enseignantId) body.enseignantId = (rest as any).enseignantId;
    return this.apiService.put<CoursApiResponse>(`/bookings/cours/${id}`, body).pipe(
      map(this.toCours)
    );
  }

  deleteCours(id: string): Observable<void> {
    return this.apiService.delete<void>(`/bookings/cours/${id}`);
  }

  private toCours(r: CoursApiResponse): Cours {
    return {
      id: r.id,
      intitule: r.intitule,
      volumeHoraire: r.volumeHoraire,
      typeCours: r.typeCours,
      coefficient: 0,
      ueId: r.ueId,
      enseignantId: r.enseignantId ?? undefined
    };
  }
}
