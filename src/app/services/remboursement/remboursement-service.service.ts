import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Remboursement } from 'src/app/models/remboursement';

@Injectable({
  providedIn: 'root',
})
export class RemboursementServiceService {
     private baseUrl = `${environment.apiUrl}/remboursement`;

  constructor(private http: HttpClient) {}

  // POST: Add a remboursement for a given facture
  addRemboursement(
    remboursement: Remboursement,
    idFacture: number
  ): Observable<Remboursement> {
    return this.http.post<Remboursement>(
      `${this.baseUrl}/${idFacture}`,
      remboursement
    );
  }
  getRemoursementByFactureId(factureId: number): Observable<Remboursement> {
    return this.http.get<Remboursement>(
      `${this.baseUrl}/byFactureId/${factureId}`
    );
  }
  // GET: Get all remboursements
  getAllRemboursements(): Observable<Remboursement[]> {
    return this.http.get<Remboursement[]>(`${this.baseUrl}`);
  }

  // GET: Get a remboursement by ID
  getRemboursementById(id: number): Observable<Remboursement> {
    return this.http.get<Remboursement>(`${this.baseUrl}/${id}`);
  }

  // PUT: Update remboursement
  updateRemboursement(
    id: any,
    remboursement: Remboursement
  ): Observable<Remboursement> {
    return this.http.put<Remboursement>(`${this.baseUrl}/${id}`, remboursement);
  }

  // PUT: Accept remboursement
  acceptRemboursement(id: any): Observable<Remboursement> {
    return this.http.put<Remboursement>(`${this.baseUrl}/accept/${id}`, {});
  }

  // PUT: Decline remboursement
  declineRemboursement(id: any, reason: string): Observable<Remboursement> {
    return this.http.put<Remboursement>(
      `${this.baseUrl}/decline/${id}`,
      reason,
      {
        headers: { 'Content-Type': 'text/plain' },
      }
    );
  }

  // DELETE: Delete remboursement
  deleteRemboursement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
