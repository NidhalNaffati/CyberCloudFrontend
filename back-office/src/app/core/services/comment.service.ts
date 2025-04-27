import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Comment } from '../models/comment.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private apiService: ApiService) { }

  // Method to fetch all comments
  getComments(): Observable<Comment[]> {
    return this.apiService.get<any>('/api/admin/dashboard/comments').pipe(
      map(response => response.content)
    );
  }
  // Method to search comments based on a query string
  // According to the API documentation, we only have specific endpoints and
  // might need to adjust this based on actual implementation
  searchComments(query: string): Observable<Comment[]> {
    return this.apiService.get<Comment[]>('/api/admin/dashboard/comments/search', { query });
  }

  deleteComment(id: string): Observable<any> {
    return this.apiService.delete<any>(`/api/admin/dashboard/comments/${id}`);
  }
}
