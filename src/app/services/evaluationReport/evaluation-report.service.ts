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

  addReport(reportData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/working-period-report/add`, reportData);
  }
  getEvaluationReports(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "/evaluation-report" + '/eval-list');
  }


  /**
 * Fetch all reports
 * @returns Observable containing the list of all reports
 */
  getAllReports(): Observable<any> {
    return this.http.get(`${this.apiUrl}/working-period-report/all`);
  }

  // Update the state of a work period
  updateWorkPeriodState(workPeriodId: number, newState: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/working-period-report/${workPeriodId}/state`, { state: newState });
  }

  // Method to update work period state
  updateWorkPeriod(workPeriodId: number, newState: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/work-periods/${workPeriodId}/state`, { state: newState });
  }


  /**
 * Update the evaluation of a work period.
 * @param id - The ID of the work period to update.
 * @param evaluationData - The evaluation fields and state to update.
 * @returns Observable of the API response.
 */
  updateWorkPeriodEvaluation(id: number, evaluationData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/work-periods/${id}/evaluation`, evaluationData);
  }

}
