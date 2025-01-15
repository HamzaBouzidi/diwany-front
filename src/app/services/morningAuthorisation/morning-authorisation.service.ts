import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './../token/token.service';


@Injectable({
  providedIn: 'root'
})
export class MorningAuthorisationService {


  //  private apiUrl = 'http://localhost:3000/api/morning-delay/add';
  //  private Url = 'http://localhost:3000/api/morning-delay';

  // private apiUrl = 'http://102.213.180.145:5000/api/morning-delay/add';
  //private Url = 'http://102.213.180.145:5000/api/morning-delay';


  private apiUrl = environment.apiBaseUrl;


  constructor(private http: HttpClient, private tokenService: TokenService) { }
  /**
   * Submit a Morning Authorization request
   */
  submitMorningAuthorization(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/morning-delay/add`, data, { headers });
  }

  /**
   * Get all Morning Delays (general list)
   */
  getMorningDelays(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/morning-delay/list`);
  }

  getMorningDelayCounts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/morning-delay/counts`);
  }


  /**
 * Get Morning Delays by Employee
 */
  getMorningDelaysByEmployee(): Observable<any> {
    const employee_rw = this.tokenService.decodeToken()?.ref_emp;
    if (!employee_rw) {
      return new Observable(subscriber => {
        subscriber.error('No employee_rw found in token.');
      });
    }
    return this.http.get<any>(`${this.apiUrl}/morning-delays/employee/${employee_rw}`);
  }

  /**
   * Get Morning Delays by Manager
   */
  getMorningDelaysByManager(): Observable<any> {
    const manager_rw = this.tokenService.decodeToken()?.ref_emp;
    if (!manager_rw) {
      return new Observable(subscriber => {
        subscriber.error('No manager_rw found in token.');
      });
    }
    return this.http.get<any>(`${this.apiUrl}/morning-delays/manager/${manager_rw}`);
  }

  /**
 * Approve/Reject a morning delay by updating its state
 */
  updateMorningDelayState(delayId: number, body: { state: string; comment?: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/morning-delays/validate/${delayId}`, body);
  }

  getAllMorningDelays(): Observable<any> {
    return this.http.get(`${this.apiUrl}/morning-delays`);
  }
}
