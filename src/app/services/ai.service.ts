import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AiService {
  constructor(private http: HttpClient) {}

  generateDescription(title: string): Observable<string> {
    const url = `${environment.apiUrl}/activities/ai/describe`;
    const token = localStorage.getItem('jwt');
    const headers = token
      ? new HttpHeaders({ 'Authorization': `Bearer ${token}` })
      : undefined;

    return this.http.post(url, { title }, { headers, responseType: 'text' });
  }
}
