import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DashboardStats, UserStats, ContentStats, EngagementStats, GrowthData } from '../models/stats.model';
import { User, UserPage, UserProfile } from '../models/user.model';
import { Buzz } from '../models/buzz.model';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Performs an HTTP GET request to the specified endpoint
   * @param endpoint The API endpoint
   * @param params Query parameters
   * @returns Observable of the response
   */
  get<T>(endpoint: string, params: any = {}): Observable<T> {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { params: httpParams })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Performs an HTTP POST request to the specified endpoint
   * @param endpoint The API endpoint
   * @param data Request body
   * @returns Observable of the response
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Performs an HTTP PUT request to the specified endpoint
   * @param endpoint The API endpoint
   * @param data Request body
   * @returns Observable of the response
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Performs an HTTP DELETE request to the specified endpoint
   * @param endpoint The API endpoint
   * @returns Observable of the response
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  /**
   * Handles HTTP errors and transforms them into a standardized format
   * Maps API-specific error responses to meaningful error messages
   * Preserves original error data for component-level handling
   * 
   * @param error The HTTP error response
   * @returns An observable error with formatted message
   */
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred';
    const errorData: any = {
      status: error.status,
      statusText: error.statusText,
      originalMessage: ''
    };
    
    // Client-side or network error
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
      errorData.originalMessage = error.error.message;
    } 
    // Server returned an error object with a message
    else if (error.error && typeof error.error === 'object' && error.error.message) {
      errorMessage = error.error.message;
      errorData.originalMessage = error.error.message;
      
      // Check for validation errors (common pattern in APIs)
      if (error.error.errors) {
        errorData.validationErrors = error.error.errors;
        // If it's a validation error, append the first error message
        if (Array.isArray(error.error.errors) && error.error.errors.length > 0) {
          errorMessage += `: ${error.error.errors[0].message || error.error.errors[0]}`;
        }
      }
    } 
    // Server returned an error string
    else if (error.error && typeof error.error === 'string') {
      errorMessage = error.error;
      errorData.originalMessage = error.error;
    } 
    // Use HTTP status code to generate message
    else if (error.status) {
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid request data';
          break;
        case 401:
          errorMessage = 'Your session has expired. Please log in again.';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 409:
          errorMessage = 'Conflict with current state of the resource.';
          break;
        case 422:
          errorMessage = 'The request data failed validation.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later or contact support.';
          break;
        case 503:
          errorMessage = 'Service unavailable. Please try again later.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.statusText || 'Unknown error'}`;
      }
    }
    
    // Create an error object with additional data
    const enhancedError = new Error(errorMessage);
    (enhancedError as any).errorData = errorData;
    
    return throwError(() => enhancedError);
  }
}