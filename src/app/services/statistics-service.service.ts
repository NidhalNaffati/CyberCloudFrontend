import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8089/api/statistics';

  constructor(private http: HttpClient) { }

  // Get all statistics
  getAllStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Get rating distribution
  getRatingDistribution(): Observable<Map<number, number>> {
    return this.http.get<Map<number, number>>(`${this.apiUrl}/ratings`);
  }

  // Get read status statistics
  getReadStatus(): Observable<{read: number, unread: number}> {
    return this.http.get<{read: number, unread: number}>(`${this.apiUrl}/status`);
  }

  // Get urgency statistics
  getUrgencyStats(): Observable<{urgent: number, normal: number}> {
    return this.http.get<{urgent: number, normal: number}>(`${this.apiUrl}/urgency`);
  }
}
