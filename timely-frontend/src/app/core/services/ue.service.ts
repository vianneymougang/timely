import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UE, CreateUEDTO, UpdateUEDTO } from '../models/cours.model';
import { ApiService } from './api.service';

interface UEApiResponse {
  id: string;
  filiereId: string;
  filiereNom: string;
  code: string;
  intitule: string;
  creditEcts: number;
  volumeHoraireTotal: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class UEService {
  private apiService = inject(ApiService);

  getUE(): Observable<UE[]> {
    return this.apiService.get<UEApiResponse[]>('/bookings/ues').pipe(
      map(items => items.map(this.toUE))
    );
  }

  getUEById(id: string): Observable<UE> {
    return this.apiService.get<UEApiResponse>(`/bookings/ues/${id}`).pipe(
      map(this.toUE)
    );
  }

  getUEByFiliere(filiereId: string): Observable<UE[]> {
    return this.apiService.get<UEApiResponse[]>(`/bookings/filieres/${filiereId}/ues`).pipe(
      map(items => items.map(this.toUE))
    );
  }

  createUE(ue: CreateUEDTO): Observable<UE> {
    const body = {
      filiereId: ue.filiereId,
      code: `UE-${ue.intituleUE.substring(0, 6).toUpperCase().replace(/\s/g, '')}`,
      intitule: ue.intituleUE,
      creditEcts: ue.credit,
      volumeHoraireTotal: ue.semestre,
      description: ue.description
    };
    return this.apiService.post<UEApiResponse>('/bookings/ues', body).pipe(
      map(this.toUE)
    );
  }

  updateUE(ue: UpdateUEDTO): Observable<UE> {
    const { id, ...rest } = ue;
    const body = {
      filiereId: rest.filiereId,
      code: `UE-${(rest.intituleUE ?? '').substring(0, 6).toUpperCase().replace(/\s/g, '')}`,
      intitule: rest.intituleUE,
      creditEcts: rest.credit,
      volumeHoraireTotal: rest.semestre,
      description: rest.description
    };
    return this.apiService.put<UEApiResponse>(`/bookings/ues/${id}`, body).pipe(
      map(this.toUE)
    );
  }

  deleteUE(id: string): Observable<void> {
    return this.apiService.delete<void>(`/bookings/ues/${id}`);
  }

  private toUE(r: UEApiResponse): UE {
    return {
      id: r.id,
      intituleUE: r.intitule,
      credit: r.creditEcts,
      semestre: r.volumeHoraireTotal,
      description: r.description ?? '',
      filiereId: r.filiereId
    };
  }
}
