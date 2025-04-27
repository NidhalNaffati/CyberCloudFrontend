import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Buzz } from '../models/buzz.model';

@Injectable({
  providedIn: 'root'
})
export class BuzzService {
  constructor(private apiService: ApiService) { }

  // Method to fetch all buzz posts
  getBuzzs(page: number = 0, size: number = 100, sortBy: string = 'createdAt', direction: string = 'DESC'): Observable<any> {
    return this.apiService.get<any>('/api/admin/dashboard/buzzs', { page, size, sortBy, direction });
  }

  // Method to search buzz posts based on a query string
  // According to the API documentation, we only have specific endpoints and
  // might need to adjust this based on actual implementation
  searchBuzzs(query: string): Observable<Buzz[]> {
    return this.apiService.get<Buzz[]>('/api/admin/dashboard/buzzs/search', { query });
  }

  deleteBuzz(id: string): Observable<any> {
    return this.apiService.delete<any>(`/api/admin/dashboard/buzzs/${id}`);
  }
}
