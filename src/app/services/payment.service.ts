import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Facture } from '../models/facture';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
     private baseUrl = `${environment.apiUrl}/payment`;

  constructor(private http: HttpClient) {}

  createPayment(amount: number): Observable<{ [key: string]: string }> {
    return this.http.post<{ [key: string]: string }>(
      `${this.baseUrl}/create-payment-intent`,
      { amount: amount }
    );
  }
  confirm(factureId: number): Observable<Facture> {
    return this.http.put<Facture>(
      `${this.baseUrl}/confirmPayment/${factureId}`,
      {}
    );
  }
}
