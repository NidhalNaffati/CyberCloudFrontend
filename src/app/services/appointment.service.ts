import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment} from '../models/appointment';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = 'http://localhost:8080/appointments';  // URL de l'API Spring Boot

  constructor(private http: HttpClient) { }

  // Récupérer tous les rendez-vous
  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  // Récupérer un rendez-vous par son ID
  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  getAvailableSlots(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/available?date=${date}`);
  }
 // Créer un nouveau rendez-vous
createAppointment(appointment: Appointment): Observable<Appointment> {
  return this.http.post<Appointment>(this.apiUrl, appointment).pipe(
    catchError((error) => {
      return throwError(() => error); // propage l'erreur au composant
    })
  );
}


  // Mettre à jour un rendez-vous existant
  updateAppointment(id: number, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointment);
  }

  // Supprimer un rendez-vous
  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

