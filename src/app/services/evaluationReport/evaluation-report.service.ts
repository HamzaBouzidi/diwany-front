import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvaluationReportService {
  //private apiUrl = 'http://localhost:3000/api/evaluation-report/add';
  //private apiUrl = 'http://102.213.180.145:5000/api/evaluation-report/add';

  //private Url = 'http://localhost:3000/api/evaluation-report';
  //private Url = 'http://102.213.180.145:5000/api/evaluation-report';

  private apiUrl = environment.apiBaseUrl;



  constructor(private http: HttpClient) { }

  submitReport(reportData: any): Observable<any> {
    return this.http.post(this.apiUrl + "/evaluation-report/add", reportData);
  }

  getEvaluationReports(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "/evaluation-report" + '/eval-list');
  }
}
