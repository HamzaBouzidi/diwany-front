import { Component, OnInit } from '@angular/core';
import { EvaluationReportService } from '../../../services/evaluationReport/evaluation-report.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { DoneModalComponent } from '../../../shared/modal/done-modal/done-modal.component';
import { CommonModule } from '@angular/common';
import { UserInfoService } from '../../../services/user/user-info.service';
import { TokenService } from '../../../services/token/token.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-hr-working-period-report-form',
  standalone: true,
  imports: [DoneModalComponent, CommonModule, FormsModule],
  templateUrl: './hr-working-period-report-form.component.html',
  styleUrl: './hr-working-period-report-form.component.css'
})
export class HrWorkingPeriodReportFormComponent {
  name: string = '';
  jobTitle: string = '';
  nationalNumber: string = '';
  department: string = '';
  startDate: string = '';
  endDate: string = '';
  isModalVisible: boolean = false;



  constructor(private evaluationReportService: EvaluationReportService, private userService: UserInfoService,
    private tokenService: TokenService, private router: Router) { }



  onSubmit(reportForm: NgForm) {
    if (reportForm.valid) {
      const reportData = {
        employee_name: this.name.trim(),
        employee_job_title: this.jobTitle.trim(),
        employee_national_number: this.nationalNumber.trim(),
        employee_department: this.department.trim(),
        startDate: this.startDate,
        endDate: this.endDate,
      };

      console.log('Submitting Report Data:', reportData); // Debug log

      this.evaluationReportService.addReport(reportData).subscribe(
        (response) => {
          console.log('Evaluation report submitted successfully:', response);
          this.isModalVisible = true;
          setTimeout(() => {
            this.closeModal();
            this.router.navigate(['/hr/releases-list']);
          }, 3000);
          reportForm.reset();
        },
        (error) => {
          console.error('Error submitting evaluation report:', error);
        }
      );
    }
  }

  closeModal() {
    this.isModalVisible = false;
  }

}
