import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';

interface BadWordsLibrary {
  french: string[];
  english: string[];
  arabic: string[];
}

interface WebPurifyResponse {
  rsp: {
    found: string;
    expletive?: string | string[];
    error?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BadWordsFilterService {

  private badWordsLibrary: BadWordsLibrary = {
    french: [],
    english: [],
    arabic: []
  };

  private badWords: string[] = [];

  private webPurifyApiUrl = 'https://api1.webpurify.com/services/rest/';
  private webPurifyApiKey = environment.webPurifyApiKey;

  constructor(private http: HttpClient) {
    this.loadBadWordsLibrary(); 
  }

  private loadBadWordsLibrary(): void {
    this.http.get<BadWordsLibrary>('assets/bad-words.json').subscribe({
      next: (data) => {
        this.badWordsLibrary = data;
        this.badWords = [
          ...this.badWordsLibrary.french,
          ...this.badWordsLibrary.english,
          ...this.badWordsLibrary.arabic
        ];
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la bibliothèque de mots inappropriés:', error);
      }
    });
  }

  checkContent(text: string): Observable<{ isValid: boolean, badWordsFound: string[] }> {
    if (!text) return of({ isValid: true, badWordsFound: [] });

    const detectedLanguage = this.detectLanguage(text);
    const lang = this.mapLanguageToWebPurify(detectedLanguage);

    let params = new HttpParams()
      .set('api_key', this.webPurifyApiKey)
      .set('method', 'webpurify.live.check')
      .set('format', 'json')
      .set('text', text)
      .set('lang', lang)
      .set('semail', '1')
      .set('sphone', '1')
      .set('slink', '1')
      .set('rsp', '1');

    return this.http.get<WebPurifyResponse>(this.webPurifyApiUrl, { params }).pipe(
      map(response => {
        const found = parseInt(response.rsp.found, 10) > 0;
        const badWordsFound: string[] = [];

        if (found && response.rsp.expletive) {
          if (Array.isArray(response.rsp.expletive)) {
            badWordsFound.push(...response.rsp.expletive);
          } else {
            badWordsFound.push(response.rsp.expletive as unknown as string);
          }
        }

        return {
          isValid: !found,
          badWordsFound
        };
      }),
      catchError(error => {
        console.error('Erreur lors de la vérification avec WebPurify:', error);
        return of(this.checkContentLocally(text));
      })
    );
  }

  private checkContentLocally(text: string): { isValid: boolean, badWordsFound: string[] } {
    if (!text) return { isValid: true, badWordsFound: [] };

    const lowerText = text.toLowerCase();
    const foundBadWords: string[] = [];
    const detectedLanguage = this.detectLanguage(text);
    const primaryWordList = this.badWordsLibrary[detectedLanguage as keyof BadWordsLibrary] || [];

    primaryWordList.forEach(word => {
      const regex = new RegExp(`\\b${this.escapeRegExp(word)}\\b`, 'i');
      if (regex.test(lowerText)) {
        foundBadWords.push(word);
      }
    });

    if (foundBadWords.length === 0) {
      this.badWords.forEach(word => {
        if (!primaryWordList.includes(word)) {
          const regex = new RegExp(`\\b${this.escapeRegExp(word)}\\b`, 'i');
          if (regex.test(lowerText)) {
            foundBadWords.push(word);
          }
        }
      });
    }

    return {
      isValid: foundBadWords.length === 0,
      badWordsFound: foundBadWords
    };
  }

  private mapLanguageToWebPurify(language: string): string {
    switch (language) {
      case 'french': return 'fr';
      case 'arabic': return 'ar';
      case 'english':
      default: return 'en';
    }
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  detectLanguage(text: string): string {
    const arabicPattern = /[؀-ۿ]/;
    if (arabicPattern.test(text)) {
      return 'arabic';
    }

    const frenchPattern = /[éèêëàâäôöùûüÿçœæ]/i;
    if (frenchPattern.test(text)) {
      return 'french';
    }

    return 'english';
  }

  validateContent(text: string): boolean {
    const localResult = this.checkContentLocally(text);

    if (!localResult.isValid) {
      Swal.fire({
        title: 'Contenu inapproprié',
        html: `Votre message contient des mots inappropriés.<br>Veuillez modifier votre contenu avant de publier.`,
        icon: 'warning',
        confirmButtonText: 'Compris'
      });
      return false;
    }

    this.checkContent(text).subscribe(result => {
      if (!result.isValid) {
        Swal.fire({
          title: 'Contenu inapproprié',
          html: `Votre message contient des mots inappropriés.<br>Veuillez modifier votre contenu avant de publier.`,
          icon: 'warning',
          confirmButtonText: 'Compris'
        });
      }
    });

    return true;
  }
}
