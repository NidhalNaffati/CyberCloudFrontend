import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Buzz, CreateBuzzRequest, TrendingBuzz } from '../models/buzz.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BuzzService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get feed (buzzes from users you follow)
  getFeed(page: number = 0, size: number = 100): Observable<Buzz[]> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    const url = `${this.apiUrl}/buzzs/mainstream`;
    console.log('getFeed URL:', url);
    return this.http.get<Buzz[]>(url, { headers, params })
      .pipe(
        tap(buzzes => console.log('getFeed response:', buzzes)),
        catchError(this.handleError)
      );
  }

  // Get a single buzz by ID
  getBuzzById(id: string): Observable<Buzz> {
    const url = `${this.apiUrl}/buzzs/${id}`;
    console.log('getBuzzById URL:', url);
    return this.http.get<Buzz>(url)
      .pipe(
        tap(response => console.log('Buzz response:', response)),
        catchError(this.handleError)
      );
  }

  // Create a new buzz
  createBuzz(buzz: CreateBuzzRequest): Observable<Buzz> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `${this.apiUrl}/buzzs`;
    console.log('createBuzz URL:', url);
    return this.http.post<Buzz>(url, buzz, { headers })
      .pipe(
        tap(response => console.log('Created buzz:', response)),
        catchError(this.handleError)
      );
  }

  // Delete a buzz
  deleteBuzz(id: string): Observable<void> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `${this.apiUrl}/buzzs/${id}`;
    console.log('deleteBuzz URL:', url);
    return this.http.delete<void>(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Like a buzz
  likeBuzz(id: string): Observable<void> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `${this.apiUrl}/buzzs/${id}/like`;
    console.log('likeBuzz URL:', url);
    return this.http.post<void>(url, {}, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Unlike a buzz
  unlikeBuzz(id: string): Observable<void> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `${this.apiUrl}/buzzs/${id}/unlike`;
    console.log('unlikeBuzz URL:', url);
    return this.http.delete<void>(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Bookmark a buzz
  bookmarkBuzz(id: string): Observable<void> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `${this.apiUrl}/buzzs/${id}/bookmark`;
    console.log('bookmarkBuzz URL:', url);
    return this.http.post<void>(url, {}, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Unbookmark a buzz
  unbookmarkBuzz(id: string): Observable<void> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `${this.apiUrl}/buzzs/${id}/unbookmark`;
    console.log('unbookmarkBuzz URL:', url);
    return this.http.delete<void>(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get user's bookmarked buzzes
  getBookmarkedBuzzs(page: number = 0, size: number = 100): Observable<Buzz[]> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'accept': 'application/json'  // facultatif, mais correspond à ce que l'API attend
    });
  
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    const url = `${this.apiUrl}/buzzs/bookmarks`;
    console.log('getBookmarkedBuzzs URL:', url);
  
    return this.http.get<Buzz[]>(url, { headers, params }).pipe(
      catchError(this.handleError)
    );
  }
  

  // Get bookmarked buzzes by user ID
  getBookmarkedBuzzsByUserId(userId: string, page: number = 0, size: number = 100): Observable<Buzz[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    const url = `${this.apiUrl}/buzzs/bookmarks/user/${userId}`;
    console.log('getBookmarkedBuzzsByUserId URL:', url);
    return this.http.get<Buzz[]>(url, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get trending buzzes
  getTrendingBuzzs(): Observable<TrendingBuzz[]> {
    const url = `${this.apiUrl}/buzzs/trends`;
    console.log('getTrendingBuzzs URL:', url);
    return this.http.get<TrendingBuzz[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get popular buzzes
  getPopularBuzzs(page: number = 0, size: number = 100): Observable<Buzz[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    const url = `${this.apiUrl}/buzzs/followings`;
    console.log('getPopularBuzzs URL:', url);
    return this.http.get<Buzz[]>(url, { params })
      .pipe(
        tap(buzzes => console.log('getPopularBuzzs response:', buzzes)),
        catchError(this.handleError)
      );
  }

  // Get mainstream buzzes
  getMainstreamBuzzs(page: number = 0, size: number = 100): Observable<Buzz[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    const url = `${this.apiUrl}/buzzs/mainstream`;
    console.log('getMainstreamBuzzs URL:', url);
    return this.http.get<Buzz[]>(url, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get unpopular buzzes
  getUnpopularBuzzs(page: number = 0, size: number = 100): Observable<Buzz[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    const url = `${this.apiUrl}/buzzs/unpopular`;
    console.log('getUnpopularBuzzs URL:', url);
    return this.http.get<Buzz[]>(url, { params })
      .pipe(
        tap(buzzes => console.log('getUnpopularBuzzs response:', buzzes)),
        catchError(this.handleError)
      );
  }
  

  // Search buzzes
  searchBuzzs(query: string, page: number = 0, size: number = 100): Observable<Buzz[]> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());
    const url = `${this.apiUrl}/explore/buzzs`;
    console.log('searchBuzzs URL:', url);
    return this.http.get<Buzz[]>(url, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get user's buzzes
  getUserBuzzs(username: string, page: number = 0, size: number = 100): Observable<Buzz[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    const url = `${this.apiUrl}/buzzs/explore`;
    console.log('getUserBuzzs URL:', url);
    return this.http.get<Buzz[]>(url, { params })
      .pipe(
        tap(buzzes => console.log('getUserBuzzs response:', buzzes)),
        catchError(this.handleError)
      );
  }

  // Report a buzz
  reportBuzz(id: string, reason: string): Observable<void> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `${this.apiUrl}/buzzs/${id}/report`;
    console.log('reportBuzz URL:', url);
    return this.http.post<void>(url, { reason }, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    // Log the full error for debugging
    console.error('HTTP error:', error);

    if (error.status === 0) {
      // CORS or network error
      errorMessage = 'CORS or network error: Unable to reach the server at http://localhost:8080. Please verify that the backend is running, CORS is configured to allow requests from http://localhost:4200, and check if environment.ts apiUrl is correctly set (e.g., http://localhost:8080 without /api).';
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
        errorMessage = 'Unauthorized: Please log in again';
      } else if (error.status === 400) {
        errorMessage = error.error.message || 'Bad request: Invalid data';
      } else if (error.status === 403) {
        errorMessage = 'Forbidden: Access denied';
      } else if (error.status === 404) {
        errorMessage = 'Not found: Buzz or resource does not exist';
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}