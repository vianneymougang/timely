import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Filiere, CreateFiliereDTO, UpdateFiliereDTO } from '../models/academic.model';
import { ApiService } from './api.service';

interface FiliereApiResponse {
  id: string;
  ecoleId: string;
  ecoleNom: string;
  nom: string;
  code: string;
  cycleType: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class FiliereService {
  private apiService = inject(ApiService);

  getFilieres(): Observable<Filiere[]> {
    return this.apiService.get<FiliereApiResponse[]>('/bookings/filieres').pipe(
      map(items => items.map(this.toFiliere))
    );
  }

  getFiliereById(id: string): Observable<Filiere> {
    return this.apiService.get<FiliereApiResponse>(`/bookings/filieres/${id}`).pipe(
      map(this.toFiliere)
    );
  }

  getFilieresByEcole(ecoleId: string): Observable<Filiere[]> {
    return this.apiService.get<FiliereApiResponse[]>(`/bookings/ecoles/${ecoleId}/filieres`).pipe(
      map(items => items.map(this.toFiliere))
    );
  }

  createFiliere(filiere: CreateFiliereDTO): Observable<Filiere> {
    const body = {
      ...filiere,
      code: filiere.code || filiere.nom.toUpperCase().replace(/\s+/g, '').substring(0, 8)
    };
    return this.apiService.post<FiliereApiResponse>('/bookings/filieres', body).pipe(
      map(this.toFiliere)
    );
  }

  updateFiliere(filiere: UpdateFiliereDTO): Observable<Filiere> {
    const { id, ...rest } = filiere;
    const body = {
      ...rest,
      code: rest.code || (rest.nom ?? '').toUpperCase().replace(/\s+/g, '').substring(0, 8)
    };
    return this.apiService.put<FiliereApiResponse>(`/bookings/filieres/${id}`, body).pipe(
      map(this.toFiliere)
    );
  }

  deleteFiliere(id: string): Observable<void> {
    return this.apiService.delete<void>(`/bookings/filieres/${id}`);
  }

  private toFiliere(r: FiliereApiResponse): Filiere {
    return {
      id: r.id,
      nom: r.nom,
      description: r.description,
      ecoleId: r.ecoleId,
      code: r.code,
      cycleType: r.cycleType
    };
  }
}
