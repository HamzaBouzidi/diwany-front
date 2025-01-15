import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ReleaseService {
  //private apiUrl = 'http://localhost:3000/api/release/add';
  //private Url = 'http://localhost:3000/api/release';


  //private apiUrl = 'http://102.213.180.145:5000/api/release/add';
  //private Url = 'http://102.213.180.145:5000/api/release';

  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // Method to submit the release form
  submitReleaseForm(formData: any): Observable<any> {
    return this.http.post(this.apiUrl + "/release/add", formData);
  }

  getReleases(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/release/release-list');
  }
}
