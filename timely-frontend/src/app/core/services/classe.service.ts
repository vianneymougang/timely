import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Classe, CreateClasseDTO, UpdateClasseDTO } from '../models/academic.model';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private classeSubject = new BehaviorSubject<Classe[]>([]);
  public classe$ = this.classeSubject.asObservable();

  // Mock data - à remplacer par des appels API
  private mockClasses: Classe[] = [
    {
      id: '1',
      nom: 'GI-3A',
      niveau: 'Licence 3',
      filiereId: '1'
    },
    {
      id: '2',
      nom: 'GI-4A',
      niveau: 'Master 1',
      filiereId: '1'
    },
    {
      id: '3',
      nom: 'GE-3A',
      niveau: 'Licence 3',
      filiereId: '2'
    },
    {
      id: '4',
      nom: 'MATH-L2',
      niveau: 'Licence 2',
      filiereId: '3'
    }
  ];

  constructor() {
    this.classeSubject.next(this.mockClasses);
  }

  getClasses(): Observable<Classe[]> {
    return this.classe$;
  }

  getClasseById(id: string): Classe | undefined {
    return this.mockClasses.find(c => c.id === id);
  }

  createClasse(classe: CreateClasseDTO): Observable<Classe> {
    return new Observable(observer => {
      const newClasse: Classe = {
        id: Date.now().toString(),
        ...classe
      };
      this.mockClasses.push(newClasse);
      this.classeSubject.next([...this.mockClasses]);
      observer.next(newClasse);
      observer.complete();
    });
  }

  updateClasse(classe: UpdateClasseDTO): Observable<Classe> {
    return new Observable(observer => {
      const index = this.mockClasses.findIndex(c => c.id === classe.id);
      if (index !== -1) {
        this.mockClasses[index] = { ...this.mockClasses[index], ...classe };
        this.classeSubject.next([...this.mockClasses]);
        observer.next(this.mockClasses[index]);
      }
      observer.complete();
    });
  }

  deleteClasse(id: string): Observable<void> {
    return new Observable(observer => {
      this.mockClasses = this.mockClasses.filter(c => c.id !== id);
      this.classeSubject.next([...this.mockClasses]);
      observer.next();
      observer.complete();
    });
  }
}
