import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../services/auth.service';
import { AppState } from '../store/app.state';
import * as AuthActions from '../store/auth/auth.actions';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const store = inject(Store<AppState>);
  const token = authService.getToken();

  // Clone the request and add the token if it exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors by logging the user out
      if (error.status === 401) {
        store.dispatch(AuthActions.logout());
        router.navigate(['/auth']);
      }
      
      return throwError(() => error);
    })
  );
};
