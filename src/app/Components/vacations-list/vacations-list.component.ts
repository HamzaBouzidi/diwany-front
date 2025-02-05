import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { VacationService } from '../../services/vacation/vacation.service';

@Component({
  selector: 'app-vacation-list',
  templateUrl: './vacations-list.component.html',
  standalone: true,
  imports: [CommonModule, TableModule, HttpClientModule, InputTextModule, ButtonModule, FormsModule],
  styleUrls: ['./vacations-list.component.css']
})
export class VacationListComponent implements OnInit {
  employees: any[] = [];
  myVacations: any[] = [];
  searchTerm: string = '';
  showMyVacations: boolean = true;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  notifications: string[] = [];
  filteredEmployees: any[] = [];
  filteredMyVacations: any[] = [];

  constructor(private vacationService: VacationService) { }

  ngOnInit(): void {
    this.loadMyVacations();
    this.loadEmployeeVacations();

  }

  loadMyVacations(): void {

    this.isLoading = true;
    this.vacationService.getMyVacations().subscribe({
      next: (data) => {
        this.myVacations = (data.vacations || []).map((vacation: any) => ({
          id: vacation.id,
          name: vacation.name,
          vacationStartDate: vacation.vacationStartDay,
          vacationEndDate: vacation.vacationEndDate,
          vacationDays: vacation.vacationDays,
          vacationType: vacation.vacationDescription || 'إجازة',
          state: this.determineVacationState(vacation),
          profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
        }));
        this.filteredMyVacations = [...this.myVacations];

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching vacation data', error);
        this.errorMessage = 'تعذر تحميل البيانات، حاول لاحقاً.';
        this.isLoading = false;
      }
    });
  }

  loadEmployeeVacations(): void {
    // Capture the current time when the data is loaded
    const now = new Date();
    this.isLoading = true;
    this.vacationService.getVacationsByManager().subscribe({
      next: (data) => {
        console.log('Raw backend data:', data.vacations);
        this.employees = (data.vacations || []).map((vacation: any) => ({
          id: vacation.id,
          name: vacation.name,
          department: vacation.department,
          vacationStartDate: vacation.vacationStartDay,
          vacationEndDate: vacation.vacationEndDate,
          vacationDays: vacation.vacationDays,
          vacationType: vacation.vacationDescription || 'إجازة',
          state: this.determineVacationState(vacation),
          createdAt: vacation.createdAt,
          isPending: vacation.bossApprovalStatus === 'Pending',
          // isNew: vacation.bossApprovalStatus === 'Pending' && this.isNewVacation(vacation.createdAt),
          profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'

        }));
        //console.log('Mapped employees:', this.employees);
        this.filteredEmployees = [...this.employees];

        this.checkForNewRequests(); 
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching employee vacation data', error);
        this.errorMessage = 'تعذر تحميل بيانات إجازات الموظفين، حاول لاحقاً.';
        this.isLoading = false;
      }
    });
  }

  determineVacationState(vacation: any): string {
    if (vacation.bossApprovalStatus === 'Approved') {
      return 'مقبولة';
    } else if (vacation.bossApprovalStatus === 'Rejected') {
      return 'مرفوضة';
    } else {
      return 'قيد الانتظار';
    }
  }

  approveVacation(vacationId: number): void {
    const body = { state: 'Approved' };
    this.vacationService.updateVacationState(vacationId, body).subscribe({
      next: (response) => {
        console.log(`Vacation ID ${vacationId} approved:`, response);
        this.loadEmployeeVacations(); // Refresh employee vacations
      },
      error: (error) => {
        console.error(`Error approving vacation ID ${vacationId}:`, error);
      }
    });
  }

  rejectVacation(vacationId: number): void {
    const comment = prompt('Provide a reason for rejection:');
    const body = { state: 'Rejected', comment: comment || 'No comment provided' };
    this.vacationService.updateVacationState(vacationId, body).subscribe({
      next: (response) => {
        console.log(`Vacation ID ${vacationId} rejected:`, response);
        this.loadEmployeeVacations(); // Refresh employee vacations
      },
      error: (error) => {
        console.error(`Error rejecting vacation ID ${vacationId}:`, error);
      }
    });
  }

  toggleTable(view: 'myVacations' | 'employeeVacations'): void {
    this.showMyVacations = view === 'myVacations';
  }
/*
  get filteredEmployees() {
    return this.employees.filter((employee) =>
      employee.name.includes(this.searchTerm) ||
      employee.vacationType.includes(this.searchTerm)
    );
  }
*/


  isNewVacation(createdAt: string): boolean {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1); // Calculate 24 hours ago
    const vacationDate = new Date(createdAt); // Convert `createdAt` to a Date object

    console.log('Comparing Dates:', {
      oneDayAgo: oneDayAgo.toISOString(),
      vacationDate: vacationDate.toISOString(),
      isNew: vacationDate > oneDayAgo
    });

    return vacationDate > oneDayAgo; // Compare if vacationDate is within the last 24 hours
  }



  /* checkForNewRequests(): void {
     //console.log('Checking for new requests:', this.employees);
     this.notifications = []; // Clear old notifications
 
     // Ensure the state is compared with 'Pending' exactly as set in the backend
     const newRequests = this.employees.filter(
       (employee) => employee.state === 'قيد الانتظار' && employee.isNew
       // (employee) => employee.isNew == true
 
     );
 
     console.log('New requests:', newRequests); // Log filtered requests
 
     // Push notifications for new requests
     newRequests.forEach((request) => {
       this.addNotification(`طلب إجازة جديدة من ${request.name}`);
     });
 
     console.log('Notifications:', this.notifications); // Log notifications array
   }
 */
  checkForNewRequests(): void {
    this.notifications = []; // Clear old notifications

    // Filter pending requests
    const pendingRequests = this.employees.filter((employee) => employee.isPending);

    console.log('Pending requests:', pendingRequests); // Log filtered requests

    // Push notifications for pending requests
    if (pendingRequests.length > 0) {
      this.addNotification(`هناك ${pendingRequests.length} طلبات إجازة قيد الانتظار.`);
    }

    console.log('Notifications:', this.notifications); // Log notifications array
  }
  addNotification(message: string): void {
    this.notifications.push(message);

    // Automatically remove the notification after 2 seconds
    setTimeout(() => {
      this.notifications.shift(); // Remove the first notification in the array
    }, 4000);
  }
  closeNotification(index: number): void {
    this.notifications.splice(index, 1); // Remove the notification at the given index
  }

  // --- Search Filtering ---


  // Unified search function that filters both tables based on searchTerm
  filterVacations(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredMyVacations = [...this.myVacations];
      this.filteredEmployees = [...this.employees];
      return;
    }

    // For My Vacations: filter by vacation type, state, and formatted start/end dates.
    this.filteredMyVacations = this.myVacations.filter(vacation => {
      // Format dates as "Jan 30, 2025" using the en-US locale
      const startDateStr = new Date(vacation.vacationStartDate)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .toLowerCase();
      const endDateStr = new Date(vacation.vacationEndDate)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .toLowerCase();

      return vacation.vacationType?.toLowerCase().includes(term) ||
        vacation.state?.toLowerCase().includes(term) || // 🔥 Filter by vacation state (e.g., مقبولة, مرفوضة, قيد الانتظار)
        startDateStr.includes(term) ||
        endDateStr.includes(term);
    });

    // For Employee Vacations: filter by employee name, employee_rw, vacation type, state, and dates.
    this.filteredEmployees = this.employees.filter(employee => {
      // Format start and end dates using the 'en-US' locale to get a format like "Jan 30, 2025"
      const startDateStr = new Date(employee.vacationStartDate)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .toLowerCase();
      const endDateStr = new Date(employee.vacationEndDate)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .toLowerCase();

      return (
        employee.name?.toLowerCase().includes(term) ||
        employee.employee_rw?.toString().includes(term) || // 🔥 Filter by employee-rw
        employee.vacationType?.toLowerCase().includes(term) ||
        employee.state?.toLowerCase().includes(term) || // 🔥 Filter by vacation state
        startDateStr.includes(term) ||
        endDateStr.includes(term)
      );
    });
  }




}
