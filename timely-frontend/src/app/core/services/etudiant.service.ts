import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Etudiant, CreateEtudiantDTO, UpdateEtudiantDTO } from '../models/etudiant.model';
import { ApiService } from './api.service';

interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface EtudiantApiResponse {
  id: string;
  classeId: string;
  classeCode: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateInscription: string;
}

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private apiService = inject(ApiService);

  getEtudiants(): Observable<Etudiant[]> {
    return this.apiService.get<PagedResponse<EtudiantApiResponse>>('/bookings/etudiants', { page: 0, size: 200 }).pipe(
      map(page => page.content.map(this.toEtudiant))
    );
  }

  getEtudiantById(id: string): Observable<Etudiant> {
    return this.apiService.get<EtudiantApiResponse>(`/bookings/etudiants/${id}`).pipe(
      map(this.toEtudiant)
    );
  }

  getEtudiantsByClasse(classeId: string): Observable<Etudiant[]> {
    return this.apiService.get<PagedResponse<EtudiantApiResponse>>(`/bookings/classes/${classeId}/etudiants`, { page: 0, size: 200 }).pipe(
      map(page => page.content.map(this.toEtudiant))
    );
  }

  getEtudiantsByGroupe(groupeId: string): Observable<Etudiant[]> {
    return this.getEtudiants().pipe(
      map(etudiants => etudiants.filter(e => e.groupeId === groupeId))
    );
  }

  createEtudiant(etudiant: CreateEtudiantDTO): Observable<Etudiant> {
    const body = {
      classeId: etudiant.classeId,
      matricule: etudiant.matricule,
      nom: etudiant.nom,
      prenom: etudiant.prenom,
      email: etudiant.email,
      telephone: etudiant.telephone,
      dateInscription: etudiant.dateNaissance
    };
    return this.apiService.post<EtudiantApiResponse>('/bookings/etudiants', body).pipe(
      map(this.toEtudiant)
    );
  }

  updateEtudiant(etudiant: UpdateEtudiantDTO): Observable<Etudiant> {
    const { id, ...rest } = etudiant;
    const body = {
      classeId: rest.classeId,
      matricule: rest.matricule,
      nom: rest.nom,
      prenom: rest.prenom,
      email: rest.email,
      telephone: rest.telephone,
      dateInscription: rest.dateNaissance
    };
    return this.apiService.put<EtudiantApiResponse>(`/bookings/etudiants/${id}`, body).pipe(
      map(this.toEtudiant)
    );
  }

  deleteEtudiant(id: string): Observable<void> {
    return this.apiService.delete<void>(`/bookings/etudiants/${id}`);
  }

  affecterGroupe(etudiantId: string, groupeId: string): Observable<Etudiant> {
    return this.apiService.post<EtudiantApiResponse>(`/bookings/groupes/${groupeId}/etudiants/${etudiantId}`, {}).pipe(
      map(this.toEtudiant)
    );
  }

  retirerGroupe(etudiantId: string, groupeId: string): Observable<Etudiant> {
    return this.apiService.delete<EtudiantApiResponse>(`/bookings/groupes/${groupeId}/etudiants/${etudiantId}`).pipe(
      map(this.toEtudiant)
    );
  }

  private toEtudiant(r: EtudiantApiResponse): Etudiant {
    return {
      id: r.id,
      matricule: r.matricule,
      nom: r.nom,
      prenom: r.prenom,
      email: r.email,
      telephone: r.telephone ?? '',
      dateNaissance: r.dateInscription,
      classeId: r.classeId
    };
  }
}
