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
  isLoading = true;
  errorMessage: string | null = null;
  searchTerm: string = ''; // For filtering

  constructor(private vacationService: VacationService) { }

  ngOnInit(): void {
    this.fetchVacations();
  }

  fetchVacations(): void {
    this.isLoading = true;
    this.vacationService.getAllVacations().subscribe(
      (data) => {
        this.vacations = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching vacations:', error);
        this.errorMessage = 'Failed to load vacations. Please try again later.';
        this.isLoading = false;
      }
    );
  }

}
