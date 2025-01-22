import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ExitAuthorisationService } from '../../services/exitAuthorisation/exit-authorisation.service';
import { MorningAuthorisationService } from '../../services/morningAuthorisation/morning-authorisation.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-autorisation-list',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    FormsModule
  ],
  templateUrl: './autorisation-list.component.html',
  styleUrls: ['./autorisation-list.component.css']
})
export class AutorisationListComponent implements OnInit {
  // Arrays for Exits
  myExits: any[] = [];
  employeesExits: any[] = [];

  // Arrays for Morning Delays
  myMorningDelays: any[] = [];
  employeesMorningDelays: any[] = [];

  // UI control variables

  searchTerm: string = '';
  isLoading: boolean = true;
  errorMessage: string | null = null;

  showMyExits: boolean = false;
  showMyDelays: boolean = true;
  isEmployeesExits: boolean = false;
  isEmployeesMorningDelays: boolean = false;


  notifications: string[] = [];


  constructor(
    private exitAuthService: ExitAuthorisationService,
    private morningAuthService: MorningAuthorisationService
  ) { }

  ngOnInit(): void {
    // Load all required data
    this.loadMyExits();
    this.loadEmployeesExits();
    this.loadMyMorningDelays();
    this.loadEmployeesMorningDelays();
  }

  // Load My Exits
  loadMyExits(): void {
    this.isLoading = true;
    this.exitAuthService.getMyExits().subscribe({
      next: (data) => {
        this.myExits = (data.exitAuthorizations || []).map((exit: any) => ({
          ...exit,
          state: this.mapState(exit.bossApprovalStatus)
        }));
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching my exits:', error);
        this.errorMessage = 'تعذر تحميل بيانات أذونات الخروج الخاصة بك.';
        this.isLoading = false;
      }
    });
  }

  // Load Employees' Exits
  loadEmployeesExits(): void {
    this.isLoading = true;
    this.exitAuthService.getExitsByManager().subscribe({
      next: (data) => {
        this.employeesExits = (data.exitAuthorizations || []).map((exit: any) => ({
          ...exit,
          state: this.mapState(exit.bossApprovalStatus),
          isPending: exit.bossApprovalStatus === 'Pending',
          // isNew: exit.bossApprovalStatus === 'Pending' && this.isNewRequest(exit.createdAt),

        }));
        this.checkForPendingExits();
        // this.checkForNewRequests();

        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching employees exits:', error);
        this.errorMessage = 'تعذر تحميل بيانات أذونات خروج الموظفين.';
        this.isLoading = false;
      }
    });
  }

  // Load My Morning Delays
  loadMyMorningDelays(): void {
    this.isLoading = true;
    this.morningAuthService.getMorningDelaysByEmployee().subscribe({
      next: (response: { morningDelays: any[] }) => {
        this.myMorningDelays = (response.morningDelays || []).map((delay: any) => ({
          ...delay,
          state: this.mapState(delay.bossApprovalStatus)
        }));
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching my morning delays:', error);
        this.errorMessage = 'تعذر تحميل بيانات تأخيراتك الصباحية.';
        this.isLoading = false;
      }
    });
  }

  // Load Employees' Morning Delays
  loadEmployeesMorningDelays(): void {
    this.isLoading = true;
    this.morningAuthService.getMorningDelaysByManager().subscribe({
      next: (response: { morningDelays: any[] }) => {
        this.employeesMorningDelays = (response.morningDelays || []).map((delay: any) => ({
          ...delay,
          state: this.mapState(delay.bossApprovalStatus),
          isPending: delay.bossApprovalStatus === 'Pending',
          //isNew: delay.bossApprovalStatus === 'Pending' && this.isNewRequest(delay.createdAt),

        }));
        this.checkForPendingMorningDelays();
        // this.checkForNewMorningDelays();

        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching employees morning delays:', error);
        this.errorMessage = 'تعذر تحميل بيانات تأخيرات الموظفين.';
        this.isLoading = false;
      }
    });
  }

  approveExit(exitId: number): void {
    const body = { state: 'Approved' };
    this.exitAuthService.updateExitState(exitId, body).subscribe({
      next: (response) => {
        console.log(`Exit ID ${exitId} approved:`, response);
        // Refresh the table after approval
        this.loadEmployeesExits();
      },
      error: (error: HttpErrorResponse) => {
        console.error(`Error approving exit ID ${exitId}:`, error);
      }
    });
  }

  rejectExit(exitId: number): void {
    const comment = prompt('Please enter a rejection comment:', 'No comment provided.');
    if (comment !== null) {
      const body = { state: 'Rejected', comment };
      this.exitAuthService.updateExitState(exitId, body).subscribe({
        next: (response) => {
          console.log(`Exit ID ${exitId} rejected:`, response);
          // Refresh the table after rejection
          this.loadEmployeesExits();
        },
        error: (error: HttpErrorResponse) => {
          console.error(`Error rejecting exit ID ${exitId}:`, error);
        }
      });
    }
  }

  approveDelay(delayId: number): void {
    const body = { state: 'Approved' };
    this.morningAuthService.updateMorningDelayState(delayId, body).subscribe({
      next: (response) => {
        console.log(`Morning delay approved:`, response);
        // Refresh the employees' morning delays table
        this.loadEmployeesMorningDelays();
      },
      error: (error) => {
        console.error(`Error approving morning delay ID ${delayId}:`, error);
      },
    });
  }

  rejectDelay(delayId: number): void {
    const comment = prompt('Enter a comment for rejection (optional):');
    const body = { state: 'Rejected', comment: comment || 'No comment provided' };
    this.morningAuthService.updateMorningDelayState(delayId, body).subscribe({
      next: (response) => {
        console.log(`Morning delay rejected:`, response);
        // Refresh the employees' morning delays table
        this.loadEmployeesMorningDelays();
      },
      error: (error) => {
        console.error(`Error rejecting morning delay ID ${delayId}:`, error);
      },
    });
  }
  /**
   * Map the bossApprovalStatus to Arabic state labels.
   */
  mapState(status: string): string {
    switch (status) {
      case 'Approved':
        return 'مقبولة';
      case 'Rejected':
        return 'مرفوضة';
      default:
        return 'قيد الانتظار';
    }
  }
  // Toggle between views
  toggleTable(tableType: 'myExits' | 'employeesExits' | 'myMorningDelays' | 'employeesMorningDelays'): void {
    this.showMyExits = tableType === 'myExits';
    this.showMyDelays = tableType === 'myMorningDelays';
    this.isEmployeesExits = tableType === 'employeesExits';
    this.isEmployeesMorningDelays = tableType === 'employeesMorningDelays';
  }

  // Filtered Data
  get filteredMyExits(): any[] {
    return this.myExits.filter((exit) =>
      exit.exitDescription?.includes(this.searchTerm)
    );
  }

  get filteredEmployeesExits(): any[] {
    return this.employeesExits.filter((exit) =>
      exit.exitDescription?.includes(this.searchTerm)
    );
  }

  get filteredMyMorningDelays(): any[] {
    return this.myMorningDelays.filter((delay) =>
      delay.description?.includes(this.searchTerm)
    );
  }

  get filteredEmployeesMorningDelays(): any[] {
    return this.employeesMorningDelays.filter((delay) =>
      delay.description?.includes(this.searchTerm)
    );
  }


  isNewRequest(createdAt: string): boolean {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return new Date(createdAt) > oneDayAgo;
  }
  /*
    checkForNewRequests(): void {
      const newRequests = this.employeesExits.filter((exit) => exit.isNew);
      newRequests.forEach((request) => {
        this.notifications.push(`طلب إذن جديد من ${request.name}`);
      });
    }
  */
  // Notifications for Pending Exits
  checkForPendingExits(): void {
    const pendingExits = this.employeesExits.filter((exit) => exit.isPending);
    if (pendingExits.length > 0) {
      this.addNotification(`هناك ${pendingExits.length} طلبات إذن خروج قيد الانتظار.`);
    }
  }

  // Notifications for Pending Morning Delays
  checkForPendingMorningDelays(): void {
    const pendingDelays = this.employeesMorningDelays.filter((delay) => delay.isPending);
    if (pendingDelays.length > 0) {
      this.addNotification(`هناك ${pendingDelays.length} تأخيرات صباحية قيد الانتظار.`);
    }
  }
  // Add notification
  addNotification(message: string): void {
    this.notifications.push(message);
    setTimeout(() => {
      this.notifications.shift(); // Remove the notification after 4 seconds
    }, 4000);
  }
  closeNotification(index: number): void {
    this.notifications.splice(index, 1);
  }

  /*
    // Check for New Morning Delays
    checkForNewMorningDelays(): void {
      const newDelays = this.employeesMorningDelays.filter((delay) => delay.isNew);
      newDelays.forEach((delay) => {
        this.notifications.push(`تأخير جديد من ${delay.name}`);
      });
    }
      */
}
