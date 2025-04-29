import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment';
import { ApiService } from '../auth/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private endpoint = '/appointments'; // Endpoint path without base URL which is handled by ApiService

  constructor(private apiService: ApiService) { }

  // Récupérer tous les rendez-vous
  getAllAppointments(): Observable<Appointment[]> {
    return this.apiService.get<Appointment[]>(this.endpoint);
  }

  // Récupérer un rendez-vous par son ID
  getAppointmentById(id: number): Observable<Appointment> {
    return this.apiService.get<Appointment>(`${this.endpoint}/${id}`);
  }

  // Récupérer les créneaux disponibles pour une date donnée
  getAvailableSlots(date: string): Observable<any[]> {
    return this.apiService.get<any[]>(`${this.endpoint}/available`, { date });
  }

  // Créer un nouveau rendez-vous
  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.apiService.post<Appointment>(this.endpoint, appointment);
  }

  // Mettre à jour un rendez-vous existant
  updateAppointment(id: number, appointment: Appointment): Observable<Appointment> {
    return this.apiService.put<Appointment>(`${this.endpoint}/${id}`, appointment);
  }

  // Supprimer un rendez-vous
  deleteAppointment(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}