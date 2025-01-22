import { TokenService } from './../token/token.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ExitAuthorisationService {

  // private apiUrl = 'http://localhost:3000/api/authorisation/add-exit';
  //private Url = 'http://localhost:3000/api/authorisation';

  // private apiUrl = 'http://102.213.180.145:5000/api/authorisation/add-exit';

  //private Url = 'http://102.213.180.145:5000/api/authorisation';


  private apiUrl = environment.apiBaseUrl;


  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  /**
   * Get the current user's exit authorizations
   */
  getMyExits(): Observable<any> {
    const employee_rw = this.tokenService.decodeToken()?.ref_emp;
    if (!employee_rw) {
      // Return an empty observable or throw an error if no token
      return new Observable(subscriber => {
        subscriber.error('No employee_rw found in token.');
      });
    }
    // GET /exit-authorizations/employee/:employee_rw
    return this.http.get<any>(`${this.apiUrl}/exit-authorizations/employee/${employee_rw}`);
  }

  /**
   * Get exits for employees under the logged-in manager
   */
  getExitsByManager(): Observable<any> {
    const manager_rw = this.tokenService.decodeToken()?.ref_emp;
    if (!manager_rw) {
      return new Observable(subscriber => {
        subscriber.error('No manager_rw found in token.');
      });
    }
    // GET /exit-authorizations/manager/:manager_rw
    return this.http.get<any>(`${this.apiUrl}/exit-authorizations/manager/${manager_rw}`);
  }

  /**
   * Approve/Reject an exit by updating its state
   */
  updateExitState(exitId: number, body: { state: string; comment?: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/exit-authorizations/validate/${exitId}`, body);
  }

  // Function to add a exit autorisation request

  addExitAuthorization(exitData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/authorisation/add-exit`, exitData, { headers });
  }

  // Get all exits from the API
  getExits(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/authorisation/list-exit');
  }

  getExitCounts(): Observable<any> {
    return this.http.get(this.apiUrl + '/exit-authorizations/exit-counts');
  }

  getAllExitAuthorizations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/exit-authorizations`);
  }



}
