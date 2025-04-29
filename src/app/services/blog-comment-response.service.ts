import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogCommentResponse } from '../interfaces/BlogCommentResponse';
import { BadWordsFilterService } from './bad-words-filter.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class BlogCommentResponseService {
  private apiUrl = `${environment.apiUrl}/blogcommentresponses`
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private badWordsFilter: BadWordsFilterService
  ) {}
  id_user = this.authService.getUserId();



  createResponse(commentId: number, response: BlogCommentResponse): Observable<BlogCommentResponse> {
    if (!this.badWordsFilter.validateContent(response.content)) {
      return new Observable(observer => {
        observer.error(new Error('Contenu inapproprié détecté'));
      });
    }
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    const responseData = {
      content: response.content
    };
    
    console.log(`Création d'une réponse pour le commentaire ${commentId} avec l'utilisateur connecté ${this.id_user}`);
    
    return this.http.post<BlogCommentResponse>(`${this.apiUrl}/add/${commentId}/${this.id_user}`, responseData, { headers });
  }

  getAllResponses(): Observable<BlogCommentResponse[]> {
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
     
    return this.http.get<BlogCommentResponse[]>(`${this.apiUrl}/all`, { headers });
  }

  getResponseById(id: number): Observable<BlogCommentResponse> {
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
     
    return this.http.get<BlogCommentResponse>(`${this.apiUrl}/get/${id}`, { headers });
  }

  updateResponse(id: number, response: BlogCommentResponse): Observable<BlogCommentResponse> {
    if (!this.badWordsFilter.validateContent(response.content)) {
      return new Observable(observer => {
        observer.error(new Error('Contenu inapproprié détecté'));
      });
    }
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    const updateData = {
      content: response.content
    };
    
    console.log(`Mise à jour de la réponse ${id} avec le contenu modifié`);
    
    return this.http.put<BlogCommentResponse>(`${this.apiUrl}/update/${id}`, updateData, { headers });
  }

  deleteResponse(id: number): Observable<void> {
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
     
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers });
  }

  getResponsesByCommentId(commentId: number): Observable<BlogCommentResponse[]> {
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
     
    return this.http.get<BlogCommentResponse[]>(`${this.apiUrl}/comment/${commentId}`,  { headers });
  }

  getResponsesByUserId(userId: number): Observable<BlogCommentResponse[]> {
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
     
    return this.http.get<BlogCommentResponse[]>(`${this.apiUrl}/user/${this.id_user}`,  { headers });
  }
}