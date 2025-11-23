import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Ajouter le token à la requête si disponible
  let authReq = req;
  if (token && !req.url.includes('/api/auth/login') && !req.url.includes('/api/auth/refresh')) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Gérer les erreurs 401 (Unauthorized)
      if (error.status === 401 && !req.url.includes('/api/auth/login') && !req.url.includes('/api/auth/refresh')) {
        const refreshToken = authService.getRefreshToken();
        
        // Essayer de rafraîchir le token si disponible
        if (refreshToken) {
          return authService.refreshToken().pipe(
            switchMap(() => {
              // Réessayer la requête originale avec le nouveau token
              const newToken = authService.getToken();
              if (newToken) {
                const retryReq = req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${newToken}`)
                });
                return next(retryReq);
              }
              return throwError(() => error);
            }),
            catchError((refreshError) => {
              // Si le refresh échoue, déconnecter l'utilisateur
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          // Pas de refresh token, déconnecter l'utilisateur
          authService.logout();
        }
      }

      // Gérer les erreurs 403 (Forbidden)
      if (error.status === 403) {
        router.navigate(['/admin/dashboard']); // Rediriger vers le dashboard
      }

      return throwError(() => error);
    })
  );
};
