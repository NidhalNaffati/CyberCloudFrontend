import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Comment, CreateCommentRequest } from '../models/comment.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get comments for a buzz
  getComments(buzzId: string, page: number = 0, size: number = 20): Observable<Comment[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Comment[]>(`${this.apiUrl}/buzzs/${buzzId}/comments`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Create a comment
  createComment(buzzId: string, comment: CreateCommentRequest): Observable<Comment> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<Comment>(`${this.apiUrl}/buzzs/${buzzId}/comments`, comment, { headers })
      .pipe(
        tap(response => console.log('Created comment:', response)),
        catchError(this.handleError)
      );
  }

  // Delete a comment
  deleteComment(commentId: string): Observable<void> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<void>(`${this.apiUrl}/buzzs/comments/${commentId}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Like a comment
  likeComment(commentId: string): Observable<void> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<void>(`${this.apiUrl}/buzzs/comments/${commentId}/like`, {}, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Unlike a comment
  unlikeComment(commentId: string): Observable<void> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<void>(`${this.apiUrl}/buzzs/comments/${commentId}/unlike`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Dislike a comment
  dislikeComment(commentId: string): Observable<void> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<void>(`${this.apiUrl}/buzzs/comments/${commentId}/dislike`, {}, { headers })
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
        errorMessage = 'Unauthorized: Please log in again';
      } else if (error.status === 400) {
        errorMessage = error.error.message || 'Bad request: Invalid data';
      } else if (error.status === 403) {
        errorMessage = 'Forbidden: Access denied';
      } else if (error.status === 404) {
        errorMessage = 'Not found: Comment or resource does not exist';
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}