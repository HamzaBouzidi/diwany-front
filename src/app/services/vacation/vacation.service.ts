import { TokenService } from './../token/token.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacationService {

  //private apiUrl = 'http://localhost:3000/api/vacations/add';
  //private Url = 'http://localhost:3000/api/vacations';

  // private apiUrl = 'http://102.213.180.145:5000/api/vacations/add';
  //private Url = 'http://102.213.180.145:5000/api/vacations';

  private apiUrl = environment.apiBaseUrl;


  constructor(private http: HttpClient, private tokenService: TokenService) { }

  // Function to add a vacation request
  addVacation(vacationData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl + "/vacations/add", vacationData, { headers });
  }


  getVacations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/vacations/get-all');
  }

  // Fetch vacation counts by state from the API
  getVacationCounts(): Observable<any> {
    return this.http.get(this.apiUrl + '/vacations/vacation-counts');
  }


  getMyVacations(): Observable<any> {
    const refEmp = this.tokenService.decodeToken()?.ref_emp;
    if (refEmp) {
      return this.http.get(`${this.apiUrl}/vacations/${refEmp}`);
    }
    return new Observable();
  }


  getVacationsByManager(): Observable<any> {
    const refEmp = this.tokenService.decodeToken()?.ref_emp;
    if (refEmp) {
      return this.http.get(`${this.apiUrl}/vacations/manager/${refEmp}`);
    }
    return new Observable();  // Return an empty observable if token is not available
  }

  updateVacationState(vacationId: number, body: { state: string, comment?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/vacations/${vacationId}/validate`, body);
  }

  getAllVacations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vacations/get-all`);
  }


}