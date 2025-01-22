import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReleaseService } from '../../services/release/release.service';
import { EvaluationReportService } from '../../services/evaluationReport/evaluation-report.service';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  // Properties
  searchTerm: string = '';
  reports: any[] = []; // For work periods
  releases: any[] = []; // For release requests
  filteredReports: any[] = []; // Filtered work periods
  filteredReleases: any[] = []; // Filtered release requests
  filteredWorkPeriods: any[] = [];
  refEmp: string | undefined;
  currentView: 'releases' | 'work-periods' = 'releases';

  // Modal state
  isModalVisible: boolean = false;
  selectedReason: string = '';

  // Loading and error states
  isLoading: boolean = true;
  errorMessage: string = '';

  notifications: string[] = [];

  constructor(
    private releaseService: ReleaseService,
    private evaluationReportService: EvaluationReportService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.getUserRefFromToken();
    this.loadReleaseReports();
    this.fetchWorkPeriods();
  }

  // Get user's refEmp from the token
  getUserRefFromToken(): void {
    const decodedToken = this.tokenService.decodeToken();
    if (decodedToken && decodedToken.ref_emp) {
      this.refEmp = decodedToken.ref_emp.trim();
    } else {
      console.error('Error decoding token or refEmp missing.');
    }
  }

  // Load release reports and filter them by directorRW
  /* loadReleaseReports(): void {
     this.releaseService.getReleases().subscribe(
       (data) => {
         console.log('Raw Releases:', data); // Debugging
         if (this.refEmp) {
           this.releases = data.filter((release: any) => {
             const directorRw = String(release.directorRw).trim();
             return directorRw == this.refEmp; // Match directorRw with refEmp
           });
           this.filteredReleases = this.releases; // Initialize filteredReleases
         } else {
           console.error('refEmp is undefined, skipping filtering.');
           this.releases = [];
           this.filteredReleases = [];
         }
         this.isLoading = false;
       },
       (error) => {
         console.error('Error loading releases:', error);
         this.errorMessage = 'Failed to load release requests.';
         this.isLoading = false;
       }
     );
   }
     */

  loadReleaseReports(): void {
    this.releaseService.getReleases().subscribe(
      (data) => {
        console.log('Raw Releases:', data); // Debugging

        if (this.refEmp) {
          // Filter releases based on refEmp and map additional properties
          this.releases = data
            .filter((release: any) => {
              const directorRw = String(release.directorRw).trim();
              return directorRw === this.refEmp; // Match directorRw with refEmp
            })
            .map((release: any) => ({
              ...release,
              isPending: release.state === 'Pending', // Add isPending property for highlighting
            }));

          // Check for pending releases and log notifications
          this.checkForPendingReleases();

          this.filteredReleases = this.releases; // Initialize filteredReleases
        } else {
          console.error('refEmp is undefined, skipping filtering.');
          this.releases = [];
          this.filteredReleases = [];
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading releases:', error);
        this.errorMessage = 'Failed to load release requests.';
        this.isLoading = false;
      }
    );
  }

  checkForPendingReleases(): void {
    const pendingReleases = this.releases.filter((release) => release.state === 'Pending');
    if (pendingReleases.length > 0) {
      this.addNotification(`هناك ${pendingReleases.length} طلبات إخلاء تنتظر المعالجة.`);
    }
  }

  // Add notification to the system
  addNotification(message: string): void {
    this.notifications.push(message);
    setTimeout(() => {
      this.notifications.shift(); // Remove the notification after 5 seconds
    }, 5000);
  }

  fetchWorkPeriods(): void {
    this.evaluationReportService.getAllReports().subscribe(
      (response) => {
        if (response.success) {
          this.filteredWorkPeriods = response.data.map((period: any) => ({
            id: period.REPORT_ID, // Map REPORT_ID to id
            employee_name: period.employee_name,
            startDate: period.startDate,
            endDate: period.endDate,
            state: period.state,
          }));
          console.log('Filtered Work Periods:', this.filteredWorkPeriods); // Debugging
        } else {
          this.errorMessage = response.message || 'Failed to fetch work periods.';
        }
        this.isLoading = false; // Update loading state
      },
      (error) => {
        this.errorMessage = 'Error fetching work periods.';
        console.error(error);
        this.isLoading = false; // Update loading state
      }
    );
  }

  updateWorkPeriodState(period: any, newState: string): void {
    console.log('Button clicked, Period ID:', period?.id); // Debugging
    if (!period?.id || !newState) {
      console.error('Invalid period or state provided.');
      return;
    }

    this.evaluationReportService.updateWorkPeriodState(period.id, newState).subscribe(
      (response) => {
        console.log(`Work period ${period.id} updated to ${newState}:`, response);
        period.state = newState; // Update the local state
        this.applyFilter(); // Refresh the filtered list
      },
      (error) => {
        console.error(`Error updating work period ${period.id} state:`, error);
        this.errorMessage = `Failed to update state for work period ${period.id}.`;
      }
    );
  }

  applyFilter(): void {
    const search = this.searchTerm.toLowerCase();
    if (this.currentView === 'releases') {
      this.filteredReleases = this.releases.filter((release) =>
        this.matchesSearch(release)
      );
    } else if (this.currentView === 'work-periods') {
      this.filteredWorkPeriods = this.reports.filter(
        (period) =>
          period.employee_name?.toLowerCase().includes(search) // Use optional chaining (?)
      );
    }
  }


  // Match search term
  matchesSearch(release: any): boolean {
    const term = this.searchTerm.toLowerCase();
    return (
      release.directorName.toLowerCase().includes(term) ||
      release.department.toLowerCase().includes(term) ||
      release.employeeName.toLowerCase().includes(term)
    );
  }

  // Search term change handler
  onSearchChange(): void {
    this.applyFilter();
  }

  // Show modal for reason
  showReason(release: any): void {
    this.selectedReason = release.reason;
    this.isModalVisible = true;
  }

  // Close modal
  closeModal(): void {
    this.isModalVisible = false;
    this.selectedReason = '';
  }

  // Toggle between views
  toggleView(view: 'releases' | 'work-periods'): void {
    this.currentView = view;
    this.applyFilter();
  }

  // Approve a report
  approveReport(reportId: number): void {
    this.releaseService.updateReportState(reportId, 'مقبولة').subscribe(
      () => {
        this.updateReportState(reportId, 'مقبولة');
      },
      (error) => {
        console.error('Error approving report:', error);
      }
    );
  }

  // Reject a report
  rejectReport(reportId: number): void {
    this.releaseService.updateReportState(reportId, 'مرفوضة').subscribe(
      () => {
        this.updateReportState(reportId, 'مرفوضة');
      },
      (error) => {
        console.error('Error rejecting report:', error);
      }
    );
  }

  // Update the state of a report
  private updateReportState(reportId: number, newState: string): void {
    const report = this.reports.find((r) => r.id === reportId);
    if (report) {
      report.state = newState;
      this.applyFilter();
    }
  }

  // Update release state
  updateReleaseState(release: any, newState: string): void {
    this.releaseService.updateReportState(release.id, newState).subscribe(
      (response) => {
        console.log(`Release ${release.id} updated to ${newState}:`, response);
        release.state = newState; // Update the local state
        this.applyFilter(); // Refresh the filtered list
      },
      (error) => {
        console.error(`Error updating release ${release.id} state:`, error);
      }
    );
  }

}
