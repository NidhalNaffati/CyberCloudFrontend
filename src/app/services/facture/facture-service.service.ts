import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 import { Observable } from 'rxjs';
import { Facture } from 'src/app/models/facture';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FactureServiceService {
    private baseUrl = `${environment.apiUrl}/facture`;
  
 
  constructor(private http: HttpClient) {}

  addFacture(
    facture: Facture,
    doctorId: any,
    patientId: any
  ): Observable<Facture> {
    return this.http.post<Facture>(
      `${this.baseUrl}/${doctorId}/${patientId}`,
      facture
    );
  }

  // GET: Get all factures
  getAllFactures(): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.baseUrl}`);
  }
  getAllDoctors():Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/getUserForFacture/ROLE_DOCTOR`)
  }
  
  getAllPatients():Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/getUserForFacture/ROLE_USER`)
  }
  getMyFactures(patientId: number): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.baseUrl}/myfacture/${patientId}`);
  }

  // GET: Get facture by ID
  getFactureById(id: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.baseUrl}/${id}`);
  }

  // PUT: Update facture by ID
  updateFacture(id: any, facture: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.baseUrl}/${id}`, facture);
  }

  // DELETE: Delete facture by ID
  deleteFacture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
