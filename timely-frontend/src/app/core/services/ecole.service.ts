import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ecole, CreateEcoleDTO, UpdateEcoleDTO } from '../models/academic.model';
import { ApiService } from './api.service';

export interface EcoleDto {
  id: string;
  nom: string;
  code: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  contactResponsable?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EcoleService {
  private apiService = inject(ApiService);

  getEcoles(): Observable<Ecole[]> {
    return this.apiService.get<EcoleDto[]>('/bookings/ecoles').pipe(
      map(items => items.map(this.toEcole))
    );
  }

  fetchEcolesFromApi(): Observable<EcoleDto[]> {
    return this.apiService.get<EcoleDto[]>('/bookings/ecoles');
  }

  getEcoleById(id: string): Observable<Ecole> {
    return this.apiService.get<EcoleDto>(`/bookings/ecoles/${id}`).pipe(
      map(this.toEcole)
    );
  }

  createEcole(ecole: CreateEcoleDTO): Observable<Ecole> {
    const body = {
      nom: ecole.nom,
      code: ecole.nom.toUpperCase().replace(/\s+/g, '-').substring(0, 10),
      contactResponsable: (ecole as any).directeur ?? '',
      adresse: (ecole as any).description ?? ''
    };
    return this.apiService.post<EcoleDto>('/bookings/ecoles', body).pipe(
      map(this.toEcole)
    );
  }

  updateEcole(ecole: UpdateEcoleDTO): Observable<Ecole> {
    const { id, ...rest } = ecole;
    const body = {
      nom: rest.nom,
      code: (rest.nom ?? '').toUpperCase().replace(/\s+/g, '-').substring(0, 10),
      contactResponsable: (rest as any).directeur ?? '',
      adresse: (rest as any).description ?? ''
    };
    return this.apiService.put<EcoleDto>(`/bookings/ecoles/${id}`, body).pipe(
      map(this.toEcole)
    );
  }

  deleteEcole(id: string): Observable<void> {
    return this.apiService.delete<void>(`/bookings/ecoles/${id}`);
  }

  private toEcole(r: EcoleDto): Ecole {
    return {
      id: r.id,
      nom: r.nom,
      directeur: r.contactResponsable ?? '',
      description: r.adresse ?? ''
    };
  }
}
