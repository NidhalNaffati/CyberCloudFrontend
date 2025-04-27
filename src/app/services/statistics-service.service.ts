import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8089/statistics'; // Remplacez par votre URL API

  constructor(private http: HttpClient) { }

  // Statistiques des réclamations
 // Update the getComplaintRatings() method
getComplaintRatings(): Observable<{[key: number]: number}> {
  return this.http.get<{[key: number]: number}>(`${this.apiUrl}/ratings`);
}

  getComplaintStatus(): Observable<{read: number, unread: number}> {
    return this.http.get<{read: number, unread: number}>(`${this.apiUrl}/status`);
  }

  getComplaintUrgency(): Observable<{urgent: number, normal: number}> {
    return this.http.get<{urgent: number, normal: number}>(`${this.apiUrl}/urgency`);
  }

  getTotalComplaints(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getAllComplaintStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all-stats`);
  }
}