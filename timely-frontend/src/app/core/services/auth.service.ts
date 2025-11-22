import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthResponse } from '../models/auth-response.model';
import { LoginRequest } from '../models/login-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  private readonly AUTH_API = `${environment.apiUrl}/auth`;
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'user';

  constructor() {
    this.checkStoredAuth();
  }

  /**
   * Login with API Gateway
   */
  login(email: string, password: string): Observable<AuthResponse> {
    const loginRequest: LoginRequest = { email, password };

    return this.http.post<AuthResponse>(`${this.AUTH_API}/login`, loginRequest).pipe(
      tap((response) => this.handleSuccessfulLogin(response)),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(
          () => new Error(error.error?.message || 'Email ou mot de passe incorrect')
        );
      })
    );
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(`${this.AUTH_API}/refresh`, { refreshToken }).pipe(
      tap((response) => {
        // Update tokens
        localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
      }),
      catchError((error) => {
        console.error('Token refresh error:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Handle successful login
   */
  private handleSuccessfulLogin(response: AuthResponse): void {
    // Store tokens
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);

    // Map backend response to User model
    const user: User = {
      id: response.userId,
      email: response.email,
      name: response.name,
      role: this.mapRole(response.role),
      status: response.status,
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
    this.isAuthenticated.set(true);

    // Redirection selon le rôle
    if (user.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/teacher/dashboard']);
    }
  }

  /**
   * Map backend role format to frontend format
   * ROLE_ADMIN -> 'admin', ROLE_TEACHER -> 'teacher'
   */
  private mapRole(backendRole: string): 'admin' | 'teacher' {
    if (backendRole.includes('ADMIN')) {
      return 'admin';
    }
    return 'teacher';
  }

  /**
   * Check stored authentication
   */
  private checkStoredAuth(): void {
    const token = this.getAccessToken();
    const userStr = localStorage.getItem(this.USER_KEY);

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
   * Logout
   */
  logout(): void {
    const refreshToken = this.getRefreshToken();

    // Call backend logout endpoint if refresh token exists
    if (refreshToken) {
      this.http.post(`${this.AUTH_API}/logout`, { refreshToken }).subscribe({
        error: (error) => console.error('Logout error:', error),
      });
    }

    // Clear local storage
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Legacy method for backward compatibility
   */
  getToken(): string | null {
    return this.getAccessToken();
  }

  checkAuth(): boolean {
    return !!this.getAccessToken();
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
