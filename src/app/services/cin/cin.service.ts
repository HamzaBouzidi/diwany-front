import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CinService {

  //private apiUrl = 'http://localhost:3000/api/cin/add';
  // private apiUrl = 'http://102.213.180.145:5000/api/cin/add';
  private apiUrl = environment.apiBaseUrl;




  constructor(private http: HttpClient) { }

  // Function to add a exit autorisation request
  submitCinRequest(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl + "/cin/add", data, { headers });
  }


  /**
  * Update the state of a CIN entry.
  * @param CIN_ID The ID of the CIN entry to update.
  * @param state The new state ('Approved', 'Rejected', 'Pending').
  */
  updateCinState(CIN_ID: number, state: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { state };

    return this.http.put(`${this.apiUrl}/cin/update-state/${CIN_ID}`, body, { headers });
  }

  getAllCins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cin/cin-list`);
  }
}
