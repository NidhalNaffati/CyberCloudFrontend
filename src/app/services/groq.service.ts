import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroqService {
  private apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private apiKey = environment.groqApiKey; // API key stored in environment

  constructor(private http: HttpClient) {}

  complete(prompt: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const correctionPrompt = `Correct the following paragraph for grammar, clarity, and professionalism. Return only the corrected paragraph, with no additional text, explanations, or introductions:\n\n${prompt}`;

    const body = {
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: correctionPrompt
        }
      ]
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(response => {
        const choices = response.choices;
        if (choices && choices.length > 0) {
          return choices[0].message.content;
        }
        throw new Error('No response content found');
      }),
      catchError(error => {
        console.error('Error in Groq API call:', error);
        return throwError(() => new Error('Error correcting description. Please try again.'));
      })
    );
  }
}