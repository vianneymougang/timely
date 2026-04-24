import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Equipement, CreateEquipementDTO, UpdateEquipementDTO } from '../models/resource.model';
import { ApiService } from './api.service';

interface EquipementApiResponse {
  id: string;
  nom: string;
  code: string;
  description: string;
  quantiteDisponible: number;
}

@Injectable({
  providedIn: 'root'
})
export class EquipementService {
  private apiService = inject(ApiService);

  getEquipements(): Observable<Equipement[]> {
    return this.apiService.get<EquipementApiResponse[]>('/bookings/equipements').pipe(
      map(items => items.map(this.toEquipement))
    );
  }

  getEquipementById(id: string): Observable<Equipement> {
    return this.apiService.get<EquipementApiResponse>(`/bookings/equipements/${id}`).pipe(
      map(this.toEquipement)
    );
  }

  createEquipement(equipement: CreateEquipementDTO): Observable<Equipement> {
    const body = {
      nom: equipement.nom,
      code: equipement.nom.toUpperCase().replace(/\s+/g, '-').substring(0, 20),
      description: equipement.description ?? '',
      quantiteDisponible: 1
    };
    return this.apiService.post<EquipementApiResponse>('/bookings/equipements', body).pipe(
      map(this.toEquipement)
    );
  }

  updateEquipement(equipement: UpdateEquipementDTO): Observable<Equipement> {
    const { id, ...rest } = equipement;
    const body = {
      nom: rest.nom,
      code: (rest.nom ?? '').toUpperCase().replace(/\s+/g, '-').substring(0, 20),
      description: rest.description ?? '',
      quantiteDisponible: 1
    };
    return this.apiService.put<EquipementApiResponse>(`/bookings/equipements/${id}`, body).pipe(
      map(this.toEquipement)
    );
  }

  deleteEquipement(id: string): Observable<void> {
    return this.apiService.delete<void>(`/bookings/equipements/${id}`);
  }

  private toEquipement(r: EquipementApiResponse): Equipement {
    return {
      id: r.id,
      nom: r.nom,
      type: 'Équipement',
      etat: 'Bon',
      description: r.description ?? '',
      materielsAffectes: []
    };
  }
}
