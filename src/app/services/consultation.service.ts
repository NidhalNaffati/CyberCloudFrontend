import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Consultation } from '../models/consultation.model';
import { ApiService } from '../auth/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private endpoint = '/consultations'; // Just the endpoint path

  constructor(private apiService: ApiService) { }

  // Récupérer toutes les consultations
  getConsultations(): Observable<Consultation[]> {
    return this.apiService.get<Consultation[]>(this.endpoint);
  }

  // Récupérer une consultation par ID
  getConsultationById(id: number): Observable<Consultation> {
    return this.apiService.get<Consultation>(`${this.endpoint}/${id}`);
  }

  // Créer une nouvelle consultation
  createConsultation(consultation: Consultation): Observable<Consultation> {
    return this.apiService.post<Consultation>(this.endpoint, consultation);
  }

  // Mettre à jour une consultation
  updateConsultation(id: number, consultation: Consultation): Observable<Consultation> {
    return this.apiService.put<Consultation>(`${this.endpoint}/${id}`, consultation);
  }

  // Supprimer une consultation
  deleteConsultation(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}