import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  checkAuthStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.checkAuthStatus),
      switchMap(() => {
        return this.authService.getCurrentUser().pipe(
          map((user) => AuthActions.checkAuthStatusSuccess({ user })),
          catchError((error) => of(AuthActions.checkAuthStatusFailure({ error })))
        );
      })
    );
  });

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) => {
        return this.authService.login(credentials).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        );
      })
    );
  });

  loginSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ response }) => {
        this.router.navigate(['/']);
        this.snackBar.open('Login successful!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      })
    );
  }, { dispatch: false });

  loginFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginFailure),
      tap(({ error }) => {
        this.snackBar.open(
          error.error || 'Failed to login. Please check your credentials.',
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          }
        );
      })
    );
  }, { dispatch: false });

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ userData }) => {
        return this.authService.register(userData).pipe(
          map((response) => AuthActions.registerSuccess({ response })),
          catchError((error) => of(AuthActions.registerFailure({ error })))
        );
      })
    );
  });

  registerSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(({ response }) => {
        this.router.navigate(['/']);
        this.snackBar.open('Registration successful!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      })
    );
  }, { dispatch: false });

  registerFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.registerFailure),
      tap(({ error }) => {
        this.snackBar.open(
          error.error || 'Failed to register. Please try again.',
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          }
        );
      })
    );
  }, { dispatch: false });

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.logout();
      }),
      map(() => AuthActions.logoutSuccess())
    );
  });

  logoutSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logoutSuccess),
      tap(() => {
        this.router.navigate(['/auth']);
        this.snackBar.open('You have been logged out.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      })
    );
  }, { dispatch: false });

  getCurrentUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.getCurrentUser),
      switchMap(() => {
        return this.authService.getCurrentUser().pipe(
          map((user) => AuthActions.getCurrentUserSuccess({ user })),
          catchError((error) => of(AuthActions.getCurrentUserFailure({ error })))
        );
      })
    );
  });
}
