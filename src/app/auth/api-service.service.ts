import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Execute a GET request to the API
   * @param endpoint The API endpoint path
   * @param params Optional query parameters
   * @returns Observable with the response data
   */
  get<T>(endpoint: string, params?: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<T>(url, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Execute a POST request to the API
   * @param endpoint The API endpoint path
   * @param data The payload to send
   * @returns Observable with the response data
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.post<T>(url, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Execute a PUT request to the API
   * @param endpoint The API endpoint path
   * @param data The payload to send
   * @returns Observable with the response data
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.put<T>(url, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Execute a PATCH request to the API
   * @param endpoint The API endpoint path
   * @param data The payload to send
   * @returns Observable with the response data
   */
  patch<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.patch<T>(url, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Execute a DELETE request to the API
   * @param endpoint The API endpoint path
   * @returns Observable with the response data
   */
  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.delete<T>(url)
      .pipe(catchError(this.handleError));
  }

  /**
   * Centralized error handling for HTTP requests
   * @param error The HTTP error response
   * @returns Observable with error
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred while processing your request.';

    // Extract message from Spring Boot error response
    if (error.error) {
      if (typeof error.error === 'string') {
        try {
          // Try to parse it as JSON first
          const parsedError = JSON.parse(error.error);
          errorMessage = parsedError.message || errorMessage;
        } catch {
          // If not valid JSON, use as is
          errorMessage = error.error;
        }
      } else if (error.error.message) {
        errorMessage = error.error.message;
      }
    }

    // Log the error for debugging
    console.error('API Error:', error);
    console.error('Error Message:', errorMessage);

    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }
}
