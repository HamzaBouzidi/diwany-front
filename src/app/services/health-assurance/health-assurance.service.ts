import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthAssuranceService {
  private apiUrl = environment.apiBaseUrl;


  constructor(private http: HttpClient) { }

  // Fonction pour créer une nouvelle demande d'assurance santé
  createHealthAssurance(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/health-assurance/add`, data);
  }
  // Fetch all health assurances
  getAllHealthAssurances(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health-assurance/list`);
  }

  updateHealthAssuranceState(id: number, data: { state: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/health-assurance/update-state/${id}`, data);
  }
}
