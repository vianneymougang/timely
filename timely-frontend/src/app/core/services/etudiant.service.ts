import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Etudiant, CreateEtudiantDTO, UpdateEtudiantDTO } from '../models/etudiant.model';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private etudiantSubject = new BehaviorSubject<Etudiant[]>([]);
  public etudiant$ = this.etudiantSubject.asObservable();

  // Mock data - à remplacer par des appels API
  private mockEtudiants: Etudiant[] = [
    {
      id: '1',
      matricule: '2024I001',
      nom: 'MEPE',
      prenom: 'Victoire',
      email: 'victoire.mepe@gmail.com',
      telephone: '+237 650 123 456',
      dateNaissance: '2005-05-15',
      classeId: '1',
      groupeId: '1'
    },
    {
      id: '2',
      matricule: '2024002',
      nom: 'Mougang',
      prenom: 'Ange-Vianney',
      email: 'ange@example.com',
      telephone: '+237 650 234 567',
      dateNaissance: '2003-08-20',
      classeId: '1',
      groupeId: '1'
    },
    {
      id: '3',
      matricule: '2024003',
      nom: 'Biango',
      prenom: 'Miguel',
      email: 'miguel@gmail.com',
      telephone: '+237 650 345 678',
      dateNaissance: '2002-11-10',
      classeId: '1',
      groupeId: '2'
    },
    {
      id: '4',
      matricule: '2024003',
      nom: 'hjgbj',
      prenom: 'Miguel',
      email: 'hghg@gmail.com',
      telephone: '+237 650 345 688',
      dateNaissance: '2002-11-10',
      classeId: '3',
    },
  ];

  constructor() {
    this.etudiantSubject.next(this.mockEtudiants);
  }

  getEtudiants(): Observable<Etudiant[]> {
    return this.etudiant$;
  }

  getEtudiantById(id: string): Etudiant | undefined {
    return this.mockEtudiants.find(e => e.id === id);
  }

  getEtudiantsByClasse(classeId: string): Observable<Etudiant[]> {
    return new Observable(observer => {
      const etudiants = this.mockEtudiants.filter(e => e.classeId === classeId);
      observer.next(etudiants);
      observer.complete();
    });
  }

  getEtudiantsByGroupe(groupeId: string): Observable<Etudiant[]> {
    return new Observable(observer => {
      const etudiants = this.mockEtudiants.filter(e => e.groupeId === groupeId);
      observer.next(etudiants);
      observer.complete();
    });
  }

  createEtudiant(etudiant: CreateEtudiantDTO): Observable<Etudiant> {
    return new Observable(observer => {
      const newEtudiant: Etudiant = {
        id: Date.now().toString(),
        ...etudiant
      };
      this.mockEtudiants.push(newEtudiant);
      this.etudiantSubject.next([...this.mockEtudiants]);
      observer.next(newEtudiant);
      observer.complete();
    });
  }

  updateEtudiant(etudiant: UpdateEtudiantDTO): Observable<Etudiant> {
    return new Observable(observer => {
      const index = this.mockEtudiants.findIndex(e => e.id === etudiant.id);
      if (index !== -1) {
        this.mockEtudiants[index] = { ...this.mockEtudiants[index], ...etudiant };
        this.etudiantSubject.next([...this.mockEtudiants]);
        observer.next(this.mockEtudiants[index]);
      }
      observer.complete();
    });
  }

  deleteEtudiant(id: string): Observable<void> {
    return new Observable(observer => {
      this.mockEtudiants = this.mockEtudiants.filter(e => e.id !== id);
      this.etudiantSubject.next([...this.mockEtudiants]);
      observer.next();
      observer.complete();
    });
  }

  affecterGroupe(etudiantId: string, groupeId: string): Observable<Etudiant> {
    return new Observable(observer => {
      const index = this.mockEtudiants.findIndex(e => e.id === etudiantId);
      if (index !== -1) {
        this.mockEtudiants[index].groupeId = groupeId;
        this.etudiantSubject.next([...this.mockEtudiants]);
        observer.next(this.mockEtudiants[index]);
      }
      observer.complete();
    });
  }

  retirerGroupe(etudiantId: string): Observable<Etudiant> {
    return new Observable(observer => {
      const index = this.mockEtudiants.findIndex(e => e.id === etudiantId);
      if (index !== -1) {
        this.mockEtudiants[index].groupeId = undefined;
        this.etudiantSubject.next([...this.mockEtudiants]);
        observer.next(this.mockEtudiants[index]);
      }
      observer.complete();
    });
  }
}
