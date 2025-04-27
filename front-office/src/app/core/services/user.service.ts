import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get user by username
  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${username}`)
      .pipe(
        tap(response => console.log('User response:', response)),
        catchError(this.handleError)
      );
  }

  // Update current user's profile
  updateProfile(userData: Partial<User>): Observable<User> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<User>(`${this.apiUrl}/users/me`, userData, { headers })
      .pipe(
        tap(response => console.log('Updated user:', response)),
        catchError(this.handleError)
      );
  }

  // Get followers of a user
  getUserFollowers(username: string, page: number = 0, size: number = 20): Observable<User[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<User[]>(`${this.apiUrl}/users/by-id/${username}/followers`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get users followed by a user
  getUserFollowing(username: string, page: number = 0, size: number = 20): Observable<User[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<User[]>(`${this.apiUrl}/users/by-username/${username}/followings`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Search users
  searchUsers(query: string, page: number = 0, size: number = 20): Observable<User[]> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<User[]>(`${this.apiUrl}/explore/people`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get suggested users
  getSuggestedUsers(page: number = 0, size: number = 20): Observable<User[]> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    // Map page and size to limit (limit = size, ignore page for simplicity)
    const limit = size;
    const params = new HttpParams()
      .set('limit', limit.toString());
    return this.http.get<User[]>(`${this.apiUrl}/users/discover`, { headers, params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get current user's followers
  getMyFollowers(): Observable<User[]> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<User[]>(`${this.apiUrl}/users/me/followers`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Follow a user
  followUser(userId: string): Observable<void> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<void>(`${this.apiUrl}/users/${userId}/follow`, {}, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return throwError(() => ({ error: { error: 'User not found' }, status: 404 }));
          }
          return throwError(() => error);
        })
      );
  }

  // Unfollow a user
  unfollowUser(userId: string): Observable<void> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}/unfollow`, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return throwError(() => ({ error: { error: 'User not found' }, status: 404 }));
          }
          return throwError(() => error);
        })
      );
  }

  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.status === 0) {
      errorMessage = 'Network error: Unable to reach the server';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side errors
      switch (error.status) {
        case 400:
          errorMessage = error.error?.error || 'Invalid request';
          break;
        case 401:
          errorMessage = 'Please log in again';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action';
          break;
        case 404:
          errorMessage = 'User not found';
          break;
        default:
          errorMessage = error.error?.error || error.message || 'Server error occurred';
      }
    }

    return throwError(() => ({
      message: errorMessage,
      originalError: error,
      error: error.error,
      status: error.status
    }));
  }
}