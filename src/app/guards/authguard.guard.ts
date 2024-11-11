import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, delay } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authguardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check for login status in cookies
  const isLoggedIn = authService.cookieService.get('isLoggedIn') === 'true';

  return authService.isLoggedIn$.pipe(
    delay(100), // Add a slight delay to ensure cookie changes are reflected
    map(storedIsLoggedIn => storedIsLoggedIn || isLoggedIn || router.createUrlTree(['/login']))
  );
};