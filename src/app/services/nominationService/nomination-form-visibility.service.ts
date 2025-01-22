import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NominationFormVisibilityService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // Get the current visibility state
  getVisibility(): Observable<{ isVisible: boolean }> {
    return this.http.get<{ isVisible: boolean }>(this.apiUrl);
  }

  // Update the visibility state
  updateVisibility(isVisible: boolean): Observable<any> {
    return this.http.post(this.apiUrl, { isVisible });
    
  }
}
