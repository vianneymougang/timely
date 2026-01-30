import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Materiel, CreateMaterielDTO, UpdateMaterielDTO } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class MaterielService {
  private materielSubject = new BehaviorSubject<Materiel[]>([]);
  public materiel$ = this.materielSubject.asObservable();

  // Mock data - à remplacer par des appels API
  private mockMateriels: Materiel[] = [
    {
      id: '1',
      nom: 'rallonge',
      type: 'electrique',
      etat: 'Bon',
      quantite: 50,
      description: 'rallonge pour les appareils'
    },
    {
      id: '2',
      nom: 'projecteur',
      type: 'electrique',
      etat: 'Excellent',
      quantite: 25,
      description: 'projecteur pour les cours'
    },
    {
      id: '3',
      nom: 'Marqueurs tableau blanc',
      type: 'Fourniture',
      etat: 'Bon',
      quantite: 100,
      description: 'Marqueurs effaçables à sec'
    },
    {
      id: '4',
      nom: 'Haut parleurs',
      type: 'electrique',
      etat: 'Excellent',
      quantite: 10,
      description: ''
    }
  ];

  constructor() {
    this.materielSubject.next(this.mockMateriels);
  }

  getMateriels(): Observable<Materiel[]> {
    return this.materiel$;
  }

  getMaterielById(id: string): Materiel | undefined {
    return this.mockMateriels.find(m => m.id === id);
  }

  createMateriel(materiel: CreateMaterielDTO): Observable<Materiel> {
    return new Observable(observer => {
      const newMateriel: Materiel = {
        id: Date.now().toString(),
        ...materiel
      };
      this.mockMateriels.push(newMateriel);
      this.materielSubject.next([...this.mockMateriels]);
      observer.next(newMateriel);
      observer.complete();
    });
  }

  updateMateriel(materiel: UpdateMaterielDTO): Observable<Materiel> {
    return new Observable(observer => {
      const index = this.mockMateriels.findIndex(m => m.id === materiel.id);
      if (index !== -1) {
        this.mockMateriels[index] = { ...this.mockMateriels[index], ...materiel };
        this.materielSubject.next([...this.mockMateriels]);
        observer.next(this.mockMateriels[index]);
      }
      observer.complete();
    });
  }

  deleteMateriel(id: string): Observable<void> {
    return new Observable(observer => {
      this.mockMateriels = this.mockMateriels.filter(m => m.id !== id);
      this.materielSubject.next([...this.mockMateriels]);
      observer.next();
      observer.complete();
    });
  }
}
