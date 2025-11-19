import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError, delay } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { MOCK_USERS } from '../data/mock-data';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.checkStoredAuth();
  }

  /**
   * Connexion
   */
  login(email: string, password: string): Observable<{ user: User; token: string }> {
    // Mode développement - Authentification mock
    return of(null).pipe(
      delay(500), // Simuler délai réseau
      map(() => {
        const mockUser = MOCK_USERS.find(
          u => u.email === email && u.password === password
        );

        if (!mockUser) {
          throw new Error('Email ou mot de passe incorrect');
        }

        const response = {
          user: mockUser.user,
          token: 'mock-jwt-token-' + Date.now()
        };

        this.handleSuccessfulLogin(response);
        return response;
      })
    );
  }

  /**
   * Gérer une connexion réussie
   */
  private handleSuccessfulLogin(response: { user: User; token: string }): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);

    // Redirection selon le rôle
    if (response.user.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/teacher/dashboard']);
    }
  }

  /**
   * Vérifier l'authentification stockée
   */
  private checkStoredAuth(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  /**
   * Déconnexion
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  checkAuth(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  isTeacher(): boolean {
    return this.currentUser()?.role === 'teacher';
  }
}
