import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint } from '../models/complaint';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = 'http://localhost:8089/api/complaints';
  private badWordsApiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private deepSeekApiKey = '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';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Check for inappropriate content
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

  // Get all complaints
  getComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.apiUrl);
  }

  // Get complaint by ID
  getComplaintById(id: number): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.apiUrl}/${id}`);
  }

  // Add new complaint with current user
  addComplaint(complaint: Complaint): Observable<Complaint> {
    const userId = this.authService.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.http.post<Complaint>(`${this.apiUrl}/${userId}`, complaint);
  }

  // Update existing complaint
  updateComplaint(id: number, complaint: Complaint): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.apiUrl}/${id}`, complaint);
  }

  // Delete complaint
  deleteComplaint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get complaints for current user
  getMyComplaints(): Observable<Complaint[]> {
    const userId = this.authService.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.http.get<Complaint[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Get unread complaints (admin only)
  getUnreadComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/unread`);
  }

  // Mark complaint as read
  markComplaintAsRead(id: number): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.apiUrl}/${id}/read`, {});
  }
}


