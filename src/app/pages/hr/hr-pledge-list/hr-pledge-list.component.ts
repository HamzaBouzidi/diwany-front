import { Component, OnInit } from '@angular/core';
import { PledgeService } from '../../../services/pledge/pledge.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-hr-pledge-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-pledge-list.component.html',
  styleUrl: './hr-pledge-list.component.css'
})
export class HrPledgeListComponent implements OnInit {
  pledges: any[] = [];
  filteredPledges: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  isModalVisible: boolean = false;
  selectedPledge: any = null;

  constructor(private pledgeService: PledgeService) { }

  ngOnInit(): void {
    this.fetchPledges();
  }

  fetchPledges(): void {
    this.isLoading = true;
    this.pledgeService.getAllPledges().subscribe(
      (data) => {
        this.pledges = data;
        this.filteredPledges = data;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching pledges:', error);
        this.errorMessage = 'Failed to load pledges. Please try again.';
        this.isLoading = false;
      }
    );
  }

  openModal(pledge: any): void {
    this.selectedPledge = pledge;
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedPledge = null;
  }
  openDocument(documentPath: string): void {
    const fullUrl = `${environment.apiBaseUrl}/${documentPath}`;
    window.open(fullUrl, '_blank');
  }

  updatePledgeState(state: string): void {
    if (this.selectedPledge) {
      this.pledgeService.updatePledgeState(this.selectedPledge.id, { state }).subscribe(
        (response) => {
          console.log('Pledge state updated:', response);
          this.selectedPledge.state = state; // Update the state in the UI
          this.fetchPledges(); // Refresh the table
          this.closeModal(); // Close the modal
        },
        (error) => {
          console.error('Error updating pledge state:', error);
          alert('Failed to update pledge state. Please try again.');
        }
      );
    }
  }

  filterPledges(): void {
    this.filteredPledges = this.pledges.filter((pledge) =>
      pledge.employeeName.includes(this.searchTerm)
    );
  }




}
