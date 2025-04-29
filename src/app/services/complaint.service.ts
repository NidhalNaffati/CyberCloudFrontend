import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Complaint} from '../models/complaint';
import {AuthService} from '../auth/auth.service';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = 'http://localhost:8089/api/complaints';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  // Vérifie si le contenu contient des mots inappropriés
  private validateComplaintContent(complaint: Complaint): void {
    // Cette validation est déjà faite côté backend, donc pas besoin de la dupliquer ici
    // On pourrait ajouter une validation basique côté client si nécessaire
    if (!complaint.subject || !complaint.content) {
      throw new Error('Le sujet et le contenu sont obligatoires');
    }
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
  addComplaint(complaint: Complaint, userId: number): Observable<Complaint> {
    return this.http.post<Complaint>(`${this.apiUrl}/${userId}`, complaint).pipe(
      catchError((error) => {
        // Gestion des erreurs côté backend (dont les bad words)
        if (error.status === 400 && error.error) {
          return throwError(() => new Error(error.error.message || 'Contenu inapproprié détecté.'));
        }
        return throwError(() => new Error('Erreur lors de l\'envoi de la plainte.'));
      })
    );
  }

  // Update existing complaint
  updateComplaint(id: number, complaint: Complaint): Observable<Complaint> {
    try {
      this.validateComplaintContent(complaint);
      return this.http.put<Complaint>(`${this.apiUrl}/${id}`, complaint).pipe(
        catchError(error => {
          if (error.error && error.error.message) {
            return throwError(() => new Error(error.error.message));
          }
          return throwError(() => new Error('Une erreur est survenue lors de la mise à jour de la plainte'));
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Delete complaint
  deleteComplaint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get complaints for current user
  getMyComplaints(): Observable<Complaint[]> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
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
