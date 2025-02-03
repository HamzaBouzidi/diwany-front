import { Component, OnInit } from '@angular/core';
import { VacationService } from '../../../services/vacation/vacation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hr-vacations-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-vacations-list.component.html',
  styleUrl: './hr-vacations-list.component.css'
})
export class HrVacationsListComponent implements OnInit {
  vacations: any[] = [];
  filteredVacations: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  searchTerm: string = ''; 

  constructor(private vacationService: VacationService) { }

  ngOnInit(): void {
    this.fetchVacations();
  }

  fetchVacations(): void {
    this.isLoading = true;
    this.vacationService.getAllVacations().subscribe(
      (data) => {
        this.vacations = data;
        this.filteredVacations = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching vacations:', error);
        this.errorMessage = 'Failed to load vacations. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  filterVacations(): void {
    const searchTermLower = this.searchTerm.toLowerCase().trim();

    if (!searchTermLower) {
      this.filteredVacations = this.vacations;
      return;
    }

    this.filteredVacations = this.vacations.filter((vacation) =>
      vacation.name?.toLowerCase().includes(searchTermLower) ||
      vacation.department?.toLowerCase().includes(searchTermLower) ||
      vacation.bossApprovalStatus?.toLowerCase().includes(searchTermLower) ||
      vacation.employee_rw?.toLowerCase().includes(searchTermLower)

    );
  }

}
