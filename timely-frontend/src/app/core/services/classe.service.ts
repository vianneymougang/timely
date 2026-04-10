import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Classe, CreateClasseDTO, UpdateClasseDTO } from '../models/academic.model';
import { ApiService } from './api.service';

interface ClasseApiResponse {
  id: string;
  filiereId: string;
  filiereNom: string;
  yearIndex: number;
  cycleType: string;
  displayLevel: string;
  code: string;
  effectif: number;
  anneeAcademique: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private apiService = inject(ApiService);

  getClasses(): Observable<Classe[]> {
    return this.apiService.get<ClasseApiResponse[]>('/bookings/classes').pipe(
      map(items => items.map(this.toClasse))
    );
  }

  getClasseById(id: string): Observable<Classe> {
    return this.apiService.get<ClasseApiResponse>(`/bookings/classes/${id}`).pipe(
      map(this.toClasse)
    );
  }

  getClassesByFiliere(filiereId: string): Observable<Classe[]> {
    return this.apiService.get<ClasseApiResponse[]>(`/bookings/filieres/${filiereId}/classes`).pipe(
      map(items => items.map(this.toClasse))
    );
  }

  createClasse(classe: CreateClasseDTO): Observable<Classe> {
    const body = {
      filiereId: classe.filiereId,
      yearIndex: classe.yearIndex,
      code: classe.nom,
      effectif: 0,
      anneeAcademique: '2024-2025'
    };
    return this.apiService.post<ClasseApiResponse>('/bookings/classes', body).pipe(
      map(this.toClasse)
    );
  }

  updateClasse(classe: UpdateClasseDTO): Observable<Classe> {
    const { id, ...rest } = classe;
    const body = {
      filiereId: rest.filiereId,
      yearIndex: rest.yearIndex,
      code: rest.nom,
      effectif: 0,
      anneeAcademique: '2024-2025'
    };
    return this.apiService.put<ClasseApiResponse>(`/bookings/classes/${id}`, body).pipe(
      map(this.toClasse)
    );
  }

  deleteClasse(id: string): Observable<void> {
    return this.apiService.delete<void>(`/bookings/classes/${id}`);
  }

  private toClasse(r: ClasseApiResponse): Classe {
    return {
      id: r.id,
      nom: r.code,
      yearIndex: r.yearIndex,
      cycleType: r.cycleType,
      displayLevel: r.displayLevel,
      filiereId: r.filiereId
    };
  }
}
