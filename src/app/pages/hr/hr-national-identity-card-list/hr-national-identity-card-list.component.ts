import { Component, OnInit } from '@angular/core';
import { CinService } from '../../../services/cin/cin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hr-national-identity-card-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-national-identity-card-list.component.html',
  styleUrls: ['./hr-national-identity-card-list.component.css'],
})
export class HrNationalIdentityCardListComponent implements OnInit {
  cins: any[] = [];
  selectedCin: any | null = null; // Store the selected CIN for modal
  isModalVisible = false;
  isLoading = true;
  errorMessage: string | null = null;
  searchTerm: string = '';

  constructor(private cinService: CinService) { }

  ngOnInit(): void {
    this.fetchCins();
  }

  fetchCins(): void {
    this.isLoading = true;
    this.cinService.getAllCins().subscribe(
      (data) => {
        this.cins = data.map((cin: any) => ({
          ...cin,
          stateLabel: this.mapState(cin.state), // Map state to human-readable format
        }));
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching CINs:', error);
        this.errorMessage = 'Failed to load CINs. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  get filteredCins(): any[] {
    return this.cins.filter(
      (cin) =>
        cin.user_name.includes(this.searchTerm) ||
        cin.user_natio_num.includes(this.searchTerm) ||
        cin.user_sifa.includes(this.searchTerm)
    );
  }

  // Map state to human-readable format
  private mapState(state: string): string {
    switch (state) {
      case 'Approved':
        return 'مقبولة';
      case 'Rejected':
        return 'مرفوضة';
      case 'Pending':
        return 'قيد الانتظار';
      default:
        return 'غير معروف';
    }
  }

  // Open modal with selected CIN details
  openModal(cin: any): void {
    this.selectedCin = cin;
    this.isModalVisible = true;
  }

  // Close modal
  closeModal(): void {
    this.selectedCin = null;
    this.isModalVisible = false;
  }

  // Update CIN state
  updateCinState(state: string): void {
    if (this.selectedCin) {
      this.cinService.updateCinState(this.selectedCin.CIN_ID, state).subscribe(
        (response) => {
          console.log('CIN updated successfully:', response);
          this.selectedCin.stateLabel = this.mapState(state); // Update state label in modal
          this.selectedCin.state = state; // Update the actual state
          this.fetchCins(); // Refresh the table
          this.closeModal(); // Close the modal
        },
        (error) => {
          console.error('Error updating CIN state:', error);
        }
      );
    }
  }
}
