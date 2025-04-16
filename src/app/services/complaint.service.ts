import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint } from '../models/complaint';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = 'http://localhost:8089/api/complaints';

  constructor(private http: HttpClient) {}

  getComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.apiUrl);
  }

  getComplaintById(id: number): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.apiUrl}/${id}`);
  }

  addComplaint(complaint: Complaint): Observable<Complaint> {
    return this.http.post<Complaint>(this.apiUrl, complaint);
  }

  updateComplaint(id: number, complaint: Complaint): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.apiUrl}/${id}`, complaint);
  }

  deleteComplaint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getComplaintsByUser(userId: number): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/user/${userId}`);
  }
  getUnreadComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/unread`);
  }
  // complaint.service.ts

markComplaintAsRead(id: number): Observable<Complaint> {
  return this.http.put<Complaint>(`${this.apiUrl}/${id}/read`, {});
}

  
}
