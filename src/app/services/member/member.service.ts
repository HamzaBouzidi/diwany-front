import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {


  //private apiUrl = 'http://localhost:3000/api/member/add';
  //private Url = 'http://localhost:3000/api/member';

  // private apiUrl = 'http://102.213.180.145:5000/api/member/add';
  //private Url = 'http://102.213.180.145:5000/api/member';


  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }


  submitMemberRequest(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl + "/member/add", data, { headers });
  }


  getMembers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/member/member-list');
  }
}
