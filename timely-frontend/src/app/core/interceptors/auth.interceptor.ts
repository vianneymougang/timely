import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip adding token for public endpoints
  const publicEndpoints = ['/api/auth/login', '/api/auth/refresh'];
  const isPublicEndpoint = publicEndpoints.some((endpoint) => req.url.includes(endpoint));

  if (isPublicEndpoint) {
    return next(req);
  }

  // Add access token to request
  const token = authService.getAccessToken();

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const refreshToken = authService.getRefreshToken();
          if (refreshToken) {
            return authService.refreshToken().pipe(
              switchMap(() => {
                const newToken = authService.getAccessToken();
                const retryReq = req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${newToken}`),
                });
                return next(retryReq);
              }),
              catchError((refreshError) => {
                authService.logout();
                return throwError(() => refreshError);
              })
            );
          }
          authService.logout();
        }

        return throwError(() => error);
      })
    );
  }

  return next(req);
};
