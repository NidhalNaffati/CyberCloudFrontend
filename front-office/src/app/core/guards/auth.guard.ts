import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AppState } from '../store/app.state';
import { selectIsAuthenticated } from '../store/auth/auth.selectors';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  
  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      
      // Redirect to the auth page
      return router.createUrlTree(['/auth']);
    })
  );
};
