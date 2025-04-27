import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Log the payload for debugging
    console.log('Login payload:', credentials);

    // Ensure Content-Type is set
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials, { headers })
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          this.storeToken(response.accessToken);
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData, { headers })
      .pipe(
        tap(response => {
          this.storeToken(response.accessToken);
        }),
        catchError(this.handleError)
      );
  }

  getCurrentUser(): Observable<User> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<User>(`${this.apiUrl}/auth/me`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private storeToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    // Log the full error for debugging
    console.error('HTTP error:', error);

    if (error.status === 0) {
      // CORS or network error
      errorMessage = 'CORS or network error: Unable to reach the server. Please check your connection or server CORS configuration.';
    } else if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message; // Use server-provided message
      }
      // Handle specific HTTP status codes
      if (error.status === 401) {
        errorMessage = 'Unauthorized: Invalid username/email or password';
      } else if (error.status === 400) {
        errorMessage = error.error.message || 'Bad request: Invalid login data';
      } else if (error.status === 403) {
        errorMessage = 'Forbidden: Access denied';
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}