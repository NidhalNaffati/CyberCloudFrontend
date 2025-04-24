import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, from } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getAccessToken();

    const skipAuthUrls = ['refresh-token', 'authenticate'];

    // Ajoute le token si la requête n’est pas dans les URLs à ignorer
    if (token && !skipAuthUrls.some(url => request.url.includes(url))) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Gestion des erreurs 401 : token expiré ou invalide
        if (error.status === 401) {
          const errorMessage = error.error?.message || error.error;

          if (
            typeof errorMessage === 'string' &&
            (errorMessage.includes('expired') || errorMessage.includes('Invalid token'))
          ) {
            // Rafraîchir le token
            return this.handle401Error(request, next);
          }

          // Si la requête concerne le refresh lui-même, éviter la boucle
          if (request.url.includes('refresh-token')) {
            this.authService.logout();
            this.router.navigate(['/auth/login'], { queryParams: { sessionExpired: 'true' } });
            return throwError(() => error);
          }

          // Autres cas 401 : déconnexion
          this.authService.logout();
          this.router.navigate(['/auth/login'], { queryParams: { sessionExpired: 'true' } });
          return throwError(() => error);
        }

        // Autres erreurs
        return throwError(() => error);
      })
    );
  }

  // Ajoute le header Authorization
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Gère le rafraîchissement du token en cas d’expiration
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return from(this.authService.refreshToken()).pipe(
        switchMap((response: { access_token: string }) => {
          this.refreshTokenSubject.next(response.access_token);
          return next.handle(this.addToken(request, response.access_token));
        }),
        catchError((error) => {
          // En cas d’échec du refresh : déconnexion
          this.authService.logout();
          this.router.navigate(['/auth/login'], { queryParams: { sessionExpired: 'true' } });
          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      // Si un refresh est déjà en cours, attendre le nouveau token
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request, token as string));
        })
      );
    }
  }
}
