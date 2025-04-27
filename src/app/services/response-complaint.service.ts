import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseComplaint } from '../models/response-complaint';
import { Complaint } from '../models/complaint';
import { AuthStoreService } from '../auth/auth-store.service';

@Injectable({
  providedIn: 'root'
})
export class ResponseComplaintService {
  private apiUrl = 'http://localhost:8089/api/responses';
  private badWordsApiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private deepSeekApiKey = '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';

  constructor(
    private http: HttpClient,
    private authStore: AuthStoreService
  ) {}

  private getUserIdFromToken(): number {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No access token available');
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.userId) throw new Error('User ID not found in token');
      return payload.userId;
    } catch (e) {
      throw new Error('Failed to decode token');
    }
  }

  // Vérification des mots inappropriés (inchangée)
  checkForBadWords(content: string): Observable<any> {
    if (!this.authStore.isUserAuthenticated) {
      throw new Error('User not authenticated');
    }

    const requestPayload = {
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: 'system', content: 'Respond only with "YES" if the text contains inappropriate words, otherwise "NO".' },
        { role: 'user', content: content }
      ],
      max_tokens: 5
    };

    const headers = {
      'Authorization': `Bearer ${this.deepSeekApiKey}`,
      'Content-Type': 'application/json'
    };

    return this.http.post(this.badWordsApiUrl, requestPayload, { headers });
  }

  // Ajouter une réponse à une plainte
  addResponse(complaintId: number, response: ResponseComplaint): Observable<ResponseComplaint> {
    if (!this.authStore.isUserAuthenticated) {
      throw new Error('User not authenticated');
    }

    response.isReadRep = false;
    const userId = this.getUserIdFromToken();
    response.userId = userId; // Associer la réponse à l'utilisateur
    
    return this.http.post<ResponseComplaint>(`${this.apiUrl}/${complaintId}`, response);
  }

  // Répondre à une plainte (méthode alternative)
  respondToComplaint(data: { complaintId: number, response: string }): Observable<any> {
    if (!this.authStore.isUserAuthenticated) {
      throw new Error('User not authenticated');
    }
    
    return this.http.post('/api/complaints/respond', {
      ...data,
      userId: this.getUserIdFromToken()
    });
  }

  // Récupérer une réponse par son ID
  getResponseById(responseId: number): Observable<ResponseComplaint> {
    if (!this.authStore.isUserAuthenticated) {
      throw new Error('User not authenticated');
    }
    
    return this.http.get<ResponseComplaint>(`${this.apiUrl}/${responseId}`);
  }

  // Récupérer le Complaint associé à une réponse
  getComplaintByResponseId(responseId: number): Observable<Complaint> {
    if (!this.authStore.isUserAuthenticated) {
      throw new Error('User not authenticated');
    }
    
    return this.http.get<Complaint>(`${this.apiUrl}/${responseId}/complaint`);
  }

  // Mettre à jour une réponse existante
  updateResponse(responseId: number, response: ResponseComplaint): Observable<ResponseComplaint> {
    if (!this.authStore.isUserAuthenticated) {
      throw new Error('User not authenticated');
    }
    
    // Vérifier que l'utilisateur est l'auteur de la réponse ou admin
    return this.http.put<ResponseComplaint>(`${this.apiUrl}/${responseId}`, response);
  }

  // Supprimer une réponse
  deleteResponse(responseId: number): Observable<void> {
    if (!this.authStore.isUserAuthenticated) {
      throw new Error('User not authenticated');
    }
    
    // Seul l'auteur ou un admin peut supprimer
    return this.http.delete<void>(`${this.apiUrl}/${responseId}`);
  }

  // Récupérer toutes les réponses d'une plainte spécifique
  getResponsesByComplaint(complaintId: number): Observable<ResponseComplaint[]> {
    if (!this.authStore.isUserAuthenticated) {
      throw new Error('User not authenticated');
    }
    
    return this.http.get<ResponseComplaint[]>(`${this.apiUrl}/complaint/${complaintId}`);
  }

  // Récupérer les réponses non lues triées par date (desc)
  getUnreadResponses(): Observable<ResponseComplaint[]> {
    if (!this.authStore.isUserAuthenticated || !this.authStore.isAdmin) {
      throw new Error('Unauthorized access');
    }
    
    return this.http.get<ResponseComplaint[]>(`${this.apiUrl}/unread`);
  }

  // Marquer une réponse comme lue
  markResponseAsRead(responseId: number): Observable<ResponseComplaint> {
    if (!this.authStore.isUserAuthenticated) {
      throw new Error('User not authenticated');
    }
    
    return this.http.put<ResponseComplaint>(`${this.apiUrl}/mark-as-read/${responseId}`, {});
  }
}