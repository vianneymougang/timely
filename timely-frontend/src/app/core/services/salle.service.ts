import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Salle, CreateSalleDTO, UpdateSalleDTO } from '../models/salle.model';
import { ApiService } from './api.service';

interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface SalleApiResponse {
  id: string;
  ecoleId: string;
  ecoleNom: string;
  numero: string;
  nom: string;
  typeSalle: string;
  capacite: number;
  superficieM2: number;
  batiment: string;
  etage: string;
  statut: string;
}

type BackendTypeSalle = 'AMPHITHEATRE' | 'SALLE_COURS' | 'LABORATOIRE' | 'SALLE_REUNION';

const TYPE_SALLE_MAP: Record<BackendTypeSalle, string> = {
  AMPHITHEATRE: 'Amphithéâtre',
  SALLE_COURS: 'Salle de TD',
  LABORATOIRE: 'Laboratoire',
  SALLE_REUNION: 'Salle de TP'
};

const TYPE_SALLE_REVERSE_MAP: Record<string, BackendTypeSalle> = {
  'Amphithéâtre': 'AMPHITHEATRE',
  'Salle de TD': 'SALLE_COURS',
  'Laboratoire': 'LABORATOIRE',
  'Salle de TP': 'SALLE_REUNION'
};

@Injectable({
  providedIn: 'root'
})
export class SalleService {
  private apiService = inject(ApiService);

  getSalles(): Observable<Salle[]> {
    return this.apiService.get<PagedResponse<SalleApiResponse>>('/bookings/salles', { page: 0, size: 100 }).pipe(
      map(page => page.content.map(this.toSalle))
    );
  }

  getSalleById(id: string): Observable<Salle> {
    return this.apiService.get<SalleApiResponse>(`/bookings/salles/${id}`).pipe(
      map(this.toSalle)
    );
  }

  getSallesByEcole(ecoleId: string): Observable<Salle[]> {
    return this.apiService.get<PagedResponse<SalleApiResponse>>(`/bookings/ecoles/${ecoleId}/salles`, { page: 0, size: 100 }).pipe(
      map(page => page.content.map(this.toSalle))
    );
  }

  getSallesDisponibles(): Observable<Salle[]> {
    return this.apiService.get<PagedResponse<SalleApiResponse>>('/bookings/salles/disponibles', { page: 0, size: 100 }).pipe(
      map(page => page.content.map(this.toSalle))
    );
  }

  getSallesByType(type: string): Observable<Salle[]> {
    return this.getSalles().pipe(
      map(salles => salles.filter(s => s.type === type))
    );
  }

  createSalle(salle: CreateSalleDTO): Observable<Salle> {
    const body = {
      ecoleId: salle.ecoleId,
      numero: salle.numeroSalle,
      typeSalle: TYPE_SALLE_REVERSE_MAP[salle.type] ?? 'SALLE_COURS',
      capacite: salle.capacite,
      batiment: salle.batiment,
      etage: String(salle.etage),
      statut: salle.disponible ? 'ACTIVE' : 'FERMEE'
    };
    return this.apiService.post<SalleApiResponse>('/bookings/salles', body).pipe(
      map(this.toSalle)
    );
  }

  updateSalle(salle: UpdateSalleDTO): Observable<Salle> {
    const { id, ...rest } = salle;
    const body = {
      ecoleId: rest.ecoleId,
      numero: rest.numeroSalle,
      typeSalle: rest.type ? (TYPE_SALLE_REVERSE_MAP[rest.type] ?? 'SALLE_COURS') : undefined,
      capacite: rest.capacite,
      batiment: rest.batiment,
      etage: rest.etage != null ? String(rest.etage) : undefined,
      statut: rest.disponible != null ? (rest.disponible ? 'ACTIVE' : 'FERMEE') : undefined
    };
    return this.apiService.put<SalleApiResponse>(`/bookings/salles/${id}`, body).pipe(
      map(this.toSalle)
    );
  }

  deleteSalle(id: string): Observable<void> {
    return this.apiService.delete<void>(`/bookings/salles/${id}`);
  }

  toggleDisponibilite(id: string): Observable<Salle> {
    return this.getSalleById(id).pipe(
      switchMap(salle => this.updateSalle({ id, disponible: !salle.disponible }))
    );
  }

  private toSalle(r: SalleApiResponse): Salle {
    return {
      id: r.id,
      numeroSalle: r.numero,
      type: (TYPE_SALLE_MAP[r.typeSalle as BackendTypeSalle] ?? r.typeSalle) as any,
      capacite: r.capacite,
      batiment: r.batiment ?? '',
      etage: r.etage ? parseInt(r.etage, 10) || 0 : 0,
      disponible: r.statut === 'ACTIVE',
      ecoleId: r.ecoleId,
      materielAffecte: [],
      equipementAffecte: []
    };
  }
}
