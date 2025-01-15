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
    this.isLoading = true;
    this.vacationService.getVacationsByManager().subscribe({
      next: (data) => {
        this.employees = (data.vacations || []).map((vacation: any) => ({
          id: vacation.id,
          name: vacation.name,
          department: vacation.department,
          vacationStartDate: vacation.vacationStartDay,
          vacationEndDate: vacation.vacationEndDate,
          vacationDays: vacation.vacationDays,
          vacationType: vacation.vacationDescription || 'إجازة',
          state: this.determineVacationState(vacation),
          profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
        }));
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

  get filteredEmployees() {
    return this.employees.filter((employee) =>
      employee.name.includes(this.searchTerm) ||
      employee.vacationType.includes(this.searchTerm)
    );
  }
}
