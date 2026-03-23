import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Filiere, CreateFiliereDTO, UpdateFiliereDTO } from '../models/academic.model';

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
      nom: 'Génie Informatique',
      description: 'Formation en développement logiciel et systèmes d\'information',
      ecoleId: '1',
      code: 'INF001'
    },
    {
      id: '2',
      nom: 'Génie Électrique',
      description: 'Formation en électronique et systèmes électriques',
      ecoleId: '1',
      code: 'ELEC01'
    },
    {
      id: '3',
      nom: 'Mathématiques',
      description: 'Mathématiques pures et appliquées',
      ecoleId: '2',
      code: 'MAT001'
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

  createFiliere(filiere: CreateFiliereDTO): Observable<Filiere> {
    return new Observable(observer => {
      const newFiliere: Filiere = {
        id: Date.now().toString(),
        ...filiere
      };
      this.mockFilieres.push(newFiliere);
      this.filiereSubject.next([...this.mockFilieres]);
      observer.next(newFiliere);
      observer.complete();
    });
  }

  updateFiliere(filiere: UpdateFiliereDTO): Observable<Filiere> {
    return new Observable(observer => {
      const index = this.mockFilieres.findIndex(f => f.id === filiere.id);
      if (index !== -1) {
        this.mockFilieres[index] = { ...this.mockFilieres[index], ...filiere };
        this.filiereSubject.next([...this.mockFilieres]);
        observer.next(this.mockFilieres[index]);
      }
      observer.complete();
    });
  }

  deleteFiliere(id: string): Observable<void> {
    return new Observable(observer => {
      this.mockFilieres = this.mockFilieres.filter(f => f.id !== id);
      this.filiereSubject.next([...this.mockFilieres]);
      observer.next();
      observer.complete();
    });
  }
}
