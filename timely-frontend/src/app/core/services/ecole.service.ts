import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  private ecoleSubject = new BehaviorSubject<Ecole[]>([]);
  public ecole$ = this.ecoleSubject.asObservable();

  private mockEcoles: Ecole[] = [
    {
      id: '1',
      nom: 'Saint Jean Ingénieur',
      directeur: 'Père Jean Hervé',
      description: "École d'ingénieurs formant des cadres techniques de haut niveau",
    },
    {
      id: '2',
      nom: 'CPGE',
      directeur: 'Père Georges',
      description: 'Formation en sciences fondamentales et appliquées',
    },
  ];

  constructor() {
    this.ecoleSubject.next(this.mockEcoles);
  }

  getEcoles(): Observable<Ecole[]> {
    return this.ecole$;
  }

  fetchEcolesFromApi(): Observable<EcoleDto[]> {
    return this.apiService.get<EcoleDto[]>('/bookings/ecoles');
  }

  getEcoleById(id: string): Ecole | undefined {
    return this.mockEcoles.find((e) => e.id === id);
  }

  createEcole(ecole: CreateEcoleDTO): Observable<Ecole> {
    return new Observable((observer) => {
      const newEcole: Ecole = {
        id: Date.now().toString(),
        ...ecole,
      };
      this.mockEcoles.push(newEcole);
      this.ecoleSubject.next([...this.mockEcoles]);
      observer.next(newEcole);
      observer.complete();
    });
  }

  updateEcole(ecole: UpdateEcoleDTO): Observable<Ecole> {
    return new Observable((observer) => {
      const index = this.mockEcoles.findIndex((e) => e.id === ecole.id);
      if (index !== -1) {
        this.mockEcoles[index] = { ...this.mockEcoles[index], ...ecole };
        this.ecoleSubject.next([...this.mockEcoles]);
        observer.next(this.mockEcoles[index]);
      }
      observer.complete();
    });
  }

  deleteEcole(id: string): Observable<void> {
    return new Observable((observer) => {
      this.mockEcoles = this.mockEcoles.filter((e) => e.id !== id);
      this.ecoleSubject.next([...this.mockEcoles]);
      observer.next();
      observer.complete();
    });
  }
}
