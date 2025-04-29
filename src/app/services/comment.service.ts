import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/Comment';
import { BadWordsFilterService } from './bad-words-filter.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class CommentService {
    
    private apiUrl = `${environment.apiUrl}/blogcomments`;
  
    constructor(
      private http: HttpClient,
      private badWordsFilter: BadWordsFilterService
    ) {}
    id_user=localStorage.getItem('user_id');
    
    createComment(postId: number, comment: Comment): Observable<Comment> {
         const  token = localStorage.getItem('access_token');
      
         const  headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
          
      if (!this.badWordsFilter.validateContent(comment.content)) {
        return new Observable(observer => {
          observer.error(new Error('Contenu inapproprié détecté'));
        });
      }
      
      const commentData = {
        ...comment,
        userId: comment.userId,
        userName: comment.userName
      };
      return this.http.post<Comment>(`${this.apiUrl}/add/${postId}/${this.id_user}`, commentData, { headers });
    }
  
    
    getAllComments(): Observable<Comment[]> {
      const  token = localStorage.getItem('access_token');
      
      const  headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`
     });
       
      return this.http.get<Comment[]>(`${this.apiUrl}/all`, { headers });
    }
  
    getCommentById(commentId: number): Observable<Comment> {
      const  token = localStorage.getItem('access_token');
      
      const  headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`
     });
       
      return this.http.get<Comment>(`${this.apiUrl}/get/${commentId}`, { headers });
    }

    deleteComment(commentId: number): Observable<void> {
      const  token = localStorage.getItem('access_token');
      
      const  headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`
     });
       
      return this.http.delete<void>(`${this.apiUrl}/delete/${commentId}`, { headers });
    }
  
    updateComment(commentId: number, comment: Comment): Observable<Comment> {
      const token = localStorage.getItem('access_token');
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
        
      if (!this.badWordsFilter.validateContent(comment.content)) {
        return new Observable(observer => {
          observer.error(new Error('Contenu inapproprié détecté'));
        });
      }
      
      const updateData = {
        content: comment.content
      };
      
      console.log(`Sending update to ${this.apiUrl}/update/${commentId} with data:`, updateData);
      
      return this.http.put<Comment>(`${this.apiUrl}/update/${commentId}`, updateData, { headers });
    }
  
    
    getCommentsByPostId(postId: number): Observable<Comment[]> {
      const  token = localStorage.getItem('access_token');
      
      const  headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`
     });
       
      return this.http.get<Comment[]>(`${this.apiUrl}/post/${postId}`, { headers });
    }

    updateCommentSimple(commentId: number, content: string): Observable<any> {
      const token = localStorage.getItem('access_token');
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      
      if (!this.badWordsFilter.validateContent(content)) {
        return new Observable(observer => {
          observer.error(new Error('Contenu inapproprié détecté'));
        });
      }
      
      const updateData = { content };
      
      console.log(`[CommentService] Envoi de mise à jour vers ${this.apiUrl}/update/${commentId}`, updateData);
      
      return this.http.put<any>(`${this.apiUrl}/update/${commentId}`, updateData, { headers });
    }

    updateCommentDirect(commentId: number, content: string): Observable<any> {
      const token = localStorage.getItem('access_token');
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      
      const rawData = JSON.stringify({ content });
      
      console.log(`[DIRECT UPDATE] Envoi vers ${this.apiUrl}/update/${commentId}`, rawData);
      
      return this.http.put(`${this.apiUrl}/update/${commentId}`, rawData, { 
        headers,
        responseType: 'text'  
      });
    }
  }
  