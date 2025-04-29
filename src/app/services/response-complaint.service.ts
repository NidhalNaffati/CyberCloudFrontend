import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Ajout de throwError ici
import { catchError } from 'rxjs/operators';
import { ResponseComplaint } from '../models/response-complaint';
import { Complaint } from '../models/complaint';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ResponseComplaintService {
  private apiUrl = 'http://localhost:8080/api/responses';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private validateComplaintContent(complaint: Complaint): void {
    if (!complaint.subject || !complaint.content) {
      throw new Error('Le sujet et le contenu sont obligatoires');
    }
  }

  addResponse(complaintId: number, response: ResponseComplaint): Observable<ResponseComplaint> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    response.isReadRep = false;
    return this.http.post<ResponseComplaint>(`${this.apiUrl}/${complaintId}/${userId}`, response).pipe(
      catchError((error) => {
        if (error.status === 400 && error.error) {
          return throwError(() => new Error(error.error.message || 'Contenu inapproprié détecté.'));
        }
        return throwError(() => new Error('Erreur lors de l\'envoi de réponse'));
      })
    );
  }

  respondToComplaint(data: { complaintId: number, response: string }): Observable<any> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    return this.http.post('/api/complaints/respond', {
      ...data,
      userId: userId
    });
  }

  getResponseById(responseId: number): Observable<ResponseComplaint> {
    return this.http.get<ResponseComplaint>(`${this.apiUrl}/${responseId}`);
  }

  getComplaintByResponseId(responseId: number): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.apiUrl}/${responseId}/complaint`);
  }

  updateResponse(responseId: number, response: ResponseComplaint): Observable<ResponseComplaint> {
    return this.http.put<ResponseComplaint>(`${this.apiUrl}/${responseId}`, response).pipe(
      catchError((error) => {
        if (error.status === 400 && error.error) {
          return throwError(() => new Error(error.error.message || 'Contenu inapproprié détecté.'));
        }
        return throwError(() => new Error('Erreur lors de la mise à jour de la réponse'));
      })
    );
  }

  deleteResponse(responseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${responseId}`);
  }

  getResponsesByComplaint(complaintId: number): Observable<ResponseComplaint[]> {
    return this.http.get<ResponseComplaint[]>(`${this.apiUrl}/complaint/${complaintId}`);
  }

  getUnreadResponses(): Observable<ResponseComplaint[]> {
    return this.http.get<ResponseComplaint[]>(`${this.apiUrl}/unread`);
  }

  markResponseAsRead(responseId: number): Observable<ResponseComplaint> {
    return this.http.put<ResponseComplaint>(`${this.apiUrl}/mark-as-read/${responseId}`, {});
  }
}