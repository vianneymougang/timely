import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Cours, CreateCoursDTO, UpdateCoursDTO } from '../models/cours.model';

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  private coursSubject = new BehaviorSubject<Cours[]>([]);
  public cours$ = this.coursSubject.asObservable();

  // Mock data - à remplacer par des appels API
  private mockCours: Cours[] = [
    {
      id: '1',
      intitule: 'Programmation Web',
      volumeHoraire: 40,
      typeCours: 'CM',
      coefficient: 3,
      ueId: '1'
    },
    {
      id: '2',
      intitule: 'Bases de données',
      volumeHoraire: 30,
      typeCours: 'TD',
      coefficient: 2,
      ueId: '1'
    }
  ];

  constructor() {
    this.coursSubject.next(this.mockCours);
  }

  getCours(): Observable<Cours[]> {
    return this.cours$;
  }

  getCoursById(id: string): Cours | undefined {
    return this.mockCours.find(c => c.id === id);
  }

  createCours(cours: CreateCoursDTO): Observable<Cours> {
    return new Observable(observer => {
      const newCours: Cours = {
        id: Date.now().toString(),
        ...cours
      };
      this.mockCours.push(newCours);
      this.coursSubject.next([...this.mockCours]);
      observer.next(newCours);
      observer.complete();
    });
  }

  updateCours(cours: UpdateCoursDTO): Observable<Cours> {
    return new Observable(observer => {
      const index = this.mockCours.findIndex(c => c.id === cours.id);
      if (index !== -1) {
        this.mockCours[index] = { ...this.mockCours[index], ...cours };
        this.coursSubject.next([...this.mockCours]);
        observer.next(this.mockCours[index]);
      }
      observer.complete();
    });
  }

  deleteCours(id: string): Observable<void> {
    return new Observable(observer => {
      this.mockCours = this.mockCours.filter(c => c.id !== id);
      this.coursSubject.next([...this.mockCours]);
      observer.next();
      observer.complete();
    });
  }
}
