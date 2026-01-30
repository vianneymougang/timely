import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Equipement, CreateEquipementDTO, UpdateEquipementDTO } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class EquipementService {
  private equipementSubject = new BehaviorSubject<Equipement[]>([]);
  public equipement$ = this.equipementSubject.asObservable();

  // Mock data - à remplacer par des appels API
  private mockEquipements: Equipement[] = [
    {
      id: '1',
      nom: 'Projecteur HD',
      type: 'Audiovisuel',
      etat: 'Excellent',
      description: 'Projecteur 1080p avec connectivité HDMI',
      materielsAffectes: [
        { materielId: '1', quantiteAffectee: 2 },
        { materielId: '2', quantiteAffectee: 1 }
      ]
    },
    {
      id: '2',
      nom: 'Système de sonorisation',
      type: 'Audiovisuel',
      etat: 'Bon',
      description: 'Haut-parleurs et microphones sans fil',
      materielsAffectes: [
        { materielId: '4', quantiteAffectee: 2 }
      ]
    },
    {
      id: '3',
      nom: 'marqueyrs cours',
      type: 'Informatique',
      etat: 'Excellent',
      description: '',
      materielsAffectes: [
        { materielId: '3', quantiteAffectee: 5 } // 5 marqueurs
      ]
    },
  ];

  constructor() {
    this.equipementSubject.next(this.mockEquipements);
  }

  getEquipements(): Observable<Equipement[]> {
    return this.equipement$;
  }

  getEquipementById(id: string): Equipement | undefined {
    return this.mockEquipements.find(e => e.id === id);
  }

  createEquipement(equipement: CreateEquipementDTO): Observable<Equipement> {
    return new Observable(observer => {
      const newEquipement: Equipement = {
        id: Date.now().toString(),
        ...equipement,
        materielsAffectes: equipement.materielsAffectes || []
      };
      this.mockEquipements.push(newEquipement);
      this.equipementSubject.next([...this.mockEquipements]);
      observer.next(newEquipement);
      observer.complete();
    });
  }

  updateEquipement(equipement: UpdateEquipementDTO): Observable<Equipement> {
    return new Observable(observer => {
      const index = this.mockEquipements.findIndex(e => e.id === equipement.id);
      if (index !== -1) {
        this.mockEquipements[index] = {
          ...this.mockEquipements[index],
          ...equipement,
          materielsAffectes: equipement.materielsAffectes ?? this.mockEquipements[index].materielsAffectes
        };
        this.equipementSubject.next([...this.mockEquipements]);
        observer.next(this.mockEquipements[index]);
      }
      observer.complete();
    });
  }

  deleteEquipement(id: string): Observable<void> {
    return new Observable(observer => {
      this.mockEquipements = this.mockEquipements.filter(e => e.id !== id);
      this.equipementSubject.next([...this.mockEquipements]);
      observer.next();
      observer.complete();
    });
  }
}
