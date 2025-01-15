import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EvaluationReportService } from '../../services/evaluationReport/evaluation-report.service';
import { DoneModalComponent } from "../../shared/modal/done-modal/done-modal.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-report-working-period',
  standalone: true,
  imports: [CommonModule, FormsModule, DoneModalComponent],
  templateUrl: './test-report-working-period.component.html',
  styleUrl: './test-report-working-period.component.css'
})
export class TestReportWorkingPeriodComponent {
  name: string = '';
  jobTitle: string = '';
  nationalNumber: string = '';
  nationality: string = '';
  department: string = '';
  section: string = '';
  startDate: string = '';
  endDate: string = '';
  jobKnowledge: string = '';
  technicalSkills: string = '';
  teamwork: string = '';
  problemSolving: string = '';
  timeManagement: string = '';
  decisionMaking: string = '';
  isModalVisible: boolean = false;

  constructor(private evaluationReportService: EvaluationReportService, private router: Router) { }


  onSubmit(reportForm: NgForm) {
    if (reportForm.valid) {
      const reportData = {
        name: this.name,
        jobTitle: this.jobTitle,
        nationalNumber: this.nationalNumber,
        nationality: this.nationality,
        department: this.department,
        section: this.section,
        startDate: this.startDate,
        endDate: this.endDate,
        jobKnowledge: this.jobKnowledge,
        technicalSkills: this.technicalSkills,
        teamwork: this.teamwork,
        problemSolving: this.problemSolving,
        timeManagement: this.timeManagement,
        decisionMaking: this.decisionMaking
      };

      this.evaluationReportService.submitReport(reportData).subscribe(
        (response) => {
          console.log('Evaluation report submitted successfully:', response);
          this.isModalVisible = true;
          setTimeout(() => {
            this.closeModal();
            this.router.navigate(['/dashboard/definitions-autorisations']);
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