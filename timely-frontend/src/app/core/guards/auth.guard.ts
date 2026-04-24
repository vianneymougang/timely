import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.checkAuth()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.checkAuth()) {
    return true;
  }

  if (authService.isAdmin()) {
    router.navigate(['/admin/dashboard']);
  } else {
    router.navigate(['/teacher/dashboard']);
  }
  return false;
};
