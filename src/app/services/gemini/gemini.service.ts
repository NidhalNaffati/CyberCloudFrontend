import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private apiKey = 'AIzaSyD_NFP7Tgs3JIkddeACnB4-N9z9CTUs_Ac';
  private apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;

  constructor(private http: HttpClient) {}
  correctReasonText(text: string): Observable<string> {
    const prompt = `Please correct the following sentence for grammar and clarity, in the context of a refund request for an invoice. Return only the corrected version, with no explanation or extra content:\n\n"${text}"`;

    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    return new Observable<string>((observer) => {
      this.http.post<any>(this.apiUrl, body).subscribe({
        next: (response) => {
          const corrected =
            response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          observer.next(corrected);
          observer.complete();
        },
        error: (err) => {
          console.error('Error calling Gemini API:', err);
          observer.error(err);
        },
      });
    });
  }
}
