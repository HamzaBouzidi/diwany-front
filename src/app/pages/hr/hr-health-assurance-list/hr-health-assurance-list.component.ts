import { Component, OnInit } from '@angular/core';
import { HealthAssuranceService } from '../../../services/health-assurance/health-assurance.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-hr-health-assurance-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-health-assurance-list.component.html',
  styleUrls: ['./hr-health-assurance-list.component.css']
})
export class HrHealthAssuranceListComponent implements OnInit {
  healthAssurances: any[] = [];
  selectedAssurance: any | null = null;
  searchTerm: string = '';
  isLoading = true;
  errorMessage: string | null = null;
  isModalVisible = false;

  constructor(private healthAssuranceService: HealthAssuranceService) { }

  ngOnInit(): void {
    this.fetchHealthAssurances();
  }

  fetchHealthAssurances(): void {
    this.isLoading = true;
    this.healthAssuranceService.getAllHealthAssurances().subscribe(
      (data) => {
        this.healthAssurances = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching health assurances:', error);
        this.errorMessage = 'Failed to load health assurances.';
        this.isLoading = false;
      }
    );
  }

  get filteredHealthAssurances(): any[] {
    return this.healthAssurances.filter(
      (assurance) =>
        assurance.name.includes(this.searchTerm) ||
        assurance.administration.includes(this.searchTerm)
    );
  }

  openModal(assurance: any): void {
    this.selectedAssurance = assurance;
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.selectedAssurance = null;
    this.isModalVisible = false;
  }

  updateAssuranceState(state: string): void {
    if (this.selectedAssurance) {
      this.healthAssuranceService
        .updateHealthAssuranceState(this.selectedAssurance.id, { state })
        .subscribe(
          (response) => {
            console.log('Health assurance state updated:', response);
            this.selectedAssurance.state = state; // Update the state in the UI
            this.fetchHealthAssurances(); // Refresh the table
            this.closeModal();
          },
          (error) => {
            console.error('Error updating health assurance state:', error);
          }
        );
    }
  }

  openDocument(documentPath: string): void {
    const fullUrl = `${environment.apiBaseUrl}/${documentPath}`;
    window.open(fullUrl, '_blank');
  }
}
