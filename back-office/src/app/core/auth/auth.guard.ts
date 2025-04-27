import { inject, Injectable } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Authentication guard for protecting routes
 * Uses functional guard pattern for Angular 19+
 * Checks if user is authenticated and has admin privileges
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    if (authService.isAuthenticated()) {
      // Check if user is admin (all admin dashboard users should be admins)
      if (authService.isAdmin()) {
        return true;
      } else {
        // User is authenticated but not an admin
        console.log('User is not an admin - redirecting to auth page');
        router.navigate(['/auth']);
        return false;
      }
    }
    
    // Not authenticated, redirect to auth page
    console.log('User is not authenticated - redirecting to auth page');
    router.navigate(['/auth']);
    return false;
  } catch (error) {
    console.error('Error in auth guard:', error);
    router.navigate(['/auth']);
    return false;
  }
}

/**
 * Legacy class-based guard for backwards compatibility
 * @deprecated Use the functional authGuard instead
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return authGuard(route, state);
  }
}
