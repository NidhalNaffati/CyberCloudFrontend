import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DashboardStats } from '../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(private apiService: ApiService) { }

  getDashboardStats(): Observable<DashboardStats> {
    return this.apiService.get<DashboardStats>('/api/admin/dashboard/stats');
  }
}
