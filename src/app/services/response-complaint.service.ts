import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseComplaint } from '../models/response-complaint';

@Injectable({
  providedIn: 'root'
})
export class ResponseComplaintService {
  private apiUrl = 'http://localhost:8089/api/responses'; // URL de l'API

  constructor(private http: HttpClient) {}

  // Ajouter une réponse à une plainte
  addResponse(complaintId: number, response: ResponseComplaint): Observable<ResponseComplaint> {
    return this.http.post<ResponseComplaint>(`${this.apiUrl}/${complaintId}`, response);
  }
  respondToComplaint(data: { complaintId: number, response: string }) {
    return this.http.post('/api/complaints/respond', data);
  }
  
  

  // Mettre à jour une réponse existante
  updateResponse(responseId: number, response: ResponseComplaint): Observable<ResponseComplaint> {
    return this.http.put<ResponseComplaint>(`${this.apiUrl}/${responseId}`, response);
  }

  // Supprimer une réponse
  deleteResponse(responseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${responseId}`);
  }

  // Récupérer toutes les réponses d'une plainte spécifique
  getResponsesByComplaint(complaintId: number): Observable<ResponseComplaint[]> {
    return this.http.get<ResponseComplaint[]>(`${this.apiUrl}/complaint/${complaintId}`);
  }
}
