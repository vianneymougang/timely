import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { LoginRequest } from '../models/login-request.model';
import { User } from '../models/user.model';

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

  /** One in-flight refresh so parallel 401s do not rotate the refresh token twice (backend invalidates old token). */
  private refreshInFlight$: Observable<AuthResponse> | null = null;

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

    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }

    this.refreshInFlight$ = this.http.post<AuthResponse>(`${this.AUTH_API}/refresh`, { refreshToken }).pipe(
      tap((response) => {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
      }),
      catchError((error) => {
        console.error('Token refresh error:', error);
        this.logout();
        return throwError(() => error);
      }),
      finalize(() => {
        this.refreshInFlight$ = null;
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    return this.refreshInFlight$;
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

    const clearSessionAndNavigate = () => {
      // Clear local storage
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);

      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      this.router.navigate(['/auth/login']);
    };

    // Call backend logout endpoint if refresh token exists
    if (refreshToken) {
      this.http.post(`${this.AUTH_API}/logout`, { refreshToken }).subscribe({
        next: () => clearSessionAndNavigate(),
        error: (error) => {
          console.error('Logout error:', error);
          clearSessionAndNavigate();
        }
      });
    } else {
      clearSessionAndNavigate();
    }
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

  /**
   * Request password reset - sends email with reset link
   */
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.AUTH_API}/forgot-password`, { email }).pipe(
      catchError((error) => {
        console.error('Forgot password error:', error);
        return throwError(
          () => new Error(error.error?.message || "Erreur lors de l'envoi de l'email")
        );
      })
    );
  }

  /**
   * Validate password reset token
   */
  validateResetToken(token: string): Observable<{ valid: boolean }> {
    return this.http.get<{ valid: boolean }>(`${this.AUTH_API}/validate-reset-token/${token}`).pipe(
      catchError((error) => {
        console.error('Token validation error:', error);
        return throwError(() => new Error(error.error?.message || 'Token invalide ou expiré'));
      })
    );
  }

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.AUTH_API}/reset-password`, { token, newPassword })
      .pipe(
        catchError((error) => {
          console.error('Reset password error:', error);
          return throwError(
            () => new Error(error.error?.message || 'Erreur lors de la réinitialisation')
          );
        })
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.AUTH_API}/change-password`, { currentPassword, newPassword })
      .pipe(
        catchError((error) => throwError(() => error))
      );
  }
}
