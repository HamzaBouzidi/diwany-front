import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserInfoService {

  //private apiUrl = 'http://localhost:3000/api';
  // private apiUrl = 'http://102.213.180.145:5000/api';

  private apiUrl = environment.apiBaseUrl;
  static apikey = '19af628cfa6df1828317a6268bbc0ce8814815e28a4aa7f36068b5d0e23ca1e7'



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
  // Method to get all departments
  getAllDepartments(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/departments-list`);
  }


  // Get department of an employee by name
  getDepartmentByEmployeeName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/department-by-employee-name`, {
      params: { name },
    });
  }

  // Get department of a director by name
  getDirectorDepartmentByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/director-department-by-name`, {
      params: { name },
    });
  }

  // Method to get director by department name
  getDirectorByDepartment(department: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/director-by-department`, {
      params: { department },
    });
  }

  getEmployeeRwByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employee-rw-by-name`, {
      params: { name },
    });
  }

  getDirectorRw(employeeId: string): Observable<string> {
    const url = `https://ejaz.dewani.ly/ejaz/api/employees/${employeeId}/manager`;
    const apikey = '19af628cfa6df1828317a6268bbc0ce8814815e28a4aa7f36068b5d0e23ca1e7'

    const headers = new HttpHeaders({
      Authorization: `Bearer ${apikey}`,
    });

    return this.http.get<any>(url, { headers }).pipe(
      map((response) => response.rw)
    );
  }

}
