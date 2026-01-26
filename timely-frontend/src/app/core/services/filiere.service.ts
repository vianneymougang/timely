import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Filiere } from '../models/cours.model';

@Injectable({
  providedIn: 'root'
})
export class FiliereService {
  private filiereSubject = new BehaviorSubject<Filiere[]>([]);
  public filiere$ = this.filiereSubject.asObservable();

  // Mock data - à remplacer par des appels API
  private mockFilieres: Filiere[] = [
    {
      id: '1',
      nom: 'Informatique',
      code: 'INF'
    },
    {
      id: '2',
      nom: 'Génie Logiciel',
      code: 'GL'
    },
    {
      id: '3',
      nom: 'Réseaux et Télécommunications',
      code: 'RT'
    }
  ];

  constructor() {
    this.filiereSubject.next(this.mockFilieres);
  }

  getFilieres(): Observable<Filiere[]> {
    return this.filiere$;
  }

  getFiliereById(id: string): Filiere | undefined {
    return this.mockFilieres.find(f => f.id === id);
  }
}
