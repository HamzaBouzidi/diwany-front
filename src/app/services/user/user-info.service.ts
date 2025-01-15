import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserInfoService {

  //private apiUrl = 'http://localhost:3000/api';
  // private apiUrl = 'http://102.213.180.145:5000/api';

  private apiUrl = environment.apiBaseUrl;



  constructor(private http: HttpClient) { }

  // Method to get user information by user_ref_emp
  getUserInfo(userRefEmp: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-info/${userRefEmp}`);
  }

  // Method to get account count by month
  getAccountCountByMonth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/account-count-by-month`);
  }



  // Method to get count distinct age from all employee
  getDistinctcount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/account-count-by-distinct`);
  }



  // Method to get count distinct age from all employee
  getStatSpeciality(): Observable<any> {
    return this.http.get(`${this.apiUrl}/account-count-by-speciality`);
  }




  // Method to get count distinct age from all employee
  getStatJob(): Observable<any> {
    return this.http.get(`${this.apiUrl}/account-count-by-job`);
  }


  // Method to get count distinct age from all employee
  getStatDiplome(): Observable<any> {
    return this.http.get(`${this.apiUrl}/account-count-by-job`);
  }

}
