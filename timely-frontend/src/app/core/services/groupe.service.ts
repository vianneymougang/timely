import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Groupe, UpdateGroupeDTO, GroupeGenerationOptions } from '../models/etudiant.model';
import { ApiService } from './api.service';

interface GroupeApiResponse {
  id: string;
  coursId: string;
  coursIntitule: string;
  numeroGroupe: number;
  effectif: number;
  typeGroupe: string;
}

interface GroupeApiRequest {
  coursId: string;
  numeroGroupe: number;
  effectif: number;
  typeGroupe: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupeService {
  private apiService = inject(ApiService);

  getGroupes(): Observable<Groupe[]> {
    return this.apiService.get<GroupeApiResponse[]>('/bookings/groupes').pipe(
      map(items => items.map(this.toGroupe))
    );
  }

  getGroupeById(id: string): Observable<Groupe> {
    return this.apiService.get<GroupeApiResponse>(`/bookings/groupes/${id}`).pipe(
      map(this.toGroupe)
    );
  }

  getGroupesByClasse(classeId: string): Observable<Groupe[]> {
    return this.getGroupes();
  }

  getGroupesByCours(coursId: string): Observable<Groupe[]> {
    return this.apiService.get<GroupeApiResponse[]>(`/bookings/cours/${coursId}/groupes`).pipe(
      map(items => items.map(this.toGroupe))
    );
  }

  updateGroupe(groupe: UpdateGroupeDTO): Observable<Groupe> {
    const { id, ...rest } = groupe;
    const body: GroupeApiRequest = {
      coursId: (rest as any).coursId ?? '',
      numeroGroupe: parseInt(rest.nom ?? '1', 10) || 1,
      effectif: rest.capaciteMax ?? 0,
      typeGroupe: 'TD'
    };
    return this.apiService.put<GroupeApiResponse>(`/bookings/groupes/${id}`, body).pipe(
      map(this.toGroupe)
    );
  }

  deleteGroupe(id: string): Observable<void> {
    return this.apiService.delete<void>(`/bookings/groupes/${id}`);
  }

  ajouterEtudiant(groupeId: string, etudiantId: string): Observable<GroupeApiResponse> {
    return this.apiService.post<GroupeApiResponse>(`/bookings/groupes/${groupeId}/etudiants/${etudiantId}`, {});
  }

  retirerEtudiant(groupeId: string, etudiantId: string): Observable<GroupeApiResponse> {
    return this.apiService.delete<GroupeApiResponse>(`/bookings/groupes/${groupeId}/etudiants/${etudiantId}`);
  }

  genererGroupes(options: GroupeGenerationOptions, etudiants: any[]): Observable<Groupe[]> {
    const coursId = (options as any).coursId;
    if (coursId) {
      return this.apiService.post<{ groupes: GroupeApiResponse[] }>(`/bookings/cours/${coursId}/groupes/generate`, {}).pipe(
        map(response => (response.groupes ?? []).map(this.toGroupe))
      );
    }

    return new Observable(observer => {
      const etudiantsClasse = etudiants.filter(e => e.classeId === options.classeId);
      const groupesGeneres: Groupe[] = [];

      if (etudiantsClasse.length === 0) {
        observer.next([]);
        observer.complete();
        return;
      }

      let etudiantsARepartir = [...etudiantsClasse];
      if (options.repartitionAleatoire) {
        for (let i = etudiantsARepartir.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [etudiantsARepartir[i], etudiantsARepartir[j]] = [etudiantsARepartir[j], etudiantsARepartir[i]];
        }
      }

      let nombreGroupes: number;
      let tailleParGroupe: number;

      if (options.nombreGroupes) {
        nombreGroupes = options.nombreGroupes;
        tailleParGroupe = Math.ceil(etudiantsARepartir.length / nombreGroupes);
      } else if (options.tailleGroupe) {
        tailleParGroupe = options.tailleGroupe;
        nombreGroupes = Math.ceil(etudiantsARepartir.length / tailleParGroupe);
      } else {
        tailleParGroupe = 5;
        nombreGroupes = Math.ceil(etudiantsARepartir.length / tailleParGroupe);
      }

      for (let i = 0; i < nombreGroupes; i++) {
        const debut = i * tailleParGroupe;
        const fin = Math.min(debut + tailleParGroupe, etudiantsARepartir.length);
        const etudiantsDuGroupe = etudiantsARepartir.slice(debut, fin);
        groupesGeneres.push({
          id: `local_${Date.now()}_${i}`,
          nom: `${options.prefixeNom} ${i + 1}`,
          classeId: options.classeId,
          etudiantsIds: etudiantsDuGroupe.map((e: any) => e.id),
          capaciteMax: tailleParGroupe
        });
      }

      observer.next(groupesGeneres);
      observer.complete();
    });
  }

  private toGroupe(r: GroupeApiResponse): Groupe {
    return {
      id: r.id,
      nom: `${r.coursIntitule ?? 'Groupe'} - G${r.numeroGroupe}`,
      classeId: r.coursId,
      etudiantsIds: [],
      capaciteMax: r.effectif
    };
  }
}
