import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../infrastructure/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log('Se ejecuto AuthGuard');

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/auth');
};
