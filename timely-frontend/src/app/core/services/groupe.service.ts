import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Groupe, CreateGroupeDTO, UpdateGroupeDTO, GroupeGenerationOptions } from '../models/etudiant.model';

@Injectable({
  providedIn: 'root'
})
export class GroupeService {
  private groupeSubject = new BehaviorSubject<Groupe[]>([]);
  public groupe$ = this.groupeSubject.asObservable();

  // Mock data - à remplacer par des appels API
  private mockGroupes: Groupe[] = [
    {
      id: '1',
      nom: 'Groupe A',
      description: 'Groupe de travaux pratiques A',
      classeId: '1',
      etudiantsIds: ['1', '2'],
      capaciteMax: 15
    },
    {
      id: '2',
      nom: 'Groupe B',
      description: 'Groupe de travaux pratiques B',
      classeId: '1',
      etudiantsIds: ['3'],
      capaciteMax: 15
    }
  ];

  constructor() {
    this.groupeSubject.next(this.mockGroupes);
  }

  getGroupes(): Observable<Groupe[]> {
    return this.groupe$;
  }

  getGroupeById(id: string): Groupe | undefined {
    return this.mockGroupes.find(g => g.id === id);
  }

  getGroupesByClasse(classeId: string): Observable<Groupe[]> {
    return new Observable(observer => {
      const groupes = this.mockGroupes.filter(g => g.classeId === classeId);
      observer.next(groupes);
      observer.complete();
    });
  }

  updateGroupe(groupe: UpdateGroupeDTO): Observable<Groupe> {
    return new Observable(observer => {
      const index = this.mockGroupes.findIndex(g => g.id === groupe.id);
      if (index !== -1) {
        this.mockGroupes[index] = {
          ...this.mockGroupes[index],
          ...groupe,
          etudiantsIds: groupe.etudiantsIds ?? this.mockGroupes[index].etudiantsIds
        };
        this.groupeSubject.next([...this.mockGroupes]);
        observer.next(this.mockGroupes[index]);
      }
      observer.complete();
    });
  }

  deleteGroupe(id: string): Observable<void> {
    return new Observable(observer => {
      this.mockGroupes = this.mockGroupes.filter(g => g.id !== id);
      this.groupeSubject.next([...this.mockGroupes]);
      observer.next();
      observer.complete();
    });
  }

  ajouterEtudiant(groupeId: string, etudiantId: string): Observable<Groupe> {
    return new Observable(observer => {
      const index = this.mockGroupes.findIndex(g => g.id === groupeId);
      if (index !== -1) {
        if (!this.mockGroupes[index].etudiantsIds.includes(etudiantId)) {
          this.mockGroupes[index].etudiantsIds.push(etudiantId);
          this.groupeSubject.next([...this.mockGroupes]);
        }
        observer.next(this.mockGroupes[index]);
      }
      observer.complete();
    });
  }

  retirerEtudiant(groupeId: string, etudiantId: string): Observable<Groupe> {
    return new Observable(observer => {
      const index = this.mockGroupes.findIndex(g => g.id === groupeId);
      if (index !== -1) {
        this.mockGroupes[index].etudiantsIds =
          this.mockGroupes[index].etudiantsIds.filter(id => id !== etudiantId);
        this.groupeSubject.next([...this.mockGroupes]);
        observer.next(this.mockGroupes[index]);
      }
      observer.complete();
    });
  }

  genererGroupes(options: GroupeGenerationOptions, etudiants: any[]): Observable<Groupe[]> {
    return new Observable(observer => {
      const groupesGeneres: Groupe[] = [];

      // Filtrer les étudiants de la classe
      const etudiantsClasse = etudiants.filter(e => e.classeId === options.classeId);

      if (etudiantsClasse.length === 0) {
        observer.next([]);
        observer.complete();
        return;
      }

      // Mélanger aléatoirement si demandé
      let etudiantsARepartir = [...etudiantsClasse];
      if (options.repartitionAleatoire) {
        etudiantsARepartir = this.shuffleArray(etudiantsARepartir);
      }

      // Calculer le nombre de groupes et la taille
      let nombreGroupes: number;
      let tailleParGroupe: number;

      if (options.nombreGroupes) {
        nombreGroupes = options.nombreGroupes;
        tailleParGroupe = Math.ceil(etudiantsARepartir.length / nombreGroupes);
      } else if (options.tailleGroupe) {
        tailleParGroupe = options.tailleGroupe;
        nombreGroupes = Math.ceil(etudiantsARepartir.length / tailleParGroupe);
      } else {
        // Par défaut: groupes de 5
        tailleParGroupe = 5;
        nombreGroupes = Math.ceil(etudiantsARepartir.length / tailleParGroupe);
      }

      // Créer les groupes
      for (let i = 0; i < nombreGroupes; i++) {
        const debut = i * tailleParGroupe;
        const fin = Math.min(debut + tailleParGroupe, etudiantsARepartir.length);
        const etudiantsDuGroupe = etudiantsARepartir.slice(debut, fin);

        const nouveauGroupe: Groupe = {
          id: `${Date.now()}_${i}`,
          nom: `${options.prefixeNom} ${i + 1}`,
          description: `Groupe généré automatiquement`,
          classeId: options.classeId,
          etudiantsIds: etudiantsDuGroupe.map(e => e.id),
          capaciteMax: tailleParGroupe
        };

        this.mockGroupes.push(nouveauGroupe);
        groupesGeneres.push(nouveauGroupe);
      }

      this.groupeSubject.next([...this.mockGroupes]);
      observer.next(groupesGeneres);
      observer.complete();
    });
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
