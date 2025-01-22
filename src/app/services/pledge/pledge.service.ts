import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PledgeService {

  private apiUrl = environment.apiBaseUrl;


  constructor(private http: HttpClient, private tokenService: TokenService) { }

  /**
   * Add a new pledge
   * @param pledgeData - Object containing the pledge details
   * @returns Observable with the response
   */
  addPledge(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/pledge/add`, formData);
  }


  getAllPledges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pledges`);
  }


  // Function to update pledge state
  updatePledgeState(id: number, data: { state: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/pledge/update-state/${id}`, data);
  }
}
