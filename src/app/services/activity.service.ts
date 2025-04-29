import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Activity } from '../models/activity.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = `${environment.apiUrl}/activities`;
  private statisticsUrl = `${environment.apiUrl}/statistics/activities`;
  private activitiesSubject = new BehaviorSubject<Activity[]>([]);
  public activities$ = this.activitiesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.getActivities().subscribe();
  }

  addActivity(formData: FormData): Observable<Activity> {
    return this.http.post<Activity>(`${this.apiUrl}/add`, formData).pipe(
      tap(() => this.refreshActivities())
    );
  }

  updateActivity(id: number, formData: FormData): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/update/${id}`, formData).pipe(
      tap(() => this.refreshActivities())
    );
  }

  deleteActivity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(
      tap(() => this.refreshActivities())
    );
  }

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl).pipe(
      tap(activities => this.activitiesSubject.next(activities))
    );
  }

  getUserActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl);
  }

  getActivityById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/${id}`);
  }

  updateActivitySeats(activityId: number, seatsToRemove: number): Observable<Activity> {
    return this.http.patch<Activity>(
      `${this.apiUrl}/${activityId}/seats?seats=${seatsToRemove}`,
      {}
    ).pipe(
      catchError(error => {
        console.error('Error updating seats:', error);
        return throwError(() => new Error(
          error.error?.message ||
          'Failed to update seats. Please try again.'
        ));
      })
    );
  }

  cleanupPastActivities(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cleanup`);
  }

  getActivitiesForToday(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/today`);
  }

  refreshActivities(): void {
    this.getActivities().subscribe();
  }

  joinWaitlist(activityId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${activityId}/waitlist`, {});
  }

  checkWaitlistStatus(activityId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${activityId}/waitlist/check`);
  }

  getGeneralStatistics(): Observable<Map<string, any>> {
    return this.http.get<Map<string, any>>(`${this.statisticsUrl}/general`);
  }

  getLocationStatistics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.statisticsUrl}/locations`);
  }

  getMonthlyStatistics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.statisticsUrl}/monthly`);
  }

  getActivityMetrics(activityId: number): Observable<{ waitlistCount: number, reservationsCount: number }> {
    return this.http.get<{ waitlistCount: number, reservationsCount: number }>(`${this.statisticsUrl}/${activityId}/metrics`);
  }

searchActivitiesNlp(query: string): Observable<Activity[]> {
  return this.http.get<Activity[]>(`${this.apiUrl}/search-nlp`, { params: { q: query } });
}

}
