import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private baseUrl = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient) {}

  createReservation(activityId: number, reservationData: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/activity/${activityId}/create`,
      reservationData
    ).pipe(
      catchError(error => {
        console.error('API Error:', error);
        let errorMsg = 'Failed to create reservation';
        if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.status === 404) {
          errorMsg = 'Service endpoint not found. Please try again later.';
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  getAllReservations(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getReservationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateReservation(id: number, reservationData: any): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/${id}`,
      reservationData
    );
  }

  sendReminderEmail(reservationId: number): Observable<string> {
    return this.http.post(`${this.baseUrl}/sendReminder/${reservationId}`, {}, { responseType: 'text' });
  }
}
