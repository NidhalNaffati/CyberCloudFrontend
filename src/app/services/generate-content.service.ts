import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenerateContentService {
  private apiUrl = `${environment.apiUrl}/api/generate-content`;

  constructor(private http: HttpClient) {}

  /**
   * Generates content based on a given subject
   * @param subject The subject to generate content for
   * @returns An Observable with the generated content
   */
  generateContent(subject: string): Observable<{ content: string }> {
    return this.http.post<{ content: string }>(this.apiUrl, { subject });
  }
}
