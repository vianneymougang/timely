import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { UE, CreateUEDTO, UpdateUEDTO } from '../models/cours.model';

@Injectable({
  providedIn: 'root'
})
export class UEService {
  private ueSubject = new BehaviorSubject<UE[]>([]);
  public ue$ = this.ueSubject.asObservable();

  // Mock data - à remplacer par des appels API
  private mockUE: UE[] = [
    {
      id: '1',
      intituleUE: 'Technologies Web',
      credit: 6,
      semestre: 5,
      description: 'Introduction aux technologies web modernes',
      filiereId: '1'
    },
    {
      id: '2',
      intituleUE: 'Systèmes d\'Information',
      credit: 4,
      semestre: 5,
      description: 'Conception et gestion des systèmes d\'information',
      filiereId: '1'
    }
  ];

  constructor() {
    this.ueSubject.next(this.mockUE);
  }

  getUE(): Observable<UE[]> {
    return this.ue$;
  }

  getUEById(id: string): UE | undefined {
    return this.mockUE.find(ue => ue.id === id);
  }

  createUE(ue: CreateUEDTO): Observable<UE> {
    return new Observable(observer => {
      const newUE: UE = {
        id: Date.now().toString(),
        ...ue
      };
      this.mockUE.push(newUE);
      this.ueSubject.next([...this.mockUE]);
      observer.next(newUE);
      observer.complete();
    });
  }

  updateUE(ue: UpdateUEDTO): Observable<UE> {
    return new Observable(observer => {
      const index = this.mockUE.findIndex(u => u.id === ue.id);
      if (index !== -1) {
        this.mockUE[index] = { ...this.mockUE[index], ...ue };
        this.ueSubject.next([...this.mockUE]);
        observer.next(this.mockUE[index]);
      }
      observer.complete();
    });
  }

  deleteUE(id: string): Observable<void> {
    return new Observable(observer => {
      this.mockUE = this.mockUE.filter(u => u.id !== id);
      this.ueSubject.next([...this.mockUE]);
      observer.next();
      observer.complete();
    });
  }
}
