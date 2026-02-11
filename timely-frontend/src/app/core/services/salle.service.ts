import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Salle, CreateSalleDTO, UpdateSalleDTO } from '../models/salle.model';

@Injectable({
  providedIn: 'root'
})
export class SalleService {
  private salleSubject = new BehaviorSubject<Salle[]>([]);
  public salle$ = this.salleSubject.asObservable();

  // Mock data - à remplacer par des appels API
  private mockSalles: Salle[] = [
    {
      id: '1',
      numeroSalle: 'A101',
      type: 'Amphithéâtre',
      capacite: 200,
      batiment: 'Bâtiment A',
      etage: 1,
      disponible: true,
      ecoleId: '1',
      materielAffecte: [
        { materielId: '1', quantiteAffectee: 200, dateAffectation: '2024-01-15' }, // Chaises
        { materielId: '2', quantiteAffectee: 1, dateAffectation: '2024-01-15' }     // Table
      ],
      equipementAffecte: [
        { equipementId: '1', dateAffectation: '2024-01-20' }, // Projecteur
        { equipementId: '2', dateAffectation: '2024-01-20' }  // Système audio
      ]
    },
    {
      id: '2',
      numeroSalle: 'B205',
      type: 'Salle de TP',
      capacite: 30,
      batiment: 'Bâtiment B',
      etage: 2,
      disponible: true,
      ecoleId: '1',
      materielAffecte: [
        { materielId: '1', quantiteAffectee: 30, dateAffectation: '2024-02-01' }
      ],
      equipementAffecte: [
        { equipementId: '3', dateAffectation: '2024-02-05' } // Ordinateur
      ]
    },
    {
      id: '3',
      numeroSalle: 'C102',
      type: 'Laboratoire',
      capacite: 25,
      batiment: 'Bâtiment C',
      etage: 1,
      disponible: false,
      ecoleId: '1',
      materielAffecte: [],
      equipementAffecte: [
        { equipementId: '5', dateAffectation: '2024-01-10' } // Imprimante 3D
      ]
    },
    {
      id: '4',
      numeroSalle: 'A203',
      type: 'Salle de TD',
      capacite: 40,
      batiment: 'Bâtiment A',
      etage: 2,
      disponible: true,
      ecoleId: '1',
      materielAffecte: [
        { materielId: '1', quantiteAffectee: 40, dateAffectation: '2024-01-12' },
        { materielId: '2', quantiteAffectee: 10, dateAffectation: '2024-01-12' }
      ],
      equipementAffecte: []
    }
  ];

  constructor() {
    this.salleSubject.next(this.mockSalles);
  }

  getSalles(): Observable<Salle[]> {
    return this.salle$;
  }

  getSalleById(id: string): Salle | undefined {
    return this.mockSalles.find(s => s.id === id);
  }

  getSallesByEcole(ecoleId: string): Observable<Salle[]> {
    return new Observable(observer => {
      const salles = this.mockSalles.filter(s => s.ecoleId === ecoleId);
      observer.next(salles);
      observer.complete();
    });
  }

  getSallesByType(type: string): Observable<Salle[]> {
    return new Observable(observer => {
      const salles = this.mockSalles.filter(s => s.type === type);
      observer.next(salles);
      observer.complete();
    });
  }

  getSallesDisponibles(): Observable<Salle[]> {
    return new Observable(observer => {
      const salles = this.mockSalles.filter(s => s.disponible);
      observer.next(salles);
      observer.complete();
    });
  }

  createSalle(salle: CreateSalleDTO): Observable<Salle> {
    return new Observable(observer => {
      const newSalle: Salle = {
        id: Date.now().toString(),
        ...salle,
        materielAffecte: salle.materielAffecte || [],
        equipementAffecte: salle.equipementAffecte || []
      };
      this.mockSalles.push(newSalle);
      this.salleSubject.next([...this.mockSalles]);
      observer.next(newSalle);
      observer.complete();
    });
  }

  updateSalle(salle: UpdateSalleDTO): Observable<Salle> {
    return new Observable(observer => {
      const index = this.mockSalles.findIndex(s => s.id === salle.id);
      if (index !== -1) {
        this.mockSalles[index] = {
          ...this.mockSalles[index],
          ...salle,
          materielAffecte: salle.materielAffecte ?? this.mockSalles[index].materielAffecte,
          equipementAffecte: salle.equipementAffecte ?? this.mockSalles[index].equipementAffecte
        };
        this.salleSubject.next([...this.mockSalles]);
        observer.next(this.mockSalles[index]);
      }
      observer.complete();
    });
  }

  deleteSalle(id: string): Observable<void> {
    return new Observable(observer => {
      this.mockSalles = this.mockSalles.filter(s => s.id !== id);
      this.salleSubject.next([...this.mockSalles]);
      observer.next();
      observer.complete();
    });
  }

  toggleDisponibilite(id: string): Observable<Salle> {
    return new Observable(observer => {
      const index = this.mockSalles.findIndex(s => s.id === id);
      if (index !== -1) {
        this.mockSalles[index].disponible = !this.mockSalles[index].disponible;
        this.salleSubject.next([...this.mockSalles]);
        observer.next(this.mockSalles[index]);
      }
      observer.complete();
    });
  }
}
