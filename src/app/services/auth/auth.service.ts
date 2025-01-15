import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private apiUrl = 'http://localhost:3000/api';
  //private apiUrl = 'http://102.213.180.145:5000/api';

  private apiUrl = environment.apiBaseUrl;


  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const loginData = {
      user_email: email,
      password: password
    };
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  signup(userData: any): Observable<any> {
    // userData should contain all necessary fields
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}