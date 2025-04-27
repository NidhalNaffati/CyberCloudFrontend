import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserProfile | null>;
  public currentUser: Observable<UserProfile | null>;
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<UserProfile | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  /**
   * Authenticates a user with their username/email and password
   * @param loginRequest The login credentials
   * @returns Observable of AuthResponse
   */
  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, loginRequest)
      .pipe(
        tap((response: AuthResponse) => {
          // Store authentication data in localStorage
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => {
          // Handle different error cases
          let errorMessage = 'Login failed';
          
          if (error.error && typeof error.error === 'object' && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status === 401) {
            errorMessage = 'Invalid username or password';
          } else if (error.status === 403) {
            errorMessage = 'Account is locked or disabled';
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**
   * Registers a new admin user
   * Using the exact API endpoint: POST /api/admin/dashboard/register
   * 
   * @param registerRequest The registration information including:
   *  - fullName: Full name of the admin
   *  - birthDate: Birth date in the format "YYYY-MM-DD"
   *  - email: Email address
   *  - username: Unique username
   *  - password: Password
   *  - adminSecretKey: Secret key required for admin registration
   * @returns Observable of the registered User object
   */
  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/admin/dashboard/register`, registerRequest)
      .pipe(
        tap((response: AuthResponse) => {
          // Log response for debugging
          console.log('Registration response:', response);
          // Store authentication data in localStorage
          if (response.accessToken && response.user) {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          } else {
            console.warn('Registration response missing accessToken or user:', response);
          }
        }),
        catchError(error => {
          // Enhanced error handling with detailed logging
          console.error('Registration error:', error);
          let errorMessage = 'Registration failed';
          
          if (error.error && typeof error.error === 'object' && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status === 409) {
            errorMessage = 'Username or email already exists';
          } else if (error.status === 400) {
            errorMessage = 'Invalid registration data';
          } else if (error.status === 403) {
            errorMessage = 'Invalid admin secret key';
          } else if (error.status === 0) {
            errorMessage = 'Network error: Unable to reach the server';
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**
   * Logs out the current user
   * Clears local storage and redirects to login page without API call
   */
  logout(): void {
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    // Update user subject
    this.currentUserSubject.next(null);
    // Navigate to login page
    this.router.navigate(['/auth']);
  }

  /**
   * Checks if the user is authenticated
   * @returns boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  /**
   * Retrieves the current access token
   * @returns string or null
   */
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Checks if the current user is an admin
   * @returns boolean indicating admin status
   */
  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user ? user.isAdmin : false;
  }
}