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



  filteredMyExits: any[] = [];
  filteredEmployeesExits: any[] = [];
  filteredMyMorningDelays: any[] = [];
  filteredEmployeesMorningDelays: any[] = [];


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
        this.filteredMyExits = [...this.myExits];

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
        this.filteredEmployeesExits = [...this.employeesExits];

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
        this.filteredMyMorningDelays = [...this.myMorningDelays];

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
        this.filteredEmployeesMorningDelays = [...this.employeesMorningDelays];

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
/*
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


  // ------------------ Search Filtering ------------------
  // Here we add search-by-date for employee records as well as by name, employee_rw, and description.

  // For My Exits: Filter by exit description and created date.
  get filteredMyExits(): any[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      return this.myExits;
    }
    return this.myExits.filter(exit =>
      exit.exitDescription?.toLowerCase().includes(term) ||
      new Date(exit.createdAt)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .toLowerCase()
        .includes(term)
    );
  }

  // For Employees' Exits: Filter by exit description, employee name, employee_rw, and created date.
  get filteredEmployeesExits(): any[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      return this.employeesExits;
    }
    return this.employeesExits.filter(exit =>
      exit.exitDescription?.toLowerCase().includes(term) ||
      exit.name?.toLowerCase().includes(term) ||
      exit.employee_rw?.toString().includes(term) ||
      new Date(exit.createdAt)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .toLowerCase()
        .includes(term)
    );
  }

  // For My Morning Delays: Filter by delay description and created date.
  get filteredMyMorningDelays(): any[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      return this.myMorningDelays;
    }
    return this.myMorningDelays.filter(delay =>
      delay.description?.toLowerCase().includes(term) ||
      new Date(delay.createdAt)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .toLowerCase()
        .includes(term)
    );
  }

  // For Employees' Morning Delays: Filter by delay description, employee name, employee_rw, and created date.
  get filteredEmployeesMorningDelays(): any[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      return this.employeesMorningDelays;
    }
    return this.employeesMorningDelays.filter(delay =>
      delay.description?.toLowerCase().includes(term) ||
      delay.name?.toLowerCase().includes(term) ||
      delay.employee_rw?.toString().includes(term) ||
      new Date(delay.createdAt)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .toLowerCase()
        .includes(term)
    );
  }

  */
  filterAuthorizations(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredMyExits = [...this.myExits];
      this.filteredEmployeesExits = [...this.employeesExits];
      this.filteredMyMorningDelays = [...this.myMorningDelays];
      this.filteredEmployeesMorningDelays = [...this.employeesMorningDelays];
      return;
    }

    // For My Exits: Filter by exit description, state, and date
    this.filteredMyExits = this.myExits.filter(exit =>
      exit.exitDescription?.toLowerCase().includes(term) ||
      exit.state?.toLowerCase().includes(term) || // 🔥 Filter by state (e.g., مقبولة, مرفوضة, قيد الانتظار)
      new Date(exit.day)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .toLowerCase()
        .includes(term)
    );

    // For Employees' Exits: Filter by exit description, state, employee name, RW number, and date
    this.filteredEmployeesExits = this.employeesExits.filter(exit =>
      exit.exitDescription?.toLowerCase().includes(term) ||
      exit.state?.toLowerCase().includes(term) || // 🔥 Filter by state
      exit.name?.toLowerCase().includes(term) ||
      exit.employee_rw?.toString().includes(term) ||
      new Date(exit.day)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .toLowerCase()
        .includes(term)
    );

    // For My Morning Delays: Filter by description, state, and date
    this.filteredMyMorningDelays = this.myMorningDelays.filter(delay =>
      delay.description?.toLowerCase().includes(term) ||
      delay.state?.toLowerCase().includes(term) || // 🔥 Filter by state
      new Date(delay.day)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .toLowerCase()
        .includes(term)
    );

    // For Employees' Morning Delays: Filter by description, state, employee name, RW number, and date
    this.filteredEmployeesMorningDelays = this.employeesMorningDelays.filter(delay =>
      delay.description?.toLowerCase().includes(term) ||
      delay.state?.toLowerCase().includes(term) || // 🔥 Filter by state
      delay.name?.toLowerCase().includes(term) ||
      delay.employee_rw?.toString().includes(term) ||
      new Date(delay.day)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .toLowerCase()
        .includes(term)
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
