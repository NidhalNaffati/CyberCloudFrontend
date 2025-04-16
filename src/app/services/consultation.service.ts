import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultation } from '../models/consultation.model';


@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  private apiUrl = 'http://localhost:8080/consultations'; // URL de ton backend

  constructor(private http: HttpClient) { }

  // Récupérer toutes les consultations
  getConsultations(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(this.apiUrl);
  }

  // Récupérer une consultation par ID
  getConsultationById(id: number): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle consultation
 // createConsultation(consultation: Consultation): Observable<Consultation> {
  //  return this.http.post<Consultation>(this.apiUrl, consultation);
//  }
createConsultation(consultation: Consultation): Observable<Consultation> {
  return this.http.post<Consultation>(this.apiUrl, consultation, {
    headers: { 'Content-Type': 'application/json' }
  });
}

  // Mettre à jour une consultation
  updateConsultation(id: number, consultation: Consultation): Observable<Consultation> {
    return this.http.put<Consultation>(`${this.apiUrl}/${id}`, consultation);
  }

  // Supprimer une consultation
  deleteConsultation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
