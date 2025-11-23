import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User, AuthResponse, LoginRequest, RegisterTeacherRequest } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
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
    const loginRequest: LoginRequest = { email, password };

    return this.apiService.post<AuthResponse>('/api/auth/login', loginRequest).pipe(
      map((authResponse) => {
        // Convertir AuthResponse en User
        const user: User = this.mapAuthResponseToUser(authResponse);
        const response = {
          user,
          token: authResponse.accessToken
        };

        this.handleSuccessfulLogin(response, authResponse.refreshToken);
        return response;
      }),
      catchError((error) => {
        // Préserver l'erreur HTTP complète pour une meilleure gestion dans le composant
        return throwError(() => error);
      })
    );
  }

  /**
   * Convertir AuthResponse en User
   */
  private mapAuthResponseToUser(authResponse: AuthResponse): User {
    // Le backend retourne 'name' qui contient le nom complet
    // On peut le splitter ou utiliser directement
    const nameParts = authResponse.name?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      id: authResponse.userId,
      email: authResponse.email,
      firstName,
      lastName,
      role: this.normalizeRole(authResponse.role),
      status: authResponse.status,
      name: authResponse.name
    };
  }

  /**
   * Normaliser le rôle (ROLE_ADMIN -> admin, ROLE_TEACHER -> teacher)
   */
  private normalizeRole(role: string): 'admin' | 'teacher' {
    if (role === 'ROLE_ADMIN' || role === 'admin') {
      return 'admin';
    }
    return 'teacher';
  }

  /**
   * Gérer une connexion réussie
   */
  private handleSuccessfulLogin(response: { user: User; token: string }, refreshToken: string): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);

    // Redirection selon le rôle
    if (response.user.role === 'admin' || response.user.role === 'ROLE_ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/teacher/dashboard']);
    }
  }

  /**
   * Enregistrer un nouvel enseignant (Admin uniquement)
   */
  registerTeacher(request: RegisterTeacherRequest): Observable<{ user: User; token: string }> {
    return this.apiService.post<AuthResponse>('/api/auth/register/teacher', request).pipe(
      map((authResponse) => {
        // Convertir AuthResponse en User
        const user: User = this.mapAuthResponseToUser(authResponse);
        const response = {
          user,
          token: authResponse.accessToken
        };

        // Note: On ne connecte pas automatiquement l'admin après l'enregistrement
        // L'admin reste connecté avec son propre compte
        return response;
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Rafraîchir le token d'accès
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('Aucun refresh token disponible'));
    }

    return this.apiService.post<AuthResponse>('/api/auth/refresh', { refreshToken }).pipe(
      tap((authResponse) => {
        const user = this.mapAuthResponseToUser(authResponse);
        localStorage.setItem('token', authResponse.accessToken);
        localStorage.setItem('refreshToken', authResponse.refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      }),
      catchError((error) => {
        // Si le refresh token est invalide, déconnecter l'utilisateur
        this.logout();
        return throwError(() => new Error('Session expirée. Veuillez vous reconnecter.'));
      })
    );
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
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Appeler l'API de déconnexion si un refresh token existe
    if (refreshToken) {
      this.apiService.post('/api/auth/logout', { refreshToken }).subscribe({
        error: () => {
          // Ignorer les erreurs lors de la déconnexion
        }
      });
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  checkAuth(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  isAdmin(): boolean {
    const role = this.currentUser()?.role;
    return role === 'admin' || role === 'ROLE_ADMIN';
  }

  isTeacher(): boolean {
    const role = this.currentUser()?.role;
    return role === 'teacher' || role === 'ROLE_TEACHER';
  }
}
