import { Component, OnInit } from '@angular/core';
import { ReleaseService } from '../../../services/release/release.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluationReportService } from '../../../services/evaluationReport/evaluation-report.service';

@Component({
  selector: 'app-hr-release-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-release-list.component.html',
  styleUrl: './hr-release-list.component.css',
})
export class HrReleaseListComponent implements OnInit {
  releases: any[] = [];
  reports: any[] = [];

  filteredReleases: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  filteredWorkPeriods: any[] = [];
  currentView: 'releases' | 'work-periods' = 'releases';
  notifications: string[] = [];


  isEvaluationModalVisible = false;
  selectedPeriod: any = null;
  evaluationData: any = {
    job_knowledge: null,
    job_mastery: null,
    job_communication_skills: null,
    job_problem_solving: null,
    job_time_management: null,
    job_decision_making: null,
  };


  // Modal state
  isModalVisible: boolean = false;
  selectedReason: string = ''; // Reason to display in the modal

  constructor(
    private releaseService: ReleaseService,
    private evaluationReportService: EvaluationReportService
  ) { }

  ngOnInit(): void {
    this.fetchReleases();
    this.fetchWorkPeriods();
  }

  // Fetch all releases
 /* fetchReleases(): void {
    this.releaseService.getReleases().subscribe(
      (data) => {
        this.releases = data;
        this.filteredReleases = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'خطأ في جلب البيانات.';
        console.error('Error fetching releases:', error);
        this.isLoading = false;
      }
    );
  }
*/
  fetchReleases(): void {
    this.releaseService.getReleases().subscribe(
      (data) => {
        this.releases = data.map((release: any) => ({
          ...release,
          isPending: release.state === 'Pending', // Highlight pending releases
        }));
        this.filteredReleases = this.releases;
        this.checkForPendingReleases();
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'خطأ في جلب طلبات الإخلاء.';
        console.error('Error fetching releases:', error);
        this.isLoading = false;
      }
    );
  }
  // Fetch all work periods
 /* fetchWorkPeriods(): void {
    this.evaluationReportService.getAllReports().subscribe(
      (response) => {
        if (response.success) {
          this.reports = response.data;
          this.filteredWorkPeriods = response.data;
        } else {
          this.errorMessage = response.message || 'فشل في جلب فترات العمل.';
        }
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'خطأ في جلب البيانات.';
        console.error('Error fetching work periods:', error);
        this.isLoading = false;
      }
    );
  }
    */
  fetchWorkPeriods(): void {
    this.evaluationReportService.getAllReports().subscribe(
      (response) => {
        if (response.success) {
          this.reports = response.data.map((period: any) => ({
            ...period,
            isPending: period.state === 'Pending', // Highlight pending work periods
          }));
          this.filteredWorkPeriods = this.reports;
          this.checkForPendingWorkPeriods();
        } else {
          this.errorMessage = response.message || 'فشل في جلب فترات العمل.';
        }
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'خطأ في جلب فترات العمل.';
        console.error('Error fetching work periods:', error);
        this.isLoading = false;
      }
    );
  }

  filterReleases(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredReleases = this.releases.filter((release) =>
      this.matchesSearch(release)
    );
  }

  filterWorkPeriods(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredWorkPeriods = this.reports.filter((period) =>
      period.employee_name.toLowerCase().includes(term)
    );
  }

  matchesSearch(release: any): boolean {
    const term = this.searchTerm.toLowerCase();
    return (
      release.directorName.toLowerCase().includes(term) ||
      release.department.toLowerCase().includes(term) ||
      release.employeeName.toLowerCase().includes(term)
    );
  }

  onSearchChange(): void {
    if (this.currentView === 'releases') {
      this.filterReleases();
    } else if (this.currentView === 'work-periods') {
      this.filterWorkPeriods();
    }
  }

  // Show the reason in a modal
  showReason(release: any): void {
    this.selectedReason = release.reason;
    this.isModalVisible = true;
  }

  // Close the modal
  closeModal(): void {
    this.isModalVisible = false;
    this.selectedReason = '';
  }

  toggleView(view: 'releases' | 'work-periods'): void {
    this.currentView = view;
    this.onSearchChange(); // Update the filtered list based on the search term
  }


  // Open the evaluation modal
  openEvaluationModal(period: any): void {
    this.selectedPeriod = period;
    this.isEvaluationModalVisible = true;

    // Pre-fill the evaluation data if it exists
    this.evaluationData = {
      job_knowledge: period.job_knowledge || null,
      job_mastery: period.job_mastery || null,
      job_communication_skills: period.job_communication_skills || null,
      job_problem_solving: period.job_problem_solving || null,
      job_time_management: period.job_time_management || null,
      job_decision_making: period.job_decision_making || null,
    };
  }

  // Close the modal
  closeEvaluationModal(): void {
    this.isEvaluationModalVisible = false;
    this.selectedPeriod = null;
  }

  // Submit the evaluation
  submitEvaluation(): void {
    if (!this.selectedPeriod) return;

    const updatedData = {
      ...this.evaluationData,
      state: 'Done',
    };

    this.evaluationReportService.updateWorkPeriodEvaluation(this.selectedPeriod.REPORT_ID, updatedData).subscribe(
      (response) => {
        console.log('Evaluation submitted:', response);
        this.selectedPeriod.state = 'Done'; // Update the local state
        Object.assign(this.selectedPeriod, updatedData); // Update other fields in the local object
        this.closeEvaluationModal(); // Close the modal
      },
      (error) => {
        console.error('Error submitting evaluation:', error);
      }
    );
  }

  /*updateWorkPeriodState(period: any, newState: string): void {
    console.log('Updating work period state:', period.REPORT_ID, newState); // Debugging
    if (!period?.id) {
      console.error('Invalid work period ID.');
      return;
    }

    this.evaluationReportService.updateWorkPeriodState(period.id, newState).subscribe(
      (response) => {
        console.log(`Work period ${period.id} updated to ${newState}:`, response);
        period.state = newState; // Update the local state
      },
      (error) => {
        console.error(`Error updating work period ${period.REPORT_ID} state:`, error);
      }
    );
  }
    */

  updateWorkPeriodState(period: any, newState: string): void {
    console.log('Updating work period state:', period.REPORT_ID, newState);
    console.log('Period Object:', period); // Debug
    console.log('Period ID:', period?.REPORT_ID); // Debug
    console.log('New State:', newState);  // Debugging

    if (!period?.REPORT_ID) {
      console.error('Invalid work period ID.');
      return;
    }

    this.evaluationReportService.updateWorkPeriod(period.REPORT_ID, newState).subscribe(
      (response) => {
        console.log(`Work period ${period.REPORT_ID} updated to ${newState}:`, response);
        period.state = newState; // Update local state
      },
      (error) => {
        console.error(`Error updating work period ${period.REPORT_ID} state:`, error);
      }
    );
  }


  checkForPendingReleases(): void {
    const pendingReleases = this.releases.filter((release) => release.isPending);
    if (pendingReleases.length > 0) {
      this.addNotification(`هناك ${pendingReleases.length} طلبات إخلاء قيد الانتظار.`);
    }
  }

  checkForPendingWorkPeriods(): void {
    const pendingPeriods = this.reports.filter((period) => period.isPending);
    if (pendingPeriods.length > 0) {
      this.addNotification(`هناك ${pendingPeriods.length} فترات عمل قيد الانتظار.`);
    }
  }

  addNotification(message: string): void {
    this.notifications.push(message);
    setTimeout(() => {
      this.notifications.shift(); // Remove the oldest notification
    }, 4000);
  }

  closeNotification(index: number): void {
    this.notifications.splice(index, 1); // Manually close the notification
  }
}
