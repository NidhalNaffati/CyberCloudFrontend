import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  constructor() {}

  // Méthode factice pour la génération de description (à remplacer par un vrai appel API)
  generateDescription(title: string): Observable<string> {
    // Remplacer ceci par l'appel à votre backend ou API d'IA
    return of(`Description générée pour : ${title}`);
  }
}
