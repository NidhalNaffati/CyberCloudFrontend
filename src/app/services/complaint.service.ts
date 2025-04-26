import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint } from '../models/complaint';
import { AuthStoreService } from '../auth/auth-store.service';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = 'http://localhost:8089/api/complaints';
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

  // Méthode pour vérifier les mots inappropriés (inchangée)
  checkForBadWords(content: string): Observable<any> {
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

  // Méthodes pour gérer les plaintes (modifiées pour utiliser l'utilisateur connecté)
  getComplaints(): Observable<Complaint[]> {
    if (!this.authStore.isUserAuthenticated) {
      throw new Error('User not authenticated');
    }
    return this.http.get<Complaint[]>(this.apiUrl);
  }

  getComplaintById(id: number): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.apiUrl}/${id}`);
  }

  addComplaint(complaint: Complaint): Observable<Complaint> {
    if (!this.authStore.isUserAuthenticated) {
      throw new Error('User not authenticated');
    }
    
    // Récupérer l'ID de l'utilisateur connecté depuis le token
    const userId = this.getUserIdFromToken();
    complaint.userId = userId;
    
    return this.http.post<Complaint>(this.apiUrl, complaint);
  }

  updateComplaint(id: number, complaint: Complaint): Observable<Complaint> {
    if (!this.authStore.isUserAuthenticated) {
      throw new Error('User not authenticated');
    }
    return this.http.put<Complaint>(`${this.apiUrl}/${id}`, complaint);
  }

  deleteComplaint(id: number): Observable<void> {
    if (!this.authStore.isUserAuthenticated) {
      throw new Error('User not authenticated');
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getComplaintsByUser(): Observable<Complaint[]> {
    if (!this.authStore.isUserAuthenticated) {
      throw new Error('User not authenticated');
    }
    
    const userId = this.getUserIdFromToken();
    return this.http.get<Complaint[]>(`${this.apiUrl}/user/${userId}`);
  }

  getUnreadComplaints(): Observable<Complaint[]> {
    if (!this.authStore.isUserAuthenticated || !this.authStore.isAdmin) {
      throw new Error('Unauthorized access');
    }
    return this.http.get<Complaint[]>(`${this.apiUrl}/unread`);
  }

  markComplaintAsRead(id: number): Observable<Complaint> {
    if (!this.authStore.isUserAuthenticated || !this.authStore.isAdmin) {
      throw new Error('Unauthorized access');
    }
    return this.http.put<Complaint>(`${this.apiUrl}/${id}/read`, {});
  }
}