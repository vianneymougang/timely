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

  if (req.url.includes('/reports/dashboard')) {
    // #region agent log
    fetch('http://127.0.0.1:7648/ingest/353df7e9-5a1e-4ad8-a917-59345810afdc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '4f933b' },
      body: JSON.stringify({
        sessionId: '4f933b',
        location: 'auth.interceptor.ts:dashboard-req',
        message: 'dashboard request before send',
        data: {
          hypothesisId: 'H3',
          hasToken: !!token,
          tokenLen: token?.length ?? 0,
          authHeaderIncoming: !!req.headers.get('Authorization'),
        },
        timestamp: Date.now(),
        hypothesisId: 'H3',
      }),
    }).catch(() => {});
    // #endregion
  }

  if (req.url.includes('/auth/logout')) {
    // #region agent log
    fetch('http://127.0.0.1:7648/ingest/353df7e9-5a1e-4ad8-a917-59345810afdc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '4f933b' },
      body: JSON.stringify({
        sessionId: '4f933b',
        location: 'auth.interceptor.ts:logout-req',
        message: 'logout request before send',
        data: {
          hypothesisId: 'H1',
          hasToken: !!token,
          hasAuthHeader: !!req.headers.get('Authorization'),
        },
        timestamp: Date.now(),
        hypothesisId: 'H1',
      }),
    }).catch(() => {});
    // #endregion
  }

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // #region agent log
          fetch('http://127.0.0.1:7648/ingest/353df7e9-5a1e-4ad8-a917-59345810afdc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '4f933b' },
            body: JSON.stringify({
              sessionId: '4f933b',
              location: 'auth.interceptor.ts:401',
              message: '401 on authenticated request',
              data: {
                hypothesisId: 'H2-H4-H5',
                url: error.url ?? req.url,
                hasRefresh: !!authService.getRefreshToken(),
              },
              timestamp: Date.now(),
              hypothesisId: 'H2-H4-H5',
            }),
          }).catch(() => {});
          // #endregion
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
                // #region agent log
                fetch('http://127.0.0.1:7648/ingest/353df7e9-5a1e-4ad8-a917-59345810afdc', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '4f933b' },
                  body: JSON.stringify({
                    sessionId: '4f933b',
                    location: 'auth.interceptor.ts:refresh-failed',
                    message: 'refresh chain failed, will logout',
                    data: {
                      hypothesisId: 'H2-H4',
                      refreshStatus:
                        refreshError && typeof refreshError === 'object' && 'status' in refreshError
                          ? (refreshError as HttpErrorResponse).status
                          : null,
                    },
                    timestamp: Date.now(),
                    hypothesisId: 'H2-H4',
                  }),
                }).catch(() => {});
                // #endregion
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
